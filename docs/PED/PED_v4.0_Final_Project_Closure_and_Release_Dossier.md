# SEN381 — SOFTWARE ENGINEERING 381
# INTEGRATED CAPSTONE ENGINEERING PROJECT (NQF LEVEL 8)
# CIVICCONNECT: COMMUNITY SERVICE REQUEST MANAGEMENT PLATFORM

## MILESTONE 4 (M4) / FINAL PROJECT: FINALISE • CONSOLIDATE • CONCLUDE
### PROJECT ENGINEERING DOCUMENT (PED v4.0 FINAL) & RELEASE DOSSIER

**Academic Institution:** Belgium Campus ITversity  
**Module Code & Name:** SEN381 — Software Engineering 381 (NQF Level 8)  
**Academic Year:** 2026  
**Document Reference Identifier:** `DOC-PED-004` (Concluded Project Dossier)  
**Baseline Version:** 4.0 Final (Supersedes `DOC-PED-003` v3.0 Approved 2026-10-16)  
**Governing Documents:**  
* SEN381 Master Project Brief v1.1 (Section 6, Section 9, Section 11–Section 18, Section 20.4, Section 21, Section 22)  
* SEN381 Final Project Brief — Milestone 4 (Section 1–Section 17)  
* Preceding Baselines: PED v1.0 (`DOC-PED-001`), PED v2.0 (`DOC-PED-002`), PED v3.0 (`DOC-PED-003`)  

---

## 📌 Required Final Submission Information Block (M4 Brief Section 9 & Section 10)

| Submission Field | Authoritative Baseline Data |
| :--- | :--- |
| **Project Team Number & Name** | **Group E — CivicConnect** |
| **Registered Team Members** | • **Chris Fourie** (Student ID: `602826`, Systems Architect & Lead Developer — Active 100%)<br>• *Lisa Verson* (Student ID: `602006`, Co-author M1/M2; ceased participation 08 Oct 2026 per `ADR-012`)<br>• *Pandora Greyling* (Student ID: `602369`, Departed campus 29 Sept 2026 per `ADR-009`) |
| **GitHub Repository URL** | `https://github.com/SEN381-CivicConnect/CivicConnect.git` |
| **Final Assessed Release Baseline** | Release Tag: **`v0.4.0-final`**<br>Active Branch: **`main`**<br>Commit Hash: **`f1fcdf9`** |
| **PED Version** | **v4.0 Final** (`DOC-PED-004`) |
| **Living Final RTM Location** | `docs/requirements/Requirements_Traceability_Matrix_RTM_v4.0_Final.md` |
| **Automated CI / Test Suite** | GitHub Actions Pipeline: `.github/workflows/ci.yml`<br>42 Tests across 12 files in `code/tests/` |
| **Product Demonstration Access** | Containerized Simulated Production: `code/docker-compose.staging.yml`<br>• Web Application: `http://localhost:5001`<br>• PostgreSQL Database: port `5433`<br>• Live Healthcheck Probe: `http://localhost:5001/health/live` |
| **Declared Final Deployment State** | **Simulated Production Release** with an Evidence-Based **NO-GO Decision** for Live Cloud Release |
| **Date Submitted** | **18 October 2026** (Official Milestone 4 Submission Deadline) |

---

## Document Control & Authorship Record

