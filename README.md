# CivicConnect: Community Service Request Management Platform

[![SEN381](https://img.shields.io/badge/Module-SEN381--NQF8-blue.svg)](https://www.belgiumcampus.ac.za/)
[![Milestone Gate](https://img.shields.io/badge/Milestone%201-Baseline%20Accepted-brightgreen.svg)](docs/governance/Baseline_Sign_Off_Gate_M1.md)
[![Governance](https://img.shields.io/badge/GitHub%20Governance-Two--Reviewer%20Enforced-orange.svg)](docs/decisions/ADR-002_GitHub_Governance_and_Two_Reviewer_Policy.md)
[![Academic Year](https://img.shields.io/badge/Academic%20Year-2026-lightgrey.svg)](#)

---

## 1. Project Overview & Context

**CivicConnect** is a centralized, traceable, and secure digital platform engineered to replace fragmented, informal service request channels (WhatsApp, phone calls, ad-hoc emails, disconnected spreadsheets, and paper records) within community-focused and municipal campus environments.

By establishing strict role-based access control, unambiguous request lifecycle state machines, real-time auditability, and automated stakeholder feedback, CivicConnect eliminates lost requests, misassigned work orders, and unaccountable status changes while providing management with reliable operational intelligence.

---

## 2. Directory Layout & Organization

The project workspace separates the **controlled engineering documentation record** (root and `docs/`) from the **practical application codebase** (`code/`):

```
c:/Chris/Studies/SEN/Project/
├── README.md                                          # Master repository overview and navigation
├── CONTRIBUTING.md                                    # Contribution workflow, branching model, and 2-reviewer rule
├── SEN381 Master Project Brief.pdf                     # Institutional master project brief (governing document)
├── SEN381 Project Milestone 1.pdf                     # Milestone 1 specific brief
│
├── docs/                                              # Controlled Milestone 1 Engineering Baseline Documents
│   ├── PED/                                           # Project Engineering Document (PED v1.0 -> v4.0)
│   │   └── PED_v1.0_Engineering_Baseline.md           # Master Project Engineering Document v1.0 (Core Output)
│   ├── requirements/                                  # RTM, Stakeholder Analysis, Scope Baseline
│   │   ├── Requirements_Traceability_Matrix_RTM_v1.0.md
│   │   ├── Stakeholder_Analysis_Matrix.md
│   │   └── Scope_Baseline_Statement.md
│   ├── decisions/                                     # Engineering Decision Log & ADRs
│   │   ├── Engineering_Decision_Log.md
│   │   ├── ADR-001_Scope_and_Lifecycle_Boundary.md
│   │   ├── ADR-002_GitHub_Governance_and_Two_Reviewer_Policy.md
│   │   └── ADR-003_Justified_Deferment_of_Tech_Stack.md
│   ├── risk/                                          # Project Risk Register & Risk Treatment Plans
│   │   └── Project_Risk_Register_v1.0.md
│   ├── forward_engineering/                           # Forward Engineering Considerations Register
│   │   └── Forward_Engineering_Considerations_Register.md
│   ├── governance/                                    # Team Agreement, AI Register, Baseline Sign-off
│   │   ├── Team_Working_Agreement.md
│   │   ├── AI_Usage_Register_v1.0.md
│   │   └── Baseline_Sign_Off_Gate_M1.md
│   └── presentation/                                  # Slide Deck Scripts & Individual Defence Guides
│       ├── Milestone_1_Presentation_Deck_and_Script.md
│       └── Milestone_1_Individual_Defence_Preparation_Guide.md
│
├── code/                                              # Practical Application Codebase (Cloned Official Repo)
│   ├── .git/                                          # Git repository tracking (Development, Testing, Staging, Production)
│   ├── .github/                                       # Pull request templates & PR governance workflows
│   ├── .gitignore                                     # Multi-stack gitignore
│   ├── CONTRIBUTING.md                                # Codebase branching and 2-reviewer PR rules
│   └── README.md                                      # Codebase entry point
│
└── Assignments/                                       # Pre-project Assignment 1 Research Foundations
```

---

## 3. Controlled Engineering Baseline (Milestone 1)

| Category | Artefact Document | Description & Primary SE Purpose |
| :--- | :--- | :--- |
| **Primary Output** | [**PED v1.0 — Engineering Baseline**](docs/PED/PED_v1.0_Engineering_Baseline.md) | Single evolving Project Engineering Document integrating problem analysis, stakeholders, scope, FRs/NFRs, constraints, and baseline sign-off. |
| **Requirements** | [**Requirements Traceability Matrix (RTM)**](docs/requirements/Requirements_Traceability_Matrix_RTM_v1.0.md) | End-to-end forward/backward traceability from Stakeholder Need $\rightarrow$ FR/NFR $\rightarrow$ AC $\rightarrow$ Architecture $\rightarrow$ PR $\rightarrow$ Code $\rightarrow$ Test. |
| **Requirements** | [**Stakeholder Analysis Matrix**](docs/requirements/Stakeholder_Analysis_Matrix.md) | Multi-stakeholder interest/power analysis, personas, and resolution of inherent conflict surfaces. |
| **Requirements** | [**Scope Baseline Statement**](docs/requirements/Scope_Baseline_Statement.md) | Explicit In-Scope, Out-of-Scope, and Deferred Scope definitions with justified boundary defenses. |
| **Risk Management** | [**Project Risk Register v1.0**](docs/risk/Project_Risk_Register_v1.0.md) | Active risk log with probability, impact, exposure, proactive mitigations, reactive contingencies, and owner assignment. |
| **Decisions & ADRs** | [**Engineering Decision Log**](docs/decisions/Engineering_Decision_Log.md) | Master log of all formal engineering decisions and deliberate, evidence-backed deferments. |
| **Decisions & ADRs** | [**ADR-001: Scope Boundary Control**](docs/decisions/ADR-001_Scope_and_Lifecycle_Boundary.md) | Architectural decision record defining baseline boundaries and anti-scope creep controls. |
| **Decisions & ADRs** | [**ADR-002: GitHub Governance Policy**](docs/decisions/ADR-002_GitHub_Governance_and_Two_Reviewer_Policy.md) | Decision record mandating protected main, branch conventions, and 2-reviewer peer review. |
| **Decisions & ADRs** | [**ADR-003: Justified Tech Stack Deferment**](docs/decisions/ADR-003_Justified_Deferment_of_Tech_Stack.md) | Formal justification deferring final tech-stack selection to Milestone 2 pending architectural trade-off evaluation. |
| **Forward Thinking** | [**Forward Engineering Considerations**](docs/forward_engineering/Forward_Engineering_Considerations_Register.md) | Deep-dive analysis of 6 future lifecycle concerns (Security, Testability, Persistence, Observability, Environments, Cost). |
| **Governance** | [**Team Working Agreement**](docs/governance/Team_Working_Agreement.md) | Team norms, communication protocols, Definition of Ready/Done, and conflict resolution mechanisms. |
| **Governance** | [**AI Usage Register v1.0**](docs/governance/AI_Usage_Register_v1.0.md) | Auditable register recording AI tool contributions, human-in-the-loop verification, and rejections. |
| **Governance** | [**Milestone 1 Baseline Sign-Off**](docs/governance/Baseline_Sign_Off_Gate_M1.md) | Formal engineering gate decision conforming to Master Project Brief Appendix D. |
| **Presentation & Defence** | [**M1 Presentation Deck & Script**](docs/presentation/Milestone_1_Presentation_Deck_and_Script.md) | 12–15 minute visual presentation structure with complete speaker notes and visual layouts. |
| **Presentation & Defence** | [**M1 Individual Defence Preparation**](docs/presentation/Milestone_1_Individual_Defence_Preparation_Guide.md) | Comprehensive engineering defence guide with full model answers for all 12 indicative questions. |

---

## 4. Official Remote Repository

* **Remote URL:** `https://github.com/SEN381-CivicConnect/CivicConnect.git`
* **Local Practical Directory:** `c:/Chris/Studies/SEN/Project/code/`
* **Branch Strategy:** `Production`, `Staging`, `Testing`, `Development`, plus `feat/FR-xxx` branches.
