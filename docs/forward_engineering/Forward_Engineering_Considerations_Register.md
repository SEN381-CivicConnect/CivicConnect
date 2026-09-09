# CivicConnect: Forward Engineering Considerations Register

**Document Reference:** `DOC-FWD-001`  
**Milestone:** Milestone 1 — Engineering Foundation & Requirements Baseline  
**Baseline Version:** 1.0 (Controlled)  
**Governing Standard:** SEN381 Milestone 1 Brief §4 & Master Project Brief §1  

---

## 1. The Principle of Forward Engineering

In accordance with **SEN381 NQF Level 8 standards**, thinking ahead is fundamentally different from premature implementation. Forward engineering involves identifying high-consequence lifecycle concerns early—while their cost of consideration is near zero—so that current requirements, constraints, and risk models actively preserve future options rather than unintentionally foreclosing them (Boehm, 1981; Bass et al., 2021).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FORWARD ENGINEERING HORIZON                           │
│                                                                             │
│   Milestone 1: BASELINE             Milestone 2: DESIGN                     │
│   • Identify Concerns               • Architect for Testability & RBAC      │
│   • Preserve Architectural Options  • Define Contracts & Persistence         │
│                                                                             │
│   Milestone 3: CONSTRUCTION         Milestone 4: RELEASE                    │
│   • Automated CI & Integration      • Environment Parity & Monitoring       │
│   • Implement Quality Controls      • Operational Verification & Audit      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Register of Project-Specific Forward Engineering Concerns

| Concern ID | Lifecycle Engineering Concern | Why It Matters Now in Milestone 1 | Later Decisions & Activities Influenced | Information Currently Missing (M1 Gap) | Risk of Ignoring / Deferring Without Thought | Justified Next Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`FEC-001`** | **Security & Role-Based Access Control (RBAC)** | Community service requests involve sensitive public issues (security complaints, personal home addresses, phone numbers). RBAC boundaries dictate entity relationships and API authorization rules. | Influences M2 domain model design, API endpoint middleware, JWT token claims structure, and database row-level security. | Exact granular permission matrix for cross-departmental supervisors vs field technicians. | If ignored in M1, PII leaks into unpartitioned queries (`RSK-002`), requiring catastrophic backend refactoring in M3. | Define conceptual RBAC boundaries in M1; specify formal authorization middleware in M2. |
| **`FEC-002`** | **Automated Testing & Testability Architecture** | Testing cannot be "bolted on" after code is written. Requirements must be phrased in verifiable Gherkin syntax now to enable automated unit and integration tests later. | Influences M2 architectural modularity (Dependency Injection, repository abstractions) to allow mock databases during CI testing. | Chosen test runner framework and mock database library for the selected stack. | Highly coupled monolithic code written in M3 that cannot be tested automatically, failing SEN381 CI quality gates. | Baseline Gherkin acceptance criteria in M1 RTM; design for testability in M2. |
| **`FEC-003`** | **Data Persistence & Audit Trail Evolution** | Request state transitions must be immutable and auditable under compliance regulations. Audit logging alters the database schema design. | Influences M2 relational schema design (separate `ServiceRequests` vs `RequestAuditEvents` tables) and migration tooling. | Final database engine (PostgreSQL vs SQL Server) and ORM migration tool capabilities. | Altering table structures late in M3 risks database schema corruption and permanent data loss during staging deploys. | Model audit requirements in `FR-010`/`NFR-006` in M1; design relational schema in M2. |
| **`FEC-004`** | **Environment Parity & Deployment Target** | The software must run seamlessly in local development, automated CI test runners, cloud staging, and final demonstration environments. | Influences M2 containerization design (Docker Compose), environment variable management, and configuration loading. | Exact free-tier hosting platform constraints (e.g. Render RAM limits, Neon connection pooling). | "It works on my machine" syndrome during Milestone 4 defence; deployment crashes due to missing cloud environment variables. | Document deployment constraints in M1; author Docker Compose baseline in M2. |
| **`FEC-005`** | **Observability, Logging & Error Telemetry** | When requests fail or state transitions throw exceptions in production, operators must know why before users report an outage. | Influences M2 error-handling middleware, structured JSON logging format, and health check endpoint design (`/healthz`). | Telemetry aggregation tool compatible with free-tier hosting (e.g. Pino, Serilog, Winston). | Silent production failures and unidentifiable server 500 errors during M4 live demonstration. | Mandate structured error handling in `NFR-009`; architect logging middleware in M2. |
| **`FEC-006`** | **Operational Cost & Free-Tier Sustainability** | The project is constrained to operate entirely within \$0.00/month educational budgets while remaining production-capable. | Influences M2 technology stack selection, database hosting choice, and cloud service tier selection. | Updated 2026 pricing and compute limits for candidate cloud providers (Render, Vercel, Supabase). | Cloud account suspension mid-milestone due to exceeding compute/bandwidth limits. | Document free-tier constraints in `NFR-010`; evaluate candidate providers in M2. |

---

## 3. Forward Engineering Decision Deferment Defense

The team explicitly affirms that **none** of the six concerns above are implemented in Milestone 1. Instead:
1. Requirements have been formulated to remain compatible with all evaluated forward engineering options.
2. The team has identified what evidence is required in Milestone 2 (e.g., comparative benchmarks, container proofs-of-concept, and pricing audits) before committing to implementation.
3. This deliberate restraint demonstrates professional software engineering maturity and prevents premature technical debt.
