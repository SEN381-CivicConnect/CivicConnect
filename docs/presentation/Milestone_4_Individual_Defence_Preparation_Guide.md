# CivicConnect: Milestone 4 Individual Engineering Defence Preparation Guide
## Comprehensive Viva Cross-Examination Rehearsal Across All 11 Assessor Questioning Dimensions

**Academic Year:** 2026  
**Module:** Software Engineering 381 (SEN381) — NQF Level 8  
**Project:** CivicConnect (Community Service Request Management Platform)  
**Deliverable:** Milestone 4 Final Capstone Viva Defence (20 / 25 Marks)  
**Governing Documents:**  
* `SEN381 FINAL.pdf` (Section 12, Section 14, Expected Assessor Questions Section 1–Section 11)  
* `SEN381 Master Project Brief v1.1` (Section 8, Section 19, Section 20.4, Section 21, Section 22)  
**Author & Lead Engineer:** Chris Fourie (Student ID: `602826`, Systems Architect & Lead Developer)  

---

## 1. The Universal 5-Step Oral Defence Answering Formula

When answering ANY question from the examining panel during the Milestone 4 Defence, strictly follow this 5-step structure:

$$\text{[1. Live Artefact Evidence]} \longrightarrow \text{[2. Engineering Concern / ASR]} \longrightarrow \text{[3. Architectural Pattern / Control]} \longrightarrow \text{[4. Trade-off \& Cost]} \longrightarrow \text{[5. Justified Outcome \& Verification]}$$

1. **Live Artefact Evidence:** Immediately open and cite the actual repository file, PED section, commit hash, or test log. Never speak abstractly.
2. **Engineering Concern / ASR:** Name the specific software engineering risk or quality driver (e.g., data corruption, lost updates, IDOR, POPIA non-compliance, free-tier OOM crash).
3. **Architectural Pattern / Control:** State the concrete engineering control applied (e.g., Optimistic Concurrency Control integer versioning, Factory Method invariants, Clean Architecture inward dependency inversion, Transactional Outbox buffer).
4. **Trade-off & Cost:** Acknowledge what was deliberately sacrificed (e.g., in-flight event volatility, class count overhead, handling HTTP 409 in the client, development time).
5. **Justified Outcome:** Present empirical verification proving that stakeholder intent is satisfied (e.g., 42 passing tests in 11.4s, 93.60% code coverage, 0 open defects, $p95 = 142\text{ms}$).

---

## 2. Model Answers for All 11 Assessor Questioning Areas

---

### Area 1: Final Product & Overall Outcome
**Q1: "What is the exact commit/tag/release being demonstrated, and how do we know it is the same version described in PED v4.0?"**
* **Model Answer:**
  1. *Live Evidence:* Open Git terminal and execute `git log -n 1` and `git status`. Open `PED_v4.0_Final.md` Section 1. Show commit hash `f1fcdf9` and release tag `v0.4.0-final` on branch `main`.
  2. *Engineering Concern:* Software baseline drift and configuration desynchronization where documentation describes code that was never deployed or tested.
  3. *Control:* `ADR-012` and our Git release baseline protocol. The commit hash is stamped in `PED_v4.0_Final.md`, `package.json`, and returned live by the `/health/live` probe.
  4. *Trade-off:* Requires re-verifying documentation on every release candidate tag rather than treating docs as static drafts.
  5. *Outcome:* 100% cryptographic alignment between assessed repository HEAD, live Docker container, and PED v4.0 dossier.

**Q2: "What changed between the M3 release candidate and this final version?"**
* **Model Answer:**
  1. *Live Evidence:* Git diff `git log 494c064..f1fcdf9 --stat`.
  2. *Engineering Concern:* Scope bloat and instability caused by introducing new unverified features during project closure.
  3. *Control:* Adherence to the M4 Principle (*Finalise, Consolidate & Conclude*). Zero new architectural components were added. Work was strictly restricted to consolidating registers, calculating the 98.2% scope completion baseline, compiling the final release dossier, and preparing defence evidence.
  4. *Trade-off:* Resisted the temptation to code new experimental features (such as WhatsApp webhooks or machine learning classification).
  5. *Outcome:* Rock-solid final product stability; 100% pass rate across all 42 tests.

