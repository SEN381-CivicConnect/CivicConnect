# CivicConnect: Milestone 1 Individual Defence Preparation & Question Guide
## Group E — Software Engineering 381 (SEN381) — NQF Level 8

**Module:** Software Engineering 381 (SEN381) — NQF Level 8  
**Governing Standard:** SEN381 Master Project Brief Section 19.3 & Milestone 1 Brief Section 8  
**Assessed Component:** Individual Engineering Defence & SE Understanding (15 Raw Marks)  
**Registered Team:**
- **Lisa Verson (602006):** Lead Requirements Analyst (Option 1)
- **Pandora Greyling (602369):** Quality & Risk Manager (Option 2)
- **Chris Fourie (602826):** Systems Architect & Governance Lead (Option 3)

---

## 1. Individual Defence Strategy & Assessment Principles

In accordance with **SEN381 NQF Level 8 standards**, the individual engineering defence assesses whether each student possesses a genuine command of software engineering principles, authentic ownership over project artefacts, and the ability to articulate trade-offs, constraints, and downstream consequences under oral cross-examination.

### The 5-Step Defence Response Pattern
When an assessor asks a question, follow the standard SEN381 response model:

$$\text{Direct Principle/Answer} \longrightarrow \text{Cite Specific Project Section/Page} \longrightarrow \text{Explain SE Trade-off / Risk} \longrightarrow \text{Connect Downstream Consequence} \longrightarrow \text{State Concrete Mitigation}$$

---

## 2. Comprehensive Model Answers for the 12 Indicative Defence Questions

---

### Question 1: Which stakeholder expectation was hardest to reconcile, and how did it affect scope or requirements?
* **Primary Respondent:** Lisa Verson (Lead Requirements Analyst)
* **Core Answer:** "The hardest conflict was reconciling the **Community Requesters' demand for frictionless, anonymous request submission** against the **Compliance and Operational Staff requirement for verified citizen contact details and attribution** to prevent malicious spam and comply with South African POPIA regulations."
* **Artefact & Document Citation:** PED v1.0 Section 2.4.1 (Conflict Surface A, PDF p. 10).
* **Engineering Trade-off:** "Allowing completely anonymous public submissions invites automated spam and untraceable vandalism reports, overwhelming field staff. Conversely, requiring mandatory public disclosure of personal identities creates a chilling effect on citizens reporting sensitive security or harassment hazards."
* **Downstream Consequence & Resolution:** "We resolved this in `FR-001` and `NFR-004` through data minimization: authenticating user identity at submission, but implementing strict Role-Based Access Control and partitioned audit tables so field technicians see only fault locations and descriptions, while citizen PII is cryptographically masked and isolated."

---

### Question 2: If the client adds a major feature after baseline without changing the deadline, what must the team analyse?
* **Primary Respondent:** Lisa Verson (Lead Requirements Analyst) or Chris Fourie (Governance Lead)
* **Core Answer:** "The team will not informally absorb the feature. We must perform a formal **Change Impact Analysis** using the protocol in Master Project Brief Appendix E, as mandated by our approved ADR-001."
* **Artefact & Document Citation:** PED v1.0 Section 3.5 (PDF p. 12) and Section 9.2.1 (ADR-001, PDF p. 23).
* **Systemic Analysis Dimensions:**
  1. **Scope Interaction:** Which baselined functional requirements (`FR-001` to `FR-014`) does this feature modify or contradict?
  2. **Schedule & Capacity:** Given our fixed team size of 3 students and fixed academic milestones, what existing feature (MoSCoW 'Should' or 'Could') must be descheduled or deferred?
  3. **Quality & Testability:** Will this change compress our testing window and violate our $\ge 80\%$ automated test coverage gate (`NFR-008`)?
  4. **Security & POPIA:** Does the change introduce unauthenticated endpoints or unencrypted PII exposure?
  5. **Cost Sustainability:** Does it breach our \$0.00/month free-tier cloud quota (`NFR-010`)?
