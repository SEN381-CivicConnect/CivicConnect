# ADR-007: Transactional Outbox Pattern for External Notification Gateway Integration

**Status:** ACCEPTED  
**Date:** 2026-09-19  
**Deciders:** Lead Requirements & Design Analyst (Lisa Verson), Systems Architect (Chris Fourie), Quality Engineer (Pandora Greyling)  
**Governing Standard:** SEN381 Master Project Brief §13, §16, §18.1; Assignment 2 Task 3 Research  
**Document Reference:** `DOC-ADR-007`  

---

## 1. Context & Problem Statement

CivicConnect requires reliable communication with external third-party communication gateways (e.g. Email / SMS providers such as SendGrid, AWS SES, or Twilio) to dispatch status updates, assignment alerts, and resolution notices to community requesters (`FR-005`).

Integrating with third-party web services across a public network introduces the fundamental **Dual-Write Problem**:
* If the system updates the database and *then* makes a synchronous HTTP request to the external gateway, a network timeout or provider outage causes the user transaction to fail or hang, violating latency thresholds (`NFR-001`).
* If the external API call succeeds but the local database transaction fails or crashes before committing, the citizen receives an email about a ticket update that was never saved.
* If the application relies on in-memory fire-and-forget background threads, any container restart or crash results in silent, unrecoverable message loss.

---

## 2. Decision Drivers & Quality Attributes

* **Reliability & Guaranteed Delivery (`NFR-002`, `NFR-009`):** Zero notification loss; external gateway downtime must never compromise ticket persistence.
* **Performance & Low Latency (`NFR-001`):** Client API requests must respond within $\le 500\text{ms}$; slow external gateways must not block internal state transitions.
* **Fault Tolerance & Resilience:** Transient network glitches must be automatically retried with exponential backoff and dead-letter handling.
* **Cost & Free-Tier Quota Protection (`NFR-010`):** Must not require dedicated commercial message brokers (e.g. AWS SQS or RabbitMQ).

---

## 3. Considered Alternatives (Informed by Assignment 2 Research)

### Alternative 1: Synchronous HTTP Calls Inside the Request Handler
Execute `await httpClient.post('https://api.sendgrid.com/...', payload)` directly inside the `updateStatus` controller method.
* *Pros:* Simple procedural code; no additional database tables or background jobs.
* *Cons:* **Rejected.** Direct violation of `NFR-001`; third-party API latency (often 800ms–2500ms) is forced onto the user; third-party rate limits or outages cause user actions to crash; tight runtime coupling to external networks.

### Alternative 2: In-Memory Fire-and-Forget Background Task
Dispatch notifications asynchronously using Node.js `setImmediate()`, worker threads, or unmanaged task queues.
* *Pros:* Does not block the HTTP response.
* *Cons:* **Rejected.** Complete lack of durability; if the container restarts or crashes during deployment, queued notifications vanish without a trace; no audit trail or replay capability.

### Alternative 3: Asynchronous Transactional Outbox Pattern (Selected)
Within the *same atomic database transaction* that updates `service_requests` and inserts into `service_request_audit_logs`, insert an event record into an `outbox_messages` table:
```sql
BEGIN;
  UPDATE service_requests SET status_id = :new_status WHERE request_id = :id;
  INSERT INTO service_request_audit_logs (...) VALUES (...);
  INSERT INTO outbox_messages (message_id, event_type, payload, status) VALUES (...);
COMMIT;
```
An internal scheduled worker process polls unprocessed outbox records, dispatches them to external notification providers, handles retries with exponential backoff, and updates the status to `PROCESSED` or `DEAD_LETTER`.
* *Pros:* Guarantees atomicity between state transitions and message emission; 100% resilient to network drops and container restarts; keeps user API responses lightning fast ($<50\text{ms}$); zero additional cloud costs.
* *Cons:* Introduced complexity: requires an outbox table, background polling loop, and idempotent consumer handling.

---

## 4. Decision Outcome

**Chosen Option:** **Alternative 3: Asynchronous Transactional Outbox Pattern.**

### Positive Consequences
* **Atomic Consistency:** A notification is guaranteed to be scheduled if and only if the ticket status is committed to the database.
* **Isolated Failure Domains:** If the third-party email provider experiences an outage, CivicConnect operations continue unaffected. Notifications buffer safely in PostgreSQL until connectivity is restored.
* **Performance:** Eliminates external network latency from the user's critical request-response path.

### Negative Consequences & Accepted Complexity
* **Polling Overhead:** Requires a lightweight periodic query (`SELECT ... FROM outbox_messages WHERE status = 'PENDING' LIMIT 20 FOR UPDATE SKIP LOCKED`). Mitigated by indexing on `status` and `created_at`.

---

## 5. Architectural & Implementation Mapping

* **Persistence Table:** `outbox_messages` (defined in `DOC-ARCH-DATA-001` and `V1__initial_schema.sql`).
* **Worker Service:** `TransactionalOutboxService` running on a configurable interval (default: 5 seconds).
* **Gateway Interfaces:** `INotificationGateway` with implementations `EmailNotificationGateway`, `SmsNotificationGateway`, and `MockNotificationGateway` (for test suites).
* **Traced Requirements:** `FR-005` (Citizen Feedback), `NFR-001` (Latency $\le 500\text{ms}$), `NFR-002` (Availability), `NFR-009` (Fault Tolerance).
