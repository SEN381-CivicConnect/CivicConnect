# CivicConnect: Milestone 4 Final Demonstration Script & Live Storyboard
## Professional Capstone Engineering Review Meeting (16 Slides • ~22–24 Minutes)

**Academic Year:** 2026  
**Module:** Software Engineering 381 (SEN381) — NQF Level 8  
**Project:** CivicConnect (Community Service Request Management Platform)  
**Deliverable:** Compulsory Final Product Demonstration & Viva Defence Presentation  
**Governing Documents:**  
* `SEN381 FINAL.pdf` (�Section 3, �Section 4, �Section 5, �Section 11, �Section 12, �Section 13, �Section 14)  
* `SEN381 Master Project Brief v1.1` (�Section 8, �Section 9, �Section 15, �Section 19, �Section 20.4, �Section 21, �Section 22)  
**Author & Presenter:** Chris Fourie (Student ID: `602826`, Systems Architect & Lead Developer)  
**Ratified Governance Protocol:** `ADR-012` (Solo SCM Governance following team attrition)  
**Final Release Baseline:** `v0.4.0-final` (Commit `f1fcdf9` on `main`)  
**Submission Deadline:** Sunday, 18 October 2026, 23:59 SAST  

---

## 1. Demonstration Standards & 16-Slide Running Order

In accordance with **SEN381 Final Project Brief �Section 12**, the presentation is structured into 16 focused, clean slides with short, natural spoken scripts (~1.2 to 1.5 minutes per slide) to allow a relaxed, professional delivery without overwhelming text:

```text
[00:00 – 01:30] Slide 1:  Title & Capstone Final Overview (v0.4.0-final, Commit f1fcdf9, ADR-012)
[01:30 – 02:45] Slide 2:  Executive Rubric Cross-Walk (Harmonizing Moodle Criteria A–F with M4)
[02:45 – 04:15] Slide 3:  Stage 1: The Final Integrated Product & System Architecture
[04:15 – 05:45] Slide 4:  Stage 1 (Cont.): User Journey 1 — Citizen Intake & Factory Invariants (FR-001, FR-002)
[05:45 – 07:15] Slide 5:  Stage 1 (Cont.): User Journey 2 — Lifecycle FSM & Resolution Notes (FR-010, FR-011)
[07:15 – 08:45] Slide 6:  Stage 1 (Cont.): User Journey 3 — Concurrency & POPIA Privacy (FR-008, FR-009, DEF-003)
[08:45 – 10:15] Slide 7:  Stage 2: Mandatory M1 Scope Baseline → Final Delivery Reflection (Table of 14 FRs + 10 NFRs)
[10:15 – 11:30] Slide 8:  Stage 2 (Cont.): Quantified Scope Completion Percentage (98.2% FR, 100% NFR, 98.7% Combined)
[11:30 – 13:00] Slide 9:  Stage 3: Milestone 3 → Final Closure: Defect Register v4.0 (4/4 Resolved DEF-001–DEF-004)
[13:00 – 14:30] Slide 10: Stage 3 (Cont.): Technical Debt Register v2.0 & Risk Register v4.0 (4 Debts, 15 Risks)
[14:30 – 15:45] Slide 11: Stage 3 (Cont.): AI Usage Register v4.0 & Academic Integrity (11 Verified Entries)
[15:45 – 17:15] Slide 12: Stage 4: Living RTM v4.0 & Closed Traceability Chain (8-Stage Verification Chain)
[17:15 – 18:45] Slide 13: Stage 4 (Cont.): Automated Quality Gates & Verification Evidence (42 Tests, 93.60% Coverage)
[18:45 – 20:15] Slide 14: Stage 5: Final Deployment Baseline & Defended Staging No-Go Decision
[20:15 – 21:45] Slide 15: Stage 5 (Cont.): Decision Consequence Reflection & Lessons Learned (ADR-004 to ADR-012)
[21:45 – 23:00] Slide 16: Stage 6: Individual Engineering Defence & Capstone Conclusion (5-Step Formula)
```

---

## 2. Detailed Slide-by-Slide Spoken Script & Demonstration Actions

---

### Slide 1: Title & Capstone Project Final Overview (00:00 – 01:30)
* **Slide Visual:** Slide 1 showing Title, Group E, Chris Fourie (602826), Release Tag `v0.4.0-final`, Commit `f1fcdf9`, and `ADR-012` Governance Badge.
* **Live Action Cue:** Keep webcam framed on full face; introduce student identity and release baseline.

