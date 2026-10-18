# CivicConnect: Milestone 3 Individual Engineering Defence Preparation Guide
## Structured Defence Rehearsal & Model Answers across all 5 Assessment Dimensions

**Academic Year:** 2026  
**Module:** Software Engineering 381 (SEN381) — NQF Level 8  
**Project:** CivicConnect (Community Service Request Management Platform)  
**Governing Standard:** SEN381 Milestone 3 Brief Section 17, Section 18, Section 20  
**Document Identifier:** `DOC-DEFENCE-M3-001`  
**Milestone:** Milestone 3 (Individual Oral Engineering Defence — 20 Marks)  
**Team Members:** Chris Fourie (602826) & Lisa Verson (602006)  

---

## 1. Individual Defence Rubric & Ground Rules (M3 Brief Section 17 & Section 20)

Every student is examined individually. Being present at the presentation does not guarantee individual marks; marks depend on demonstrated technical understanding and the ability to defend authentic repository evidence:

```
┌──────────────────────────────────────────────────┬───────┬────────────────────────────────────────────────────────┐
│ Defence Assessment Area                          │ Marks │ Evaluated Student Competency                           │
├──────────────────────────────────────────────────┼───────┼────────────────────────────────────────────────────────┤
│ 1. Requirement-to-Evidence Trace                 │   4   │ Traces a requirement end-to-end through code & test.   │
│ 2. Engineering Decision & M2 Conformance         │   4   │ Explains context, alternatives, trade-offs, and ADRs.  │
│ 3. Quality Evidence Interpretation               │   4   │ Interprets test, CI, coverage, and performance results.│
│ 4. Failure & Residual Risk Reasoning             │   4   │ Explains failure modes, controls, and remaining risks. │
│ 5. Release Readiness Defence                     │   4   │ Defends CONDITIONALLY READY classification using data. │
├──────────────────────────────────────────────────┼───────┼────────────────────────────────────────────────────────┤
│ TOTAL INDIVIDUAL DEFENCE                         │  20   │ Evaluated Per Student (Chris Fourie & Lisa Verson)     │
└──────────────────────────────────────────────────┴───────┴────────────────────────────────────────────────────────┘
```

---

## 2. Dimension 1: Requirement-to-Evidence Trace (4 Marks)

