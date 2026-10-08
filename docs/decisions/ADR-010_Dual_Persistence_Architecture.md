# ADR-010: Dual Persistence Architecture (In-Memory Harness for CI & PostgreSQL 16 for Staging)

**Status:** ACCEPTED  
**Date:** 2026-10-02  
**Deciders:** Systems Architect & Governance Lead (Chris Fourie), Lead Requirements & Quality Analyst (Lisa Verson)  
**Governing Standard:** SEN381 Milestone 3 Brief §7 (Area A: Baseline Conformance), §9 (Area C: CI Gates), ADR-006, ADR-008  
**Document Reference:** `DOC-ADR-010`  

---

## 1. Context & Problem Statement

In Milestone 2, Group E committed to PostgreSQL 16 as the persistent relational database (`ADR-006`, `ADR-008`). During initial Milestone 3 construction and CI pipeline automation, the team faced an engineering trade-off:
1. Running a live PostgreSQL container inside GitHub Actions CI runners adds ~45–60 seconds of container spin-up and healthcheck latency per pull request, risking GitHub Actions free-tier minute exhaustion.
2. Conversely, relying solely on an in-memory repository mock fails to demonstrate runtime persistence engineering, real SQL queries, connection pooling, and live healthchecks mandated by **Milestone 3 Brief §7 (Area A)**.

The team must establish an architectural mechanism that guarantees blazing-fast local and CI test execution while providing an authentic PostgreSQL repository adapter for staging and release evaluation.

---

## 2. Decision Drivers & Constraints

* **Speed of Feedback (`NFR-008`):** The automated CI verification suite must execute in $< 5$ seconds to facilitate rapid student peer review cycles under `ADR-009`.
* **Clean Architecture Compliance:** Preserving the Dependency Inversion Principle where domain entities and use cases depend solely on the `IServiceRequestRepository` abstraction, not concrete database drivers.
* **Assessment Robustness (Area A):** The team must demonstrate real SQL DDL migrations, strict 3NF schema, parameterized queries, and optimistic concurrency version validation against PostgreSQL 16.
* **Zero Cost Hosting (`NFR-010`):** Avoid paying for always-on external cloud database instances for CI test runs.

---

## 3. Evaluated Alternatives

### Alternative 1: Mandatory PostgreSQL Container in All Environments
Force all unit tests, integration tests, and CI runs to connect to a live PostgreSQL 16 instance.
* *Pros:* 100% database engine fidelity across all test tiers.
* *Cons:* **Rejected.** High test execution latency (~1 minute spin-up); breaks offline development for team members without Docker Desktop running; fragile CI failure modes due to network port binding delays.

### Alternative 2: Discard PostgreSQL and Use SQLite
Replace PostgreSQL with file-based SQLite.
* *Pros:* Simple local file persistence without Docker.
* *Cons:* **Rejected.** Incompatible with production concurrency; lacks PostgreSQL-specific concurrency semantics, procedural functions, and strict 3NF typing baselined in `DOC-ARCH-DATA-001`.

### Alternative 3: Dual Persistence Strategy via Dependency Inversion (Selected)
Implement two interchangeable repository adapters conforming to `IServiceRequestRepository`:
1. `InMemoryServiceRequestRepository.ts`: High-performance in-memory harness used by default in unit, integration, and CI test suites (executes 41 tests in 1.3s).
2. `PostgresServiceRequestRepository.ts`: Production-ready PostgreSQL 16 repository utilizing `pg.Pool`, parameterized SQL queries, active `SELECT 1;` health probes, and optimistic concurrency `WHERE version = $4` validation.
3. Switchable at runtime via the `USE_POSTGRES=true/false` environment flag in `server.ts`.

---

## 4. Decision Outcome

**Chosen Option:** **Alternative 3: Dual Persistence Strategy via Dependency Inversion.**

### Architectural Implementation:
* Domain boundary: `src/domain/repositories/IServiceRequestRepository.ts` remains pristine.
* In-Memory Adapter: `src/infrastructure/repositories/InMemoryServiceRequestRepository.ts`.
* PostgreSQL Adapter: `src/infrastructure/repositories/PostgresServiceRequestRepository.ts`.
* Runtime Selection: `src/server.ts` checks `process.env.USE_POSTGRES === 'true'`.
* Healthcheck integration: `GET /health/ready` actively probes `pool.query('SELECT 1;')` when PostgreSQL is active.

### Positive Consequences:
* **Instant CI Execution:** GitHub Actions verification runs and passes in $< 15$ seconds without external container dependencies.
* **Staging Fidelity:** Docker Compose staging environment executes against real PostgreSQL 16 container with strict schema seeds.
* **Demonstrable Conformance:** Assessor can inspect real SQL DDL and repository logic without forcing brittle CI configurations.

### Negative Consequences & Accepted Risks:
* **In-Memory Concurrency Divergence (`DEBT-001`):** In-memory Map concurrency checks simulate OCC logic programmatically but do not test PostgreSQL transaction isolation level nuances (e.g. `READ COMMITTED` vs `REPEATABLE READ`). Mitigated by declarative schema constraints and Docker staging tests.

---

## 5. Traceability
* **Implements:** `DOC-ARCH-DATA-001` (PostgreSQL Persistence Specification)
* **Traces to:** `NFR-001` (Latency), `NFR-002` (Availability), `NFR-008` (Modularity)
* **Linked Risks:** `RSK-002` (Concurrency), `RSK-008` (Cost & Resource Limits)
* **Linked Tech Debt:** `DEBT-001`
