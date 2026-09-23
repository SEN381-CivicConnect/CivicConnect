# ADR-001: Scope Baseline and Strict Change Control Governance

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** Full Project Team (Lisa Verson, Pandora Greyling, Chris Fourie)  
**Governing Standard:** SEN381 Master Project Brief Section 4, Section 13, Section 14  

---

## 1. Context & Problem Statement
The CivicConnect project is executed by a team of exactly three students across four assessed milestones within a fixed academic calendar. In municipal and community service request domains, stakeholder feature requests are virtually boundless (e.g., automated IoT sensor telemetry, multi-language speech-to-text, live contractor dispatch, GPS vehicle tracking). 

Without an explicit, formally baselined scope boundary and an auditable change-control mechanism, uncontrolled scope creep (`RSK-001`) will inevitably compromise automated test coverage, architectural integrity, and delivery deadlines.

---

## 2. Decision Drivers & Constraints
* **Team Size Constraint:** Exactly 3 students; finite engineering hours per week.
* **Schedule Constraint:** Strict delivery deadlines for Milestones 1 through 4.
* **Assessment Quality Focus:** Students are evaluated on software engineering rigor, testability, traceability, and architectural defensibility rather than sheer volume of half-finished features.
* **POPIA Compliance:** Regulatory boundaries mandate that sensitive request workflows remain secure and audited.

---

## 3. Considered Alternatives

### Alternative 1: Open / Fluid Scope Backlog
Allow team members and stakeholders to add or modify features continuously during development sprints without formal review.
* *Pros:* Maximum flexibility and immediate adoption of creative ideas.
* *Cons:* Guarantees severe scope creep, broken architectural abstractions, untested edge cases, and high risk of project failure.

### Alternative 2: Rigid Zero-Change Lockout
Enforce a permanent ban on any post-baseline feature modifications or improvements throughout the entire project lifecycle.
* *Pros:* Maximum schedule predictability.
* *Cons:* Completely unrealistic in professional software engineering; prevents adaptation to legitimate lecturer change requests (mandated in Milestone 3).

### Alternative 3: Controlled Scope Baseline with Formal Change Impact Analysis (Selected)
Establish a formal 14-requirement functional baseline in Milestone 1 (`DOC-REQ-003`). Any subsequent modification must undergo formal impact analysis (evaluating requirements, architecture, security, cost, schedule, and test coverage) using Master Project Brief Appendix E.
* *Pros:* Protects engineering predictability while providing a structured, defensible mechanism for managed evolution.
* *Cons:* Requires administrative overhead to process change requests.

---

## 4. Decision Outcome

**Chosen Option:** **Alternative 3: Controlled Scope Baseline with Formal Change Impact Analysis.**

### Positive Consequences
* Clear, immutable foundation for Milestone 2 architectural design and Milestone 3 construction.
* High confidence in achieving $\ge 80\%$ test coverage on all baselined functional requirements.
* Establishes a defensible audit trail when lecturer change requests are introduced in Milestone 3.

### Negative Consequences / Accepted Trade-offs
* Minor overhead in drafting formal impact analysis records for scope adjustments.
* Deliberately defers attractive features (e.g., WhatsApp integration) to post-M4 roadmaps.

---

## 5. Traceability & Compliance
* **Linked Requirements:** `FR-001` through `FR-014`
* **Linked Risks:** Mitigates `RSK-001` (Scope Creep)
* **Governing Template:** SEN381 Master Project Brief Appendix E (Change Request Form)
