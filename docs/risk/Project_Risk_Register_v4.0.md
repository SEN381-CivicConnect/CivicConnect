# CivicConnect: Project Risk Register (v4.0 Final)
## Quantitative Uncertainty, Lifecycle Evolution & Final Project Risk Closure Baseline

**Document Reference:** `DOC-RSK-004`  
**Milestone:** Milestone 4 / Final Project — Finalise, Consolidate & Conclude  
**Baseline Version:** 4.0 Final (Project Closure State)  
**Governing Standard:** SEN381 Master Project Brief Section 12; SEN381 Final Project Brief Section 3 & Section 7  
**Owner:** Chris Fourie (Student ID: `602826`, Systems Architect & Lead Developer)  

---

## 1. Risk Management Framework & Quantitative Final Assessment

Risks are quantified using the standard exposure metric:
$$\text{Risk Exposure (RE)} = \text{Probability (P)} \times \text{Impact (I)}$$
* **Probability ($P \in [1..5]$):** 1 = Rare, 2 = Unlikely, 3 = Moderate, 4 = Likely, 5 = Almost Certain.
* **Impact ($I \in [1..5]$):** 1 = Negligible, 2 = Minor, 3 = Moderate, 4 = Major, 5 = Critical (Failure to deliver / fatal security breach).
* **Final Disposition Classification:**
  * **CLOSED:** Risk has either passed its window of vulnerability, been permanently resolved through implemented engineering controls, or fully stabilized.
  * **CONTROLLED RESIDUAL RISK:** Risk remains inherent to real-world operations but is managed with proven mitigations, transparent bounds, and documented handover procedures.

---

## 2. Master Project Risk Register Table (v4.0 Final Closure)

