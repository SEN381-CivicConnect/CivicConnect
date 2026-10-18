# CivicConnect: Milestone 4 Final Demonstration Script & Live Storyboard
## Professional Capstone Engineering Review Meeting (~24 Minutes)

**Academic Year:** 2026  
**Module:** Software Engineering 381 (SEN381) — NQF Level 8  
**Project:** CivicConnect (Community Service Request Management Platform)  
**Deliverable:** Compulsory Final Product Demonstration & Viva Defence Presentation  
**Governing Documents:**  
* `SEN381 FINAL.pdf` (§3, §4, §5, §11, §12, §13, §14)  
* `SEN381 Master Project Brief v1.1` (§8, §9, §15, §19, §20.4, §21, §22)  
**Author & Presenter:** Chris Fourie (Student ID: `602826`, Systems Architect & Lead Developer)  
**Ratified Governance Protocol:** `ADR-012` (Solo SCM Governance following team attrition)  
**Final Release Baseline:** `v0.4.0-final` (Commit `c2d7def` on `main`)  
**Submission Deadline:** Sunday, 18 October 2026, 23:59 SAST  

---

## 1. Demonstration Standards & Presentation Ground Rules (Brief §12)

In accordance with **SEN381 Final Project Brief §12**, the final demonstration is not a generic marketing pitch or a screen-by-screen tour. It is an **evidence-based engineering review** structured across 5 distinct stages (~24 minutes total), followed by individual viva cross-examination:

```text
[00:00 – 06:00] Stage 1: Final Product & Critical User Journeys (Release Baseline v0.4.0-final)
[06:00 – 12:00] Stage 2: M1 Scope Baseline → Final Delivery Reflection & 98.2% Scope Completion %
[12:00 – 16:00] Stage 3: M3 → Final Project Closure (Defects, Debt, Risks & AI Usage Registers)
[16:00 – 20:00] Stage 4: Living RTM v4.0, Closed Traceability & Automated Quality Gates (42 Tests)
[20:00 – 24:00] Stage 5: Project Conclusion, Decision Consequences & Defended Go-Live / Staging No-Go
[Assessed Sep]  Stage 6: Individual Engineering Defence (Assessor Viva using 5-Step Formula)
```

---

## 2. Slide-by-Slide Script, Live Terminal Cues & Artefact Citations

---

### Slide 1: Title & Capstone Project Final Overview (00:00 – 02:00)
* **Slide Visual:** Slide 1 (`CivicConnect_Final_Project_Presentation.pptx`) showing Title, Group E, Chris Fourie (602826), Release Tag `v0.4.0-final`, Commit `c2d7def`, and `ADR-012` Governance Badge.
* **On-Screen Action:** Web camera active with student face clearly framed and student identity stated.

#### Spoken Script:
> *"Good day Assessor. My name is **Chris Fourie**, student number **602826**, presenting the Final Capstone Engineering Demonstration for **CivicConnect: Community Service Request Management Platform** in SEN381 at Belgium Campus ITversity.
>
> Today represents project closure. As established in the Final Project Brief, Milestone 4 is not a new development window; its purpose is to **Finalise, Consolidate, and Conclude**.
>
> Our assessed final release baseline is version **`v0.4.0-final`**, anchored to commit **`c2d7def`** on the protected `main` branch of our official repository.
>
> In terms of team governance, as documented in our living Risk Register under `RSK-011` and `RSK-012`, our team experienced total member attrition with Pandora Greyling departing in M2 and Lisa Verson withdrawing in M3. In response, I ratified **`ADR-012`**—our Solo SCM Governance Protocol. Under `ADR-012`, direct commits to `main` remained locked; merging required passing all automated CI quality gates alongside completed, signed single-engineer self-audit checklists, while preserving an active grace period.
>
> Over the next 24 minutes, I will demonstrate our final integrated product, reconcile our original M1 scope commitments, prove our 98.2% scope completion, present our automated verification evidence, and defend our release decisions."*

---

