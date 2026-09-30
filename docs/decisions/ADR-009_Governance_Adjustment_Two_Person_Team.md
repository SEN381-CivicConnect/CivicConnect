# ADR-009: Governance & Branch Review Policy Adjustment for Two-Person Team Operation

**Status:** ACCEPTED (Emergency Governance Amendment to ADR-002)  
**Date:** 2026-09-29  
**Deciders:** Systems Architect & Governance Lead (Chris Fourie), Lead Requirements & Design Analyst (Lisa Verson)  
**Governing Standard:** SEN381 Master Project Brief Section 4, Section 9, Section 13; Milestone 2 Brief Section 10  
**Document Reference:** `DOC-ADR-009`  

---

## 1. Context & Problem Statement

On 29 September 2026 (Week 4, Day 2), team member **Pandora Greyling (Student ID: 602369)** officially withdrew from the institution and departed campus, reducing CivicConnect Group E from three students to exactly **two students** (Chris Fourie and Lisa Verson), approximately 34 hours prior to the Milestone 2 submission deadline.

This unexpected event directly impacts repository governance:
* In `ADR-002` (*GitHub Governance and Two-Reviewer Policy*), the team baselined a rule requiring **two independent reviewer approvals** for every Pull Request entering protected `main`.
* In a two-person team, when one student authors a Pull Request, exactly **one other team member exists** in the repository. Requiring two independent reviewers becomes mathematically impossible and would paralyze development.
* Furthermore, workload distribution must be restructured: Chris Fourie assumes ~80% of project execution (Architecture, Database Persistence, Docker Parity, Concurrency, CI Quality Gates, Codebase Construction, and Presentation Lead), while Lisa Verson leads Requirements, Design Pattern Specifications, Outbox Integration, UI/UX Wireframes, and Co-Defence.

---

## 2. Decision Drivers & Constraints

* **Operational Continuity:** Development, integration, and review must proceed without administrative deadlocks.
* **Master Project Brief Alignment (Section 9):** Peer review remains mandatory; zero unreviewed code may enter `main`.
* **Traceability & Integrity:** The departure of a team member must be formally recorded in the engineering log rather than hidden.
* **Workload Rebalancing:** Reallocating database architecture, concurrency controls, and risk management to Chris Fourie.

---

## 3. Considered Alternatives

### Alternative 1: Freeze Repository & Await Institutional Reassignment
Halt all branch merges until the academic department assigns a replacement student.
* *Pros:* Preserves theoretical 3-person requirement.
* *Cons:* **Rejected.** Milestone 2 deadline is in 34 hours; institutional reassignment mid-semester is unfeasible; would cause immediate milestone failure.

### Alternative 2: Allow Solo Unreviewed Merges (Disable Branch Protection)
Allow direct pushes or unreviewed self-merges to `main`.
* *Pros:* Maximum speed.
* *Cons:* **Rejected.** Complete violation of Master Project Brief Section 9 and NQF Level 8 software configuration management standards; destroys peer review auditability.

### Alternative 3: Amend Governance to Single Mandatory Independent Peer Review + Automated CI Gate (Selected)
Formally amend repository branch protection:
1. Every Pull Request requires **100% peer review approval from the remaining team partner** (1 mandatory review).
2. The author cannot self-approve.
3. Every PR must pass the automated GitHub Actions CI Quality Gate (`pr-governance-check.yml` and test suites).
4. Formally log the team restructuring in the Project Engineering Document (PED v2.0) and Risk Register (`RSK-011`).
* *Pros:* Maintains 100% peer review coverage across all changes; eliminates the mathematical deadlock; fully auditable and transparent for academic assessors.
* *Cons:* None. Represents responsible engineering adaptability under external constraints.

---

## 4. Decision Outcome

**Chosen Option:** **Alternative 3: Single Mandatory Independent Peer Review + Automated CI Gate.**

### Workload Reallocation Contract
| Engineering Area | Previous Owner | Revised 2-Person Allocation & Accountability |
| :--- | :--- | :--- |
| **Macro-Architecture & Governance** | Chris Fourie | **Chris Fourie** (Retained) |
| **Technology Stack & Docker Parity** | Chris Fourie | **Chris Fourie** (Retained) |
| **Backend Codebase & Server** | Chris Fourie | **Chris Fourie** (Retained) |
| **Data Persistence & 3NF Schema** | Pandora Greyling | **Chris Fourie** (Absorbed -- author of SQL DDL & seeds) |
| **Optimistic Concurrency Control** | Pandora Greyling | **Chris Fourie** (Absorbed -- author of OCC logic & tests) |
| **Project Risk Register** | Pandora Greyling | **Chris Fourie** (Absorbed -- updated with `RSK-011`) |
| **Requirements & Acceptance Criteria** | Lisa Verson | **Lisa Verson** (Retained) |
| **Design Patterns (Observer & Factory)** | Lisa Verson | **Lisa Verson** (Retained) |
| **API Contracts & Outbox Integration** | Lisa Verson | **Lisa Verson** (Retained) |
| **UI Wireframes & WCAG 2.1 AA** | Lisa Verson | **Lisa Verson** (Retained) |

---

## 5. Traceability & Compliance
* **Amends:** `ADR-002` (GitHub Governance Policy)
* **Linked Risk:** `RSK-011` (Team Member Attrition / Capacity Loss)
* **Governing Document:** `DOC-PED-002` Section Document Control & Section 18
