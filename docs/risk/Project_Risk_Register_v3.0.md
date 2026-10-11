# CivicConnect: Project Risk Register (v3.0)
## Quantitative Uncertainty, Team Transition & Quality Risk Register (Milestone 3 Baseline)

**Document Reference:** `DOC-RSK-003`  
**Milestone:** Milestone 3 — Controlled Construction, Integration, Quality & Release Readiness  
**Baseline Version:** 3.0 (Controlled Construction State)  
**Governing Standard:** SEN381 Master Project Brief §12; SEN381 Milestone 3 Brief §4 & §12  
**Owner:** Chris Fourie (Student ID: `602826`, Systems Architect & Lead Developer)  

---

## 1. Risk Management Framework & Quantitative Scoring

Risks are evaluated using the standard quantitative risk exposure formula:
$$\text{Risk Exposure (RE)} = \text{Probability (P)} \times \text{Impact (I)}$$
* **Probability ($P \in [1..5]$):** 1 = Rare, 2 = Unlikely, 3 = Moderate, 4 = Likely, 5 = Almost Certain.
* **Impact ($I \in [1..5]$):** 1 = Negligible, 2 = Minor, 3 = Moderate, 4 = Major, 5 = Critical (Failure to deliver / fatal security breach).
* **Risk Severity Scale:**
  * **Low (1 – 6):** Managed via standard development procedures.
  * **Medium (8 – 12):** Requires proactive engineering controls and active monitoring.
  * **High (15 – 25):** Critical project threat; requires formal architecture decision records (ADRs) and contingency governance.

---

## 2. Master Project Risk Register Table (v3.0)

