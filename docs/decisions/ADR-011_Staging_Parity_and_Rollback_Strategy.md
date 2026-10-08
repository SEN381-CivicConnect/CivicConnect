# ADR-011: Simulated Staging Environment Parity, Secret Isolation & Rollback Strategy

**Status:** ACCEPTED  
**Date:** 2026-10-02  
**Deciders:** Systems Architect & Governance Lead (Chris Fourie), Lead Requirements & Quality Analyst (Lisa Verson)  
**Governing Standard:** SEN381 Milestone 3 Brief §14 (Staging / Test Deployment), DEC-005, ADR-008  
**Document Reference:** `DOC-ADR-011`  

---

## 1. Context & Problem Statement

Per **SEN381 Milestone 3 Brief §14**, student teams must demonstrate the release candidate in an environment separate from normal development, isolate secrets, inject release candidate identification, and establish a verifiable rollback procedure.

The brief explicitly clarifies:
> *"Real cloud staging is optional in M3. A credible simulated staging environment is fully acceptable. Using paid cloud services, multiple servers, containers or other advanced infrastructure does not automatically earn additional marks. Marks are awarded for engineering evidence, configuration control, understanding and interpretation."*

The team needs a standardized staging deployment architecture that runs locally or on cloud runners with zero financial cost, strict secret isolation, and verifiable disaster recovery protocols.

---

## 2. Decision Drivers & Constraints

* **Port & Network Isolation:** Staging must not conflict with active development processes running on port 3000 or PostgreSQL on port 5432.
* **Secrets Security (`NFR-004`):** Production and staging credentials must never be committed to the public Git repository.
* **Release Candidate Traceability:** The running container must visibly return the assessed release version (`APP_VERSION=v0.3.0-rc1`) and Git commit hash via synthetic health probes.
* **Disaster Recovery & Rollback (Area F):** The team must document and prove how a defective deployment can be safely downgraded without data corruption.

---

## 3. Evaluated Alternatives

### Alternative 1: Paid Cloud Kubernetes Cluster
Deploy staging on AWS EKS or Google Cloud GKE.
* *Pros:* True enterprise cloud replication.
* *Cons:* **Rejected.** Violates strict \$0.00/month project constraint (`NFR-010`); excessive administrative overhead for a 2-person team; explicitly stated in M3 Brief as earning no extra marks.

### Alternative 2: Manual Localhost Execution on Alternative Port
Run `PORT=5001 tsx src/server.ts` directly on the developer host workstation.
* *Pros:* Simple.
* *Cons:* **Rejected.** Lacks container parity; relies on developer host OS packages; does not test Docker image build steps or containerized Linux runtime boundaries.

### Alternative 3: Isolated Multi-Stage Docker Compose Simulated Staging (Selected)
Establish a simulated staging environment via `code/docker-compose.staging.yml`:
1. Multi-stage production container build (`code/Dockerfile`) matching production Alpine runtime.
2. Port isolation: Staging Web App binds to `5001:5001`; Staging PostgreSQL binds to `5433:5432`.
3. Secret isolation: Environment variables injected via `.env.staging` (strictly ignored by `.gitignore`).
4. Release metadata injection: Environment variables `APP_VERSION` and `GIT_COMMIT_SHA` surfaced in `/health/live`.
5. Rollback strategy: Documented code revert protocol combined with declarative SQL rollback script (`V1__rollback_initial_schema.sql`).

---

## 4. Decision Outcome

**Chosen Option:** **Alternative 3: Isolated Multi-Stage Docker Compose Simulated Staging.**

### Operational Rules & Specifications:
1. `code/docker-compose.staging.yml` orchestrates `civicconnect-staging-app` and `civicconnect-staging-db`.
2. Database volumes are strictly separated (`staging_pgdata` vs `postgres_data`).
3. Application rollback is achieved by checking out previous baseline commit `ffc17cb` and executing `docker compose up --build -d`.
4. Schema rollback is achieved by executing `code/database/migrations/V1__rollback_initial_schema.sql` via `psql`.

### Positive Consequences:
* **Zero Infrastructure Cost:** Runs entirely within Docker Desktop without incurring cloud platform fees.
* **Clear Port Boundaries:** Developer can run local dev server (`3000`) and staging candidate (`5001`) concurrently without port collisions.
* **High Assessor Auditability:** Assessor can query `curl http://localhost:5001/health/live` to immediately verify release candidate metadata.

---

## 5. Traceability
* **Implements:** `DOC-GUIDE-STAGE-001` (Staging & Rollback Guide)
* **Traces to:** `NFR-002` (Availability), `NFR-004` (Security), `NFR-010` (Zero Cost)
* **Linked Risks:** `RSK-008` (Resource Limits), `RSK-011` (Two-person workload)