---

### Area 2: M1 Scope Baseline $\rightarrow$ Final Delivery
**Q3: "Choose one item placed in scope in M1. Was it fully implemented, partially implemented, not implemented, or changed? Show the evidence."**
* **Model Answer:**
  1. *Live Evidence:* Open `PED_v4.0_Final.md` Section 2 row `FR-009` and `code/src/domain/entities/ServiceRequest.ts`.
  2. *Engineering Concern:* Concurrent ticket assignment race conditions causing lost updates when multiple coordinators assign technicians simultaneously.
  3. *Control:* `FR-009` was **IMPLEMENTED**. Governed by `ADR-006` (Optimistic Concurrency Control). Implemented via an integer `version` property that increments on each assignment.
  4. *Trade-off:* Rejected database row locking (`SELECT FOR UPDATE`) to avoid connection pool exhaustion under high read traffic. Accepted requiring API consumers to handle HTTP 409 Conflict.
  5. *Outcome:* Fully Met (`AC-009.1` and `AC-009.2`). Verified in `tests/unit/entities/OptimisticConcurrency.test.ts` and `tests/integration/api.test.ts`.

**Q4: "Show one item that was deliberately deferred or out of scope. Why should that not be treated as project failure?"**
* **Model Answer:**
  1. *Live Evidence:* Open `Project/docs/requirements/Scope_Baseline_Statement.md` Section 3 and Section 4.
  2. *Engineering Concern:* Premature feature commitment leading to budget overrun, third-party network flakiness, and project failure.
  3. *Control:* In Milestone 1, we explicitly deferred Multi-Channel Ingestion (SMS/WhatsApp webhooks) and Out-of-Scoped Financial Billing.
  4. *Trade-off:* Requesters cannot report faults via WhatsApp; they must use our web portal.
  5. *Outcome:* Not a failure, but mature engineering constraint management: WhatsApp Business APIs incur recurring costs that violate `NFR-010` ($0.00 educational budget cap), while financial billing introduces PCI-DSS compliance overhead unnecessary for a public municipal fault platform.

---

### Area 3: Requirements, Acceptance Criteria & Final Evidence
**Q5: "Why does demonstrating a working screen not by itself prove that a requirement has been accepted?"**
* **Model Answer:**
  1. *Live Evidence:* Open `code/src/presentation/controllers/RequestController.ts` and `tests/integration/api.test.ts`.
  2. *Engineering Concern:* The *UI Mirage Fallacy*—a UI form can render inputs, show a green notification, and look polished while silently bypassing domain invariants, dropping database transactions, or failing under concurrent loads.
  3. *Control:* Full 8-stage verification traceability in RTM v4.0. Acceptance requires proving that domain entities reject invalid inputs (`CategoryFactories.ts`), enforce state transitions (`ServiceRequest.ts`), commit ACID transactions to PostgreSQL 16, and pass negative automated test assertions.
  4. *Trade-off:* High investment in automated test automation (42 tests, 93.60% coverage) rather than spending all time tweaking UI CSS.
  5. *Outcome:* Rigorous, verifiable software engineering quality rather than a cosmetic surface demonstration.

---

### Area 4: M3 Issues $\rightarrow$ Final Status
**Q6: "Identify an important defect from M3. What is its root cause and final status?"**
* **Model Answer:**
  1. *Live Evidence:* Open `Project/docs/risk/Defect_Register_v4.0.md` row `DEF-003`.
  2. *Engineering Concern:* Race conditions during ticket assignment causing lost updates (`FR-009`, `NFR-009`).
  3. *Control:* Root Cause Analysis revealed that our initial update handler read the ticket and executed an unconditional write back to the store without verifying if another coordinator had modified it in the interim. Corrected by implementing Optimistic Concurrency Control (`ADR-006`): `ServiceRequest.assignTechnician()` checks `expectedVersion === this._version` and increments version.
  4. *Trade-off:* Version collisions throw `ConcurrencyConflictError`, requiring the client to refresh the queue.
  5. *Outcome:* **CLOSED & REVERIFIED**. Regression test `tests/unit/entities/OptimisticConcurrency.test.ts` simulates two concurrent writes on the same ticket, proving that exactly one succeeds and the second returns HTTP 409 Conflict.

