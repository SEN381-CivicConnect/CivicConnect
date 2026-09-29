# CivicConnect Application Codebase (v2.0)

[![Module: SEN381](https://img.shields.io/badge/Module-SEN381--NQF8-blue.svg)](https://www.belgiumcampus.ac.za/)
[![Milestone Gate](https://img.shields.io/badge/Milestone%202-Architecture%20Baseline%20Accepted-brightgreen.svg)](../docs/governance/Baseline_Sign_Off_Gate_M2.md)
[![Governance](https://img.shields.io/badge/GitHub%20Governance-Two--Reviewer%20Enforced-orange.svg)](../docs/decisions/ADR-002_GitHub_Governance_and_Two_Reviewer_Policy.md)
[![Stack](https://img.shields.io/badge/Stack-TypeScript%20%7C%20Node.js%20%7C%20PostgreSQL%2016-blue.svg)](../docs/decisions/ADR-008_Technology_Stack_Commitment.md)
[![Automated Tests](https://img.shields.io/badge/Tests-16%2F16%20Passing%20(Vitest)-brightgreen.svg)](#4-automated-testing--quality-verification)

This repository contains the practical application codebase, clean-architecture domain services, database persistence scripts, containerized infrastructure, and automated verification suites for **CivicConnect: Community Service Request Management Platform**.

---

## 1. Clean Layered Architecture Mapping

In accordance with **Milestone 2 Brief §5.3, §7** and **`ADR-008`**, the application is structured with strict inward dependency inversion:

```
code/
├── database/                                  # Data tier & persistence scripts
│   ├── migrations/                            # PostgreSQL 16 3NF DDL migration (V1__initial_schema.sql)
│   └── seeds/                                 # Baseline taxonomy & FSM transition rules (01_baseline_seeds.sql)
├── src/                                       # Clean Architecture Source Code
│   ├── domain/                                # Enterprise Domain Core (Independent of frameworks)
│   │   ├── entities/                          # ServiceRequest aggregate (enforcing FSM & OCC versioning)
│   │   ├── enums/                             # RequestStatus, Role, PriorityLevel, SLA targets
│   │   ├── events/                            # IDomainEvent, DomainEventDispatcher (Observer Pattern - ADR-004)
│   │   ├── factories/                         # IServiceRequestFactory & Category Creators (Factory Method - ADR-005)
│   │   └── repositories/                      # IServiceRequestRepository interface abstractions
│   ├── application/                           # Application Services & Business Use Cases
│   │   ├── dtos/                              # ServiceRequestDTOMapper (POPIA masking - NFR-005)
│   │   ├── observers/                         # NotificationDispatchObserver, AuditLoggingObserver (ADR-004)
│   │   └── use-cases/                         # CreateServiceRequest, AssignServiceRequest, UpdateServiceRequestStatus
│   ├── infrastructure/                        # External adapters & persistence implementations
│   │   ├── outbox/                            # TransactionalOutboxService (ADR-007)
│   │   └── repositories/                      # InMemoryServiceRequestRepository, PostgresServiceRequestRepository
│   ├── presentation/                          # HTTP controllers, Express routers, and middleware
│   │   ├── controllers/                       # RequestController (handling OCC HTTP 409 responses)
│   │   └── routes/                            # requestRoutes, healthRoutes (/health/live, /health/ready)
│   ├── app.ts                                 # Express application factory & centralized error handling
│   └── server.ts                              # Production bootstrap entry point
├── tests/                                     # Automated Verification Suites (Vitest)
│   ├── integration/                           # Supertest API tests (health probes, request CRUD, OCC conflict 409)
│   └── unit/                                  # Unit tests for FSM, Factories, Observer, POPIA DTO, and OCC
├── docker-compose.yml                         # PostgreSQL 16 Alpine container parity (DEC-005)
├── package.json                               # Dependencies & npm scripts
├── tsconfig.json                              # Strict TypeScript configuration
└── .env.example                               # Environment secrets template
```

---

## 2. Prerequisites & Quickstart Guide

### 2.1 Prerequisites
* [Node.js](https://nodejs.org/) (v20+ LTS recommended)
* [Docker Desktop](https://www.docker.com/) (v24.0+ for container parity)
* [Git](https://git-scm.com/)

### 2.2 Setup Instructions

1. **Install Node.js Dependencies:**
   ```bash
   cd c:/Chris/Studies/SEN/Project/code
   npm install
   ```

2. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```

3. **Start Containerized PostgreSQL Database:**
   ```bash
   docker compose up -d
   ```
   *Verify container status with `docker compose ps` — expected: `Up (healthy)`.*

4. **Compile TypeScript Code:**
   ```bash
   npm run build
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   *API will start on `http://localhost:3000`.*

---

## 3. Core REST API Endpoints (OpenAPI 3.0)

| Method | Endpoint | Description | Primary Quality Driver |
| :--- | :--- | :--- | :--- |
| `GET` | `/health/live` | Liveness health probe returning process memory and uptime. | `NFR-002` Availability |
| `GET` | `/health/ready` | Readiness probe confirming database connectivity. | `NFR-002` Availability |
| `POST` | `/api/v1/requests` | Citizen submits service request (validated via Factory Method `ADR-005`). | `FR-001`, `ADR-005` |
| `GET` | `/api/v1/requests` | Paginated, filtered queue collection (`status`, `departmentId`, `page`, `limit`). | `FR-006`, `FR-007` |
| `GET` | `/api/v1/requests/:id` | Full request details with POPIA citizen PII masking for technicians. | `FR-008`, `NFR-005` |
| `PATCH` | `/api/v1/requests/:id/assign` | Assigns ticket to technician; returns **HTTP 409 Conflict** on stale version. | `FR-009`, `ADR-006` |
| `PATCH` | `/api/v1/requests/:id/status` | Updates request status along validated FSM transition path. | `FR-010`, `DEC-004` |

---

## 4. Automated Testing & Quality Verification

CivicConnect enforces a continuous automated verification standard using **Vitest** and **Supertest**:

```bash
npm test
```

### Verified Test Suites (16/16 Tests Passing):
1. **`ServiceRequestFSM.test.ts` (4 tests):** Asserts valid FSM transitions (`SUBMITTED` $\to$ `TRIAGED` $\to$ `ASSIGNED` $\to$ `IN_PROGRESS` $\to$ `RESOLVED` $\to$ `CLOSED`), verifies that invalid jumps throw `InvalidStateTransitionError`, and enforces `FR-011` resolution notes.
2. **`OptimisticConcurrency.test.ts` (2 tests):** Verifies version counter increments and asserts that updating with a stale version throws `ConcurrencyConflictError` (`ADR-006`).
3. **`ServiceRequestFactory.test.ts` (4 tests):** Tests Factory Method pattern across `FAC_FAULT`, `IT_SUPPORT`, and `SECURITY_HAZARD`, validating category invariants and SLA defaults (`ADR-005`).
4. **`ObserverPattern.test.ts` (1 test):** Verifies that status transitions automatically notify registered `NotificationDispatchObserver` and `AuditLoggingObserver` via `DomainEventDispatcher` (`ADR-004`).
5. **`AnonymizationMask.test.ts` (2 tests):** Asserts POPIA citizen PII masking for operational `STAFF` while revealing details for `ADMIN` (`NFR-005`).
6. **`api.test.ts` (3 tests):** Integration tests for `/health/live`, ticket submission (`POST /api/v1/requests`), and HTTP 409 Conflict response on concurrent assignment (`ADR-006`).

---

## 5. Controlled Project Documentation Links

Master engineering documentation is tracked in the parent project repository:
* [Project Engineering Document (PED v2.0)](../docs/PED/PED_v2.0_Architecture_and_Design_Baseline.md)
* [Requirements Traceability Matrix (RTM v2.0)](../docs/requirements/Requirements_Traceability_Matrix_RTM_v2.0.md)
* [Engineering Decision Log (v2.0)](../docs/decisions/Engineering_Decision_Log.md)
* [Project Risk Register (v2.0)](../docs/risk/Project_Risk_Register_v2.0.md)
* [Milestone 2 Baseline Sign-Off Gate](../docs/governance/Baseline_Sign_Off_Gate_M2.md)