#### Spoken Script:
> *"Good day Assessor. My name is **Chris Fourie**, student number **602826**, representing Group E for the Software Engineering 381 module at Belgium Campus ITversity.
>
> Today, I am formally presenting our Milestone 4 Final Capstone Engineering Demonstration for **CivicConnect: Community Service Request Management Platform**.
>
> As set out in the Final Project Brief, Milestone 4 is not a new development window. Our explicit engineering principle is to **Finalise, Consolidate, and Conclude**.
>
> Our assessed final release baseline is version **`v0.4.0-final`**, anchored to commit **`f1fcdf9`** on the protected `main` branch of our official GitHub repository.
>
> In terms of team governance: As documented in our living Risk Register under `RSK-011` and `RSK-012`, our team experienced total member attrition with Pandora Greyling departing in Milestone 2 and Lisa Verson withdrawing in Milestone 3. In response, I ratified **`ADR-012`**—our Solo SCM Governance Protocol. Under `ADR-012`, direct pushes to `main` remained blocked; merging required passing all automated CI quality gates alongside our completed, signed single-engineer self-audit checklists.
>
> Over this final demonstration, I will trace our commitments from M1 to final delivery, prove our 98.2% scope completion, demonstrate our containerized simulated production environment, and defend our engineering decisions."*

---

### Slide 2: Executive Assessment Cross-Walk (01:30 – 02:45)
* **Slide Visual:** Slide 2 displaying the dual-rubric cross-walk mapping Moodle Criteria A–F + Viva to PED v4.0 chapters.

#### Spoken Script:
> *"Turning to Slide 2: We have cross-referenced every single assessment criterion from the Moodle portal against the Milestone 4 Final Project Brief.
>
> Our submission maps cleanly across all six criteria:
> - **Criterion A** is evidenced by our unbroken PED v4.0 dossier and our quantified 98.2% scope completion calculation.
> - **Criterion B** is evidenced by our Clean Layered Architecture and explicit rejection of distributed microservices based on Deutsch's Eight Fallacies.
> - **Criterion C** is evidenced by our 8-table normalized 3NF PostgreSQL relational model and integer version Optimistic Concurrency Control.
> - **Criterion D** is evidenced by our containerized staging parity and defended Staging No-Go decision.
> - **Criterion E** is evidenced by our research-informed GoF patterns: Factory Method for polymorphic intake and Observer for event decoupling.
> - **Criterion F** is evidenced by our 42 automated tests passing at 93.60% coverage and zero CVEs.
> - And finally, our 20-mark **Individual Defence** component is prepared using our 5-step engineering answering formula."*

---

### Slide 3: Stage 1: The Final Integrated Product & System Architecture (02:45 – 04:15)
* **Slide Visual:** Slide 3 displaying the 4-layer architecture, runtime specs (Node.js 20 LTS, TypeScript 5.3, PostgreSQL 16), RAM footprint (<180MB), and healthcheck probes.
* **Live Action Cue:** Alt-Tab to Browser `http://localhost:5001/health/live` to show live uptime and memory metrics.

#### Spoken Script:
> *"Moving to Stage 1: The Final Integrated Product.
>
> As required by Brief Section 4, the strongest evidence in Milestone 4 is a single, coherent, stable product. We are not demonstrating disconnected prototypes.
>
> CivicConnect is built as a **Clean Layered Monolith** adhering strictly to inward dependency inversion:
> - The **Presentation layer** handles HTTP routing, JWT/role extraction, and serves our semantic web dashboard.
> - The **Application layer** orchestrates business use cases without referencing Express or SQL.
> - The **Domain core** encapsulates enterprise rules, FSM state guards, and category factories with zero external dependencies.
> - And the **Infrastructure layer** implements our dual-persistence repositories and notification observers.
>
> [ALT-TAB TO BROWSER NOW]
> Notice in my browser that our application is running live inside Docker on port 5001, backed by PostgreSQL 16 on port 5433. Our health probe at `/health/live` returns status UP with a memory footprint of just 142 megabytes—comfortably inside our 512MB container quota."*

---