### Slide 2: Executive Assessment Cross-Walk (02:00 – 04:00)
* **Slide Visual:** Slide 2 showing the complete dual-rubric cross-reference table mapping Moodle Criteria A–F + Individual Defence to PED v4.0 chapters and repository artefacts.

#### Spoken Script:
> *"Turning to Slide 2: To ensure maximum assessment transparency, we have cross-referenced every criterion from the Moodle portal against the Final Project Brief requirements.
>
> Our submission addresses:
> - **Criterion A (5 Marks):** Unbroken PED v4.0 continuity, living RTM evolution, and our quantified 98.2% Scope Completion Percentage.
> - **Criterion B (5 Marks):** Clean Layered Architecture, 7 quantified ASRs, and the explicit rejection of distributed microservices based on Deutsch’s Eight Fallacies.
> - **Criterion C (4 Marks):** Strict 3NF relational modeling in PostgreSQL 16, Optimistic Concurrency Control integer versioning, and our dual-persistence test architecture.
> - **Criterion D (4 Marks):** Technology stack commitment in ADR-008, Docker staging environment parity, and our defended Go-Live / Staging No-Go decision.
> - **Criterion E (5 Marks):** Research-informed GoF patterns: Factory Method for polymorphic intake invariants, and Observer for decoupled event notifications.
> - **Criterion F (7 Marks):** 42 automated tests passing with 93.60% code coverage, 0 CVEs, 4 resolved defects, and authenticated Git commit evidence.
> - **Presentation & Individual Defence (20 Marks):** Comprehensive viva preparation using our 5-step engineering answering formula."*

---

### Slide 3: Stage 1: The Final Integrated Product & Architecture (04:00 – 06:00)
* **Slide Visual:** Slide 3 displaying the 4-layer architectural decomposition, runtime specs (Node.js 20 LTS, TypeScript 5.3, PostgreSQL 16), RAM footprint (<180MB), and healthcheck probes.
* **Live Action Cue:**
  * Open Terminal: Run `docker compose -f code/docker-compose.staging.yml ps` to show running containers.
  * Open Browser: Navigate to `http://localhost:5001/health/live` to display live JSON health probe (`status: UP`, `uptimeSeconds`, `memoryUsageMB: 142MB`).

#### Spoken Script:
> *"Moving to Stage 1: The Final Integrated Product.
>
> As mandated by Brief Section 4, the strongest evidence in Milestone 4 is a single, coherent, stable product. We are not presenting disconnected prototypes.
>
> CivicConnect is constructed as a **Clean Layered Monolith** with strict inward dependency inversion:
> - The **Presentation Layer** (`src/presentation/`) exposes REST API endpoints, enforces role authorization guards, and serves our semantic web dashboard.
> - The **Application Layer** (`src/application/`) orchestrates domain use cases without referencing Express or database drivers.
> - The **Domain Core** (`src/domain/`) encapsulates enterprise business rules, FSM state guards, and category factories with zero external dependencies.
> - The **Infrastructure Layer** (`src/infrastructure/`) implements our dual repositories and event observers.
>
> In our staging environment running live on my machine, the app runs on Node.js 20 LTS with PostgreSQL 16 on port 5433, consuming under 180MB of RAM and reporting live health status via our `/health/live` probe."*

---

### Slide 4: Stage 1 (Cont.): Combined Critical User Journeys (06:00 – 08:30)
* **Slide Visual:** Slide 4 detailing the three verified critical end-to-end user journeys (Intake to Resolution, Concurrency OCC, and RBAC/POPIA).
* **Live Action Cue:**
  * Switch to Browser: Open `http://localhost:5001/` (Web Dashboard).
  * **Journey 1:** Submit a new `Facilities` fault. Show that leaving room number blank fails validation; fill in Room 302 and submit. Ticket `REQ-2026-0042` appears in the queue.
  * **Journey 2:** Transition ticket to `ASSIGNED` with staff ID. Show integer version incrementing. Explain OCC race condition prevention.
  * **Journey 3:** Show that citizen phone number appears as `[POPIA PROTECTED]` in staff view, but is visible to administrators. Transition ticket to `RESOLVED` with mandatory resolution notes.