* **Outcome:** "We present the formal impact assessment to the client/lecturer with an evidence-backed recommendation: Accept, Defer to post-release roadmap, or Reject."

---

### Question 3: Show one NFR and explain how it could constrain an M2 architecture or technology choice.
* **Primary Respondent:** Pandora Greyling (Quality & Risk Manager)
* **Core Answer:** "Consider **`NFR-004` (Security & Role-Based Access Control)**, which mandates strict authorization boundaries between Requesters, Field Staff, Supervisors, and Administrators."
* **Artefact & Document Citation:** PED v1.0 Section 4.4.4 (PDF p. 15) and Section 8.2.1 (FEC-001, PDF p. 19).
* **Architectural Constraint on Milestone 2:**
  - "This NFR directly constrains our Milestone 2 software architecture by ruling out single-tier, flat CRUD architectures. It forces us to adopt a layered/clean architecture with dedicated **Authorization Middleware / Route Guards** at the API gateway level and **Row-Level Security / Claims-Based Filtering** at the data access layer."
  - "Furthermore, when evaluating candidate technology stacks in Milestone 2, `NFR-004` favors frameworks with mature, enterprise-grade identity and RBAC libraries over lightweight micro-frameworks requiring custom, roll-your-own security mechanisms."

---

### Question 4: Trace one requirement from source to acceptance criteria. What evidence will be added later?
* **Primary Respondent:** Lisa Verson (Lead Requirements Analyst)
* **Core Answer:** "Let us trace **`FR-010` (Service Request Status Updates via State Machine)** through our Requirements Traceability Matrix."
* **Artefact & Document Citation:** PED v1.0 Section 6.3 (RTM Table, PDF p. 17), Section 4.3 (FSM, p. 15), and Section 6.4 (Deep Trace, p. 18).
* **Traceability Chain:**
  1. **Stakeholder Source:** Operational Staff and Supervisors needing clear workflow coordination.
  2. **Requirement Definition (`FR-010`):** The system must update ticket status through controlled transitions (`New` $\rightarrow$ `Assigned` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved` $\rightarrow$ `Closed`).
  3. **Acceptance Criteria (`AC-010`):** Formulated in Gherkin BDD syntax (`Given a ticket in SUBMITTED state... When an actor attempts to jump directly to RESOLVED... Then the server rejects the transition with HTTP 400 Bad Request`).
* **Downstream Lifecycle Evidence to be Added:**
  - **In Milestone 2:** Architectural component mapping (`StateTransitionEngine`, `ServiceRequestController`, `AuditInterceptor`).
  - **In Milestone 3:** GitHub Pull Request ID, source code commit SHA, and automated CI test execution report (`fsm_transition_test.ts` passing in CI).
  - **In Milestone 4:** Staging and production runtime verification logs demonstrating zero invalid transitions.

---

### Question 5: Which risk deserves the most attention now, and why?
* **Primary Respondent:** Pandora Greyling (Quality & Risk Manager)
* **Core Answer:** "**`RSK-001` (Scope Creep via Late, Uncontrolled Feature Ingestion)** deserves the most urgent attention in Milestone 1."
* **Artefact & Document Citation:** PED v1.0 Section 7.2 (Risk Register, PDF p. 18) and Section 7.3 (Risk Defence, p. 18).
* **Engineering Justification:**
  - "In accordance with Barry Boehm's software economics research, discovering or modifying a requirement late in construction costs 50 to 100 times more than resolving it during the initial baseline phase."
  - "Because our team size (3 students) and academic milestones are strictly fixed, absorbing unbudgeted features directly cannibalizes the time required for automated unit testing (`NFR-008`) and POPIA security hardening (`NFR-005`), causing systemic project failure."
* **Active Control:** "We froze our 14 FR baseline in Section 3 and enacted ADR-001 to mandate formal impact analysis before any scope modification is approved."

---

### Question 6: Why are deployment, automated testing or operations relevant in M1 when they are implemented later?
* **Primary Respondent:** Chris Fourie (Systems Architect) or Pandora Greyling (Quality Lead)
* **Core Answer:** "Because **implementation-time is far too late to design for testability, deployability, and operability**. Quality attributes and operational realities must be engineered into requirements and domain abstractions from day one."
* **Artefact & Document Citation:** PED v1.0 Section 8.1 & 8.2 (Forward Engineering Register, PDF pp. 18–21) and Section 10 (Deployment Concept, pp. 25–28).
* **Downstream Consequence if Ignored:**
  - "If we do not design for automated testability now (`FEC-002`), our Milestone 2 software architecture might introduce tightly coupled database calls that cannot be mocked, making our $\ge 80\%$ test coverage quality gate (`NFR-008`) mathematically impossible to achieve in Milestone 3."
  - "If we do not anticipate cloud free-tier hosting limits (`FEC-006`, `NFR-010`) and environment parity (`FEC-004`) now, our platform will crash or face cold-start timeouts during the live oral defence demonstration due to 512MB RAM exhaustion or missing configuration keys."

---

### Question 7: Which decision did your team intentionally not make, and what evidence is still needed?
* **Primary Respondent:** Chris Fourie (Systems Architect & Governance Lead)
* **Core Answer:** "Our team intentionally deferred the **final technology stack selection (programming language, web framework, database engine)** and detailed software architecture to Milestone 2."
* **Artefact & Document Citation:** PED v1.0 Section 9.1 & Section 9.2.3 (ADR-003, PDF pp. 22–24) and Section 8.1 (p. 18).
* **Engineering Rationale:**
  - "In strict compliance with Milestone 1 Brief Section 5, committing to frameworks during Milestone 1 is an engineering anti-pattern driven by personal developer familiarity rather than verified requirements."
* **Evidence Required Before Deciding in Milestone 2:**
  1. An objective **Weighted Decision Matrix** evaluating candidate stacks against our baselined NFRs (API latency $\le 500\text{ms}$, 512MB RAM consumption, free-tier cloud compatibility).
  2. Empirical proof-of-concept spikes evaluating team learning curves against our 3-student capacity constraint.
  3. Verification of Docker Compose containerization and CI test runner support.

---

### Question 8: Why must a substantive change entering main receive two approvals from team members other than the author?
* **Primary Respondent:** Chris Fourie (Systems Architect & Governance Lead)
* **Core Answer:** "To enforce **collective codebase ownership**, eliminate single points of human failure, prevent rubber-stamping, and ensure compliance with Master Project Brief Section 9."
* **Artefact & Document Citation:** PED v1.0 Section 9.2.2 (ADR-002, PDF pp. 23–24) and Section 13 Appendix D (p. 31).
* **Engineering Purpose:**
  - "In a 3-person team, requiring two non-author reviews guarantees that 100% of the team inspects and verifies every line of code or documentation entering the controlled baseline."
  - "This guarantees that no team member is blind to any architectural component, which is vital because the individual oral defence examines each student on any project artefact, regardless of who originally authored it."
  - "It enforces our Definition of Done: verifying requirement alignment, absence of plaintext credentials, passing CI tests, and updated traceability links before merge."

---

### Question 9: Show one AI-assisted contribution. What did you verify, reject or change?
* **Primary Respondent:** Chris Fourie (Governance Lead)
* **Core Answer:** "In our Responsible AI Usage Register, consider our engineering audit of Gemini 3.1 Pro on 2026-09-02 regarding Forward Engineering infrastructure."
* **Artefact & Document Citation:** PED v1.0 Section 13 Appendix E (PDF pp. 32–33, Case 1).
* **Human Verification & Rectification:**
  - **AI Generation:** When prompted for forward engineering candidate concerns, the AI proposed implementing a distributed Kubernetes cluster with multi-region ingress controllers and Redis cache replication.
  - **Human Critique & Rejection:** "During our human-in-the-loop domain audit, we completely rejected this recommendation. Introducing Kubernetes directly violates our binding \$0.00/month free-tier budget constraint (`NFR-010`) and introduces operational complexity that exceeds our 3-person capacity."
  - **Correction:** "We replaced it with a lightweight Docker Compose local parity model that satisfies Twelve-Factor App principles at zero financial cost."

---

### Question 10: A baselined requirement changes tomorrow. Which artefacts and constraints must be revisited?
* **Primary Respondent:** Lisa Verson (Requirements Lead) or Chris Fourie (Governance Lead)
* **Core Answer:** "If a baselined requirement changes, we follow our formal Change Management Protocol (`ADR-001`) and systematically update the following interconnected artefacts:"
* **Artefact & Document Citation:** PED v1.0 Section 3.5 (PDF p. 12), Section 5.3 (Ripple Effects, pp. 15–16), and Master Project Brief Section 14.
* **Systemic Audit Checklist:**
  1. **Scope Baseline Statement:** Update the boundary definition and register the change justification.
  2. **Requirements Traceability Matrix (RTM):** Modify requirement text, adjust MoSCoW priority, and rewrite Gherkin acceptance criteria.
  3. **Project Risk Register:** Re-score schedule risk (`RSK-002`) and team capacity risk.
  4. **Engineering Decision Log & ADRs:** Author a new ADR documenting the change rationale, alternatives, and trade-offs.
  5. **Constraint Verification:** Verify that the change does not breach our fixed academic deadline or \$0.00 cloud hosting limit (`NFR-010`).
  6. **Downstream Artefacts (M2/M3):** Update software component contracts, database schemas, and automated regression test suites.

---

### Question 11: How will you later know CivicConnect succeeded beyond "the code works"?
* **Primary Respondent:** Pandora Greyling (Quality Lead)
* **Core Answer:** "Success is evaluated against **stakeholder value, baselined scope delivery, empirical quality attribute metrics, and operational readiness**, not merely whether the application compiles or renders a user interface."
* **Artefact & Document Citation:** PED v1.0 Section 1.4 (PDF pp. 7–8), Section 4.4 (NFRs, p. 15), and Section 11 (Baseline Sign-Off, pp. 28–29).
* **Measurable Success Dimensions:**
  1. **Traceable Scope Delivery:** 100% of the 14 committed functional requirements delivered with verified Gherkin test evidence in the RTM.
  2. **Empirical Quality Compliance:** Automated verification proving API response latency is $\le 500\text{ms}$ under load (`NFR-001`), accessibility passes WCAG 2.1 AA (`NFR-003`), and automated branch test coverage exceeds 80% (`NFR-008`).
  3. **Operational Integrity:** Zero plaintext credentials leaked, complete POPIA compliance with immutable audit logging (`NFR-006`), and automated health probes passing in cloud staging.
  4. **Engineering Governance:** A clean, progressive Git commit history demonstrating two-reviewer PR approvals and full AI usage accountability.

---

### Question 12: Give one early shortcut that could create technical debt later.
* **Primary Respondent:** Chris Fourie (Systems Architect)
* **Core Answer:** "An early shortcut would be **hardcoding status transitions directly in frontend UI components instead of implementing a centralized, server-side Finite State Machine (FSM) backed by database constraints**."
* **Artefact & Document Citation:** PED v1.0 Section 4.3 (FSM, PDF p. 15), Section 8.2.3 (FEC-003, p. 20), and Section 10.4 (Structured Telemetry, p. 28).
* **Downstream Technical Debt Compounding:**
  - "While frontend-only validation allows rapid initial UI prototyping in Milestone 2, it creates catastrophic technical debt in Milestone 3. Any direct API call, mobile client, or concurrent browser session could bypass the UI logic, creating orphaned or corrupted tickets in the database (e.g. transitioning directly from `SUBMITTED` to `RESOLVED` without an assigned technician)."
  - "Remediating this defect in Milestone 3 would require rewriting backend API controllers, altering relational database schemas, refactoring test suites, and running complex data cleanup migrations under intense schedule pressure."
  - "By formally specifying a deterministic backend state machine in Milestone 1, we eliminate technical debt and ensure absolute lifecycle auditability."