### Slide 4: Stage 1 (Cont.): User Journey 1 — Citizen Intake & Factory Invariants (04:15 – 05:45)
* **Slide Visual:** Slide 4 detailing the intake flow, Factory Method Pattern (`ADR-005`), and `DEF-001` resolution.
* **Live Action Cue:** Alt-Tab to Web Dashboard `http://localhost:5001/`; submit a Facilities fault without a room number to trigger validation; then enter Room 302 and submit successfully.

#### Spoken Script:
> *"Here on Slide 4, we examine our first critical user journey: Citizen Fault Intake and Category Invariants.
>
> When a citizen reports a fault, our platform enforces controlled categorization under `FR-001` and `FR-002`.
>
> Rather than using a fragile switch-statement, we implemented the GoF Factory Method Pattern under `ADR-005`. Each category is handled by a specialized domain creator: `FacilityFaultCreator`, `ItSupportCreator`, and `SecurityHazardCreator`.
>
> In Milestone 3, we logged Defect 001 because initial intake allowed facility tickets to be created without a room number. We resolved this by embedding invariant validation directly into the factory methods.
>
> [ALT-TAB TO BROWSER NOW]
> As demonstrated live in our portal: attempting to submit a facility fault without a room number immediately fails validation. When I supply Room 302, the ticket instantiates cleanly with tracking reference `REQ-2026-0042`, initialized to `SUBMITTED` status."*

---

### Slide 5: Stage 1 (Cont.): User Journey 2 — Lifecycle FSM & Resolution Notes (05:45 – 07:15)
* **Slide Visual:** Slide 5 showing FSM state rules (`DEC-004`) and mandatory resolution notes (`FR-011`).
* **Live Action Cue:** Alt-Tab to Web Dashboard; transition ticket to `IN_PROGRESS`; then transition to `RESOLVED` with empty notes to show failure, then add technician notes and resolve.

#### Spoken Script:
> *"Continuing to Slide 5: User Journey 2 demonstrates Lifecycle State Machine Validation and Resolution Notes under `FR-010` and `FR-011`.
>
> Municipal service requests cannot allow arbitrary state transitions. We implemented a server-side Finite State Machine governed by Decision 004. A ticket must strictly progress from `SUBMITTED`, to `ASSIGNED`, to `IN_PROGRESS`, to `RESOLVED`.
>
> Direct state jumps—such as attempting to resolve an unassigned ticket—are blocked at the domain boundary, throwing an `InvalidStateTransitionError`.
>
> Furthermore, under `FR-011`, moving a ticket to `RESOLVED` mandates non-empty resolution notes to ensure operational accountability.
>
> [ALT-TAB TO BROWSER NOW]
> In our live demonstration: attempting to mark the ticket as resolved with empty notes fails immediately. Once I provide the technician notes confirming the repair, the ticket resolves, and an immutable audit log row is appended with the timestamp and actor ID."*

---

### Slide 6: Stage 1 (Cont.): User Journey 3 — Concurrency & POPIA Privacy (07:15 – 08:45)
* **Slide Visual:** Slide 6 illustrating Optimistic Concurrency Control integer versioning and POPIA data masking.
* **Live Action Cue:** Alt-Tab to VS Code; show `OptimisticConcurrency.test.ts` and `AnonymizationMask.test.ts`.

#### Spoken Script:
> *"Slide 6 presents our third critical user journey: Concurrency Protection and Citizen Privacy.
>
> In multi-user operations, two coordinators might attempt to assign the same ticket simultaneously. In Milestone 3, we logged Defect 003 because concurrent writes silently overwrote each other.
>
> We resolved this by implementing Optimistic Concurrency Control under `ADR-006`. Our `ServiceRequest` entity maintains an integer `version` column. When Supervisor A claims a ticket, the version increments from 1 to 2. If Supervisor B concurrently submits an update against version 1, the system intercepts the collision and throws a `ConcurrencyConflictError`, mapped to HTTP 409 Conflict.
>
> Simultaneously, under `NFR-005` and POPIA compliance, our `ServiceRequestDTOMapper` masks citizen contact numbers with `[POPIA PROTECTED]` for operational ground crew, while granting unmasked access strictly to authenticated administrators."*

---

### Slide 7: Stage 2: Mandatory M1 Scope Baseline → Final Delivery Reflection (08:45 – 10:15)
* **Slide Visual:** Slide 7 showing the full Scope Reconciliation Table covering all 14 FRs and 10 NFRs.

