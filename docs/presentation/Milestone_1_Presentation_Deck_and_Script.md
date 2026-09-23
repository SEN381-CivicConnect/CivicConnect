# CivicConnect: Milestone 1 Presentation Talking Points & Cue Cards
## Group E — Milestone 1 (M1): Engineering Foundation & Requirements Baseline

**Project:** CivicConnect (Community Service Request Management Platform)  
**Academic Year:** 2026 | **Module:** Software Engineering 381 (SEN381) — NQF Level 8  
**Governing Standard:** SEN381 Master Project Brief Section 19 & Milestone 1 Brief Section 7  
**Target Duration:** 12:00 – 15:00 Minutes Total (Paced for 13:30 min)  
**Document Baseline Reference:** `SEN381_Milestone1_GroupE.pdf` (PED v1.0, 33 Pages)  

---

## Speaker Roster & Target Time Allocations

| Slide | Topic & Core Content | Speaker | Time Window | PDF Reference |
| :---: | :--- | :--- | :---: | :--- |
| **1** | Title, Team Roster, NQF 8 Principles & Gate Purpose | **Lisa Verson** (Option 1) | 0:00 – 1:15 | Document Control (pp. 3–5) |
| **2** | Operational Problem Breakdown, 8 Failure Modes & 5-Whys | **Lisa Verson** (Option 1) | 1:15 – 2:30 | Section 1 (pp. 5–7) |
| **3** | Stakeholder Profiles, RACI Matrix & Conflict Surfaces A–C | **Lisa Verson** (Option 1) | 2:30 – 3:45 | Section 2 (pp. 8–10) |
| **4** | Scope Baseline, 3 Pillars, Exclusions & Appendix E Change Rules | **Lisa Verson** (Option 1) | 3:45 – 5:00 | Section 3 (pp. 11–12) |
| **5** | 14 Functional Requirements, 6-State FSM & 10 Measurable NFRs | **Pandora Greyling** (Option 2) | 5:00 – 6:20 | Section 4 (pp. 13–15) |
| **6** | Systemic Constraints (6 PMBOK Pillars) & Trade-Off Ripple Effects | **Pandora Greyling** (Option 2) | 6:20 – 7:40 | Section 5 (pp. 15–16) |
| **7** | Project Risk Register, Formula & Highest Exposure Risk (RSK-001) | **Pandora Greyling** (Option 2) | 7:40 – 9:00 | Section 7 (p. 18) |
| **8** | Forward Engineering Considerations Register (6 Strategic Concerns) | **Chris Fourie** (Option 3) | 9:00 – 10:30 | Section 8 (pp. 18–22) |
| **9** | Engineering Decision Log, ADR-001 to ADR-003 & RTM Traceability | **Chris Fourie** (Option 3) | 10:30 – 12:00 | Section 9 (pp. 22–24) & Section 6 (pp. 16–18) |
| **10** | 4-Tier Environments, Local Parity, GitHub Rules & AI Governance | **Chris Fourie** (Option 3) | 12:00 – 13:30 | Section 10 (pp. 25–28) & Appendices D/E (pp. 31–33) |
| **11** | Baseline Sign-Off Gate (Appendix D, ACCEPTED) & Defence Handoff | **Chris Fourie** (Option 3) | 13:30 – 14:15 | Section 11 (pp. 28–29) |

---

## Slide-by-Slide Talking Points & Visual Layouts

---

### Slide 1: Executive Title, Team Roster & Milestone Gate
* **Speaker:** Lisa Verson (Lead Requirements Analyst)
* **Target Time:** 1:15 min (0:00 – 1:15)
* **Visuals on Slide:**
  * Project Title: **CivicConnect: Community Service Request Management Platform**
  * Sub-header: *Milestone 1 — Engineering Foundation & Requirements Baseline (PED v1.0)*
  * Team Roster Table: Lisa Verson (`602006`), Pandora Greyling (`602369`), Chris Fourie (`602826`).
  * NQF Level 8 Banner: *"Apply, do not repeat — establishing an auditable baseline before construction."*
  * Milestone Driving Question: *"What are we committing to engineer, for whom, within which constraints, and what must be anticipated to preserve downstream options?"*
