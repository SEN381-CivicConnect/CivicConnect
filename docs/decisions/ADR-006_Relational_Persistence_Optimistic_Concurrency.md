# ADR-006: Relational Persistence (Strict 3NF) with Optimistic Concurrency Control (OCC)

**Status:** ACCEPTED  
**Date:** 2026-09-18  
**Deciders:** Quality Engineer & Risk Manager (Pandora Greyling), Systems Architect (Chris Fourie), Lead Requirements Analyst (Lisa Verson)  
**Governing Standard:** SEN381 Master Project Brief §3, §16, §18.1; Assignment 2 Task 2 Research; `DOC-ARCH-DATA-001`  
**Document Reference:** `DOC-ADR-006`  

---

## 1. Context & Problem Statement

CivicConnect manages civic infrastructure faults where data integrity, referential consistency, and auditability are non-negotiable legal and operational mandates:
1. **Relational Model vs Unstructured Model:** Service requests link authenticated citizens (`users`), operational dispatch teams (`departments`), SLA priority matrices (`priorities`), ticket categories (`request_categories`), and immutable audit trails (`service_request_audit_logs`).
2. **Concurrency & Race Conditions:** When a ticket enters the triage queue, multiple supervisors may attempt to assign it simultaneously, or two field technicians may attempt to claim the same high-priority ticket concurrently (`FR-009`). Without concurrency control, a classic **Lost Update** race condition occurs, where one user's assignment is silently overwritten without notice.

---

## 2. Decision Drivers & Quality Attributes

* **Data Integrity & Non-Repudiation (`NFR-006`, `NFR-009`):** 100% referential consistency; zero orphaned tickets or missing foreign keys; atomic transaction boundaries for status updates and audit logs.
* **Concurrency Performance (`NFR-001`):** Prevention of race conditions without holding pessimistic database table/row locks that degrade API response latency.
* **Regulatory Compliance (POPIA Act 4 of 2013 & `NFR-005`):** Explicit role-based access filtering and support for anonymous requester display flags (`is_anonymized_display`).
* **Operational Cost & Availability (`NFR-002`, `NFR-010`):** Turnkey operation on PostgreSQL 16 (Neon / Supabase free tier or local Docker Compose container).

---

## 3. Considered Alternatives (Informed by Assignment 2 Research)

### Alternative 1: Unstructured Document Store (MongoDB / NoSQL)
Store service requests as polymorphic BSON/JSON documents.
* *Pros:* Schema flexibility; rapid initial prototype development.
* *Cons:* **Rejected.** Lacks declarative referential integrity; cross-document transactions introduce significant latency overhead; no native database-level check constraints for the 6-state FSM; high risk of orphaned references and inconsistent reporting data.

### Alternative 2: Relational Model with Pessimistic Locking (`SELECT FOR UPDATE`)
Acquire an exclusive row lock at the database level when a supervisor or technician views or attempts to claim a ticket.
* *Pros:* Absolute guarantee that only one transaction can modify a row.
* *Cons:* **Rejected.** Severely limits throughput; idle users viewing a ticket can hold open locks, exhausting the database connection pool; high risk of transaction deadlocks; degrades p95 latency far beyond the 500ms target (`NFR-001`).

### Alternative 3: Strict Third Normal Form (3NF) Relational Model with Optimistic Concurrency Control (Selected)
Deploy PostgreSQL 16 using a fully normalized relational schema (`DOC-ARCH-DATA-001`). Concurrency is managed via an integer `version` column on `service_requests`. Any update queries check:
$$\text{UPDATE service\_requests SET status = :new\_status, version = version + 1 WHERE request\_id = :id AND version = :current\_version}$$
If zero rows are updated, the application detects concurrent modification, rolls back the transaction, and returns an HTTP `409 Conflict` response with an informative message.
* *Pros:* Zero row locking overhead; non-blocking read access; absolute prevention of lost updates; strict referential integrity enforced by foreign keys and database check constraints.
* *Cons:* Requires client-side retry or conflict presentation handling when a conflict occurs.

---

## 4. Decision Outcome

**Chosen Option:** **Alternative 3: Strict 3NF Relational Model with Optimistic Concurrency Control (OCC).**

### Positive Consequences
* **Guaranteed Consistency:** Foreign keys (`ON DELETE RESTRICT`) and `CHECK` constraints prevent illegal state transitions, invalid emails, and negative SLA hours directly in the database engine.
* **High Concurrency Throughput:** Technicians can browse queues concurrently without locking rows. In the rare event of simultaneous ticket claims, exactly one succeeds and the other receives an immediate, clear conflict notification.
* **ACID Audit Guarantee:** Ticket status updates, technician reassignments, and audit log entries are wrapped inside atomic database transactions (`BEGIN ... COMMIT`), guaranteeing that no status change can occur without its corresponding immutable audit trail entry.

### Negative Consequences & Accepted Complexity
* **Conflict Handling in UI:** Application services and UI layers must explicitly handle HTTP 409 responses, alerting the second technician: *"This ticket was just assigned to Jane Doe. Refreshing queue."*

---

## 5. Architectural & Implementation Mapping

* **Database Engine:** PostgreSQL 16 Alpine (via Docker Compose and Neon/Supabase cloud).
* **Schema Migration:** `code/database/migrations/V1__initial_schema.sql` (enforcing `version INT NOT NULL DEFAULT 1`).
* **Seed Data:** `code/database/seeds/01_baseline_seeds.sql` (full FSM rules and lookup seeds).
* **Repository Implementation:** `ServiceRequestRepository.updateWithVersionCheck()`.
* **Traced Requirements:** `FR-009` (Technician Assignment), `FR-010` (State Machine), `NFR-006` (Auditability), `NFR-009` (Data Integrity), `NFR-010` (Zero-Cost).