#### Spoken Script:
> *"Turning to Stage 2: Scope Reconciliation.
>
> Milestone 1 established an explicit commitment baseline. As required by Brief Section 5, we close that loop honestly without making excuses or hiding omissions.
>
> Looking at our baseline commitments:
> - **Must-Have Requirements, from `FR-001` through `FR-011`:** Every single one is **IMPLEMENTED** and verified. Citizen intake, categorization, tracking, queues, search, POPIA masking, concurrency, state machine transitions, and resolution notes are fully operational.
> - **Should-Have Requirements:** Both `FR-012` executive dashboard and `FR-013` SLA metrics are fully delivered.
> - **Could-Have Requirement, `FR-014`:** This is classified as **PARTIALLY IMPLEMENTED**. Structured JSON export is operational; streaming CSV export was deliberately deferred to post-release to protect core stability under solo engineering governance.
>
> Crucially, our deliberately deferred items from M1—such as SMS/WhatsApp webhooks and automated AI triage—correctly remained deferred, avoiding third-party recurring costs and classification hallucination risks."*

---

### Slide 8: Stage 2 (Cont.): Quantified Scope Completion Percentage (10:15 – 11:30)
* **Slide Visual:** Slide 8 displaying the mathematical calculation: 27.5 / 28 = 98.2% on FRs, 10/10 = 100% on NFRs, 98.7% master combined score.

#### Spoken Script:
> *"Continuing Stage 2 on Slide 8: We have calculated our Quantified Scope Completion Percentage strictly using the formula prescribed on Page 8 of the Milestone 4 Brief.
>
> Across our 14 functional requirements with 2 acceptance criteria each, 27 criteria are fully Met with a value of 1.0, and 1 criterion—`AC-014.2` for CSV streaming—is Partially Met with a value of 0.5. This yields a completion sum of 27.5 divided by 28, or **98.21% functional completion**.
>
> Across our 10 Non-Functional Requirements, all 10 quantitative metrics are verified, yielding **100% NFR completion**.
>
> Combined, CivicConnect achieves **98.68% overall scope completion**. This places our project in the highest evaluation band—90 to 100%: *Very high completion of approved scope*—far surpassing the faculty's 80% minimum requirement, while proving disciplined scope control."*

---

### Slide 9: Stage 3: Milestone 3 → Final Closure: Defect Register v4.0 (11:30 – 13:00)
* **Slide Visual:** Slide 9 detailing root causes and corrective actions for `DEF-001` through `DEF-004`.
* **Live Action Cue:** Alt-Tab to VS Code: open `docs/risk/Defect_Register_v4.0.md`.

#### Spoken Script:
> *"Moving to Stage 3: Milestone 3 Issue Closure.
>
> Brief Section 7 emphasizes that closure does not mean claiming perfection; it means knowing the exact final status of all engineering issues.
>
> In our **Defect Register v4.0**: All 4 defects logged across construction are **100% resolved** and guarded by automated regression tests in CI:
> - `DEF-001` resolved category invariant bypasses via our Factory Method creators.
> - `DEF-002` resolved our CI coverage configuration anomaly, ensuring our domain core maintains over 93% coverage.
> - `DEF-003` resolved concurrent ticket assignment race conditions via Optimistic Concurrency Control integer versioning.
> - And `DEF-004` resolved unprivileged assignment attempts via centralized role-based access control guards.
>
> There are zero open Severity 1 or 2 defects in our final release baseline."*

---

### Slide 10: Stage 3 (Cont.): Technical Debt Register v2.0 & Risk Register v4.0 (13:00 – 14:30)
* **Slide Visual:** Slide 10 summarizing 4 concluded debt items behind interfaces and 15 controlled risks.
* **Live Action Cue:** Alt-Tab to VS Code: open `docs/architecture/Technical_Debt_Register_v2.0.md`.