* **Key Talking Points:**
  * **Welcome & Introduction:** Introduce Group E and the project: CivicConnect (Community Service Request Management Platform).
  * **NQF Level 8 Principle:** Emphasize that Milestone 1 is about establishing an auditable, defensible engineering baseline, not premature programming or framework lock-in.
  * **Team Role Division:**
    * Lisa Verson: Lead Requirements Analyst (Option 1).
    * Pandora Greyling: Quality and Risk Manager (Option 2).
    * Chris Fourie: Systems Architect and Governance Lead (Option 3).
  * **Milestone Purpose:** Defend what the team is committing to engineer, the real-world operational need, verified constraints, and governance mechanisms that protect downstream milestones.
* **Transition:** *"Let us examine the operational failure modes of the current manual workflow."*

---

### Slide 2: Operational Problem Decomposition & 5-Whys Root Cause
* **Speaker:** Lisa Verson (Lead Requirements Analyst)
* **Target Time:** 1:15 min (1:15 – 2:30)
* **Visuals on Slide:**
  * Contrast diagram: *Current Fragmented Reality* (WhatsApp, spreadsheets, paper notes, phone calls) vs. *CivicConnect* (Single authoritative transactional ledger).
  * Summary table of the 8 Operational Breakdown Modes.
  * 5-Whys Root Cause callout box.
* **Key Talking Points:**
  * **Current Informal Channels:** Community requests currently handled across an uncoordinated mix of WhatsApp messages, personal spreadsheets, paper records, and phone calls.
  * **Decomposition of 8 Breakdown Modes:**
    * Lost / duplicated tickets due to independent channels.
    * Requesters have zero visibility into status, causing repeated follow-up calls.
    * Operational staff lack a shared queue, clear ownership, and prioritization.
    * Status changes lack accountability and attributable audit logs.
    * Management reports are compiled manually from fragmented, error-prone data.
    * Unencrypted citizen data in WhatsApp chats creates severe statutory POPIA non-compliance risks.
  * **5-Whys Root Cause Finding:** The root cause is not staff negligence—it is the complete absence of a single, authoritative digital record with an enforced lifecycle.
  * **CivicConnect Value Proposition:** Establishing one persistent, auditable digital record for every request from submission to closure.
* **Transition:** *"To fix these operational breakdowns, we systematically mapped our stakeholder ecosystem."*

---

### Slide 3: Stakeholder Analysis, RACI Matrix & Conflict Surfaces
* **Speaker:** Lisa Verson (Lead Requirements Analyst)
* **Target Time:** 1:15 min (2:30 – 3:45)
* **Visuals on Slide:**
  * 6 Multi-Dimensional Stakeholder Profiles (Requesters, Supervisors, Staff, Admins, Management, Auditors).
  * RACI Matrix mapping key activities (Submit, Categorize, Assign, Update Status, Reports, Access Control).
  * 3 Inherent Conflict Surfaces callout box.
* **Key Talking Points:**
  * **Stakeholder Grounding:** Requirements originate from 6 verified stakeholder groups across citizens, field staff, supervisors, management, and compliance auditors.
  * **RACI Governance:** Unambiguous accountability established for every action across the request lifecycle.
  * **Defending Inherent Conflict Surfaces:**
    * *Conflict Surface A (Anonymity vs. POPIA Accountability):* Requesters want frictionless anonymous reporting; legal compliance requires attributable audit trails. **Resolution:** Authenticate user identity at submission, but enforce data minimization and role-restricted views so field staff only see fault details, not citizen PII.
    * *Conflict Surface B (Staff Visibility vs. Requester Privacy):* Field technicians need fault details, but broad visibility exposes sensitive citizen data. **Resolution:** Enforce category-based RBAC queues.
    * *Conflict Surface C (Management Oversight vs. Staff Autonomy):* Management needs performance metrics without micro-surveillance. **Resolution:** Reporting aggregated by category and team turnaround, not invasive real-time tracking.
* **Transition:** *"These stakeholder resolutions directly defined our committed scope baseline."*

---

