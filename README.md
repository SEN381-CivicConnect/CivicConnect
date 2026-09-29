# CivicConnect: Community Service Request Management Platform

[![SEN381](https://img.shields.io/badge/Module-SEN381--NQF8-blue.svg)](https://www.belgiumcampus.ac.za/)
[![Milestone 1 Gate](https://img.shields.io/badge/Milestone%201-Baseline%20Accepted-brightgreen.svg)](docs/governance/Baseline_Sign_Off_Gate_M1.md)
[![Milestone 2 Gate](https://img.shields.io/badge/Milestone%202-Architecture%20Baselined-brightgreen.svg)](docs/governance/Baseline_Sign_Off_Gate_M2.md)
[![Governance](https://img.shields.io/badge/GitHub%20Governance-ADR--002%20%7C%20ADR--009-orange.svg)](docs/decisions/ADR-009_Governance_Adjustment_Two_Person_Team.md)
[![Test Suite](https://img.shields.io/badge/Automated%20Tests-16%2F16%20Passing-success.svg)](code/README.md)
[![Academic Year](https://img.shields.io/badge/Academic%20Year-2026-lightgrey.svg)](#)

---

## 1. Project Overview & Context

**CivicConnect** is an enterprise-grade, centralized, and traceable service request management platform engineered for municipal, campus, and community infrastructure. It eliminates lost requests, misassigned work orders, and informal communication channels by enforcing a deterministic Finite State Machine (FSM), role-based access control, POPIA-compliant data protection, and immutable audit logging.

---

## 2. Monorepo Directory Layout & Structure

The repository organizes controlled engineering governance artifacts, academic research, and practical application construction in a single, auditable monorepo:

```
c:/Chris/Studies/SEN/Project/
├── .github/                                           # Centralized GitHub workflows & PR governance templates
│   ├── workflows/pr-governance-check.yml              # Automated PR verification CI pipeline
│   └── pull_request_template.md                       # Mandatory PR template (ADR-002 & ADR-009)
├── README.md                                          # Master repository overview and navigation
├── CONTRIBUTING.md                                    # Contribution workflow, branching model, and review rules
├── SEN381 Master Project Brief.pdf                     # Institutional master project brief (governing document)
├── SEN381 Project Milestone 1.pdf                     # Milestone 1 specific brief
├── SEN381_CivicConnect_Milestone_2.pdf                # Milestone 2 formal submission package
│
├── docs/                                              # Controlled Engineering Baselines (M1 & M2)
│   ├── PED/                                           # Evolving Project Engineering Document
│   │   ├── PED_v1.0_Engineering_Baseline.md           # Milestone 1 Foundation Baseline
│   │   └── PED_v2.0_Architecture_and_Design_Baseline.md # Milestone 2 Architecture & Design Baseline
│   ├── requirements/                                  # Requirements Traceability Matrices & Scope
│   │   ├── Requirements_Traceability_Matrix_RTM_v1.0.md
│   │   ├── Requirements_Traceability_Matrix_RTM_v2.0.md # Full forward/backward traceability (M2)
│   │   ├── Stakeholder_Analysis_Matrix.md
│   │   └── Scope_Baseline_Statement.md
│   ├── architecture/                                  # Data and persistence architectures
│   │   └── Database_Architecture_and_Persistence_Plan_v1.0.md # Strict 3NF Relational Model
│   ├── decisions/                                     # Master Decision Log & ADRs
│   │   ├── Engineering_Decision_Log.md                # Master log tracking ADR-001 through ADR-009
│   │   ├── ADR-001_Scope_and_Lifecycle_Boundary.md
│   │   ├── ADR-002_GitHub_Governance_and_Two_Reviewer_Policy.md
│   │   ├── ADR-003_Justified_Deferment_of_Tech_Stack.md (Superseded by ADR-008)
│   │   ├── ADR-004_Observer_Pattern_Notifications.md
│   │   ├── ADR-005_Factory_Method_Polymorphic_Intake.md
│   │   ├── ADR-006_Relational_Persistence_Optimistic_Concurrency.md
│   │   ├── ADR-007_Transactional_Outbox_Integration.md
│   │   ├── ADR-008_Technology_Stack_Commitment.md
│   │   └── ADR-009_Governance_Adjustment_Two_Person_Team.md
│   ├── risk/                                          # Project Risk Registers
│   │   ├── Project_Risk_Register_v1.0.md
│   │   └── Project_Risk_Register_v2.0.md              # Active M2 risk register with treatment plans
│   ├── forward_engineering/                           # Forward Engineering Considerations Register
│   │   └── Forward_Engineering_Considerations_Register.md # 6 lifecycle concerns (FEC-001 to FEC-006)
│   ├── governance/                                    # Governance charters, AI logs, baseline gates
│   │   ├── Team_Working_Agreement.md                  # v2.0 charter amended for two-person team
│   │   ├── AI_Usage_Register_v1.0.md
│   │   ├── AI_Usage_Register_v2.0.md                  # Auditable register with human verification
│   │   ├── Baseline_Sign_Off_Gate_M1.md               # Formal Gate M1 (ACCEPTED)
│   │   └── Baseline_Sign_Off_Gate_M2.md               # Formal Gate M2 (ACCEPTED)
│   └── presentation/                                  # Presentation decks & defence guides
│       ├── Milestone_1_Presentation_Deck_and_Script.md
│       ├── Milestone_1_Individual_Defence_Preparation_Guide.md
│       ├── Milestone_2_Presentation_Deck_and_Script.md
│       └── Milestone_2_Individual_Defence_Preparation_Guide.md
│
├── code/                                              # Practical Application Codebase & Verification
│   ├── database/                                      # PostgreSQL 16 schema migrations & seeds
│   │   ├── init/                                      # Docker auto-provisioning entrypoint
│   │   ├── migrations/                                # Versioned DDL migration scripts (V1 3NF)
│   │   └── seeds/                                     # Taxonomy, priority, and FSM transition seeds
│   ├── src/                                           # Clean Architecture Layers
│   │   ├── domain/                                    # Entities, FSM, Enums, Value Objects, Domain Errors
│   │   ├── application/                               # Factories (GoF), Observers (GoF), Use Cases, Outbox
│   │   ├── infrastructure/                            # In-memory & DB persistence repositories
│   │   ├── api/                                       # Express controllers, routes, DTOs (POPIA masking)
│   │   ├── app.ts                                     # Express application factory & middleware
│   │   └── server.ts                                  # Server bootstrap entry point
│   ├── tests/                                         # Automated Verification Suites (Vitest)
│   │   ├── unit/                                      # FSM, Factory, Observer, OCC, and POPIA unit tests
│   │   └── integration/                               # REST API integration tests (Supertest)
│   ├── docker-compose.yml                             # Container parity (PostgreSQL 16 & pgAdmin)
│   ├── .env.example                                   # Environment variable template
│   ├── package.json                                   # Dependencies & test scripts
│   ├── tsconfig.json                                  # Strict TypeScript configuration
│   └── README.md                                      # Codebase quickstart & API documentation
│
└── Assignments/                                       # Academic research briefs (Assignments 1–3)
```

---

## 3. Controlled Engineering Baselines

### 3.1 Milestone 1: Engineering Foundation Baseline
* [**PED v1.0 — Engineering Baseline**](docs/PED/PED_v1.0_Engineering_Baseline.md): Problem decomposition, stakeholder conflicts, scope baseline, and initial 14 Functional Requirements.
* [**Requirements Traceability Matrix (RTM v1.0)**](docs/requirements/Requirements_Traceability_Matrix_RTM_v1.0.md): Traceability from stakeholder needs to Gherkin criteria.
* [**Baseline Sign-Off Gate M1**](docs/governance/Baseline_Sign_Off_Gate_M1.md): Formal sign-off record (ACCEPTED).

### 3.2 Milestone 2: Architecture, Technology & Initial Design Baseline
* [**PED v2.0 — Architecture & Design Baseline**](docs/PED/PED_v2.0_Architecture_and_Design_Baseline.md): Evolved project engineering baseline containing architectural drivers (ASRs), Layered Clean Monolith decomposition, weighted tech stack trade-off analysis, strict 3NF relational schema, GoF design patterns, OpenAPI 3.0 specs, and WCAG 2.1 AA wireframes.
* [**Requirements Traceability Matrix (RTM v2.0)**](docs/requirements/Requirements_Traceability_Matrix_RTM_v2.0.md): Full bidirectional traceability (`Stakeholder Need` $\rightarrow$ `FR/NFR` $\rightarrow$ `ASR` $\rightarrow$ `Architecture` $\rightarrow$ `Design Pattern` $\rightarrow$ `Code File` $\rightarrow$ `Automated Test`).
* [**Engineering Decision Log (v2.0)**](docs/decisions/Engineering_Decision_Log.md): Master decision register including `ADR-001` through `ADR-009`.
* [**Project Risk Register (v2.0)**](docs/risk/Project_Risk_Register_v2.0.md): 10 active risks with architectural treatment plans and residual exposure ratings.
* [**AI Usage Register (v2.0)**](docs/governance/AI_Usage_Register_v2.0.md): Auditable AI interaction log documenting prompts, generated outputs, human verification, and rejections.
* [**Team Working Agreement (v2.0)**](docs/governance/Team_Working_Agreement.md): Restructured governance charter for two-person team operation (`ADR-009`).
* [**Baseline Sign-Off Gate M2**](docs/governance/Baseline_Sign_Off_Gate_M2.md): Formal engineering gate decision conforming to Master Project Brief §18 (ACCEPTED).
* [**M2 Presentation Deck & Script**](docs/presentation/Milestone_2_Presentation_Deck_and_Script.md): 12–15 minute visual presentation structure with complete speaker notes.
* [**M2 Individual Defence Preparation Guide**](docs/presentation/Milestone_2_Individual_Defence_Preparation_Guide.md): Comprehensive oral defence model answers for all 10 indicative panel questions.

---

## 4. Architecture & Technical Implementation Summary

| Architectural Concern | Implementation / Design Choice | Governing Reference |
| :--- | :--- | :--- |
| **Macro-Architecture** | Layered Clean Monolith (`Domain` $\rightarrow$ `Application` $\rightarrow$ `Infrastructure` $\rightarrow$ `API`). | `PED v2.0 §3` |
| **Technology Stack** | TypeScript, Node.js, Express, PostgreSQL 16, Vitest, Docker Compose. | `ADR-008` (Weighted Matrix 9.05/10) |
| **Database Persistence** | Strict 3NF Relational Model with optimistic concurrency control (`version` counter). | `ADR-006`, `DOC-ARCH-DATA-001` |
| **Request Creation** | GoF Factory Method Pattern (`FAC_FAULT`, `IT_SUPPORT`, `SECURITY_HAZARD`). | `ADR-005` |
| **Event Notifications** | GoF Observer Pattern via in-memory `DomainEventDispatcher`. | `ADR-004` |
| **External Integration** | Asynchronous Transactional Outbox Pattern preventing dual-write inconsistency. | `ADR-007` |
| **POPIA Compliance** | DTO masking of citizen phone/email for operational staff; full view for admin. | `NFR-005`, `PED v2.0 §7` |
| **Automated Verification** | 16/16 Unit and Integration Tests passing with 100% core domain coverage. | `code/README.md` |

---

## 5. Repository Governance & Branch Strategy

In accordance with **SEN381 Master Project Brief §9**, **`ADR-002`**, and **`ADR-009`**:

* **Remote URL:** `https://github.com/SEN381-CivicConnect/CivicConnect.git`
* **Default Integration Branch:** `main` (Protected baseline — direct pushes blocked).
* **Branching Model:** Controlled Trunk-Based Development with feature branches (`feat/FR-xxx`, `fix/RSK-xxx`, `docs/...`).
* **Pull Request Policy (ADR-009):** Every PR entering `main` requires **100% independent peer approval from the non-author team partner** plus passing the automated CI quality gate (`.github/workflows/pr-governance-check.yml`). Author self-approvals are strictly blocked.
* **Registered Active Team:**
  * **Chris Fourie (`602826`):** Systems Architect, Lead Developer & Governance Lead
  * **Lisa Verson (`602006`):** Lead Requirements & Design Analyst