#### Spoken Script:
> *"On Slide 4, I will demonstrate our three critical user journeys live in the application:
>
> First, **Citizen Fault Intake**: When logging a Facilities fault, our Factory Method Pattern enforces domain invariants—requiring building and room numbers. Submitting creates the ticket in `SUBMITTED` status and assigns an initial tracking reference.
>
> Second, **Concurrency-Protected Assignment**: In multi-user operations, two coordinators might assign the same ticket simultaneously. As demonstrated in Defect 003, our Optimistic Concurrency Control checks the integer `version` field. The first claim updates the technician and increments `version` from 1 to 2; any concurrent request on version 1 is intercepted and rejected with HTTP 409 Conflict, preventing lost updates.
>
> Third, **Security and Privacy**: In compliance with the POPIA Act, citizen contact details are masked with `[POPIA PROTECTED]` for field technicians. Furthermore, status progression follows our Finite State Machine: moving to `RESOLVED` strictly requires non-empty resolution notes, while illegal state jumps are rejected by our domain guards."*

---

### Slide 5: Stage 2: M1 Scope Baseline → Final Delivery Reflection (08:30 – 11:00)
* **Slide Visual:** Slide 5 showing the full M1 Scope Reconciliation table covering all 14 FRs and 10 NFRs.

#### Spoken Script:
> *"Turning to Stage 2: Scope Reconciliation.
>
> Milestone 1 established an explicit commitment baseline. As required by Brief Section 5, we close that loop honestly without making excuses or hiding omissions.
>
> - **Must-Have Requirements (`FR-001` through `FR-011`):** 100% of these core commitments are **IMPLEMENTED** and verified. Intake, categorization, tracking, queues, search, POPIA masking, concurrency, state machine transitions, and resolution notes are fully operational.
> - **Should-Have Requirements (`FR-012` & `FR-013`):** Both are **IMPLEMENTED**. Our executive dashboard displays real-time status counts, and audit logs capture timestamps for SLA tracking.
> - **Could-Have Requirement (`FR-014` Data Export):** Classified as **PARTIALLY IMPLEMENTED**. Structured JSON collection export is fully operational. Streaming CSV export was deliberately deferred to post-release to protect core stability under solo engineering governance.
>
> Crucially, our deliberately deferred scope from M1—such as multi-channel SMS/WhatsApp ingestion and automated AI triage—correctly remained deferred, avoiding third-party recurring costs and classification hallucination risks."*

---

### Slide 6: Stage 2 (Cont.): Quantified Scope Completion Percentage (11:00 – 13:00)
* **Slide Visual:** Slide 6 displaying the mathematical calculation: 27.5 / 28 = 98.2% on FRs, 10/10 = 100% on NFRs, 98.7% master combined score.

#### Spoken Script:
> *"Slide 6 presents our Quantified Scope Completion Percentage, calculated strictly using the formula prescribed on Page 8 of the Milestone 4 Brief.
>
> Across our 14 functional requirements with 2 acceptance criteria each, 27 criteria are fully Met with a value of 1.0, and 1 criterion—`AC-014.2` CSV streaming—is Partially Met with a value of 0.5. This produces a completion value of 27.5 divided by 28, or **98.21% functional completion**.
>
> Across our 10 Non-Functional Requirements, all 10 quantitative metrics are verified, yielding **100% NFR completion**.
>
> Combined, CivicConnect achieves **98.68% overall scope completion**. This places our project in the highest evaluation band—90 to 100%: *Very high completion of approved scope*—comfortably exceeding the faculty's 80% requirement, while demonstrating disciplined, traceable scope control."*

---