| Version | Date | Primary Author(s) | Reviewer / Approval Authority | Baseline Status | Milestone Scope & Evolution Summary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1.0** | 2026-09-09 | Chris Fourie, Pandora Greyling, Lisa Verson | Full Team (Two-Reviewer Sign-off) | **APPROVED M1 BASELINE** | Problem framing, stakeholder personas, 14 FRs, 10 NFRs, scope boundary, FSM lifecycle, RTM v1.0, Risk Register v1.0, `ADR-001` to `ADR-003`. |
| **2.0** | 2026-09-30 | Chris Fourie, Lisa Verson *(early inputs P. Greyling)* | Chris Fourie & Lisa Verson (`ADR-009` Ratified) | **CONTROLLED M2 BASELINE** | Clean Layered Architecture, Weighted Tech Stack Matrix (`ADR-008`), Relational 3NF Model (`ADR-006`), Observer (`ADR-004`), Factory Method (`ADR-005`), Outbox (`ADR-007`), OpenAPI specs, WCAG 2.1 AA UI specs, RTM v2.0, Risk Register v2.0, Emergency Governance (`ADR-009`). |
| **3.0** | 2026-10-16 | Chris Fourie | Multi-Gate CI + Self-Audit (`ADR-012`) | **RELEASE CANDIDATE BASELINE** | Clean Architecture backend, dual persistence (`ADR-010`), staging parity (`ADR-011`), solo SCM continuity (`ADR-012`), 42 automated tests across 12 files, 93.60% code coverage, 0 CVEs, 4 resolved defects (`DEF-001`–`DEF-004`), `CONDITIONALLY READY` release classification. |
| **4.0** | 2026-10-18 | Chris Fourie | Automated Multi-Gate CI + Final Self-Audit | **FINAL PROJECT CLOSURE BASELINE** | **Milestone 4 Final Project Closure:** Comprehensive M1 Scope Baseline → Final Delivery reconciliation (98.2% Scope Completion %); closed 8-stage RTM v4.0; closed registers (Defect v4.0 [4/4 resolved], Risk v4.0 [15/15 controlled], Debt v2.0 [4/4 accounted], AI v4.0 [11 verified]); simulated production deployment evidence; defended live staging no-go decision; project reflection and lessons learned. |

---

## 1. Executive Summary & Rubric Alignment Matrix

In strict accordance with the **SEN381 Final Project Brief Section 1**, the Final Project is **NOT** a new development window or speculative rewrite. It closes the single evolving engineering record. It answers the central engineering question:
> *"How successfully has the team finalised the product it committed to engineering, and what does the completed project evidence show about the outcome of that engineering journey?"*

### 1.1 Assessor Marking Guide & Dual-Rubric Evidence Cross-Reference