### Slide 4: Controlled Scope Baseline & Boundary Exclusions
* **Speaker:** Lisa Verson (Lead Requirements Analyst)
* **Target Time:** 1:15 min (3:45 – 5:00)
* **Visuals on Slide:**
  * 3-Tier Scope Box:
    * *In-Scope (14 FRs):* Requester Pillar, Staff Pillar, Management Pillar.
    * *Deliberately Deferred Scope:* WhatsApp webhooks, Automated escalation engine.
    * *Explicitly Out-of-Scope Exclusions:* Commercial utility billing/payments, Real-time live chat messaging, Multi-tenant SaaS partitioning.
  * Appendix E Change Management Callout Banner.
* **Key Talking Points:**
  * **14 Committed Functional Requirements:** Structured across 3 pillars:
    * Requester Pillar (`FR-001`–`005`): Submission, controlled categories, status tracking, feedback.
    * Staff Pillar (`FR-006`–`011`): Queue search/filter, ownership assignment, 6-state status transitions, work notes.
    * Management Pillar (`FR-012`–`014`): Ticket closure, operational dashboard, role-based access control.
  * **Deliberately Deferred Scope:** WhatsApp webhooks and automated escalation engines deferred to protect team capacity and testing windows.
  * **Explicit Out-of-Scope Exclusions:** Commercial utility billing, real-time live chat messaging, and multi-tenant SaaS architecture excluded to avoid unnecessary compliance and infrastructure costs.
  * **Scope Protection (ADR-001):** Zero informal scope additions; any post-baseline feature request requires a formal Master Project Brief Appendix E Impact Analysis.
* **Verbal Handoff:** *"I will now hand over to Pandora Greyling to present our Baselined Requirements, Constraints, and Risk Register."*

---

