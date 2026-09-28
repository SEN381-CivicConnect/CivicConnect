# CivicConnect Application Codebase

[![Module: SEN381](https://img.shields.io/badge/Module-SEN381--NQF8-blue.svg)](https://www.belgiumcampus.ac.za/)
[![Governance](https://img.shields.io/badge/GitHub%20Governance-Two--Reviewer%20Enforced-orange.svg)](../docs/decisions/ADR-002_GitHub_Governance_and_Two_Reviewer_Policy.md)
[![Environment Parity](https://img.shields.io/badge/Environment-Docker%20Compose-brightgreen.svg)](docker-compose.yml)
[![Academic Year](https://img.shields.io/badge/Academic%20Year-2026-lightgrey.svg)](#)

This repository contains the practical application codebase, database persistence scripts, containerized infrastructure, and automated verification suites for **CivicConnect: Community Service Request Management Platform**.

---

## 1. Architecture & Environment Strategy

In accordance with **SEN381 Master Project Brief §4, §17** and **`DEC-005`**:
* **Environment Parity (`FEC-004`):** Local development directly mirrors cloud staging using Docker Compose.
* **Database Engine:** PostgreSQL 16 (Strict 3NF Enterprise Relational Model).
* **Security & POPIA:** Strict role-based authorization, immutable audit logging, and PII anonymization.

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 1. DEVELOPMENT  │ ────► │ 2. AUTOMATED CI │ ────► │ 3. STAGING (PaaS│ ────► │ 4. PRODUCTION / │
│ Local Workstation│       │ GitHub Actions  │       │ Render/Vercel)  │       │ DEMONSTRATION   │
│ Docker Parity   │       │ Lint, Unit Tests│       │ Staging DB Neon │       │ Live System     │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 2. Local Engineering Environment Setup

### 2.1 Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v24.0+ recommended)
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (LTS v20+)

### 2.2 Quickstart Instructions

1. **Clone & Navigate:**
   ```bash
   cd c:/Chris/Studies/SEN/Project/code
   ```

2. **Configure Environment Secrets:**
   Copy the documented template to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Review the values in `.env` — defaults work out-of-the-box for local development).*

3. **Start Containerized Infrastructure:**
   Spin up the local PostgreSQL database and pgAdmin service:
   ```bash
   docker compose up -d
   ```

4. **Verify Health Status:**
   Confirm the PostgreSQL container is healthy:
   ```bash
   docker compose ps
   ```
   Expected status: `Up (healthy)`.

5. **Access Database Management UI (Optional):**
   * **URL:** `http://localhost:5050`
   * **Login Email:** `admin@civicconnect.local` (from `.env`)
   * **Login Password:** `admin_dev_pass_2026` (from `.env`)

6. **Shutting Down:**
   ```bash
   docker compose down
   # To wipe persistent local test data:
   docker compose down -v
   ```

---

## 3. Directory Layout

```
code/
├── database/                              # Data tier & persistence scripts
│   ├── init/                              # Docker entrypoint initialization scripts
│   ├── migrations/                        # Versioned DDL migration scripts (V1, V2, ...)
│   └── seeds/                             # Baseline taxonomy & FSM transition seeds
├── docker-compose.yml                     # Local containerized infrastructure (PostgreSQL 16)
├── .env.example                           # Environment configuration template
└── README.md                              # Application onboarding and local setup guide
```

---

## 4. Branching Strategy & Contribution Governance

In strict compliance with **Master Project Brief §9** and **`ADR-002`**:

```
main (PROTECTED - Controlled Engineering Baseline)
 │
 ├── feat/infra-docker-setup
 ├── feat/FR-xxx-<feature-name>
 └── fix/RSK-xxx-<risk-remediation>
```

1. **Zero Direct Commits:** Direct pushes to `main` are strictly prohibited by repository protection rules.
2. **Two-Reviewer Rule:** Every Pull Request into `main` requires formal approval from **at least TWO team members** other than the author. Self-approval is strictly blocked.
3. **Traceability:** Every PR must reference a requirement (`FR-xxx` / `NFR-xxx`) or risk ID (`RSK-xxx`).
4. **Responsible AI:** Any AI-assisted code must be verified and logged in [`docs/governance/AI_Usage_Register_v1.0.md`](../docs/governance/AI_Usage_Register_v1.0.md).

For full contribution conventions, see the root repository [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## 5. Controlled Project Documentation

Master engineering documentation is tracked in the parent project repository:
* [Project Engineering Document (PED v1.0)](../docs/PED/PED_v1.0_Engineering_Baseline.md)
* [Database Architecture & Persistence Plan](../docs/architecture/Database_Architecture_and_Persistence_Plan_v1.0.md)
* [Requirements Traceability Matrix (RTM v1.0)](../docs/requirements/Requirements_Traceability_Matrix_RTM_v1.0.md)
* [Engineering Decision Log & ADRs](../docs/decisions/Engineering_Decision_Log.md)
* [Milestone 2 Architecture & Engineering Plan](../docs/planning/Milestone_2_Architecture_and_Engineering_Plan.md)