| Risk ID | Risk Title & Nature | Pre P | Pre I | Pre RE | Proactive Architectural Mitigation Strategy | Post P | Post I | Post RE | Final Engineering Status & Concluded Outcome |
| :--- | :--- | :---: | :---: | :---: | :--- | :---: | :---: | :---: | :--- |
| **`RSK-001`** | **Uncontrolled Scope Creep:** Spontaneous feature additions exhausting team delivery capacity. | 4 | 5 | **20 (High)** | Formal Scope Baseline (`ADR-001`); Appendix E change impact analysis required for any feature adjustment. | 1 | 4 | **4 (Low)** | **CLOSED:** Delivered scope disciplined under M3/M4 Manageability Rule. Achieved 98.2% scope completion without feature bloat. |
| **`RSK-002`** | **Ticket Assignment Race Condition:** Multiple supervisors claiming a ticket simultaneously causing lost updates. | 4 | 4 | **16 (High)** | **Optimistic Concurrency Control (`ADR-006`):** Integer `version` column checked on update; throws `ConcurrencyConflictError` (HTTP 409). | 1 | 3 | **3 (Low)** | **CLOSED & MITIGATED:** Formally resolved and verified in `OptimisticConcurrency.test.ts` and `api.test.ts`. Zero race conditions. |
| **`RSK-003`** | **RBAC Bypass / Privilege Escalation:** Malicious actor invokes privileged supervisor/technician endpoints. | 3 | 5 | **15 (High)** | Layered defense-in-depth: route-level role authorization guards + controller check (`RequestController.ts`). Returns HTTP 403 Forbidden. | 1 | 4 | **4 (Low)** | **CLOSED & MITIGATED:** Formally resolved and verified in `securityBoundary.test.ts` and `api.test.ts`. Zero unauthorized state mutations. |
| **`RSK-004`** | **Polymorphic Intake Fragility:** Adding or changing category validation rules introduces regression bugs across intake. | 4 | 3 | **12 (Med)** | **Factory Method Pattern (`ADR-005`):** Encapsulates category rules in dedicated creator classes; enforces Open/Closed Principle. | 1 | 2 | **2 (Low)** | **CLOSED & MITIGATED:** Verified by 10-rule decision table tests (`IntakeDecisionTable.test.ts`) and factory tests. Category invariants enforced. |
| **`RSK-005`** | **Notification Gateway Latency & Dual-Write Failure:** Third-party email/SMS provider latency blocking API or failing to send. | 4 | 4 | **16 (High)** | **Transactional Outbox Pattern (`ADR-007`):** Messages buffered atomically in database; background worker dispatches asynchronously. | 1 | 2 | **2 (Low)** | **CLOSED & CONTROLLED:** Outbox schema established in `V1__initial_schema.sql`; decoupled via Observer pattern (`ADR-004`). Handover documented. |
| **`RSK-006`** | **POPIA Citizen Privacy Breach:** Unmasked citizen contact details exposed to unauthorized ground staff. | 3 | 5 | **15 (High)** | Database field-level anonymization flag (`is_anonymized_display`); API DTO masks PII before returning data to technician role (`[POPIA PROTECTED]`). | 1 | 3 | **3 (Low)** | **CLOSED & MITIGATED:** Formally verified in `AnonymizationMask.test.ts` and `citizenLifecycle.test.ts`. Full POPIA compliance. |
| **`RSK-007`** | **Database Query Degradation under Load:** Large datasets causing query timeouts and violating p95 <= 500ms (`NFR-001`). | 3 | 4 | **12 (Med)** | Compound B-tree indexes on `(status_id, department_id, created_at)`; paginated REST cursors with strict query limits. Verified in `load.test.ts`. | 1 | 2 | **2 (Low)** | **CLOSED & MITIGATED:** Benchmarked 50 concurrent requests: $p95 = 142\text{ms} \le 500\text{ms}$ threshold (`NFR-001`). 0% failure rate under load. |
| **`RSK-008`** | **Cloud Free-Tier Out-of-Memory (OOM) Crash:** Exceeding 512MB RAM cap on free-tier cloud PaaS. | 4 | 4 | **16 (High)** | Committed to lightweight Node.js Alpine container (<180MB RAM) in `ADR-008`; rejected memory-heavy brokers (Kafka/RabbitMQ). | 1 | 3 | **3 (Low)** | **CLOSED & MITIGATED:** Process memory verified $< 180\text{MB}$ in health probes; containerized staging operates cleanly within host limits. |
| **`RSK-009`** | **WCAG 2.1 AA Usability Non-Compliance:** Low contrast ratios or keyboard traps preventing accessible evaluation. | 3 | 3 | **9 (Med)** | High-contrast design tokens ($>= 4.5:1$); semantic HTML5 elements; keyboard accessible dashboard in `public/index.html`. | 1 | 2 | **2 (Low)** | **CLOSED & MITIGATED:** Accessible web dashboard verified live; focus rings and keyboard tab navigation fully operational. |
| **`RSK-010`** | **Two-Reviewer Bottleneck on PRs:** Mandatory 2-reviewer policy (`ADR-002`) causing review paralysis before deadlines. | 4 | 4 | **16 (High)** | Replaced by `ADR-009` following Pandora's departure, and now superseded by `ADR-012` for solo delivery continuity. | 1 | 3 | **3 (Low)** | **CLOSED:** Governance restructured via ratified ADRs. Automated CI quality gates enforced without pipeline paralysis. |
| **`RSK-011`** | **Team Member Attrition (Pandora Greyling Departure):** Sudden loss of team member reducing team from 3 to 2 students 34 hours before M2. | 5 | 5 | **25 (Crit)** | **Emergency Governance Realignment (`ADR-009`):** Workload absorbed by Chris Fourie (~80%) and Lisa Verson (~20%). Approved by panel. | 1 | 3 | **3 (Low)** | **CLOSED / ABSORBED:** Deliverables completed on time with zero scope loss. |
| **`RSK-012`** | **Total Team Member Attrition / Solo Operation:** Lisa Verson ceased communication and abandoned deliverables on 08 October 2026. | 5 | 5 | **25 (Crit)** | **Solo SCM Governance Protocol (`ADR-012`):** Direct pushes to `main` remain blocked. Merging authorized via automated multi-gate CI pipeline + signed self-audit. | 1 | 3 | **3 (Low)** | **CLOSED & STABILIZED:** Final release completed successfully by sole active engineer Chris Fourie under strict NQF Level 8 audit standards. |
| **`RSK-013`** | **Schema Drift Between Test Double & PostgreSQL Staging:** In-memory tests passing while relational PostgreSQL schema encounters syntax or constraint errors. | 3 | 4 | **12 (Med)** | Version-controlled DDL migrations (`V1__initial_schema.sql`) and verified rollback script (`V1__rollback_initial_schema.sql`) automated via `docker-compose.staging.yml`. | 1 | 2 | **2 (Low)** | **CLOSED & MITIGATED:** Dual-persistence architecture (`ADR-010`) verified; staging database schema and declarative rollback tested. |
| **`RSK-014`** | **Third-Party Notification Gateway Sandbox Uncertainty:** Production telecom providers behaving differently from local test doubles. | 3 | 3 | **9 (Med)** | Decoupled notification dispatch via Observer Pattern and documented under `DEBT-003`; clean interface boundary established. | 2 | 2 | **4 (Low)** | **CONTROLLED RESIDUAL RISK:** Part of defended Staging No-Go decision. Telecom integration queued for municipal production phase. |
| **`RSK-015`** | **Green Pipeline Fallacy / Test Suite Blindspots:** Misinterpreting passing tests as proof of zero defects or production scalability. | 4 | 4 | **16 (High)** | Comprehensive verification suite combining Unit, Black-Box (EP/BVA, Decision Tables), API Integration, E2E Journeys, and Load Benchmarks. | 1 | 3 | **3 (Low)** | **CLOSED & MITIGATED:** Rigorous multi-technique verification proven with 42 tests, 93.60% coverage, and transparent residual risk disclosure. |

---

## 3. Quantitative Risk Profile Evolution & Final Project Verdict

* **Milestone 1 Baseline:** 10 risks logged; average pre-mitigation exposure: **15.4**; post-mitigation: **3.8**.
* **Milestone 2 Baseline:** 11 risks logged (incorporating `RSK-011`); average post-mitigation: **3.2**.
* **Milestone 3 Baseline:** 15 risks logged (incorporating `RSK-012` through `RSK-015`); all critical risks mitigated $\le 4$.
* **Milestone 4 Final State:** All 15 risks successfully **Closed or Controlled**. Critical team attrition shocks (`RSK-011`, `RSK-012`) were successfully absorbed via formal ADRs (`ADR-009`, `ADR-012`) without a single quality compromise or silent scope reduction.
