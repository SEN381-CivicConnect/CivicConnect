# CivicConnect: AI Usage Register (v4.0 Final)
## Auditable Register of Artificial Intelligence Contributions & Human-in-the-Loop Verification

**Document Reference:** `DOC-GOV-004`  
**Milestone:** Milestone 4 / Final Project — Finalise, Consolidate & Conclude  
**Baseline Version:** 4.0 Final (Project Closure State)  
**Governing Standard:** SEN381 Master Project Brief §10 & §10.1; SEN381 Final Project Brief §3 & §7  
**Owner:** Chris Fourie (Student ID: `602826`, Systems Architect & Lead Developer)  

---

## 1. Responsible AI Policy & Academic Integrity Standard

In strict accordance with **SEN381 Master Project Brief §10**, Artificial Intelligence is utilized exclusively as an engineering assistant. AI output is never treated as authoritative evidence and transfers zero accountability away from the student.

Every AI contribution across Milestones 1 to 4 was subjected to the mandatory 5-stage verification pipeline:
$$\text{Prompt Specification} \longrightarrow \text{AI Generation} \longrightarrow \text{Domain Cross-Verification} \longrightarrow \text{Critical Correction / Rejection} \longrightarrow \text{Logged Baseline Commitment}$$

---

## 2. Master AI Usage Register Table (Complete Lifecycle M1–M4)

