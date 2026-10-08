# CivicConnect: Technical Debt Register (v1.0)
## Formal Engineering Register of Deliberate Compromises, Architectural Trade-Offs & Repayment Plan

**Document Reference:** `DOC-ARCH-003`  
**Milestone:** Milestone 3 — Controlled Construction, Integration, Quality & Release Readiness  
**Baseline Version:** 1.0 (Controlled Construction State)  
**Governing Standard:** SEN381 Master Project Brief §13 & §14; SEN381 Milestone 3 Brief §4 & §12  
**Owner:** Chris Fourie (Student ID: `602826`, Systems Architect & Lead Developer)  

---

## 1. Technical Debt Philosophy & Governance Principle

In accordance with **NQF Level 8 software engineering principles** and the **SEN381 Master Project Brief**, technical debt is not accidental negligence or bad coding. It is a **deliberate, transparent engineering trade-off** made under schedule, cost, or operational constraints. 

Every accepted debt item must be explicitly documented, assigned a severity, quantified in terms of downstream risk, and provided with an auditable repayment strategy before proceeding to production release.

---

## 2. Active Technical Debt Portfolio

| Debt ID | Classification | Component / Area | Deliberate Compromise & Engineering Context | Immediate Benefit Achieved | Downstream Risk & Architectural Consequence | Repayment Plan & Target Milestone |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **`DEBT-001`** | **Architecture / Data** | `InMemoryServiceRequestRepository.ts`<br>`ADR-010` | **Dual-Persistence Switch:** Utilizing an in-memory repository as the default runtime for fast, deterministic unit and integration testing, while reserving PostgreSQL 16 for containerized staging. | Eliminates database container spin-up overhead in CI; enables complete 41-test suite execution in under 2.5 seconds on GitHub Actions runners without flaky timeouts. | In-memory data store does not enforce strict relational foreign key constraints or SQL index lock contention at runtime. | Retain dual-mode architecture; execute full database-backed regression smoke suite against staging PostgreSQL instance prior to M4 production sign-off. |
| **`DEBT-002`** | **Integration / Infrastructure** | `DomainEventDispatcher.ts`<br>`ADR-004` | **In-Memory Observer Dispatching:** Event notifications (e.g. audit logging and ticket alerts) are dispatched synchronously within the Node.js process memory rather than through a distributed message broker (RabbitMQ/Kafka). | Strictly enforces `NFR-010` (zero-cost constraint, <180MB RAM footprint). Avoids container OOM crashes on free-tier 512MB hosting environments. | In-flight events cannot survive an abrupt operating system kill or power loss before the audit observer finishes writing. | Activate the persisted `outbox_messages` table and asynchronous outbox worker poll loop baselined in `ADR-007` during Milestone 4 operational hardening. |
| **`DEBT-003`** | **External Gateway** | `NotificationDispatchObserver.ts` | **Mock Notification Sinks:** Notification dispatch outputs structured log payloads rather than invoking paid third-party SMS/Email telecom APIs (Twilio / SendGrid). | Prevents external billing costs, removes external network flake during automated testing, and avoids committing API credentials. | Third-party telecommunication latency, rate limiting, and carrier delivery failure scenarios are unexercised in automated test runs. | Bind production adapter implementing `INotificationGateway` interface to live sandbox webhook endpoints during Milestone 4 staging verification. |
| **`DEBT-004`** | **Deployment / Infrastructure** | `docker-compose.staging.yml`<br>`ADR-011` | **Single-Host Containerized Staging:** Simulated staging environment runs on a single Docker host with containerized PostgreSQL and Express rather than multi-node Kubernetes cluster. | Fully complies with M3 Manageability Rule (M3 Brief §14); zero cloud billing overhead; 100% reproducible on local assessor machines. | Does not simulate cross-node network partitions, multi-region database latency, or automated horizontal pod auto-scaling. | Accepted permanent trade-off for academic milestone; production scaling strategy documented in PED v4.0 Operations chapter. |

---

## 3. Technical Debt Health & Release Impact Summary

* **Active Debt Items:** 4 items.
* **Release Blocking Status:** None of the active debt items represent unmanaged defects or security vulnerabilities. All 4 represent **controlled architectural boundaries** protected by interfaces (`IServiceRequestRepository`, `IDomainEventDispatcher`, `INotificationSink`), ensuring clean decoupling and low refactoring friction.
* **Release Classification Impact:** Contributes to the justified recommendation of **`CONDITIONALLY READY`** for the Milestone 3 release candidate.
