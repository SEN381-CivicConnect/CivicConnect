# ADR-004: In-Memory Observer Pattern for Lifecycle Event Notification Dispatching

**Status:** ACCEPTED  
**Date:** 2026-09-16  
**Deciders:** Lead Requirements & Design Analyst (Lisa Verson), Systems Architect (Chris Fourie), Quality Engineer (Pandora Greyling)  
**Governing Standard:** SEN381 Master Project Brief §13, §18.1; Milestone 2 Brief §5.6; Assignment 2 Task 1 Research  
**Document Reference:** `DOC-ADR-004`  

---

## 1. Context & Problem Statement

CivicConnect's core domain entity is the `ServiceRequest`. When a service request undergoes a lifecycle status transition (e.g., `SUBMITTED` $\to$ `TRIAGED`, `TRIAGED` $\to$ `ASSIGNED`, `IN_PROGRESS` $\to$ `RESOLVED`), multiple secondary actions must occur simultaneously:
1. Dispatching citizen feedback via in-app notification and email/SMS (`FR-005`).
2. Recording an immutable audit record in the database (`NFR-006`, `FR-011`).
3. Alerting the assigned field technician or department supervisor (`FR-006`, `FR-009`).
4. Re-evaluating SLA countdown timers and priority queues (`FR-013`).

If the core `ServiceRequest` entity or its application service directly instantiates and invokes concrete notification channels, audit loggers, and queue managers, the domain core becomes tightly coupled to volatile infrastructure sinks. Any modification, downtime, or bug in a notification gateway will directly impact core ticket processing, violating the Single Responsibility Principle (SRP) and Open/Closed Principle (OCP), while degrading maintainability (`NFR-008`).

---

## 2. Decision Drivers & Quality Attributes

* **Loose Coupling & Modularity (`NFR-008`):** The domain entity `ServiceRequest` must remain completely agnostic of notification mechanisms, delivery protocols, or external services.
* **Extensibility:** Adding future notification channels (e.g., WhatsApp, push notifications, webhook alerts) must require zero modification to the core state machine.
* **Performance & Latency (`NFR-001`):** Synchronous execution of notification sinks must not block client CRUD responses (p95 $\le 500\text{ms}$).
* **Cost & Cloud Resource Constraints (`NFR-010`):** Operational memory footprint must remain under 200MB RAM to function reliably within free-tier container limits (\$0.00/month).

---

## 3. Considered Alternatives (Informed by Assignment 2 Research)

### Alternative 1: Direct Procedural Method Invocations
The use-case service executes procedural calls sequentially: `serviceRequest.updateStatus()`, `emailService.send()`, `auditService.log()`, `smsService.send()`.
* *Pros:* Trivially simple to implement; low initial cognitive load.
* *Cons:* Severe coupling; if `emailService` throws an unhandled exception or times out, the ticket state update fails or hangs; impossible to unit-test `ServiceRequest` in isolation without complex mocks.

### Alternative 2: Distributed Message Broker (Apache Kafka / RabbitMQ)
Publish lifecycle domain events to an external message broker cluster, which distributes messages to detached consumer worker microservices.
* *Pros:* Complete process isolation; horizontal scaling; persistent buffering.
* *Cons:* **Rejected.** Exceeds cloud free-tier memory quotas (Kafka JVM alone requires 1GB+ RAM, violating `NFR-010`); introduces distributed operational complexity and network failure modes inappropriate for a 3-person student team.

### Alternative 3: In-Memory Observer Pattern with Domain Event Dispatcher (Selected)
The `ServiceRequest` aggregate publishes domain events (e.g., `ServiceRequestStatusChangedEvent`) to an in-memory `DomainEventDispatcher` (Subject). Concrete observers (`NotificationObserver`, `AuditLogObserver`, `SlaEvaluationObserver`) register interest and handle events reactively and independently.
* *Pros:* High cohesion and loose coupling; core domain models remain pure; zero infrastructure cloud hosting cost (\$0.00); unit testable with mock observers.
* *Cons:* Introduced complexity: indirect control flow makes debugging slightly less linear; requires careful error isolation within observers so that a failed notification observer does not corrupt event emission.

---

## 4. Decision Outcome

**Chosen Option:** **Alternative 3: In-Memory Observer Pattern with Domain Event Dispatcher.**

### Positive Consequences
* **SRP & OCP Enforcement:** `ServiceRequest` is solely responsible for enforcing business invariants and state transitions. New notification or logging channels can be added simply by creating a new observer class implementing `IDomainEventObserver<T>`.
* **Zero Cloud Cost:** Executes entirely within the node runtime with zero external infrastructure overhead, complying strictly with `NFR-010`.
* **Testability:** Domain logic can be verified in isolation by asserting that the aggregate raised the expected domain event, without executing any network or email calls.

### Negative Consequences & Accepted Complexity
* **Eventual Consistency & Error Isolation:** Observers must wrap external calls in defensive `try/catch` handlers or push tasks to the Transactional Outbox (`ADR-007`) to prevent transient network errors from bubbling up to the caller.

---

## 5. Architectural & Implementation Mapping

* **Domain Interface:** `IDomainEvent`, `IDomainEventObserver<T>`, `IDomainEventDispatcher`
* **Concrete Events:** `ServiceRequestCreatedEvent`, `ServiceRequestStatusChangedEvent`, `ServiceRequestAssignedEvent`
* **Concrete Observers:** `NotificationDispatchObserver`, `AuditLoggingObserver`
* **Affected Layers:** `Domain Core` (defines event interfaces) $\to$ `Application Layer` (dispatches events) $\to$ `Infrastructure Layer` (handles external side effects).
* **Traced Requirements:** `FR-005` (Citizen Feedback), `FR-010` (State Machine), `NFR-006` (Auditability), `NFR-008` (Modularity).
