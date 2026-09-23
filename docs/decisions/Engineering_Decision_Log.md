# CivicConnect: Engineering Decision Log

**Document Reference:** `DOC-DEC-001`  
**Milestone:** Milestone 1 — Engineering Foundation & Requirements Baseline  
**Baseline Version:** 1.0 (Controlled)  
**Governing Standard:** SEN381 Master Project Brief §13  

---

## 1. Decision Log Architecture & Standard

In accordance with **SEN381 NQF Level 8 standards**, engineering decisions must be documented at the time they are made—or deliberately deferred—capturing the context, constraints, evaluated alternatives, rationale, trade-offs, and expected downstream consequences.

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│ Context &   │ ──► │ Evaluated   │ ──► │ Justified    │ ──► │ Trade-offs    │ ──► │ Downstream   │
│ Constraints │     │ Alternative │     │ Decision &   │     │ & Accepted    │     │ Lifecycle    │
│             │     │ Options     │     │ Rationale    │     │ Residual Risk │     │ Consequences │
└─────────────┘     └─────────────┘     └──────────────┘     └───────────────┘     └──────────────┘
```

---

## 2. Master Engineering Decision Table

| Decision ID | Title & Summary | Context & Constraints | Alternatives Evaluated | Final Decision | Rationale | Accepted Trade-offs & Risks | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`ADR-001`** | **Scope Baseline & Change Control Process** | Need to prevent scope creep within a 3-person team under fixed academic deadlines. | 1. Open flexible feature backlog.<br>2. Rigid zero-change policy.<br>3. Baselined scope with formal change control. | **Option 3: Controlled Scope Baseline with Appendix E Change Process.** | Balances delivery predictability with necessary agility for legitimate stakeholder adjustments. | Requires formal overhead for any scope addition; minor delay in adopting ad-hoc enhancements. | **ACCEPTED** |
| **`ADR-002`** | **GitHub Governance & Two-Reviewer PR Policy** | Mandate to ensure collective ownership and prevent unverified code/docs from polluting `main`. | 1. Direct commits to `main`.<br>2. Single reviewer approval.<br>3. Mandatory two-reviewer approval on protected `main`. | **Option 3: Protected `main` with mandatory 2-reviewer peer review.** | Complies with Master Project Brief §9; guarantees all 3 students understand and verify every change entering the baseline. | Increases PR turnaround latency; requires high coordination among all 3 team members. | **ACCEPTED** |
| **`ADR-003`** | **Deliberate Deferment of Technology Stack Selection** | Avoiding premature technology lock-in in Milestone 1 before complete architectural drivers and quality attributes are analyzed. | 1. Commit to React/Node.js in M1.<br>2. Commit to ASP.NET Core in M1.<br>3. Formally defer stack selection to Milestone 2. | **Option 3: Deliberately defer final stack decision to Milestone 2.** | Respects Milestone 1 boundary (§5); ensures technology selection is driven by evaluated NFRs and weighted trade-offs rather than premature bias. | Requires maintaining technology-neutral domain models in M1; delays scaffolding setup to start of M2. | **ACCEPTED** |
| **`DEC-004`** | **State Machine Integrity Model** | Service request status transitions must be auditable and prevent illegal state bypasses. | 1. Free-form status dropdown.<br>2. Hardcoded frontend state logic.<br>3. Server-side deterministic Finite State Machine (FSM). | **Option 3: Server-side FSM with database foreign-key constraints.** | Guarantees non-repudiation and lifecycle integrity regardless of client API consumer. | Slightly higher initial backend validation complexity. | **ACCEPTED** |
| **`DEC-005`** | **Zero-Cost Deployment Footprint Target** | Platform must be deployable for academic evaluation without incurred cloud infrastructure costs. | 1. Paid enterprise cloud tier.<br>2. Free-tier cloud PaaS (Render/Neon) + Local Docker Compose mirror.<br>3. Localhost execution only. | **Option 2: Cloud free-tier deployment backed by complete local Docker Compose parity.** | Satisfies both remote stakeholder demonstration and offline assessment defence robustness. | Free-tier services may experience cold-start latency; mitigated by local Docker mirror. | **ACCEPTED** |
| **`DEC-006`** | **Persistence Architecture Evaluation & Comparative Planning** | Need to baseline relational schema supporting ACID transactions, optimistic concurrency, and POPIA privacy while evaluating schema evolution. | 1. Single monolithic unstructured document store.<br>2. Pure 3NF relational model.<br>3. Hybrid relational + JSONB model. | **UNDER EVALUATION:** Formulated 2 complete planned architectures (Strict 3NF vs Hybrid JSONB) documented in `DOC-ARCH-DATA-001`. | Evaluates trade-off between strict relational schema rigor and dynamic taxonomy agility before final M2 lock-in. | Trade-off analysis active; feeds Assignment 2 Task 2 and Milestone 2 PED v2.0. | **IN PROGRESS** |


---

## 3. Individual Architecture Decision Records (ADRs)

For detailed evaluation of major architectural and process decisions, refer to:
* [**ADR-001: Scope Baseline and Change Control Policy**](ADR-001_Scope_and_Lifecycle_Boundary.md)
* [**ADR-002: GitHub Governance and Two-Reviewer Approval Policy**](ADR-002_GitHub_Governance_and_Two_Reviewer_Policy.md)
* [**ADR-003: Justified Deferment of Technology Stack Selection**](ADR-003_Justified_Deferment_of_Tech_Stack.md)