#### Spoken Script:
> *"Continuing Stage 3 on Slide 10: We examine our Technical Debt Register v2.0 and Risk Register v4.0.
>
> In software engineering, technical debt is not accidental negligence; it is a deliberate, transparent engineering trade-off.
>
> All 4 active technical debt items in our register are isolated behind clean SOLID interface abstractions:
> - Our dual-persistence switch allows sub-12-second CI test runs while preserving PostgreSQL staging.
> - Our in-memory observer dispatching enforces our zero-cost constraint while our outbox table schema provides the post-release migration path.
> - And our mock notification sinks avoided committing credentials or incurring third-party billing.
>
> In our Risk Register: All 15 risks are controlled. The severe team attrition shocks of losing both partners were stabilized via `ADR-009` and `ADR-012` without a single quality compromise."*

---

### Slide 11: Stage 3 (Cont.): AI Usage Register v4.0 & Academic Integrity (14:30 – 15:45)
* **Slide Visual:** Slide 11 illustrating the 5-stage verification pipeline and 3 critical hallucinations rectified.
* **Live Action Cue:** Alt-Tab to VS Code: open `docs/governance/AI_Usage_Register_v4.0.md`.

#### Spoken Script:
> *"Slide 11 details our AI Usage Register v4.0.
>
> In strict compliance with Master Brief Section 10, Artificial Intelligence was utilized solely as an engineering assistant. AI output is never treated as authoritative evidence and transfers zero accountability away from the student.
>
> Every AI suggestion followed our 5-stage verification pipeline, and our register records 11 entries across the lifecycle.
>
> Crucially, our register proves rigorous human-in-the-loop critique:
> - When Claude suggested deploying Apache Kafka, I rejected it because its 1-gigabyte memory requirement would crash our free-tier container.
> - When ChatGPT suggested pessimistic database locking, I rejected it because it would cause connection pool starvation during queue browsing.
> - And when an AI suggested bypassing branch protection after team attrition, I rejected it and ratified `ADR-012` instead."*

---

### Slide 12: Stage 4: Living RTM v4.0 & Closed Traceability Chain (15:45 – 17:15)
* **Slide Visual:** Slide 12 illustrating the full 8-stage verification chain and deep traces for `FR-001` and `FR-009`/`FR-010`.
* **Live Action Cue:** Alt-Tab to VS Code: open `docs/requirements/Requirements_Traceability_Matrix_RTM_v4.0_Final.md`.

#### Spoken Script:
> *"Turning to Stage 4: Living RTM Traceability.
>
> In accordance with Brief Section 9, we did not create a disconnected final report. Our living RTM v4.0 closes the complete **8-stage verification chain**:
> *Stakeholder Need, to Requirement, to Acceptance Criteria, to Engineering Decision, to Implementation, to Test Evidence, to Defect Link, to Final Outcome.*
>
> To demonstrate our deep trace:
> - Take **`FR-001`**: The community requester needed digital fault reporting without paperwork. This mapped to `AC-001.1` and `AC-001.2`. In architecture, it is governed by `ADR-005` Factory Method. In code, it is implemented in `CreateServiceRequest.ts` and `CategoryFactories.ts`. In testing, it is verified by `TC-UNIT-FAC-01` and API integration tests in CI Gate 3. When an invariant bypass was discovered, it was logged as `DEF-001`, resolved, and verified. Final outcome: **MET**.
>
> - Similarly, **`FR-009`** concurrency traces through `ADR-006`, integer version OCC checking in `ServiceRequest.ts`, and our automated race condition tests, resolving `DEF-003`. Final outcome: **MET**."*

---

### Slide 13: Stage 4 (Cont.): Automated Quality Gates & Verification Evidence (17:15 – 18:45)
* **Slide Visual:** Slide 13 showing test metrics: 42/42 tests passed, 93.60% coverage, 0 CVEs, $p95 = 142\text{ms}$, and CI Gates 1–4.
* **Live Action Cue:** Alt-Tab to Terminal: run `npm test` in `code/`; show all 42 tests passing in 11 seconds.

#### Spoken Script:
> *"Continuing Stage 4 on Slide 13: Our automated verification evidence.
>
> We do not rely on subjective claims of quality. Our GitHub Actions pipeline enforces four automated quality gates on every commit:
> - Gate 1 validates clean TypeScript compilation with zero errors.
> - Gate 2 validates dependencies with `npm audit`, reporting zero high or critical CVEs.
> - Gate 3 executes our 42 automated tests across 12 files in under 12 seconds, achieving 93.60% statement coverage, 85.20% branch coverage, and 92.50% function coverage.
> - Gate 4 verifies our Docker container build and healthcheck probes.
>
> [ALT-TAB TO TERMINAL NOW]
> As you can see running live in my terminal: all 12 test files and 42 test cases pass cleanly in 11 seconds. Furthermore, our load benchmark under 50 concurrent requests achieved a p95 latency of 142 milliseconds—well within our 500 millisecond `NFR-001` threshold with zero failed requests."*