| Date | Student | AI Tool & Model | Engineering Task / Prompt Focus | AI Generated Contribution | Verification & Critical Critique Method Applied | Engineering Decision & Action Taken | Critical Corrections & Hallucinations Rectified |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **2026-09-02** | Lisa Verson | Claude 3.5 Sonnet | Initial drafting of CivicConnect stakeholder personas and needs. | Generated 8 candidate stakeholder user stories and expectations. | Evaluated against Master Project Brief §2 & §3. Checked relevance to municipal fault workflows. | **Modified** | AI included "Commercial Contractor Invoicing" which violates M1 scope. Redacted commercial features; prioritized community requester needs. |
| **2026-09-02** | Pandora Greyling | Gemini 3.7 Flash | Scaffolding initial draft of Non-Functional Requirements metrics. | Suggested latency, availability, and recovery time objectives for cloud apps. | Cross-referenced against ISO/IEC 25010 and free-tier cloud hosting limitations (Render/Neon). | **Modified** | AI suggested "99.999% high availability with multi-region failover", which is impossible on a $0 free tier. Adjusted metric to $\ge 99.0\%$ during core hours (`NFR-002`). |
| **2026-09-03** | Chris Fourie | GitHub Copilot | Generating Gherkin acceptance criteria syntax for `FR-001` and `FR-010`. | Generated initial `Given-When-Then` test scenarios for request submission and state transitions. | Reviewed against domain state machine rules. Verified status transition constraints. | **Accepted with edits** | AI allowed an invalid transition from `SUBMITTED` directly to `RESOLVED` without triage or technician assignment. Added explicit failure scenario blocking invalid state jumps. |
| **2026-09-15** | Lisa Verson | Claude 3.5 Sonnet | Researching architectural patterns for lifecycle notification decoupling. | Recommended deploying an Apache Kafka or RabbitMQ distributed message cluster. | Evaluated against `NFR-010` ($0.00 cloud hosting cap) and 512MB RAM free-tier limits. | **REJECTED (Critical Oversight)** | Kafka/RabbitMQ require 1GB+ RAM, causing immediate OOM kills on free-tier containers. Rejected distributed brokers; adopted in-memory **Observer Pattern (`ADR-004`)** + Transactional Outbox. |
| **2026-09-17** | Pandora Greyling | ChatGPT (GPT-4o) | Evaluating concurrency control mechanisms for ticket assignment. | Proposed using database pessimistic row-level locking (`SELECT ... FOR UPDATE`). | Analyzed against `NFR-001` latency targets and Kleppmann (2017) concurrency models. | **REJECTED (Critical Oversight)** | Pessimistic locking creates connection pool starvation and deadlock risk when multiple technicians browse queues. Pivoted to **Optimistic Concurrency Control (`ADR-006`)** using integer `version` column. |
| **2026-09-20** | Chris Fourie | Antigravity AI | Formulating Technology Stack Weighted Decision Matrix (`ADR-008`). | Recommended microservices deployment across AWS Lambda, API Gateway, and DynamoDB. | Evaluated against 3-person team velocity, 7-week schedule, and local Docker Compose parity (`DEC-005`). | **REJECTED (Critical Oversight)** | Cloud-only serverless architecture prevents complete offline local container replication. Selected single-language TypeScript/Node.js/PostgreSQL Clean Monolith. |
| **2026-09-28** | Chris Fourie | GitHub Copilot | Generating initial DDL schema migration script for PostgreSQL 16. | Generated draft SQL table creation statements. | Verified against 3NF normalization rules and Master Project Brief Section 3 requirements. | **Refined & Enhanced** | AI omitted table comments, foreign key `ON DELETE RESTRICT` guards, and explicit enum check constraints. Manually added `chk_role_code`, `chk_priority_code`, and UUID keys. |
| **2026-10-01** | Chris Fourie | Antigravity AI | Configuring Vitest coverage threshold configuration in `vitest.config.ts`. | Suggested blanket 80% coverage on all project files including staging infrastructure adapters. | Analyzed against M3 Manageability Rule and test execution profiling. | **Modified** | Including PostgreSQL network error handling branches dropped overall coverage to 69.7%. Refined configuration (Commit `c6bcd66`) to isolate adapter while enforcing $\ge 80\%$ on application/domain core (93.60% achieved). |
| **2026-10-02** | Chris Fourie | GitHub Copilot | Scaffolding Black-Box Equivalence Partitioning & Boundary Value Analysis tests. | Generated 35 arbitrary boundary test cases for string inputs. | Cross-referenced against `FR-001`, `FR-002`, and boundary definitions in lecture notes. | **Pruned to 10 meaningful cases** | AI padded tests with redundant string length checks (e.g. testing length 10, 11, 12). Condensed into exact 2-value boundary tests (length 2 vs 3, length 100 vs 101, valid vs invalid phone formats). |
| **2026-10-03** | Chris Fourie | Antigravity AI | Generating Docker Compose staging configuration (`docker-compose.staging.yml`). | Generated standard single-container compose mapping PostgreSQL to host port 5432. | Analyzed against local development environment conflicts and security standards. | **Corrected & Hardened** | Port 5432 would collide with pre-existing local PostgreSQL services. Re-mapped staging database to port 5433, added healthcheck dependency, and enforced non-root `USER node` in Dockerfile. |
| **2026-10-07** | Chris Fourie | Antigravity AI | Formulating SCM governance response to total team attrition (Lisa Verson withdrawal). | Suggested bypassing branch protections and committing changes directly to `main`. | Evaluated against Master Project Brief §9 (Direct development on main strictly prohibited). | **REJECTED (Critical Oversight)** | Bypassing PRs destroys SCM accountability. Ratified **`ADR-012`**, retaining branch protection on `main` and authorizing PR merges via automated multi-gate CI checks + single-engineer self-audit checklist. |

---

## 3. Student Academic Integrity Attestation & Accountability Sign-Off

I hereby formally attest that:
1. No unverified, fabricated, or uninspected AI output has entered the CivicConnect codebase or engineering record.
2. Every AI proposal was rigorously critiqued against NQF Level 8 software engineering principles, evaluated for security/architectural trade-offs, and modified or rejected where it violated quality standards.
3. As the sole active systems architect and lead developer under `ADR-012`, I assume 100% personal engineering responsibility for all committed code, test implementations, and baseline documentation.

* **Chris Fourie (Systems Architect & Lead Developer — Student ID: `602826`):** *Signed electronically — 18 October 2026*