| Risk ID | Risk Title & Description | Category | Pre P | Pre I | Pre RE | Proactive Architectural Mitigation Strategy | Reactive Contingency Plan | Post P | Post I | Post RE | Status & Owner |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **`RSK-001`** | **Uncontrolled Scope Creep:** Spontaneous feature additions exhausting team delivery capacity. | Project / Scope | 4 | 5 | **20 (High)** | Formal Scope Baseline (`ADR-001`); Appendix E change impact analysis required for any feature adjustment. | Hard rejection of non-essential features; strict adherence to M3 Manageability Rule. | 1 | 4 | **4 (Low)** | **Controlled**<br>Chris Fourie |
| **`RSK-002`** | **Ticket Assignment Race Condition:** Multiple supervisors claiming a ticket simultaneously causing lost updates. | Architecture / Data | 4 | 4 | **16 (High)** | **Optimistic Concurrency Control (`ADR-006`):** Integer `version` column checked on update; throws `ConcurrencyConflictError`. | Return HTTP 409 Conflict; client UI alerts user and prompts queue refresh. | 1 | 3 | **3 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-003`** | **RBAC Bypass / Privilege Escalation:** Malicious actor invokes privileged supervisor/technician endpoints. | Security | 3 | 5 | **15 (High)** | Layered defense-in-depth: route-level role authorization guards + controller check (`RequestController.ts`). | Return HTTP 403 Forbidden; reject unauthorized transitions; log incident. | 1 | 4 | **4 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-004`** | **Polymorphic Intake Fragility:** Adding or changing category validation rules introduces regression bugs across intake. | Architecture / Quality | 4 | 3 | **12 (Med)** | **Factory Method Pattern (`ADR-005`):** Encapsulates category rules in dedicated creator classes; enforces Open/Closed Principle. | Revert specific factory subclass without altering core intake pipeline. | 1 | 2 | **2 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-005`** | **Notification Gateway Latency & Dual-Write Failure:** Third-party email/SMS provider latency blocking API or failing to send. | Integration / Reliability | 4 | 4 | **16 (High)** | **Transactional Outbox Pattern (`ADR-007`):** Messages buffered atomically in database; background worker dispatches asynchronously. | Exponential backoff retry loop; dead-letter queue table for permanently failed messages. | 1 | 2 | **2 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-006`** | **POPIA Citizen Privacy Breach:** Unmasked citizen contact details exposed to unauthorized ground staff. | Security / Legal | 3 | 5 | **15 (High)** | Database field-level anonymization flag (`is_anonymized_display`); API DTO masks PII before returning data to technician role. | Immediate data breach isolation; supervisor audit review; user privacy flag enforcement. | 1 | 3 | **3 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-007`** | **Database Query Degradation under Load:** Large datasets causing query timeouts and violating p95 <= 500ms (`NFR-001`). | Performance | 3 | 4 | **12 (Med)** | Compound B-tree indexes on `(status_id, department_id, created_at)`; paginated REST cursors with strict query limits. Verified in `load.test.ts`. | Query tuning via `EXPLAIN ANALYZE`; introduce in-memory caching for taxonomy. | 1 | 2 | **2 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-008`** | **Cloud Free-Tier Out-of-Memory (OOM) Crash:** Exceeding 512MB RAM cap on free-tier cloud PaaS. | Infrastructure / Cost | 4 | 4 | **16 (High)** | Committed to lightweight Node.js Alpine container (<180MB RAM) in `ADR-008`; rejected memory-heavy brokers (Kafka/RabbitMQ). | Local Docker Compose fallback (`DEC-005`, `ADR-011`) for offline panel defence; container restart probe. | 1 | 3 | **3 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-009`** | **WCAG 2.1 AA Usability Non-Compliance:** Low contrast ratios or keyboard traps preventing accessible evaluation. | Usability / Compliance | 3 | 3 | **9 (Med)** | High-contrast design tokens ($>= 4.5:1$); semantic HTML5 elements; keyboard accessible dashboard in `public/index.html`. | Manual accessibility remediation pass focusing on focus rings and ARIA live regions. | 1 | 2 | **2 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-010`** | **Two-Reviewer Bottleneck on PRs:** Mandatory 2-reviewer policy (`ADR-002`) causing review paralysis before deadlines. | Governance / Team | 4 | 4 | **16 (High)** | Replaced by `ADR-009` following Pandora's departure, and now superseded by `ADR-012` for solo delivery continuity. | Automated multi-gate CI checks replace manual approval blocks during solo phase. | 1 | 3 | **3 (Low)** | **Resolved via ADR-012**<br>Chris Fourie |
| **`RSK-011`** | **Team Member Attrition (Pandora Greyling Departure):** Sudden loss of team member reducing team from 3 to 2 students 34 hours before M2. | Governance / Resource | 5 | 5 | **25 (Critical)** | **Emergency Governance Realignment (`ADR-009`):** Workload absorbed by Chris Fourie (~80%) and Lisa Verson (~20%). Approved by panel. | Reallocated tasks; maintained 100% traceability and green CI gates. | 1 | 3 | **3 (Low)** | **Closed / Absorbed**<br>Chris Fourie |
| **`RSK-012`** | **Total Team Member Attrition / Solo Operation:** Lisa Verson ceased communication and abandoned deliverables on 08 October 2026. | Governance / Resource | 5 | 5 | **25 (Critical)** | **Solo SCM Governance Protocol (`ADR-012`):** Direct pushes to `main` remain blocked. Merging authorized via automated multi-gate CI pipeline + single-engineer self-audit checklist. Grace protocol allows seamless re-integration if Lisa returns. | Scope disciplined under M3 Manageability Rule; focused verification suite protecting core high-risk journeys. | 1 | 3 | **3 (Low)** | **Active / Controlled**<br>Chris Fourie |
| **`RSK-013`** | **Schema Drift Between Test Double & PostgreSQL Staging:** In-memory tests passing while relational PostgreSQL schema encounters syntax or constraint errors. | Data / Persistence | 3 | 4 | **12 (Med)** | Version-controlled DDL migrations (`V1__initial_schema.sql`) and verified rollback script (`V1__rollback_initial_schema.sql`) automated via `docker-compose.staging.yml` (`ADR-011`). | Immediate rollback to prior migration snapshot; database restart probe. | 1 | 2 | **2 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-014`** | **Third-Party Notification Gateway Sandbox Uncertainty:** Production telecom providers behaving differently from local test doubles. | Integration / External | 3 | 3 | **9 (Med)** | Decoupled notification dispatch via Observer Pattern and documented under `DEBT-003`; clean interface boundary established. | Dedicated gateway integration smoke test prior to live municipal launch. | 2 | 2 | **4 (Low)** | **Controlled**<br>Chris Fourie |
| **`RSK-015`** | **Green Pipeline Fallacy / Test Suite Blindspots:** Misinterpreting passing tests as proof of zero defects or production scalability. | Quality / Testing | 4 | 4 | **16 (High)** | Rigorous verification suite combining Unit, Black-Box (EP/BVA, Decision Tables), API Integration, E2E Journeys, and Load Benchmarks. Explicit residual risk disclosure in PED v3.0. | Transparent residual risk statement declaring release candidate as `CONDITIONALLY READY`. | 1 | 3 | **3 (Low)** | **Mitigated**<br>Chris Fourie |

---

## 3. Quantitative Risk Profile Evolution

* **Milestone 1 Baseline:** 10 risks logged; average pre-mitigation exposure: **15.4**; post-mitigation: **3.8**.
* **Milestone 2 Baseline:** 11 risks logged (incorporating `RSK-011`); average post-mitigation: **3.2**.
* **Milestone 3 Current Baseline:** 15 risks logged (incorporating `RSK-012` through `RSK-015`); all critical risks successfully mitigated down to Low/Controlled levels (maximum residual exposure $\le 4$).
* **Conclusion:** The project is under complete quantitative engineering control. Total team attrition (`RSK-012`) has been stabilized via ratified architecture decisions without compromising code quality, test verification, or configuration discipline.
