# CivicConnect: Technical Debt Register (v2.0 Final)
## Formal Engineering Register of Deliberate Compromises, Architectural Trade-Offs & Final Closure Plan

**Document Reference:** `DOC-ARCH-004`  
**Milestone:** Milestone 4 / Final Project — Finalise, Consolidate & Conclude  
**Baseline Version:** 2.0 Final (Project Closure State)  
**Governing Standard:** SEN381 Master Project Brief §13 & §14; SEN381 Final Project Brief §3 & §7  
**Owner:** Chris Fourie (Student ID: `602826`, Systems Architect & Lead Developer)  

---

## 1. Technical Debt Philosophy & Final Project Closure Standard

In accordance with **NQF Level 8 software engineering principles** and **SEN381 Final Project Brief §7**, technical debt is not accidental incompetence or hidden negligence. It represents a **deliberate, transparent engineering trade-off** made under schedule, cost, or operational constraints. 

Milestone 4 concludes the active technical debt portfolio by establishing the final disposition of each item: identifying what was resolved, what remains deliberately open as controlled technical debt, the exact operational and maintenance consequences for a future engineering team, and the post-project evolution roadmap.

---

## 2. Final Technical Debt Portfolio & Concluded Engineering Status

| Debt ID | Classification | Component / Area | Deliberate Compromise & Engineering Context | Immediate Value Achieved | Residual Consequence & Maintenance Impact | Final Project Closure Status & Handover Roadmap |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **`DEBT-001`** | **Architecture / Persistence** | `InMemoryServiceRequestRepository.ts`<br>`ADR-010` | **Dual-Persistence Switch:** Utilizing an in-memory repository as default runtime for fast, deterministic unit/integration testing while reserving PostgreSQL 16 for containerized staging. | Eliminates database container spin-up overhead in CI; enables complete 42-test suite execution in under 12 seconds on GitHub Actions runners without flaky timeouts. | In-memory data store does not enforce relational foreign key constraint validation or SQL index lock contention at runtime. | **CONTROLLED / CONCLUDED:** Interface boundary (`IServiceRequestRepository`) completely isolates layers. Both repositories verified; staging runs on PostgreSQL 16 (`docker-compose.staging.yml`). Accepted permanent architectural pattern. |
| **`DEBT-002`** | **Integration / Infrastructure** | `DomainEventDispatcher.ts`<br>`ADR-004` | **In-Memory Observer Dispatching:** Event notifications (audit logging, citizen alerts) are dispatched synchronously within Node.js process memory rather than through a distributed message broker (RabbitMQ/Kafka). | Strictly enforces `NFR-010` (zero-cost constraint, <180MB RAM footprint). Avoids container OOM crashes on free-tier 512MB hosting environments. | In-flight events cannot survive an abrupt operating system kill or power loss before the audit observer finishes writing. | **CONTROLLED / CONCLUDED:** Table `outbox_messages` DDL verified and established in `V1__initial_schema.sql` (`ADR-007`). Handover roadmap specifies activating asynchronous outbox background worker in municipal scale phase. |
| **`DEBT-003`** | **External Gateway** | `NotificationDispatchObserver.ts` | **Mock Notification Sinks:** Notification dispatch outputs structured log payloads rather than invoking paid third-party SMS/Email telecom APIs (Twilio / SendGrid). | Prevents external billing costs, eliminates external network flakiness during automated testing, and avoids committing API credentials. | Third-party telecommunication latency, rate limiting, and carrier delivery failure scenarios are unexercised in automated test runs. | **CONTROLLED / CONCLUDED:** Clean interface boundary (`INotificationSink`) established. Handover plan provides concrete adapter code to bind production webhooks when municipal telecom budget is provisioned. |
| **`DEBT-004`** | **Deployment / Infrastructure** | `docker-compose.staging.yml`<br>`ADR-011` | **Single-Host Containerized Staging:** Simulated staging environment runs on a single Docker host with containerized PostgreSQL and Express rather than a multi-node Kubernetes cluster. | Fully complies with M3 Manageability Rule (M3 Brief §14); zero cloud billing overhead; 100% reproducible on local assessor machines. | Does not simulate cross-node network partitions, multi-region database latency, or automated horizontal pod auto-scaling. | **CONTROLLED / CONCLUDED:** Formally declared as part of the justified Staging No-Go decision for cloud production. System operates in verified Simulated Production. |

---

## 3. Technical Debt Health, Release Readiness & Future Handover Assessment

* **Total Tracked Technical Debt Items:** 4 items.
* **Unmanaged or Hidden Debt:** **0 (Zero)**. All 4 debt items are protected behind clean SOLID interface abstractions (`IServiceRequestRepository`, `IDomainEventDispatcher`, `INotificationSink`), ensuring zero ripple effects across core business logic.
* **Maintenance & Handover Implication:** If another engineering team inherits CivicConnect tomorrow, their first priority would be binding commercial notification gateways to `NotificationDispatchObserver` and spinning up the `outbox_messages` poller. The core Clean Layered Monolith remains decoupled, well-tested (93.60% coverage), and fully maintainable.