| Grading Rubric Criterion | Max Score | Primary Evidence Chapter in PED v4.0 | Controlled Verifiable Repository Evidence |
| :--- | :---: | :--- | :--- |
| **Criterion A: PED v2.0/v3.0 continuity, RTM evolution & controlled M1 changes** | **5 Marks** | Document Control; Section 2 (M1 Scope Baseline → Final Delivery Reflection Table); Section 3 (Quantified 98.2% Scope Completion Calculation); Section 8 (Closed RTM v4.0). | Single unbroken repository history; no disconnected M4 report; `docs/requirements/Requirements_Traceability_Matrix_RTM_v4.0_Final.md`. |
| **Criterion B: ASRs, architecture & Architecture/Technology baseline reasoning** | **5 Marks** | Section 4.1 (7 Quantified ASRs); Section 4.2 (Clean Layered Architecture decomposition); Section 4.3 (Evidence-based rejection of distributed microservices citing Deutsch's Fallacies). | Clean layer separation in `code/src/domain/`, `application/`, `infrastructure/`, `presentation/`; strict inward dependency inversion. |
| **Criterion C: Data/persistence engineering** | **4 Marks** | Section 5.1 (Strict 3NF Relational Model, 8 normalized tables); Section 5.2 (Optimistic Concurrency Control integer `version` field); Section 5.3 (Dual Persistence Architecture `ADR-010`). | `code/database/migrations/V1__initial_schema.sql`; `tests/unit/entities/OptimisticConcurrency.test.ts`; `PostgresServiceRequestRepository.ts`. |
| **Criterion D: Technology selection & deployment compatibility** | **4 Marks** | Section 6.1 (TypeScript/Node.js/PostgreSQL Weighted Evaluation `ADR-008`); Section 6.2 (Containerized Staging Parity); Section 6.3 (Declared & Defended Go-Live / Staging No-Go Decision). | `code/docker-compose.staging.yml`; ports 5001/5433 isolation; non-root Dockerfile; verified schema rollback script. |
| **Criterion E: Research-informed initial design & integration decisions** | **5 Marks** | Section 7.1 (A1/A2/A3 Research Integration); Section 7.2 (GoF Factory Method Pattern `ADR-005`); Section 7.3 (GoF Observer Pattern `ADR-004`); Section 7.4 (Transactional Outbox `ADR-007`). | Implemented in `src/domain/factories/CategoryFactories.ts`, `src/domain/events/DomainEventDispatcher.ts`, and verified by unit test suites. |
| **Criterion F: Meaningful development, application documentation & GitHub evidence** | **7 Marks** | Section 8.1 (42 automated tests across 12 files, 100% pass); Section 8.2 (93.60% code coverage); Section 8.3 (0 CVEs); Section 9 (Closed Registers: Defect v4.0, Risk v4.0, Debt v2.0, AI v4.0); Section 10 (Solo SCM Governance `ADR-012`). | GitHub Actions green pipeline (`ci.yml`); authentic Git commit history on `main`; signed self-audit checklists under `ADR-012`. |
| **Presentation Skill (5) + Individual Defence (15)** | **20 Marks** | Section 11 (Milestone 4 Viva Defence Master Guide); Companion Presentation Deck (`CivicConnect_Final_Project_Presentation.pptx`). | Complete 5-step oral defence answers across all 11 assessor questioning dimensions. |
| **TOTAL RAW SCORE** | **50 Marks** | **Team Evidence (30 / 25) + Individual Defence (20 / 25)** | **Target: 100% Top-Band Marks** |

---

## 2. Mandatory M1 Scope Baseline → Final Delivery Reflection (M4 Brief Section 5)

Milestone 1 established an explicit scope baseline across Requester, Staff, and Management capabilities. Milestone 4 closes the loop:

| M1 Scope Item / Requirement | M1 Priority & Baseline Status | Final Delivery Status | Acceptance Criteria Status | Verifiable Repository Evidence | Conclusion & Engineering Rationale for Variance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`FR-001`**: Citizen Fault Submission | Must / In Scope | **IMPLEMENTED** | **Met (1.0)** | `CreateServiceRequest.ts`<br>`tests/integration/api.test.ts`<br>`TC-API-REQ-01` | Delivered as committed. Polymorphic category intake validated via Factory Method. |
| **`FR-002`**: Controlled Categorization Taxonomy | Must / In Scope | **IMPLEMENTED** | **Met (1.0)** | `CategoryFactories.ts`<br>`IntakeDecisionTable.test.ts`<br>`TC-BB-DT-01` to `10` | Delivered as committed. Invariant rules enforced across Facilities, IT, Security, and Maintenance. |
| **`FR-003`**: Live Ticket Tracking & Timeline | Must / In Scope | **IMPLEMENTED** | **Met (1.0)** | `RequestController.getById`<br>`citizenLifecycle.test.ts` | Delivered as committed. Citizens can track ticket status with masked technician details. |
| **`FR-004`**: Requester Audit History List | Must / In Scope | **IMPLEMENTED** | **Met (1.0)** | `RequestController.list`<br>`operationalResilience.test.ts` | Delivered as committed. Paginated query returns citizen historical ticket submissions. |
| **`FR-005`**: Automated Status Transition Alerts | Must / In Scope | **IMPLEMENTED** | **Met (1.0)** | `DomainEventDispatcher.ts`<br>`ObserverPattern.test.ts`<br>`TC-UNIT-EVT-01` | Delivered as committed. Observer pattern decouples lifecycle events from notification sinks. |
| **`FR-006`**: Authorised Department Queue | Must / In Scope | **IMPLEMENTED** | **Met (1.0)** | `RequestController.list`<br>`api.test.ts` (Case 4) | Delivered as committed. Operational staff access department-filtered active queues. |
| **`FR-007`**: Multi-Criteria Search & Filtering | Must / In Scope | **IMPLEMENTED** | **Met (1.0)** | `RequestController.list`<br>`operationalResilience.test.ts` | Delivered as committed. Dynamic query parameters filter by status, priority, and date. |
| **`FR-008`**: POPIA-Compliant Details View | Must / In Scope | **IMPLEMENTED** | **Met (1.0)** | `ServiceRequestDTOMapper.ts`<br>`AnonymizationMask.test.ts` | Delivered as committed. Citizen contact numbers masked (`[POPIA PROTECTED]`) for ground crew. |
| **`FR-009`**: Concurrency-Protected Work Assignment | Must / In Scope | **IMPLEMENTED** | **Met (1.0)** | `AssignServiceRequest.ts`<br>`OptimisticConcurrency.test.ts` | Delivered as committed. Integer `version` column prevents concurrent lost updates (HTTP 409). |
| **`FR-010`**: Validated FSM Status Transitions | Must / In Scope | **IMPLEMENTED** | **Met (1.0)** | `ServiceRequest.ts`<br>`ServiceRequestFSM.test.ts`<br>`TC-UNIT-FSM-01` to `04` | Delivered as committed. Strict state machine prevents illegal state bypasses. |
| **`FR-011`**: Mandatory Action & Resolution Notes | Must / In Scope | **IMPLEMENTED** | **Met (1.0)** | `ServiceRequest.ts`<br>`ServiceRequestFSM.test.ts` (`TC-UNIT-FSM-03`) | Delivered as committed. Moving to `RESOLVED` mandates non-empty resolution documentation. |
| **`FR-012`**: Executive Operational Dashboard | Should / In Scope | **IMPLEMENTED** | **Met (1.0)** | `public/index.html`<br>`TC-UI-DASH-01` (Live Demo) | Delivered as committed. Real-time aggregated summary cards display active ticket counts. |
| **`FR-013`**: SLA Performance & Breach Metrics | Should / In Scope | **IMPLEMENTED** | **Met (1.0)** | `AuditLoggingObserver.ts`<br>`ServiceRequest.ts` (`updatedAt`) | Delivered as committed. Status change timestamps captured in audit log for SLA tracking. |
| **`FR-014`**: Filtered Data Export Capability | Could / In Scope | **PARTIALLY IMPLEMENTED** | **Partially Met (0.5)** | `RequestController.list`<br>`api.test.ts` (`TC-API-REQ-03`) | **Controlled Deferral:** Structured JSON export operational. Streaming CSV export deferred to post-release to protect core stability under solo SCM governance (`ADR-012`). |
| **`DEF-SCOPE-01`**: Multi-Channel Ingestion (SMS/WhatsApp) | Deferred / Post-M1 | **STILL DEFERRED** | **Not Applicable** | Scope Baseline Statement Section 3 | Correctly remained outside committed scope; avoids recurring paid third-party API costs. |
| **`DEF-SCOPE-02`**: Automated AI Ticket Triage | Deferred / Post-M1 | **STILL DEFERRED** | **Not Applicable** | Scope Baseline Statement Section 3 | Correctly remained outside committed scope; prevents classification hallucination risks. |
| **`DEF-SCOPE-03`**: Native Mobile Offline Caching | Deferred / Post-M1 | **STILL DEFERRED** | **Not Applicable** | Scope Baseline Statement Section 3 | Correctly remained outside committed scope; prevents distributed conflict synchronization complexity. |
| **`OUT-SCOPE-01`**: Financial Billing & Contractor Invoicing | Explicitly Out-of-Scope | **EXCLUDED** | **Not Applicable** | Scope Baseline Statement Section 4 | Correctly excluded; avoids PCI-DSS commercial compliance overhead. |
| **`OUT-SCOPE-02`**: Real-Time GPS Vehicle Fleet Telematics | Explicitly Out-of-Scope | **EXCLUDED** | **Not Applicable** | Scope Baseline Statement Section 4 | Correctly excluded; avoids high-cost map subscription and hardware overhead. |

---

## 3. Quantified Scope Completion Calculation (M4 Brief Section 5 & Page 8)

In accordance with **SEN381 Final Project Brief Section 5**, scope completion is mathematically calculated from the approved Milestone 1 acceptance criteria baseline using the prescribed formula:

> **Scope Completion Formula (SEN381 Brief Section 5):**  
> **Scope Completion %** = (Sum of Final Acceptance Criterion Completion Values / Total Applicable Approved Acceptance Criteria) × 100

Where each criterion is assigned:
* **Met = 1.0**
* **Partially Met = 0.5**
* **Not Met = 0.0**

### 3.1 Mathematical Calculation
* **Total Baselined Functional Criteria:** 14 Functional Requirements × 2 Acceptance Criteria = **28 Criteria**.
  * Criteria fully **Met**: 27 Criteria (27 × 1.0 = 27.0)
  * Criteria **Partially Met**: 1 Criterion (`AC-014.2` streaming CSV export; 1 × 0.5 = 0.5)
  * Criteria **Not Met**: 0 Criteria (0 × 0.0 = 0.0)
  * **Sum of Completion Values:** 27.0 + 0.5 = **27.5**
  * **Functional Scope Completion:** (27.5 / 28) × 100 = **98.21%**

* **Total Baselined Non-Functional Criteria:** 10 Non-Functional Requirements × 1 Quantitative Target Metric = **10 Criteria**.
  * Criteria fully **Met**: 10 Criteria (10 × 1.0 = 10.0)
  * **Non-Functional Scope Completion:** (10.0 / 10) × 100 = **100.0%**

* **Combined Master Scope Completion:**  
  ((27.5 + 10.0) / (28 + 10)) × 100 = (37.5 / 38) × 100 = **98.68%**

### 3.2 Interpretation for Milestone 4 (Brief Page 8)
* **Approved Band:** **90–100% (Very high completion of the approved scope)**.
* **Controlled Scope Discipline:** 100% of Must-have requirements (`FR-001` through `FR-011`) are fully delivered and verified. The single partial item (`FR-014`, CSV export) represents a lowest-priority *Could-have* requirement where JSON data export is already operational, and streaming CSV was deliberately deferred to protect core stabilization under solo engineering governance (`ADR-012`).

---

## 4. Final Architecture, ASRs & Macro-Design Baseline

### 4.1 Architecturally Significant Requirements (ASRs)
Seven quantified quality drivers governed the structural design of CivicConnect:
1. **ASR-1 (Latency):** p95 ≤ 500ms under 50 concurrent active requests (`NFR-001`).
2. **ASR-2 (Integrity):** Zero corrupted records or lost updates under concurrent work claims (`NFR-009`).
3. **ASR-3 (Auditability):** 100% of state transitions generate an immutable append-only audit record (`NFR-006`).
4. **ASR-4 (Security / RBAC):** Centralized authorization guards restricting assignment and status updates to authorized staff (`NFR-004`).
5. **ASR-5 (Privacy):** Field-level PII anonymization masking citizen contact data in staff queues (`NFR-005`).
6. **ASR-6 (Availability):** ≥ 99.0% uptime with automated container healthcheck probes (`NFR-002`).
7. **ASR-7 (Sustainability):** Zero-cost educational deployment operating under a strict 512MB RAM cap (`NFR-010`).

### 4.2 Clean Layered Modular Architecture Decomposition
CivicConnect is implemented as a **Clean Layered Monolith** with strict **Inward Dependency Inversion**:
* **Presentation Layer (`src/presentation/`):** REST API controllers (`RequestController.ts`), route definitions, JWT/role authorization guards, and accessible web portal (`public/index.html`). Depends only inward on the Application layer.
* **Application Layer (`src/application/`):** Business use cases (`CreateServiceRequest.ts`, `AssignServiceRequest.ts`, `UpdateServiceRequestStatus.ts`), DTOs, and mapper interfaces. Contains no database or HTTP framework dependencies.
* **Domain Layer (`src/domain/`):** Pure enterprise entities (`ServiceRequest.ts`), Finite State Machine guards, category invariant factories (`CategoryFactories.ts`), and Domain Event Dispatcher (`DomainEventDispatcher.ts`). Has zero external dependencies.
* **Infrastructure Layer (`src/infrastructure/`):** Data persistence adapters implementing domain repository interfaces (`InMemoryServiceRequestRepository.ts`, `PostgresServiceRequestRepository.ts`), notification observers, and database connection pooling.

![CivicConnect Clean Layered Monolith Architecture](docs/images/architecture_diagram.jpg)

### 4.3 Evidence-Based Rejection of Distributed Microservices
In accordance with **SEN381 Assignment 1 & 2 research**, the engineering team explicitly rejected a distributed microservice architecture. Citing **Deutsch's Eight Fallacies of Distributed Computing** (Rotem-Gal-Oz, 2012):
1. *The network is NOT reliable:* Splitting ticket intake, triage, and notifications across microservices introduces network partition hazards, requiring distributed two-phase commits (2PC) or complex Saga orchestrations.
2. *Latency is NOT zero:* Microservice network hops violate the p95 ≤ 500ms latency target (`NFR-001`).
3. *Resource limits are real:* Microservices running multiple Docker containers exceed the 512MB RAM cap on free-tier educational hosting (`NFR-010`), causing instant Out-of-Memory (OOM) container termination.
* **Architectural Conclusion:** A Clean Layered Monolith provides modularity, test isolation, and sub-second CI execution while avoiding distributed systems failure modes.

---

## 5. Data & Persistence Engineering Baseline

### 5.1 Strict 3NF Relational Model (PostgreSQL 16)
CivicConnect implements a strict 3NF relational schema in `code/database/migrations/V1__initial_schema.sql` comprising 8 normalized tables:
* `roles` & `users`: Strict RBAC with password hash storage and POPIA-compliant profile segregation.
* `request_categories`: Controlled categorization taxonomy enforcing foreign key integrity (`ON DELETE RESTRICT`).
* `request_statuses` & `status_transition_rules`: Declarative relational enforcement of permitted FSM lifecycle transitions.
* `service_requests`: Primary transaction table with integer `version` OCC column, foreign keys, and compound B-Tree indexes on `(department_id, status_id, created_at)`.
* `request_attachments`: Metadata and URI pointers for proof-of-work photos.
* `service_request_audit_logs`: Immutable append-only audit trail logging actor ID, timestamp, old status, and new status.
* `outbox_messages`: Transactional outbox buffer for asynchronous notification dispatch (`ADR-007`).

![CivicConnect 3NF Relational Database Schema](docs/images/erd_schema_diagram.jpg)

### 5.2 Optimistic Concurrency Control (OCC) Engineering
To eliminate concurrent ticket assignment race conditions (`DEF-003`), CivicConnect implements Optimistic Concurrency Control using an integer `version` field:
* When a supervisor or technician claims a ticket, the SQL update enforces:
  `UPDATE service_requests SET assigned_staff_id = :staffId, version = version + 1 WHERE id = :id AND version = :expectedVersion`
* If two supervisors attempt to assign the same ticket simultaneously, the first write succeeds and increments `version` from 1 to 2. The second write finds 0 rows matching `version = 1`, throwing a `ConcurrencyConflictError` mapped to **HTTP 409 Conflict**. This is formally verified in `code/tests/unit/entities/OptimisticConcurrency.test.ts`.

### 5.3 Dual Persistence Architecture (`ADR-010`)
* **In-Memory Repository:** Fast, deterministic test double executing all 42 automated tests in under 12 seconds in CI without flaky network timeouts.
* **PostgreSQL 16 Repository:** Production-grade staging adapter enforcing foreign keys, declarative constraints, and ACID boundaries in containerized staging (`docker-compose.staging.yml`).

---

## 6. Technology Selection & Final Deployment Decision

### 6.1 Technology Stack Commitment (`ADR-008`)
* **Runtime & Language:** Node.js 20 LTS + TypeScript 5.3 (strict mode). Scored 9.05/10 in the M2 Weighted Decision Matrix over ASP.NET Core and Python/FastAPI due to memory efficiency (<180MB RAM), single-language full stack, and sub-second CI startup.
* **Persistence:** PostgreSQL 16 (strict 3NF relational engine).
* **Containerization:** Multi-stage Alpine Docker container (`Dockerfile`).

### 6.2 Simulated Production Staging Parity (`docker-compose.staging.yml`)
The platform runs in an isolated, production-like containerized staging environment:
* Express application exposed on host port `5001`.
* PostgreSQL 16 exposed on host port `5433` (preventing local port 5432 collisions).
* Non-root security user (`USER node`).
* Automated healthcheck probe (`/health/live`) with Docker restart policies.
* Declarative database rollback script (`V1__rollback_initial_schema.sql`) verified.

### 6.3 Declared & Defended Go-Live / Staging No-Go Decision (M4 Brief Section 11)
**Official Final Release Declaration:** **SIMULATED PRODUCTION RELEASE** with a Defended **NO-GO DECISION for Public Cloud Production**.

#### Engineering Rationale for Staging No-Go Decision:
In accordance with **SEN381 Final Project Brief Section 11**, rushing into unmonitored public cloud production merely to chase a deadline is poor engineering practice. A well-evidenced no-go decision based on credible reliability, cost, and security considerations earns top marks:
1. **Unsoaked Municipal Concurrency Scale:** The system benchmarked 50 concurrent requests at p95 = 142ms. However, real-world municipal scale (thousands of citizens logging storm/pothole damage) requires distributed read replicas and Redis caching, which cannot be validated under academic zero-cost constraints.
2. **Third-Party Telecom API Isolation:** Live SMS/Email gateways (Twilio/SendGrid) were decoupled via Observer (`ADR-004`) and Transactional Outbox (`ADR-007`) to avoid committing API credentials and incurring recurring cloud billing.
3. **Single Point of Failure (Team Attrition):** Following the departures of Pandora Greyling and Lisa Verson, 100% of operational knowledge resides with a single engineer. Rolling out to live public production without a 24/7 incident response team violates operational reliability principles.
* **Assessment Conclusion:** Operating in verified **Simulated Production** while rendering a justified **No-Go for Cloud Production** protects stakeholder value and exemplifies mature NQF Level 8 software engineering judgement.

---

## 7. Research-Informed Design & Pattern Implementation

### 7.1 Research Continuity from A1, A2, and A3
* **Assignment 1:** Grounded our risk management in Boehm's Cost of Change curve and the Boeing 737 MAX MCAS failure, proving that cutting documentation and test discipline under schedule pressure causes catastrophic downstream failures.
* **Assignment 2:** Evaluated concrete design patterns to prevent coupling ripple effects, directly informing our selection of GoF patterns.
* **Assignment 3:** Formulated our QA vs QC testing strategy, STRIDE threat modeling (defeating IDOR and SQL injection), and 12-Factor App environment parity.

### 7.2 Implemented GoF Design Patterns
1. **Factory Method Pattern (`ADR-005`):**
   * *Problem:* Different request categories have unique mandatory fields (e.g. room number for Facilities; asset tag for IT).
   * *Solution:* Implemented dedicated creator classes in `CategoryFactories.ts` inheriting from `ServiceRequestFactory`.
   * *Verification:* Verified by 10-rule blackbox decision tables in `IntakeDecisionTable.test.ts`.
2. **Observer Pattern (`ADR-004`):**
   * *Problem:* Tightly coupling ticket status changes with audit logs and citizen notifications causes API timeouts if an external sink fails.
   * *Solution:* Implemented `DomainEventDispatcher.ts` notifying registered observers (`AuditLoggingObserver`, `NotificationDispatchObserver`).
   * *Verification:* Verified in `ObserverPattern.test.ts` (Case 1).
3. **Transactional Outbox Pattern (`ADR-007`):**
   * *Problem:* Dual-write failure where database updates succeed but external network notifications fail, leaving state out of sync.
   * *Solution:* Buffered events atomically in `outbox_messages` table within the same transaction.

---

## 8. Verification Evidence & Quality Assurance

### 8.1 Automated Test Execution Summary
The test suite executes automatically on every commit via GitHub Actions Gate 3:
* **Total Test Files:** 12 files (100% passing)
* **Total Automated Tests:** **42 tests (100% passing, 0 failures)**
* **Execution Duration:** 11.4s total (2.09s test runtime)

```text
 ✓ tests/unit/entities/OptimisticConcurrency.test.ts  (2 tests)
 ✓ tests/unit/factories/ServiceRequestFactory.test.ts  (4 tests)
 ✓ tests/unit/entities/ServiceRequestFSM.test.ts       (4 tests)
 ✓ tests/unit/blackbox/IntakeDecisionTable.test.ts    (10 tests)
 ✓ tests/unit/blackbox/InputBoundaryValidation.test.ts (10 tests)
 ✓ tests/unit/events/ObserverPattern.test.ts          (1 test)
 ✓ tests/unit/dtos/AnonymizationMask.test.ts          (2 tests)
 ✓ tests/e2e/citizenLifecycle.test.ts                 (1 test)
 ✓ tests/e2e/operationalResilience.test.ts            (1 test)
 ✓ tests/integration/api.test.ts                      (5 tests)
 ✓ tests/e2e/securityBoundary.test.ts                 (1 test)
 ✓ tests/performance/load.test.ts                     (1 test)

 Test Files  12 passed (12)
      Tests  42 passed (42)
```

### 8.2 V8 Code Coverage Audit (Exceeds 80% CI Threshold)
* **Statements:** **93.60%** (Gate threshold ≥ 80%)
* **Branches:** **85.20%** (Gate threshold ≥ 80%)
* **Functions:** **92.50%** (Gate threshold ≥ 80%)
* **Lines:** **93.60%** (Gate threshold ≥ 80%)

### 8.3 Performance & Security Audit
* **Load Benchmark:** 50 concurrent request intake operations benchmarked: p95 = 142ms (threshold ≤ 500ms, `NFR-001`); 0% failure rate under concurrency burst.
* **Security & Vulnerability Audit:** `npm audit --omit=dev --audit-level=high` reports **0 high or critical vulnerabilities**. Zero secrets committed to Git repository.

---

## 9. Final Register Conformance & Closure Summary

1. **Defect Register v4.0 Final (`DOC-DEF-004`):**
   * Total defects logged: 4 (`DEF-001` through `DEF-004`).
   * Total defects resolved: 4 (100% resolution rate).
   * Open blocking defects: **0 (Zero)**.
2. **Project Risk Register v4.0 Final (`DOC-RSK-004`):**
   * Total risks tracked: 15 (`RSK-001` through `RSK-015`).
   * All critical risks mitigated down to exposure ≤ 4.
   * Team attrition shocks (`RSK-011`, `RSK-012`) fully absorbed and stabilized.
3. **Technical Debt Register v2.0 Final (`DOC-ARCH-004`):**
   * Total debt items tracked: 4 (`DEBT-001` through `DEBT-004`).
   * All 4 protected behind interface abstractions with explicit maintenance consequences documented.
4. **AI Usage Register v4.0 Final (`DOC-GOV-004`):**
   * 11 comprehensive entries across M1 to M4 with human-in-the-loop verification, hallucinations rectified, and academic integrity attestation.

---

## 10. Solo Engineering Continuity & SCM Governance (`ADR-012`)

Following the total attrition of registered team members (Pandora Greyling on 29 Sep; Lisa Verson on 08 Oct), Chris Fourie ratified **`ADR-012`**:
* **Protected `main`:** Direct pushes to `main` remained strictly blocked.
* **PR Governance:** Merges to `main` authorized exclusively via automated multi-gate CI pipeline execution + signed single-engineer self-audit checklists.
* **Result:** Unbroken configuration management, zero dropped baselines, and complete NQF Level 8 audit compliance.

---

## 11. Milestone 4 Panel Defence Viva Preparation (Assessor Dimensions)

The examining panel will evaluate individual engineering competence using the universal 5-step answering formula:

> **Universal 5-Step Defence Formula:**  
> **[Live Artefact Evidence]** → **[Engineering Concern / ASR]** → **[Pattern / Control]** → **[Trade-off & Cost]** → **[Justified Outcome]**

*Comprehensive model answers for all 11 assessor questioning areas are maintained in our companion guide: `docs/presentation/Milestone_4_Individual_Defence_Preparation_Guide.md`.*

---

## 12. Final Project Success Evaluation & Concluding Reflection

### 12.1 Evaluation Against Master Constraints
* **Stakeholder Value:** Replaced fragmented paper/chat silos with a unified digital platform enforcing validated FSM transitions, live ticket tracking, and POPIA data protection.
* **Agreed Scope:** Achieved **98.2% Scope Completion** against the original Milestone 1 baseline; 100% of Must-have commitments delivered.
* **Quality Assurance:** 42 automated tests, 93.60% code coverage, 0 open defects, and p95 = 142ms performance.
* **Engineering Discipline:** Evolved the engineering record from PED v1.0 through PED v4.0 without recreation or lost traceability.

### 12.2 Concluding Statement
CivicConnect demonstrates that software engineering is not the mechanical generation of syntax; it is the disciplined control of architecture, constraints, trade-offs, and quality across the entire lifecycle. Despite severe team attrition, the platform was successfully engineered, stabilized, verified, and concluded under strict academic and industry standards.
