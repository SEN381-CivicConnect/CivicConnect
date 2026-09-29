# ADR-008: Technology Stack Commitment (Resolution of ADR-003 via Weighted Decision Matrix)

**Status:** ACCEPTED (Resolves ADR-003)  
**Date:** 2026-09-20  
**Deciders:** Systems Architect & Governance Lead (Chris Fourie), Quality Engineer & Risk Manager (Pandora Greyling), Lead Requirements & Design Analyst (Lisa Verson)  
**Governing Standard:** SEN381 Master Project Brief §4, §18.1; Milestone 2 Brief §5.5; `ADR-003`  
**Document Reference:** `DOC-ADR-008`  

---

## 1. Context & Problem Statement

In Milestone 1, Group E formally established `ADR-003` (*Justified Deferment of Technology Stack Selection to Milestone 2*), preserving technology-neutral domain models and requirements until complete architectural drivers, quality attributes, and cost constraints were established.

With the baselining of 14 Functional Requirements (`FR-001`–`FR-014`), 10 Non-Functional Requirements (`NFR-001`–`NFR-010`), strict \$0.00/month hosting constraints, and the completion of Assignment 2 research, the team must now commit to a concrete, defensible technology stack to begin controlled software construction.

---

## 2. Decision Drivers & Empirical Constraints

In strict accordance with **Master Project Brief §18.1**, technology selection is an assessed engineering decision, not a personal preference exercise. The selection must satisfy:
1. **Cost & Quota Sustainability (`NFR-010`):** The application runtime and database must operate continuously on free-tier cloud platforms (e.g. Render, Vercel, Neon, Supabase) with strictly \$0.00 operational cost. Container memory cap is **512 MB RAM**.
2. **Performance Latency (`NFR-001`):** p95 response time $\le 500\text{ms}$ under concurrent load with minimal cold-start penalty.
3. **Team Delivery Velocity & Capacity (Schedule Constraint):** A 3-person team operating within a 7-week semester; minimizing cognitive overhead by sharing language types between frontend and backend.
4. **Environment Parity (`DEC-005`, `FEC-004`):** Complete local containerized replication using Docker Compose matching production Linux runtimes.
5. **Architectural Fit & Modularity (`NFR-008`):** Native support for Clean/Layered Architecture, Dependency Injection, strong typing, and automated unit testing ($\ge 80\%$ branch coverage gate).

---

## 3. Evaluated Candidate Stacks

* **Candidate Stack A (TypeScript Full-Stack):**
  * *Frontend:* React 18 + Tailwind CSS + Vite (accessible UI conforming to WCAG 2.1 AA).
  * *Backend / API:* Node.js (v20+ LTS) + TypeScript + Express / NestJS modular service structure.
  * *Persistence / ORM:* PostgreSQL 16 (Strict 3NF) + pg-promise / Prisma client with optimistic concurrency.
  * *Testing / CI:* Vitest / Jest + Supertest + GitHub Actions.
* **Candidate Stack B (.NET Enterprise Stack):**
  * *Frontend:* React 18 / Blazor WebAssembly.
  * *Backend / API:* C# / ASP.NET Core 8 Web API + Entity Framework Core.
  * *Persistence:* PostgreSQL 16 / Azure SQL (Free Tier).
  * *Testing / CI:* xUnit + Moq + GitHub Actions.
* **Candidate Stack C (Python Microservices Stack):**
  * *Frontend:* React 18.
  * *Backend / API:* Python 3.11+ + FastAPI + Pydantic + SQLAlchemy.
  * *Persistence:* PostgreSQL 16.
  * *Testing / CI:* PyTest + HTTPX + GitHub Actions.

---

## 4. Empirical Weighted Decision Matrix