---

### Slide 14: Stage 5: Final Deployment Baseline & Defended Staging No-Go Decision (18:45 – 20:15)
* **Slide Visual:** Slide 14 detailing the official release declaration: Simulated Production Release with a defended Staging No-Go decision for cloud production.

#### Spoken Script:
> *"Moving to Stage 5: Final Deployment and Go-Live Decision.
>
> Brief Section 11 explicitly instructs teams to declare and defend their release state: production, simulated production, or staging under a justified no-go decision. It notes that teams must not lose marks for refusing to race into production to meet a deadline.
>
> Our declared final state is **SIMULATED PRODUCTION RELEASE** with a defended **NO-GO DECISION for public cloud production**.
>
> This decision is grounded in three engineering realities:
> 1. **Concurrency Soak:** We benchmarked 50 users at 142ms, but true municipal scale with thousands of concurrent citizens requires multi-region clustering not verifiable under academic zero-cost constraints.
> 2. **Gateway Decoupling:** We decoupled external telecom providers via Observer and Outbox patterns to protect against billing spikes and network flakiness.
> 3. **Solo Maintenance:** With single-engineer continuity under `ADR-012`, releasing to live public users without a 24/7 on-call rotation represents an irresponsible operational risk.
>
> Remaining in verified Simulated Production while defending a Staging No-Go protects stakeholder value."*

---

### Slide 15: Stage 5 (Cont.): Decision Consequence Reflection & Lessons Learned (20:15 – 21:45)
* **Slide Visual:** Slide 15 displaying the ADR reflection table evaluating `ADR-004`, `ADR-005`, `ADR-006`, `ADR-008`, `ADR-010`, and `ADR-012`.

#### Spoken Script:
> *"Continuing Stage 5 on Slide 15: Decision Consequence Reflection.
>
> Section 22 of the Master Brief asks us to reflect on our earlier architectural decisions using authentic evidence rather than hindsight alone.
>
> Selecting a **TypeScript Clean Monolith under `ADR-008`** was our most vital decision: its shared language and low memory footprint allowed a single engineer to absorb the entire project after team attrition.
>
> Adopting the **Factory Method Pattern under `ADR-005`** made resolving Defect 001 straightforward because category validation was isolated from our core intake pipeline.
>
> Implementing **Optimistic Concurrency Control under `ADR-006`** successfully eliminated race conditions during concurrent work order assignments.
>
> And ratifying **`ADR-012`** preserved our SCM governance, allowing us to complete the capstone on time with full NQF Level 8 audit compliance."*

---

### Slide 16: Stage 5 (Cont.): Final Project Conclusion & Executive Sign-Off (21:45 – 23:00)
* **Slide Visual:** Slide 16 displaying Problem & Value Delivery, Engineering Discipline (98.2% scope, 0 defects, 93.60% coverage), Future Handover Path, and Capstone Conclusion.
* **Live Action Cue:** [ON-CAMERA] Face examiner directly. Deliver the final professional closing statement for the recorded demonstration video. State completion of Milestone 4.

#### Spoken Script:
> *"To conclude our final project demonstration on Slide 16:
>
> Milestone 4 brings the CivicConnect engineering journey to a formal, successful close.
>
> Despite the severe operational shock of total team attrition, we maintained absolute software engineering discipline:
> - We delivered **98.2% of our approved scope commitments**, with 100% of our non-functional requirements verified.
> - We achieved **93.60% automated test coverage** across 42 tests running green in our CI pipeline.
> - We resolved all four logged defects, permanently guarding them against regression.
> - And we preserved unbroken traceability from original stakeholder need to final operational outcome.
>
> Our Clean Layered Architecture and decoupled interfaces ensure that any future team can easily take this platform forward into municipal production.
>
> CivicConnect demonstrates that real software engineering is not the hasty writing of code, but the disciplined management of architecture, trade-offs, and quality under real-world constraints.
>
> Thank you, Assessor. This concludes the Milestone 4 final capstone video demonstration for CivicConnect."*
