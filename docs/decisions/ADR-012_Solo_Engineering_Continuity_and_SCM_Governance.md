# ADR-012: Solo Engineering Continuity & Emergency SCM Governance Protocol Following Total Team Attrition

**Status:** ACCEPTED (Emergency Governance Amendment to ADR-002 and ADR-009)  
**Date:** 2026-10-08  
**Decider:** Systems Architect & Sole Lead Developer (Chris Fourie, Student ID: 602826)  
**Governing Standard:** SEN381 Master Project Brief §4, §8, §9, §13, §23; Milestone 3 Brief Area B (§8)  
**Document Reference:** `DOC-ADR-012`  

---

## 1. Context & Problem Statement

On 29 September 2026, team member **Pandora Greyling (Student ID: 602369)** formally withdrew from the institution, prompting `ADR-009` which amended repository governance to a two-person model (1 mandatory peer review per Pull Request + automated CI quality gates).

On 08 October 2026 (Week 6, Day 3), approximately six days prior to the Milestone 3 submission deadline, the sole remaining team partner, **Lisa Verson (Student ID: 602006)**, completely ceased communication and abandoned all assigned project responsibilities (Requirements Traceability Matrix updates, Defect Register curation, E2E journey tests, and PR peer reviews).

This event leaves **Chris Fourie (Student ID: 602826)** operating as a **solo engineer**:
* **The Governance Deadlock:** Under `ADR-002` (requiring two reviewers) and `ADR-009` (requiring one peer review), a solo developer cannot merge Pull Requests into protected `main` without violating branch protection or creating self-approved rubber stamps.
* **The Academic Integrity Constraint:** Master Project Brief §9 and §23 strictly prohibit unreviewed direct commits to `main` and forbid phantom accounts or fraudulent contributions. Assessors evaluate how an engineer handles real-world socio-technical disruptions.
* **The Capacity Reality:** Chris Fourie must absorb 100% of remaining engineering, verification, and documentation deliverables while adhering to the **Milestone 3 Manageability Rule (§1, §3)**.

---

## 2. Decision Drivers & Constraints

* **Non-Negotiable Baseline Integrity:** Direct pushes to `main` must remain permanently locked. The product baseline on `main` must never be compromised by unverified commits.
* **Elimination of Administrative Deadlock:** A mechanism must exist to allow safe, audited promotion of feature branches into `main` without waiting for a non-responsive collaborator.
* **NQF Level 8 Auditability:** Every single merged increment must possess traceable, automated, and tamper-proof verification evidence that an academic assessor can inspect.
* **Honest Engineering Accounting:** Rather than concealing team collapse, the attrition must be formally logged in the project risk architecture (`RSK-012`), the decision register, and the Project Engineering Document (PED v3.0).

---

## 3. Considered Alternatives

### Alternative 1: Freeze Development & Request Academic Incomplete / Deferral
Halt all development and petition the faculty for milestone postponement or reassignment to a new team.
* *Pros:* Preserves theoretical 3-person team requirement.
* *Cons:* **Rejected.** Milestone 3 deadline is within 6 days. Academic regulations do not permit mid-phase team reassignment in Week 6. Freezing development would result in immediate milestone failure.

### Alternative 2: Disable Branch Protection & Push Directly to `main`
Remove GitHub branch protection rules and push all remaining code directly to `main`.
* *Pros:* Maximum speed and zero administrative friction.
* *Cons:* **Rejected.** Direct violation of Master Project Brief §9 (*"Direct development on main: Not permitted for substantive controlled changes"*). Destroys Software Configuration Management (SCM) auditability and violates professional engineering ethics.

### Alternative 3: Solo Governance Protocol via Automated CI Gates + Formal Self-Audit Signoff (Selected)
Amend repository governance to a formal solo-engineering protocol:
1. **Branch Protection Enforced:** `main` remains protected; direct commits are blocked.
2. **Automated CI Quality Gate Authority:** Branch merges are gated by the automated GitHub Actions CI workflow (`ci.yml`), which strictly enforces 4 sequential gates:
   - `Gate 1: Dependency Restoration` (`npm ci`)
   - `Gate 2: Static Analysis & TypeScript Compilation` (`npm run build` / `tsc` zero errors)
   - `Gate 3: Automated Verification Suite & V8 Coverage Thresholds` (`vitest run --coverage` asserting 80%+ thresholds on core domain/application logic)
   - `Gate 4: Security Vulnerability Audit` (`npm audit --omit=dev --audit-level=high` zero high/critical vulnerabilities)
3. **Formal Single-Engineer Self-Audit Checklist:** Every Pull Request must include a standardized, filled, and signed Self-Audit Verification Checklist in the PR description prior to merge.
4. **Transparent Risk Recording:** The team attrition is registered as `RSK-012` with formal mitigation through scope prioritization and automation.

---

## 4. Decision Outcome

**Chosen Option:** **Alternative 3: Solo Governance Protocol via Automated CI Gates + Formal Self-Audit Signoff.**

### Solo Engineering Operational Contract
1. **Repository Branch Rule:** All work occurs on `feat/*` or `docs/*` branches. Merging into `main` occurs strictly via Pull Requests.
2. **Merge Authorization Rule:** A Pull Request is eligible for merge only when:
   - All 4 automated GitHub Actions CI gates report green (`success`).
   - The PR description contains the completed **Single-Engineer Self-Audit Checklist**:
     - [x] Traceable requirement / issue identified.
     - [x] Zero regressions against existing automated tests.
     - [x] Zero hardcoded secrets, credentials, or private environment variables.
     - [x] Relevant living registers updated (`RTM`, `Risk`, `Debt`, `ADR`).
3. **Workload Absorption Contract:**
   - Chris Fourie absorbs all remaining responsibilities: E2E Lifecycle Journey tests, Living RTM v3.0, Defect Register v3.0, Technical Debt Register, AI Usage Register v3.0, and PED v3.0 consolidation.
   - Deliverables are constrained strictly to the agreed MVP core scope (Citizen Fault Reporting Lifecycle) in accordance with the Manageability Rule (§1, §3).

### 4.1 Re-Integration Grace Protocol
Should team partner Lisa Verson re-engage and resume project participation prior to the final Milestone 3 submission deadline, repository governance gracefully transitions back to collaborative mode under `ADR-009`, supporting co-authored PRs and reciprocal peer reviews without administrative overhead.

---

## 5. Traceability & Compliance
* **Supersedes / Amends:** `ADR-002` (Two-Reviewer Policy), `ADR-009` (Two-Person Team Adaptation)
* **Linked Risks:** `RSK-011` (Team Member Attrition - Pandora), `RSK-012` (Total Team Attrition / Solo Operation)
* **Governing Document:** `DOC-PED-003` Section 4 & Appendix B
* **Auditable Author:** Chris Fourie (`602826`), Systems Architect & Sole Lead Developer
