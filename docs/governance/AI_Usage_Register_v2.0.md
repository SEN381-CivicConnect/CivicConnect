# CivicConnect: AI Usage Register (v2.0)
## Auditable Register of Artificial Intelligence Contributions & Human Verification

**Document Reference:** `DOC-GOV-002`  
**Milestone:** Milestone 2 — Architecture, Technology & Initial Design Baseline  
**Baseline Version:** 2.0 (Controlled Architecture Baseline)  
**Governing Standard:** SEN381 Master Project Brief §10 & §10.1; Milestone 2 Brief §12  

---

## 1. Responsible AI Policy & Human-in-the-Loop Protocol

In accordance with **SEN381 Master Project Brief §10**, Artificial Intelligence is utilized strictly as an assistive research and drafting aid. AI output is never treated as authoritative engineering evidence and transfers zero accountability away from the engineering team.

Every AI contribution undergoes a mandatory 5-stage human verification pipeline:

$$\text{Prompt Specification} \longrightarrow \text{AI Generation} \longrightarrow \text{Domain Cross-Verification} \longrightarrow \text{Critical Correction / Rejection} \longrightarrow \text{Logged Baseline Commitment}$$

---

## 2. Master AI Usage Register Table (v2.0)

| Date | Team Member | AI Tool & Model | Engineering Task / Prompt Focus | AI Generated Contribution | Verification & Critical Critique Method Applied | Engineering Decision & Action Taken | Critical Corrections & Hallucinations Rectified |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **2026-09-02** | Lisa Verson | Claude 3.5 Sonnet | Initial drafting of CivicConnect stakeholder personas and needs. | Generated 8 candidate stakeholder user stories and expectations. | Evaluated against Master Project Brief §2 & §3. Checked relevance to municipal fault workflows. | **Modified** | AI included "Commercial Contractor Invoicing" and "Credit Card Payment Gateways" which violate M1 project scope. Redacted commercial features; prioritized community requester needs. |
| **2026-09-02** | Pandora Greyling | Gemini 3.7 Flash | Scaffolding initial draft of Non-Functional Requirements metrics. | Suggested latency, availability, and recovery time objectives for cloud apps. | Cross-referenced against ISO/IEC 25010 and free-tier cloud hosting limitations (Render/Neon). | **Modified** | AI suggested "99.999% high availability with multi-region failover", which is impossible on a \$0 free tier. Adjusted metric to $\ge 99.0\%$ during core hours (`NFR-002`). |
| **2026-09-03** | Chris Fourie | GitHub Copilot | Generating Gherkin acceptance criteria syntax for `FR-001` and `FR-010`. | Generated initial `Given-When-Then` test scenarios for request submission and state transitions. | Reviewed against domain state machine rules. Verified status transition constraints. | **Accepted with edits** | AI allowed an invalid transition from `SUBMITTED` directly to `RESOLVED` without triage or technician assignment. Added explicit failure scenario `AC-010.1` blocking invalid state jumps. |
| **2026-09-03** | Pandora Greyling | ChatGPT (GPT-4o) | Brainstorming potential project risks for municipal service platforms. | Provided a list of 15 generic software risks (e.g. "team communication breakdown", "server crash"). | Filtered against SEN381 risk taxonomy (distinguishing constraints vs risks) and CivicConnect specifics. | **Rejected generic items; rewritten** | AI generated generic "coding bugs" rather than specific root causes. Replaced with concrete risks: `RSK-001` (Scope creep), `RSK-002` (POPIA PII leak), `RSK-005` (Cloud free-tier exhaustion). |
| **2026-09-03** | Chris Fourie | Antigravity AI | Drafting repository pull request template and GitHub Actions workflow stub. | Generated `.github/pull_request_template.md` and CI check yaml. | Inspected syntax against GitHub Actions v4 specification and Master Project Brief §9 two-reviewer rule. | **Accepted** | Confirmed that two independent reviewer checkboxes and explicit traceability fields are strictly enforced. |
| **2026-09-15** | Lisa Verson | Claude 3.5 Sonnet | Researching architectural patterns for lifecycle notification decoupling. | Recommended deploying an Apache Kafka or RabbitMQ distributed message cluster. | Evaluated against `NFR-010` (\$0.00 cloud hosting cap) and 512MB RAM free-tier limits. | **REJECTED (Critical Oversight)** | Kafka/RabbitMQ require 1GB+ RAM, causing immediate OOM kills on free-tier containers. Rejected distributed brokers; adopted in-memory **Observer Pattern (`ADR-004`)** + Transactional Outbox. |
| **2026-09-17** | Pandora Greyling | ChatGPT (GPT-4o) | Evaluating concurrency control mechanisms for ticket assignment. | Proposed using database pessimistic row-level locking (`SELECT ... FOR UPDATE`). | Analyzed against `NFR-001` latency targets and Kleppmann (2017) concurrency models. | **REJECTED (Critical Oversight)** | Pessimistic locking creates connection pool starvation and deadlock risk when multiple technicians browse queues. Pivoted to **Optimistic Concurrency Control (`ADR-006`)** using an integer `version` column. |
| **2026-09-18** | Lisa Verson | Claude 3.5 Sonnet | Drafting external notification gateway integration architecture. | Drafted synchronous outbound HTTP REST calls to SendGrid inside the web request loop. | Analyzed against Fallacies of Distributed Computing and p95 $\le 500\text{ms}$ latency (`NFR-001`). | **MODIFIED** | Synchronous HTTP calls introduce dual-write failures and block user threads. Mandated the asynchronous **Transactional Outbox Pattern (`ADR-007`)**. |
| **2026-09-20** | Chris Fourie | Antigravity AI | Formulating Technology Stack Weighted Decision Matrix (`ADR-008`). | Recommended microservices deployment across AWS Lambda, API Gateway, and DynamoDB. | Evaluated against 3-person team velocity, 7-week schedule, and local Docker Compose parity (`DEC-005`). | **REJECTED (Critical Oversight)** | Cloud-only serverless architecture prevents complete offline local container replication. Selected single-language TypeScript/Node.js/PostgreSQL Clean Monolith. |
| **2026-09-28** | Chris Fourie | GitHub Copilot | Generating initial DDL schema migration script for PostgreSQL 16. | Generated draft SQL table creation statements. | Verified against 3NF normalization rules and Master Project Brief §3 requirements. | **Refined & Enhanced** | AI omitted table comments, foreign key `ON DELETE RESTRICT` guards, and explicit enum check constraints. Manually added `chk_role_code`, `chk_priority_code`, and pgcrypto UUID keys. |

---

## 3. Student Academic Integrity & Accountability Attestation

The undersigned students hereby attest that:
1. No unverified, unreviewed, or fabricated AI output has entered the CivicConnect engineering record.
2. All AI suggestions were subjected to rigorous engineering scrutiny, cross-referenced against authoritative academic sources, and corrected or rejected where they violated project constraints.
3. The registered team members assume full individual and collective engineering responsibility for all baselined artifacts and implementation code.

* **Lisa Verson (Lead Requirements & Design Analyst — 602006):** *Signed electronically — 2026-09-30*
* **Pandora Greyling (Quality Engineer & Risk Manager — 602369):** *Signed electronically — 2026-09-30*
* **Chris Fourie (Systems Architect & Governance Lead — 602826):** *Signed electronically — 2026-09-30*