### Slide 5: Baselined Requirements (14 FRs & 10 Measurable NFRs)
* **Speaker:** Pandora Greyling (Quality & Risk Manager)
* **Target Time:** 1:20 min (5:00 – 6:20)
* **Visuals on Slide:**
  * 14 FR summary table prioritized by MoSCoW (12 Must, 2 Should).
  * 6-State Finite State Machine (FSM) Lifecycle Diagram: `New` $\rightarrow$ `Assigned` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved` $\rightarrow$ `Closed`.
  * 10 Measurable NFRs Table (ISO/IEC 25010 Product Quality Model).
* **Key Talking Points:**
  * **Prioritized FR Baseline:** 14 functional requirements baselined with MoSCoW priorities and verifiable Gherkin acceptance criteria in our live RTM.
  * **Finite State Machine Lifecycle:** 6 strictly controlled states. Domain logic actively blocks illegal status transitions (e.g. jumping directly from `New` to `Resolved` without technician assignment).
  * **Measurable Quality Model (ISO/IEC 25010):** NFRs are treated as primary architectural drivers with quantitative metrics:
    * *Performance (`NFR-001` / `NFR-007`):* API latency $\le 500\text{ms}$; fast page load.
    * *Availability (`NFR-002`):* $\ge 99.0\%$ uptime on free-tier cloud infrastructure.
    * *Usability & Accessibility (`NFR-003`):* Full WCAG 2.1 Level AA compliance; core workflows completed in 3–4 clicks.
    * *Security & Privacy (`NFR-004` / `NFR-005`):* Enforced RBAC, SQL injection protection, and POPIA-compliant personal data handling.
    * *Maintainability & Quality Gate (`NFR-008`):* Mandatory $\ge 80\%$ automated branch test coverage gate in CI.
    * *Cost Sustainability (`NFR-010`):* Strictly \$0.00/month operational cloud expenditure.
* **Transition:** *"These quality attributes operate directly within our project constraints."*

---

### Slide 6: Systemic Constraints & Trade-Off Ripple Effects
* **Speaker:** Pandora Greyling (Quality & Risk Manager)
* **Target Time:** 1:20 min (6:20 – 7:40)
* **Visuals on Slide:**
  * The 6 PMBOK Constraint Pillars diagram.
  * Constraint Priority Matrix (Constrain vs. Optimize vs. Accept).
  * Multi-Constraint Ripple Effect diagram.
* **Key Talking Points:**
  * **The 6 PMBOK Pillars:**
    * *Team:* Exactly 3 students (Fixed capacity; zero additions/losses).
    * *Schedule:* Fixed academic calendar across 4 milestones (Immutable deadlines).
    * *Cost:* Zero budget (\$0.00/month free-tier cloud hosting).
    * *Quality:* $\ge 80\%$ automated branch test coverage gate.
    * *Security:* Statutory POPIA Act 4 of 2013 legal liability.
    * *Technology:* Belgium Campus laboratory evaluation environment compatibility.
  * **Constraint Priority:** Scope and Quality are actively constrained; Schedule is locked; Cost is capped at zero.
  * **Dynamic Ripple Effects:**
    * *Scope vs. Schedule & Testing:* Uncontrolled feature additions compress the testing window, directly threatening our 80% coverage gate (`NFR-008`).
    * *Auditing vs. Free-Tier Performance:* Granular POPIA audit logging must not exceed cloud database write quotas (`NFR-010`).
* **Transition:** *"Understanding these constraint ripple effects is central to our Risk Register."*

---

### Slide 7: Project Risk Register & Highest Exposure Critical Risk (RSK-001)
* **Speaker:** Pandora Greyling (Quality & Risk Manager)
* **Target Time:** 1:20 min (7:40 – 9:00)
* **Visuals on Slide:**
  * Quantitative Risk Exposure Formula: $\text{Risk Exposure} = \text{Probability} \times \text{Impact}$.
  * Risk Register summary table highlighting `RSK-001` and `RSK-002`.
  * Barry Boehm's Cost of Change curve callout box.
* **Key Talking Points:**
  * **Quantitative Risk Methodology:** Every risk scored on a $5 \times 5$ scale ($\text{Exposure} = P \times I$) with concrete mitigations and contingencies.
  * **Highest-Priority Critical Risk (`RSK-001` — Scope Creep):**
    * Probability: High | Impact: High | Exposure: Critical.
    * Cause: Uncontrolled, late feature requests from informal feedback.
  * **Engineering Justification (Boehm's Cost of Change):**
    * Resolving an ambiguity or scoping defect in Milestone 1 costs 50 to 100 times less than fixing it after database construction and UI coding.
    * Unmanaged scope directly cannibalizes time needed for automated testing (`NFR-008`) and POPIA compliance (`NFR-005`).
  * **Active Controls:** Locked 14 FR baseline; enacted ADR-001 requiring Appendix E Change Impact Analysis before any scope change is permitted.
  * **Secondary Risk (`RSK-002` — Schedule Shortening):** Controlled via MoSCoW prioritization and strict milestone pacing.
* **Verbal Handoff:** *"I will now hand over to Chris Fourie to present our Forward Engineering, Architecture Decisions, Environments, and Sign-Off."*

---

### Slide 8: Forward Engineering Considerations Register (6 Strategic Concerns)
* **Speaker:** Chris Fourie (Systems Architect & Governance Lead)
* **Target Time:** 1:30 min (9:00 – 10:30)
* **Visuals on Slide:**
  * Horizon Map detailing the 6 Strategic Lifecycle Concerns (`FEC-001` to `FEC-006`).
  * Milestone 1 Boundary Banner: *"Thinking ahead to preserve architectural options vs. premature design lock-in."*
* **Key Talking Points:**
  * **Thinking Ahead vs. Premature Implementation:** In strict compliance with Milestone 1 Brief Section 5, M1 excludes coding and technology lock-in. However, professional engineering requires anticipating downstream risks so early decisions preserve future options.
  * **6 Strategic Lifecycle Concerns:**
    * `FEC-001` *(Security & RBAC):* POPIA data isolation, partitioned citizen PII, role authorization middleware.
    * `FEC-002` *(Automated Testability):* Structuring acceptance criteria now so M2 architecture uses mockable dependency injection and repository patterns for CI tests in M3.
    * `FEC-003` *(Relational Persistence):* 6-state FSM and immutable audit tables to ensure ticket history is never overwritten.
    * `FEC-004` *(Environment Parity):* Local Docker Compose mirroring cloud staging, eliminating "works on my machine" failures.
    * `FEC-005` *(Observability & Health Probes):* Structured JSON error logging and `/health` probe endpoints.
    * `FEC-006` *(Cost Sustainability):* 512MB RAM caps and cold-start latency on cloud free tiers.
  * **Deferment Defence:** Preserving viable design options today; evaluating candidate solutions empirically in Milestone 2.
* **Transition:** *"These forward concerns directly informed our formal Architecture Decision Records."*

---

### Slide 9: Engineering Decision Log, ADRs & RTM Traceability
* **Speaker:** Chris Fourie (Systems Architect & Governance Lead)
* **Target Time:** 1:30 min (10:30 – 12:00)
* **Visuals on Slide:**
  * Master Engineering Decision Table summarizing Context, Alternatives, and Consequences.
  * Three Baselined Architecture Decision Records (`ADR-001`, `ADR-002`, `ADR-003`).
  * Live Requirements Traceability Matrix (RTM v1.0) flow diagram.
* **Key Talking Points:**
  * **Decision Governance via Formal ADRs:** Every major decision is captured with context, rejected alternatives, chosen path, and downstream consequences.
  * **The 3 Milestone 1 ADRs:**
    * **ADR-001 (Scope Baseline):** Formal freeze of 14 FRs; mandates Appendix E Change Impact Analysis to eliminate ad-hoc developer scope creep.
    * **ADR-002 (GitHub Governance):** Protected `main` branch requiring mandatory TWO independent peer reviews on every PR—eliminates rubber-stamping and enforces 100% collective codebase ownership.
    * **ADR-003 (Justified Tech Stack Deferment):** Committing to frameworks in M1 before analyzing NFRs is premature design lock-in; stack selection is formally deferred to M2 to be evaluated via an objective weighted decision matrix.
  * **Requirements Traceability Matrix (RTM v1.0):** An unbroken traceability chain from citizen need -> requirement -> acceptance criteria, with placeholders established for M2 design components and M3 automated tests.
* **Transition:** *"Our engineering discipline extends directly into our deployment and repository environments."*

---

### Slide 10: 4-Tier Environments, Local Parity, GitHub & AI Governance
* **Speaker:** Chris Fourie (Systems Architect & Governance Lead)
* **Target Time:** 1:30 min (12:00 – 13:30)
* **Visuals on Slide:**
  * 4-Tier Environment Separation diagram: *Local Dev* $\rightarrow$ *Automated CI* $\rightarrow$ *Cloud Staging* $\rightarrow$ *Production/Demo*.
  * Secrets Protection & Observability callout box (`/health` probe).
  * Responsible AI Usage Governance box (Appendix E).
* **Key Talking Points:**
  * **4-Tier Environment Separation Model:**
    * *Tier 1 (Local Dev):* Workstations running Docker Desktop with containerized database.
    * *Tier 2 (Automated CI):* Ephemeral Ubuntu runners on GitHub Actions executing linting, unit tests, and secret scanning.
    * *Tier 3 (Cloud Staging):* PaaS runtime (Render/Fly.io) + Supabase/Neon PostgreSQL mirror.
    * *Tier 4 (Production/Demo):* Hardened, locked demonstration platform for oral defence.
  * **Twelve-Factor App Controls:** Configuration decoupled from code; zero secrets in Git (`.gitignore`, automated secret scanners); lightweight `/health` liveness probe.
  * **Responsible AI Governance (Appendix E):**
    * All AI usage governed through a strict 5-stage human-in-the-loop verification pipeline.
    * Highlight rejected suggestions: AI proposed a multi-node Kubernetes cluster (rejected due to $0 budget/NFR-010) and a single-reviewer PR policy (rejected to prevent knowledge silos).
* **Transition:** *"All of these engineering controls culminated in our formal Milestone Gate review."*

---

### Slide 11: Milestone 1 Baseline Sign-Off Gate (ACCEPTED) & Defence Readiness
* **Speaker:** Chris Fourie (Systems Architect & Governance Lead)
* **Target Time:** 0:45 min (13:30 – 14:15)
* **Visuals on Slide:**
  * Completed Master Project Brief Appendix D Verification Table (Scope, Requirements, Risks, Governance all **PASSED**).
  * Formal Gate Outcome Badge: **ACCEPTED (100% Team Sign-Off)**.
  * Team Signatures: Lisa Verson, Pandora Greyling, Chris Fourie.
  * Transition Banner: *"Group E is fully prepared for Individual Engineering Defence."*
* **Key Talking Points:**
  * **Appendix D Verification Audit:** Evaluated all required deliverables against institutional criteria:
    * Project Identifier & Version: Verified (`CivicConnect`, v1.0).
    * Scope Reviewed: Passed (14 FRs committed, exclusions defended).
    * Traceability & Acceptance: Passed (Live RTM established).
    * Risk Review: Passed (Scored register, `RSK-001` defended).
    * Repository Governance: Passed (Protected `main`, 2-reviewer PR rule active).
  * **Formal Gate Outcome:** **ACCEPTED** with unanimous sign-off across all three team members.
  * **Milestone 2 Readiness:** PED v1.0 establishes an auditable, controlled engineering foundation positioning Group E to proceed directly to Milestone 2 Architecture and Design.
  * **Handoff to Panel:** Thank the evaluation panel and invite individual questioning for the oral defence.
* **Closing Line:** *"Thank you for your time. Group E is now ready for individual questioning and engineering defence."*

---

## 3. Oral Defence Q&A Mapping (The 5-Step Model)

When answering assessor questions during the individual oral examination, strictly apply the **5-Step SEN381 Response Pattern**:
$$\text{Direct Principle} \longrightarrow \text{Cite PED Section \& Page} \longrightarrow \text{Explain SE Trade-off / Risk} \longrightarrow \text{Connect Downstream Consequence} \longrightarrow \text{State Concrete Mitigation}$$

### Quick Assignment Guide:
* **Lisa Verson (Lead Requirements Analyst):**
  * **Question 1:** Hardest stakeholder conflict reconciled (Conflict Surface A: Anonymity vs. POPIA Attribution, Section 2.4.1, p. 10).
  * **Question 2:** Client adding a major feature without changing deadline (Appendix E Change Impact Analysis, Section 3.5, p. 12 & ADR-001, p. 23).
  * **Question 4:** Trace requirement through RTM from source to test (`FR-010` State Machine, Section 4.3, p. 15 & Section 6.3/6.4, pp. 17–18).
* **Pandora Greyling (Quality & Risk Manager):**
  * **Question 3:** NFR constraining Milestone 2 architecture (`NFR-004` RBAC forces layered auth middleware; `NFR-001` latency bounds stack choice, Section 4.4, p. 15).
  * **Question 5:** Which risk deserves the most attention and why (`RSK-001` Scope Creep; Boehm's Cost of Change curve, Section 7.2/7.3, p. 18).
  * **Question 11:** Knowing CivicConnect succeeded beyond "the code works" (100% RTM delivery, empirical $\le 500\text{ms}$ latency, $\ge 80\%$ test coverage, Section 4.4 & Section 11, pp. 15, 28–29).
* **Chris Fourie (Systems Architect & Governance Lead):**
  * **Question 6:** Why deployment, testing, and operations are relevant in M1 (`FEC-002` Testability, `FEC-004` Parity, `FEC-006` Cost; cannot retrofit quality attributes, Section 8, pp. 18–21).
  * **Question 7:** Intentionally deferred decision (`ADR-003` Tech stack deferment to M2; evaluated via weighted decision matrix, Section 9.2.3, p. 24).
  * **Question 8:** Why changes to main require two non-author approvals (`ADR-002` Linus's Law, collective ownership, eliminates single points of failure, Section 9.2.2, pp. 23–24).
  * **Question 9:** AI-assisted contribution verified or rejected (Rejected multi-node Kubernetes cluster for Docker Compose due to $0 budget/NFR-010, Appendix E, pp. 32–33).
  * **Question 10:** Artefacts revisited if a requirement changes (Scope Statement, RTM, Risk Register, ADR, Constraints, Section 3.5, p. 12 & Section 5.3, pp. 15–16).
  * **Question 12:** Early shortcut creating technical debt (Hardcoded frontend status transitions instead of backend FSM; causes data corruption and monolithic rewrite, Section 4.3, p. 15 & Section 8.2.3, p. 20).