### Slide 7: Stage 3: M3 → Final Project Closure & Registers (13:00 – 15:30)
* **Slide Visual:** Slide 7 summarizing the final state of Defect Register v4.0, Technical Debt Register v2.0, Risk Register v4.0, and AI Usage Register v4.0.
* **Live Action Cue:**
  * Open VS Code: Briefly display `docs/risk/Defect_Register_v4.0.md` showing all 4 defects resolved.
  * Display `docs/architecture/Technical_Debt_Register_v2.0.md` showing 4 debt items behind interface boundaries.

#### Spoken Script:
> *"Moving to Stage 3: Milestone 3 Issue Closure.
>
> Brief Section 7 emphasizes that closure does not mean claiming perfection; it means knowing the exact final status of all issues.
>
> In our **Defect Register v4.0**:
> - All 4 defects logged across construction—`DEF-001` through `DEF-004`—are **100% closed and reverified** with automated regression tests. There are zero open Severity 1 or Severity 2 defects in our release baseline.
>
> In our **Technical Debt Register v2.0**:
> - All 4 deliberate trade-offs are accounted for behind clean interface boundaries: our dual-persistence switch (`DEBT-001`), in-memory observer dispatching (`DEBT-002`), mock notification sinks (`DEBT-003`), and single-host containerized staging (`DEBT-004`).
>
> In our **Risk Register v4.0**:
> - All 15 risks are controlled. Critical team attrition shocks were stabilized via ratified ADRs.
>
> And in our **AI Usage Register v4.0**:
> - All 11 AI usage entries across the lifecycle are fully documented with human verification methods, critical hallucinations rectified, and our academic integrity attestation."*

---

### Slide 8: Stage 4: Living RTM v4.0 & Closed Traceability Chain (15:30 – 17:30)
* **Slide Visual:** Slide 8 illustrating the full 8-stage verification traceability chain and deep traces for `FR-001` and `FR-009`/`FR-010`.

#### Spoken Script:
> *"Turning to Stage 4: Living RTM Traceability.
>
> In accordance with Brief Section 9, we did not create a disconnected final report. Our living RTM v4.0 closes the complete **8-stage verification chain**:
> *Stakeholder Need → Requirement → Acceptance Criteria → Engineering Decision → Implementation → Test Evidence → Defect Link → Final Outcome.*
>
> To demonstrate our deep trace:
> - Take **`FR-001`**: Community requesters needed digital fault reporting without paperwork. This mapped to `AC-001.1` and `AC-001.2`. In architecture, it is governed by `ADR-005` Factory Method. In code, it is implemented in `CreateServiceRequest.ts` and `CategoryFactories.ts`. In testing, it is verified by `TC-UNIT-FAC-01` and API integration tests in CI Gate 3. When an invariant bypass was discovered, it was logged as `DEF-001`, resolved, and verified. Final outcome: **MET**.
>
> - Similarly, **`FR-009`** concurrency traces through `ADR-006`, integer version OCC checking in `ServiceRequest.ts`, and our automated race condition tests, resolving `DEF-003`. Final outcome: **MET**."*

---

### Slide 9: Stage 4 (Cont.): Automated Quality Gates & Verification Evidence (17:30 – 19:30)
* **Slide Visual:** Slide 9 displaying test metrics: 42/42 tests passed, 93.60% coverage, 0 CVEs, $p95 = 142\text{ms}$, and CI Gate 1 to Gate 4.
* **Live Action Cue:**
  * Open Terminal: Execute `npm test` inside `code/`. Show all 12 test files and 42 tests passing in ~11 seconds.
  * Show coverage output: Statements 93.60%, Branches 85.20%, Lines 93.60%.

#### Spoken Script:
> *"Slide 9 presents our automated verification evidence. We do not make unsupported claims of quality.
>
> As you can see running live in my terminal, our entire test suite of **42 automated tests across 12 test files executes in 11 seconds with a 100% pass rate**.
>
> Our test strategy combines multiple formal techniques:
> - Unit tests verifying domain entity state guards and Factory Method invariants.
> - Black-box testing using 10-rule Decision Tables and 2-value Boundary Value Analysis.
> - API integration testing verifying status codes, DTO mapping, and negative authorization guards (HTTP 403).
> - Three complete end-to-end user journeys verifying lifecycle, security, and resilience.
>
> In our CI pipeline on GitHub Actions, V8 code coverage measures **93.60% statement coverage**—substantially exceeding the 80% CI threshold—while `npm audit` confirms **zero high or critical vulnerabilities**."*

