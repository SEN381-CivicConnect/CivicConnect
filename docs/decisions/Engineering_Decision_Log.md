# CivicConnect: Engineering Decision Log (v2.0)

**Document Reference:** `DOC-DEC-001`  
**Milestone:** Milestone 2 -- Architecture, Design & Engineering Decisions  
**Baseline Version:** 2.0 (Controlled Architecture Baseline)  
**Governing Standard:** SEN381 Master Project Brief Section 13 & Section 18.1; Milestone 2 Brief Section 4.1, Section 5  

---

## 1. Decision Log Architecture & Standard

In accordance with **SEN381 NQF Level 8 standards**, engineering decisions must be documented at the time they are made -- or deliberately deferred -- capturing the context, constraints, evaluated alternatives, rationale, trade-offs, and expected downstream consequences.

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│ Context &   │ ──-> │ Evaluated   │ ──-> │ Justified    │ ──-> │ Trade-offs    │ ──-> │ Downstream   │
│ Constraints │     │ Alternative │     │ Decision &   │     │ & Accepted    │     │ Lifecycle    │
│             │     │ Options     │     │ Rationale    │     │ Residual Risk │     │ Consequences │
└─────────────┘     └─────────────┘     └──────────────┘     └───────────────┘     └──────────────┘
```

---

## 2. Master Engineering Decision Table

| Decision ID | Title & Summary | Context & Constraints | Alternatives Evaluated | Final Decision | Rationale | Accepted Trade-offs & Risks | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`ADR-001`** | **Scope Baseline & Change Control Process** | Need to prevent scope creep within a 3-person team under fixed academic deadlines. | 1. Open flexible feature backlog.<br>2. Rigid zero-change policy.<br>3. Baselined scope with formal change control. | **Option 3: Controlled Scope Baseline with Appendix E Change Process.** | Balances delivery predictability with necessary agility for legitimate stakeholder adjustments. | Requires formal overhead for any scope addition; minor delay in adopting ad-hoc enhancements. | **ACCEPTED** (M1) |
| **`ADR-002`** | **GitHub Governance & Two-Reviewer PR Policy** | Mandate to ensure collective ownership and prevent unverified code/docs from polluting `main`. | 1. Direct commits to `main`.<br>2. Single reviewer approval.<br>3. Mandatory two-reviewer approval on protected `main`. | **Option 3: Protected `main` with mandatory 2-reviewer peer review.** | Complies with Master Project Brief Section 9; guarantees all 3 students understand and verify every change entering the baseline. | Increases PR turnaround latency; requires high coordination among all 3 team members. | **ACCEPTED** (M1) |
| **`ADR-003`** | **Deliberate Deferment of Technology Stack Selection** | Avoiding premature technology lock-in in Milestone 1 before complete architectural drivers and quality attributes are analyzed. | 1. Commit to React/Node.js in M1.<br>2. Commit to ASP.NET Core in M1.<br>3. Formally defer stack selection to Milestone 2. | **Option 3: Deliberately defer final stack decision to Milestone 2.** | Respects Milestone 1 boundary (Section 5); ensures technology selection is driven by evaluated NFRs and weighted trade-offs rather than premature bias. | Requires maintaining technology-neutral domain models in M1; delays scaffolding setup to start of M2. | **SUPERSEDED** (Resolved by `ADR-008`) |
| **`DEC-004`** | **State Machine Integrity Model** | Service request status transitions must be auditable and prevent illegal state bypasses. | 1. Free-form status dropdown.<br>2. Hardcoded frontend state logic.<br>3. Server-side deterministic Finite State Machine (FSM). | **Option 3: Server-side FSM with database foreign-key constraints.** | Guarantees non-repudiation and lifecycle integrity regardless of client API consumer. | Slightly higher initial backend validation complexity. | **ACCEPTED** (M1) |
| **`DEC-005`** | **Zero-Cost Deployment Footprint Target** | Platform must be deployable for academic evaluation without incurred cloud infrastructure costs. | 1. Paid enterprise cloud tier.<br>2. Free-tier cloud PaaS (Render/Neon) + Local Docker Compose mirror.<br>3. Localhost execution only. | **Option 2: Cloud free-tier deployment backed by complete local Docker Compose parity.** | Satisfies both remote stakeholder demonstration and offline assessment defence robustness. | Free-tier services may experience cold-start latency; mitigated by local Docker mirror. | **ACCEPTED** (M1) |
| **`ADR-004`** | **Observer Pattern for Lifecycle Event Notifications** | Decoupling core ticket entity from volatile notification sinks (email, SMS, audit logs) to prevent ripple effects. | 1. Synchronous procedural calls.<br>2. Distributed message queue (Kafka/RabbitMQ).<br>3. In-memory Observer Pattern with Domain Event Dispatcher. | **Option 3: In-Memory Observer Pattern with Domain Event Dispatcher.** | Protects free-tier memory limit (<200MB); satisfies SRP & OCP; allows mocking in unit tests. | Observers must catch transient external errors to prevent event dispatch corruption. | **ACCEPTED** (M2) |
| **`ADR-005`** | **Factory Method for Polymorphic Intake & Validation** | Diverse request categories have unique mandatory fields, SLA defaults, and validation invariants. | 1. Monolithic switch/case block.<br>2. Dynamic runtime reflection.<br>3. Factory Method with specialized category creators. | **Option 3: Factory Method Pattern with Specialized Domain Creators.** | Strict adherence to OCP; compiles safely; isolates category validation into independently testable classes. | Increases class count (requires base factory and category subclasses). | **ACCEPTED** (M2) |
| **`ADR-006`** | **Strict 3NF Relational Model with Optimistic Concurrency Control** | High-concurrency operations (triage, ticket claiming) risk lost updates; auditability requires ACID rigor. | 1. NoSQL document store (MongoDB).<br>2. Pessimistic row locking (`SELECT FOR UPDATE`).<br>3. Strict 3NF Relational Model (PostgreSQL 16) with integer `version` OCC. | **Option 3: Strict 3NF Relational Model with Optimistic Concurrency Control.** | Zero row locking contention; non-blocking queries; atomic version validation prevents double-booking. | Requires UI and API layer to handle HTTP 409 Conflict responses gracefully. | **ACCEPTED** (M2) |
| **`ADR-007`** | **Transactional Outbox Pattern for External Gateway Integration** | External notification APIs (email/SMS) introduce network latency and the Dual-Write inconsistency risk. | 1. Synchronous HTTP REST call in handler.<br>2. Fire-and-forget in-memory thread.<br>3. Asynchronous Transactional Outbox Pattern. | **Option 3: Asynchronous Transactional Outbox Pattern.** | Guarantees atomic database commit with durable retry buffer; prevents slow gateways from blocking user responses (<= 500ms). | Requires an `outbox_messages` table and internal polling background worker loop. | **ACCEPTED** (M2) |
| **`ADR-008`** | **Technology Stack Commitment (Resolving ADR-003)** | Committing to concrete frontend, backend runtime, database, and container technologies. | 1. TypeScript / Node.js / Express / React / PostgreSQL 16.<br>2. C# / ASP.NET Core 8 / React / PostgreSQL.<br>3. Python / FastAPI / React / PostgreSQL. | **Option 1: TypeScript / Node.js / Express / React / PostgreSQL 16 (Scored 9.05/10).** | Single-language full stack; lightweight footprint (<180MB RAM fits 512MB free tier); rapid test execution in CI; high team velocity. | Requires centralized async error middleware to prevent unhandled promise rejections. | **ACCEPTED** (M2) |
| **`ADR-009`** | **Governance Adjustment for Two-Person Team Operation** | Unexpected departure of Pandora Greyling (Student 602369) on 2026-09-29 reducing team to 2 members. | 1. Freeze repo.<br>2. Unreviewed solo merges.<br>3. Single mandatory peer review (100% remaining partner approval) + CI gate. | **Option 3: Single Mandatory Independent Peer Review + Automated CI Gate.** | Eliminates mathematical impossibility of 2 reviewers in a 2-person team; maintains 100% peer review coverage and transparency. | Increases individual review load on Lisa and Chris; mitigated by strict automated CI quality checks. | **ACCEPTED** (M2) |

---

## 3. Individual Architecture Decision Records (ADRs)

For detailed evaluation of major architectural and process decisions, refer to:
* [**ADR-001: Scope Baseline and Change Control Policy**](ADR-001_Scope_and_Lifecycle_Boundary.md)
* [**ADR-002: GitHub Governance and Two-Reviewer Approval Policy**](ADR-002_GitHub_Governance_and_Two_Reviewer_Policy.md)
* [**ADR-003: Justified Deferment of Technology Stack Selection**](ADR-003_Justified_Deferment_of_Tech_Stack.md) *(Superseded by ADR-008)*
* [**ADR-004: In-Memory Observer Pattern for Lifecycle Event Notifications**](ADR-004_Observer_Pattern_Notifications.md)
* [**ADR-005: Factory Method Pattern for Polymorphic Request Intake & Validation**](ADR-005_Factory_Method_Polymorphic_Intake.md)
* [**ADR-006: Relational Persistence (Strict 3NF) with Optimistic Concurrency Control**](ADR-006_Relational_Persistence_Optimistic_Concurrency.md)
* [**ADR-007: Transactional Outbox Pattern for External Gateway Integration**](ADR-007_Transactional_Outbox_Integration.md)
* [**ADR-008: Technology Stack Commitment (Resolution of ADR-003 via Weighted Matrix)**](ADR-008_Technology_Stack_Commitment.md)
* [**ADR-009: Governance & Branch Review Policy Adjustment for Two-Person Team Operation**](ADR-009_Governance_Adjustment_Two_Person_Team.md)