---

### Area 5: Engineering Decisions & Consequences
**Q7: "Which earlier decision helped the team most during finalisation, and which created technical debt?"**
* **Model Answer:**
  1. *Live Evidence:* Open `Project/docs/decisions/ADR-008_Technology_Stack_Commitment.md` and `ADR-004_Observer_Pattern_Notifications.md`.
  2. *Engineering Concern:* Team velocity and cognitive load after severe team member attrition, versus lifecycle notification coupling.
  3. *Control:*
     * *Best Decision:* **`ADR-008` (TypeScript Clean Monolith):** Using a single language (TypeScript) across domain, use cases, Express API, and Vitest test suites allowed a single active engineer (Chris Fourie) to maintain 100% velocity and absorb the entire project after partner departures.
     * *Debt Decision:* **`ADR-004` (In-Memory Observer):** Synchronous in-memory event dispatching prevented free-tier OOM crashes (`NFR-010`), but created `DEBT-002` (in-flight events cannot survive an abrupt server process crash before audit observers write).
  4. *Trade-off:* Accepted in-memory event volatility in exchange for sub-second test execution and operating under 180MB RAM.
  5. *Outcome:* Established the `outbox_messages` table DDL in PostgreSQL (`ADR-007`) as our documented post-release repayment path.

---

### Area 6: Quality, Limitations, Risk & Technical Debt
**Q8: "If this product had to be used by real users tomorrow, what would concern you most and why?"**
* **Model Answer:**
  1. *Live Evidence:* Open `Project/docs/release/Release_Evidence_Summary_v1.0.md` Section 3 (Residual Risk Statement).
  2. *Engineering Concern:* Municipal burst traffic soak under severe storm conditions, and third-party telecom carrier latency.
  3. *Control:* We benchmarked 50 concurrent requests at $p95 = 142\text{ms}$ (`NFR-001`). However, real-world municipal storm events generate thousands of simultaneous photo uploads.
  4. *Trade-off:* Under academic $0.00 cost constraints, we could not provision multi-region managed Kubernetes clusters or distributed Redis caching.
  5. *Outcome:* This is the exact engineering justification for our **Staging No-Go Decision** for cloud production. The platform is certified for **Simulated Production**, and requires cloud load soak testing before public rollout.

---

### Area 7: Finalisation & Project Closure
**Q9: "Show how PED v3.0 became PED v4.0 without losing the engineering history of the project."**
* **Model Answer:**
  1. *Live Evidence:* Open `Project/docs/PED/PED_v4.0_Final_Project_Closure_and_Release_Dossier.md` Document Control table.
  2. *Engineering Concern:* The *Amnesia Anti-Pattern*—teams discarding earlier milestone reports and writing an isolated final essay, destroying traceability.
  3. *Control:* Strict adherence to Brief Section 6 (*One Project, One Evolving Engineering Record*). PED v4.0 retains all M1 problem definitions, M2 architecture baselines, and M3 construction findings. It adds the M1 Scope Baseline Reconciliation (Section 2), Quantified Scope Completion (Section 3), and Final Deployment & Reflection chapters (Section 6, Section 12).
  4. *Trade-off:* Managing a single large, comprehensive dossier rather than fragmenting into smaller informal documents.
  5. *Outcome:* Unbroken engineering provenance from Day 1 to Day 49.

---