---

### Slide 10: Stage 5: Final Deployment & Defended Go-Live Decision (19:30 – 21:30)
* **Slide Visual:** Slide 10 detailing our official deployment declaration: Simulated Production Release with a defended Staging No-Go decision for cloud production.

#### Spoken Script:
> *"Moving to Stage 5: Final Deployment and Go-Live Decision.
>
> Brief Section 11 instructs teams to declare and defend their release state: production, simulated production, or staging under a justified no-go decision. It explicitly notes that teams must not lose marks for refusing to race into production to meet a deadline.
>
> Our official declared state is **SIMULATED PRODUCTION RELEASE** with a defended **NO-GO DECISION for public cloud production**.
>
> This decision is grounded in three responsible engineering judgements:
> 1. **Concurrency Soak:** While we verified 50 concurrent requests at $p95 = 142\text{ms}$, municipal scale with thousands of simultaneous citizens requires distributed multi-region database replicas and Redis caching, which cannot be verified under academic $0.00 cost constraints.
> 2. **External Gateway Decoupling:** Live SMS and Email providers (Twilio/SendGrid) were decoupled via Observer (`ADR-004`) and Transactional Outbox (`ADR-007`) to avoid committing credentials and incurring recurring cloud costs.
> 3. **Solo Operational Risk:** Following team attrition, releasing to live public production without a 24/7 incident response rotation violates operational reliability principles.
>
> Operating in verified Simulated Production while defending a Staging No-Go protects stakeholder value."*

---

### Slide 11: Stage 5 (Cont.): Decision Consequence Reflection (21:30 – 23:00)
* **Slide Visual:** Slide 11 displaying the decision reflection table evaluating `ADR-004`, `ADR-005`, `ADR-006`, `ADR-008`, `ADR-010`, and `ADR-012`.

#### Spoken Script:
> *"Continuing Stage 5 on Slide 11: Decision Consequence Reflection.
>
> Section 22 of the Master Brief asks us to reflect on our earlier architectural decisions using empirical evidence:
> - Committing to a **TypeScript Clean Monolith (`ADR-008`)** was our most vital decision: its shared language and low memory footprint (<180MB) allowed a single engineer to absorb the entire project after team attrition.
> - Adopting the **Factory Method Pattern (`ADR-005`)** made resolving Defect 001 straightforward because category validation was isolated from our core intake pipeline.
> - Implementing **Optimistic Concurrency Control (`ADR-006`)** eliminated race conditions during concurrent work order assignments without database row locking.
> - And ratifying **`ADR-012`** preserved our SCM governance, allowing us to complete the capstone on time with full NQF Level 8 audit compliance."*

---

### Slide 12: Stage 6: Individual Defence & Capstone Conclusion (23:00 – 24:00)
* **Slide Visual:** Slide 12 displaying the Universal 5-Step Defence Answering Formula, readiness across all 11 questioning dimensions, and academic integrity attestation.

#### Spoken Script:
> *"Finally, Stage 6: Individual Engineering Defence.
>
> As the sole active engineer who designed the architecture, wrote the backend, configured Docker, authored the automated tests, and maintained our living dossiers, I am prepared to answer panel questions across all 11 assessment dimensions using our **5-step engineering formula**:
> Connecting live artefact evidence, to the underlying engineering concern, the architectural pattern applied, the accepted trade-off, and the verified empirical outcome.
>
> CivicConnect proves that Software Engineering is about discipline, traceability, and accountability under real-world constraints.
>
> Thank you, Assessor. I welcome your questions and look forward to defending our engineering record."*