| Evaluation Criterion | Weight (%) | Candidate A: TypeScript / Node.js | Candidate B: C# / ASP.NET Core 8 | Candidate C: Python / FastAPI | Scoring Justification & Evidence |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Free-Tier Quota & Memory Footprint (`NFR-010`)** | **20%** | **9.0 / 10** (1.80) | **6.0 / 10** (1.20) | **7.5 / 10** (1.50) | Node.js lightweight runtime idles at ~45MB RAM (peak <180MB under load), easily surviving Render/Fly.io 512MB RAM caps. .NET Core base image idles at ~240MB–350MB, risking OOM kills during concurrent bursts. Python idles at ~110MB. |
| **Architecture & NFR Fit (`NFR-001`, `NFR-008`)** | **25%** | **9.0 / 10** (2.25) | **9.5 / 10** (2.38) | **8.0 / 10** (2.00) | ASP.NET Core has industry-standard built-in DI and compile-time type safety. TypeScript provides strong static typing, structural interfaces, and seamless Clean Architecture layering matching .NET's modularity. |
| **Team Capability & Velocity (3-Person Team)** | **20%** | **9.5 / 10** (1.90) | **7.0 / 10** (1.40) | **7.5 / 10** (1.50) | Single language (TypeScript) across frontend DTOs and backend domain entities eliminates context-switching. All 3 students possess verified proficiency in modern JavaScript/TypeScript and React. |
| **Automated Testing & CI Tooling (`NFR-008`)** | **15%** | **9.0 / 10** (1.35) | **9.0 / 10** (1.35) | **8.5 / 10** (1.28) | Vitest and Jest execute within milliseconds in GitHub Actions runners; native mocking and Supertest integration enable rapid local TDD loops. |
| **Docker Parity & Build Efficiency (`DEC-005`)** | **10%** | **9.0 / 10** (0.90) | **7.5 / 10** (0.75) | **8.0 / 10** (0.80) | Alpine-based Node.js images build in seconds and weigh <120MB; .NET multi-stage builds require larger SDK base layers. |
| **Ecosystem & Security Maintenance (`NFR-004`)** | **10%** | **8.5 / 10** (0.85) | **9.0 / 10** (0.90) | **8.5 / 10** (0.85) | NPM audit, Dependabot, and mature JWT/BCrypt libraries provide robust OWASP Top 10 defenses. |
| **TOTAL WEIGHTED SCORE** | **100%** | **9.05 / 10 (WINNER)** | **7.98 / 10** | **7.93 / 10** | **Candidate Stack A decisively wins by +1.07 points.** |

---

## 5. Decision Outcome

**Chosen Option:** **Candidate Stack A (TypeScript / Node.js / Express / React / PostgreSQL 16).**

### Specific Technology & Version Commitments
1. **Language & Runtime:** TypeScript v5.3+ on Node.js v20 LTS (Active Long-Term Support).
2. **Backend Architecture:** Express.js configured with strict layered Clean Architecture (Domain $\to$ Application $\to$ Infrastructure $\to$ Presentation).
3. **Database & Persistence:** PostgreSQL 16 (Alpine container in Docker; Neon / Supabase for cloud staging).
4. **Frontend Client:** React 18 + Vite + Tailwind CSS (WCAG 2.1 AA compliant color tokens and semantic elements).
5. **Testing Framework:** Vitest / Jest + Supertest (enforcing $\ge 80\%$ coverage threshold).
6. **Containerization:** Docker Desktop 24+ and Docker Compose v3.8.

### Positive Consequences
* **Single Language Synergy:** DTO interfaces (e.g. `CreateServiceRequestDTO`, `ServiceRequestResponseDTO`) are shared seamlessly between frontend and backend, eliminating serialization mismatches and contract drift.
* **Guaranteed \$0.00 Hosting:** Memory consumption stays well beneath cloud free-tier 512MB limits, avoiding cold-start latency crashes.
* **Rapid CI Feedback:** Vitest test suites execute in $<3$ seconds in GitHub Actions, accelerating the mandatory two-reviewer PR review cycle.

### Negative Consequences & Accepted Risks
* **Runtime Async Error Management:** Node.js asynchronous promises require rigorous central exception middleware to prevent unhandled promise rejections from crashing the process (`RSK-007`). Mitigated by custom global error middleware.

---

## 6. Traceability & Downstream Impact
* **Resolves:** `ADR-003` (Deliberate Deferment of Technology Stack).
* **Directly Implements:** `DOC-ARCH-DATA-001` (PostgreSQL 16 persistence), `DEC-005` (Docker Compose parity).
* **Traced NFRs:** `NFR-001` (Latency), `NFR-008` (Modularity), `NFR-010` (Zero Cost).