### Question 1.1 (Lead: Lisa Verson): Trace `FR-001` (Service Request Intake) end-to-end through the project.
* **Model Answer:**
  1. *Stakeholder Need:* Community requesters need an accessible, structured way to report campus faults without administrative friction.
  2. *Requirement & Acceptance Criteria:* `FR-001` specifies intake with mandatory category, priority, description, location, and privacy choice. `AC-001.2` mandates descriptions $\ge 10$ characters for IT support tickets to prevent vague reports.
  3. *Architecture & Design Pattern:* Follows Clean Architecture. Express controller ([`RequestController.ts#L29-L47`](file:///C:/Chris/Studies/SEN/Project/code/src/presentation/controllers/RequestController.ts)) delegates to `CreateServiceRequestUseCase`. The use case uses the **Factory Method Pattern (`ADR-005`)** via `ServiceRequestFactoryRegistry`, which routes to `ItSupportCategoryCreator` ([`CategoryFactories.ts#L48-L72`](file:///C:/Chris/Studies/SEN/Project/code/src/domain/factories/CategoryFactories.ts)).
  4. *Verification Evidence:* Evaluated via Boundary Value Analysis in [`InputBoundaryValidation.test.ts#L21-L51`](file:///C:/Chris/Studies/SEN/Project/code/tests/unit/blackbox/InputBoundaryValidation.test.ts) (asserting rejection at $N=9$ chars and acceptance at $N=10$) and API integration in [`api.test.ts#L24-L41`](file:///C:/Chris/Studies/SEN/Project/code/tests/integration/api.test.ts) (returning HTTP 201 Created).
  5. *RTM Trace Link:* Fully indexed in [`RTM_v3.0.md` Row FR-001](file:///C:/Chris/Studies/SEN/Project/docs/requirements/Requirements_Traceability_Matrix_RTM_v3.0.md).

### Question 1.2 (Lead: Chris Fourie): Trace `FR-009` / `FR-010` (Assignment & Finite State Machine) end-to-end.
* **Model Answer:**
  1. *Stakeholder Need:* Department supervisors must assign technicians without race conditions or illegal status bypasses.
  2. *Requirement & Acceptance Criteria:* `FR-009` mandates technician assignment; `FR-010` mandates deterministic FSM status progression; `AC-009.2` mandates OCC concurrency control.
  3. *Implementation:* Domain entity [`ServiceRequest.ts#L126-L161`](file:///C:/Chris/Studies/SEN/Project/code/src/domain/entities/ServiceRequest.ts) validates `expectedVersion === this._version` and checks next state against `VALID_FSM_TRANSITIONS`. In SQL, [`PostgresServiceRequestRepository.ts#L65-L95`](file:///C:/Chris/Studies/SEN/Project/code/src/infrastructure/repositories/PostgresServiceRequestRepository.ts) updates `WHERE request_id = $3 AND version = $4`.
  4. *Verification Evidence:* Verified in [`OptimisticConcurrency.test.ts`](file:///C:/Chris/Studies/SEN/Project/code/tests/unit/entities/OptimisticConcurrency.test.ts), API OCC conflict test [`api.test.ts#L43-L71`](file:///C:/Chris/Studies/SEN/Project/code/tests/integration/api.test.ts) (returning HTTP 409 Conflict), and E2E Journey 1 ([`lifecycleJourney.test.ts#L56-L71`](file:///C:/Chris/Studies/SEN/Project/code/tests/e2e/lifecycleJourney.test.ts)).

---

## 3. Dimension 2: Engineering Decision & M2 Baseline Conformance (4 Marks)

### Question 2.1 (Lead: Chris Fourie): Explain `ADR-006` (Optimistic Concurrency Control vs. Pessimistic Locking).
* **Context & Problem:** Multiple field technicians or supervisors view queues simultaneously. If two supervisors assign different technicians to the same ticket, a lost update occurs.
* **Evaluated Alternatives:**
  1. *Pessimistic Locking (`SELECT FOR UPDATE`):* Locks the database row during queue viewing. Rejected because technicians browsing queues would lock rows indefinitely, causing connection pool starvation.
  2. *NoSQL Document Store (MongoDB):* Lacks ACID transaction guarantees across audit logs.
  3. *Optimistic Concurrency Control with integer `version` column (Selected):* Rows remain non-blocking for queries. Version increments on update. Stale versions trigger an instant, non-blocking `ConcurrencyConflictError` mapped to `HTTP 409 Conflict`.
* **Consequence & Trade-off:** Zero locking contention, but client UI must handle HTTP 409 responses by notifying the user and auto-refreshing ticket state.

### Question 2.2 (Lead: Chris Fourie): Explain `ADR-010` (Dual Persistence Strategy).
* **Context & Problem:** Milestone 3 requires proving PostgreSQL 16 persistence, but running live Docker DB containers in GitHub Actions CI runners adds ~60s latency per PR and burns free-tier quotas.
* **Solution:** Dependency Inversion. Domain use cases depend on `IServiceRequestRepository`. Implemented `InMemoryServiceRequestRepository` for CI (<2s suite) and `PostgresServiceRequestRepository` with live pool query and health probe for staging, toggled via `USE_POSTGRES`.

---

## 4. Dimension 3: Quality Evidence Interpretation (4 Marks)

### Question 3.1 (Lead: Lisa Verson): What does your test suite prove, and what does it NOT prove?
* **Evidence:** 41 automated tests pass across 10 suites in 1.30s; code coverage is 84.03% statements, 83.33% branches.
* **What it Proves:** Proves that all isolated domain invariants, FSM transition guards (`VALID_FSM_TRANSITIONS`), boundary thresholds ($N=9, 10, 11$), decision table routing rules (9 categories), RBAC guards (HTTP 403), and OCC conflicts (HTTP 409) execute strictly as specified without regression.
* **What it Does NOT Prove:** Passing tests do not prove that external third-party SMS/email APIs will never fail, that Docker networks under high packet loss will not drop connections, or that the application will survive 50,000 simultaneous connections on production cloud clusters.

### Question 3.2 (Lead: Chris Fourie): Interpret your load benchmark results against `NFR-001`.
* **Evidence:** In [`load.test.ts`](file:///C:/Chris/Studies/SEN/Project/code/tests/performance/load.test.ts), 50 concurrent requests against `POST /api/v1/requests` achieved p50 = 2.1ms, p95 = 5.4ms, 0% error rate.
* **Interpretation:** Confirms that under a sudden burst of 50 simultaneous community fault reports, Node.js asynchronous event loop and Clean Architecture layering incur negligible CPU overhead, comfortably meeting `NFR-001` ($\le 500$ms).
* **Limitation:** Acknowledges that the test executed in an in-memory harness on a local workstation; it does not simulate multi-tier database disk I/O latency or distributed geographical network lag.

---

## 5. Dimension 4: Failure & Residual Risk Reasoning (4 Marks)

### Question 4.1 (Lead: Chris Fourie): Describe an authentic failure caught during construction and how it was controlled.
* **Defect Walkthrough (`DEF-001`):**
  * *Failure:* When two supervisors concurrently assigned a technician with the same version, the server threw an unhandled exception returning `HTTP 500 Internal Server Error`.
  * *Engineering Impact:* The client application could not distinguish between a fatal server crash and a standard optimistic concurrency race condition.
  * *Corrective Action:* Added a custom exception handler in [`RequestController.ts`](file:///C:/Chris/Studies/SEN/Project/code/src/presentation/controllers/RequestController.ts) inspecting `if (error instanceof ConcurrencyConflictError)` and returning `HTTP 409 Conflict` with current and expected versions.
  * *Regression Proof:* Captured in [`api.test.ts#L43-L71`](file:///C:/Chris/Studies/SEN/Project/code/tests/integration/api.test.ts) and [`lifecycleJourney.test.ts#L173-L188`](file:///C:/Chris/Studies/SEN/Project/code/tests/e2e/lifecycleJourney.test.ts).

### Question 4.2 (Lead: Chris Fourie): Explain residual risk `RSK-012` and why it remains.
* **Explanation:** `RSK-012` addresses production-scale concurrency uncertainty. It remains because student academic teams lack municipal cloud infrastructure budgets to run distributed load generators simulating an entire metropolitan municipality.
* **Mitigation:** We proved local single-node burst stability (50 concurrency) and verified memory stays $< 50$MB RAM. Before any actual municipal rollout, cloud staging load testing with distributed tools (e.g. k6 / Locust) is scheduled.

---

## 6. Dimension 5: Release Readiness Defence (4 Marks)

### Question 5.1 (Lead: Chris Fourie & Lisa Verson): Defend your `CONDITIONALLY READY` release classification.
* **Defensible Argument:**
  * We deliberately classify CivicConnect as **`CONDITIONALLY READY`** rather than claiming an unrealistic "production ready" status.
  * **Why it is Ready:** All 14 functional requirements work end-to-end; 41 automated tests pass; CI pipeline quality gates pass with zero failures; zero high-severity defects remain; secrets are isolated; staging containers run on ports 5001/5433 with verified rollback scripts.
  * **Explicit Conditions:**
    1. Operational execution is validated in single-node staging environments, not multi-node Kubernetes clusters.
    2. Fast CI execution relies on the in-memory repository harness (`ADR-010`).
    3. External SMS/Email notifications are handled via in-process domain event observers (`ADR-004`) rather than durable transactional outbox worker polling loops (`DEBT-003`).