### Area 8: Individual Contribution & Engineering Understanding
**Q10: "What was your individual contribution to the final product and finalisation work?"**
* **Model Answer:**
  1. *Live Evidence:* Git commit history `git log --author="Chris Fourie" --stat`.
  2. *Engineering Concern:* Lack of individual accountability in group projects where non-contributing students claim collective credit.
  3. *Control:* As registered under `ADR-009` and ratified under `ADR-012`, I personally architected the Clean Layered Monolith, authored the backend use cases and entities, implemented the PostgreSQL schema migrations, configured Docker Compose staging, wrote 100% of the 42 automated tests across 12 files, and compiled PED v3.0 and PED v4.0.
  4. *Trade-off:* Sustaining an extraordinary individual workload following the withdrawal of both assigned partners.
  5. *Outcome:* 100% mastery of every line of code, test case, architectural decision, and lifecycle document in the repository.

---

### Area 9: Unseen Change / Failure Reasoning
**Q11: "If a stakeholder requested adding real-time GPS tracking of field technician vans today, what existing artefacts would you examine before responding?"**
* **Model Answer:**
  1. *Live Evidence:* Open `Project/docs/requirements/Scope_Baseline_Statement.md` Section 4 and `Master Project Brief Appendix E`.
  2. *Engineering Concern:* Rushed, ad-hoc scope creep compromising security, schedule, and architectural boundaries.
  3. *Control:* I would execute the formal **Appendix E Change Impact Analysis**:
     - *Scope Baseline:* GPS telematics is explicitly listed in Section 4 as Out-of-Scope.
     - *NFR-005 (POPIA Privacy):* Continuous live tracking of staff vehicles introduces employee privacy and telemetry encryption requirements.
     - *NFR-010 (Cost):* Live mapping APIs (Google Maps / Mapbox) incur per-request billing, violating our zero-cost constraint.
     - *Architecture:* High-frequency GPS telemetry requires time-series databases or WebSockets, conflicting with our lightweight request-response REST architecture.
  4. *Trade-off:* Stakeholders do not see live vehicle icons moving on a map.
  5. *Outcome:* Formally reject or defer the request, protecting system stability and project constraints.

---

### Area 10: Final Project Conclusion
**Q12: "In one evidence-based conclusion, what did this project ultimately achieve and what remains unfinished?"**
* **Model Answer:**
  1. *Live Evidence:* Open `PED_v4.0_Final.md` Section 12.
  2. *Engineering Concern:* Reaching an honest, evidence-based conclusion rather than presenting marketing spin.
  3. *Control:* CivicConnect successfully delivered **98.2% of its approved functional scope** and **100% of its non-functional requirements**. It proved that enterprise software engineering principles—Clean Architecture, design patterns, automated CI quality gates, and relational data integrity—can deliver an operational platform capable of handling fault intake, triage, concurrency control, and POPIA privacy under strict resource constraints.
  4. *Trade-off:* Streaming CSV data export and binding live commercial telecom gateways remain unfinished and deferred to post-release maintenance.
  5. *Outcome:* A robust, stable, fully verified release candidate ready for simulated production.

---

### Area 11: Quantified Scope Completion & Go-Live Decision
**Q13: "What is your final Scope Completion Percentage, and how did you calculate it?"**
* **Model Answer:**
  1. *Live Evidence:* Open `PED_v4.0_Final.md` Section 3 and `SEN381 FINAL.pdf` Page 8.
  2. *Engineering Concern:* Arbitrary, unverified completion claims inflated by trivial items.
  3. *Control:* Calculated strictly using the formula:
     $$\text{Scope Completion \%} = \left(\frac{\sum \text{Final Acceptance Criterion Values}}{\text{Total Approved Criteria}}\right) \times 100$$
     - Functional Scope: 14 Requirements $\times$ 2 Criteria = 28 Criteria. 27 Met ($27 \times 1.0$) + 1 Partially Met ($1 \times 0.5$ for FR-014 CSV) = **27.5 / 28 = 98.21%**.
     - Non-Functional Scope: 10 NFRs $\times$ 1 Metric = 10 Criteria. 10 Met ($10 \times 1.0$) = **10.0 / 10 = 100%**.
     - Combined Master Scope: $37.5 / 38 = \mathbf{98.68\%}$.
  4. *Trade-off:* Honestly reporting FR-014 as Partially Met (0.5) rather than claiming 100% perfection.
  5. *Outcome:* Lands in the highest band (**90–100%**), exceeding the 80% requirement with full evidence.
