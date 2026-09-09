# ADR-002: GitHub Governance, Protected Main, and Two-Reviewer Approval Policy

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** Lead Requirements Analyst (Student 1), Quality & Risk Engineer (Student 2), Systems Architect & Governance Lead (Student 3)  
**Governing Standard:** SEN381 Master Project Brief §8, §9, §9.1  

---

## 1. Context & Problem Statement
In collaborative software engineering, direct, uncontrolled commits to the primary production/baseline branch (`main`) frequently introduce breaking changes, regress existing functionality, bypass security reviews, and conceal individual contribution imbalances. 

The SEN381 Master Project Brief explicitly mandates that the repository is an *engineering control and evidence environment*, requiring auditable configuration management, protected branches, and meaningful peer review.

---

## 2. Decision Drivers & Constraints
* **Master Project Brief §9 Requirement:** Direct commits to `main` are prohibited; pull requests entering `main` must receive a minimum of **two approvals** from team members other than the author.
* **Collective Codebase Ownership:** All 3 team members must understand and defend the entire system during individual oral defence examinations.
* **Quality Assurance Gate:** Every PR must be verified against baselined acceptance criteria, security guidelines, and test standards prior to integration.

---

## 3. Considered Alternatives

### Alternative 1: Direct Commits to Main Branch
Allow all 3 students to push commits directly to `main` without pull requests or reviews.
* *Pros:* Fastest integration; zero coordination overhead.
* *Cons:* Destroys traceability; creates merge conflicts; violates SEN381 core rules; results in immediate loss of assessment marks.

### Alternative 2: Single-Reviewer PR Model
Require 1 peer approval before merging a PR into `main`.
* *Pros:* Faster PR turnaround than 2-reviewer model.
* *Cons:* Violates Master Project Brief §9 (which mandates two non-author approvals for a 3-person team); leaves the 3rd student blind to merged changes.

### Alternative 3: Protected Main with Mandatory Two-Reviewer PR Approval (Selected)
Enforce repository branch protection on `main`. Every change must originate on a feature/doc branch, use the structured PR template (`.github/pull_request_template.md`), and obtain formal sign-offs from both remaining team members.
* *Pros:* 100% compliance with SEN381 standards; guarantees complete collective knowledge across the team; catches architectural defects and security risks early.
* *Cons:* Requires disciplined scheduling and rapid review turnarounds to avoid blocking developers.

---

## 4. Decision Outcome

**Chosen Option:** **Alternative 3: Protected Main with Mandatory Two-Reviewer PR Approval.**

### Positive Consequences
* The `main` branch is permanently stable, clean, and representative of the controlled baseline.
* Every team member is actively engaged in reviewing code and documentation, ensuring high readiness for the individual oral engineering defence.
* Prevents rubber-stamping by enforcing specific verification checks (traceability, acceptance criteria, security, tests) in the PR template.

### Negative Consequences / Accepted Trade-offs
* PR merge latency is slightly higher when team members are unavailable.
* Requires team adherence to the review turnaround SLAs defined in the [Team Working Agreement](../governance/Team_Working_Agreement.md).

---

## 5. Traceability & Compliance
* **Linked Risks:** Mitigates `RSK-004` (Branch Governance Violation) and `RSK-003` (Team Knowledge Silos).
* **Controlled Artefact:** `.github/pull_request_template.md` and `.github/workflows/pr-governance-check.yml`.
