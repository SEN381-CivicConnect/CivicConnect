# CivicConnect: Project Risk Register (v2.0)
## Quantitative Uncertainty & Risk Mitigation Register (Milestone 2 Baseline)

**Document Reference:** `DOC-RSK-002`  
**Milestone:** Milestone 2 -- Architecture, Design & Engineering Decisions  
**Baseline Version:** 2.0 (Controlled Architecture Baseline)  
**Governing Standard:** SEN381 Master Project Brief Section 12; Milestone 2 Brief Section 4.1, Section 12  
**Owner:** Chris Fourie (Systems Architect & Governance Lead -- Absorbed from Pandora Greyling upon departure 2026-09-29)  

---

## 1. Risk Management Framework & Quantitative Scoring

Risks are evaluated using the quantitative risk exposure formula:
$$\text{Risk Exposure (RE)} = \text{Probability (P)} \times \text{Impact (I)}$$
* **Probability ($P \in [1..5]$):** 1 = Rare, 2 = Unlikely, 3 = Moderate, 4 = Likely, 5 = Almost Certain.
* **Impact ($I \in [1..5]$):** 1 = Negligible, 2 = Minor, 3 = Moderate, 4 = Major, 5 = Critical (Failure to deliver / severe security breach).
* **Risk Severity:**
  * **Low (1 - 6):** Managed via standard development procedures.
  * **Medium (8 - 12):** Requires proactive architectural mitigation and bi-weekly review.
  * **High (15 - 25):** Critical architectural threat; requires active engineering controls and immediate contingency plans.

---

## 2. Master Project Risk Register Table (v2.0)

| Risk ID | Risk Title & Description | Category | Pre P | Pre I | Pre RE | Proactive Architectural Mitigation Strategy | Reactive Contingency Plan | Post P | Post I | Post RE | Status & Owner |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **`RSK-001`** | **Uncontrolled Scope Creep:** Spontaneous feature additions exhausting team delivery capacity. | Project / Schedule | 4 | 5 | **20 (High)** | Formal Scope Baseline (`ADR-001`); Appendix E change impact analysis required for any feature adjustment. | Hard rejection of non-essential features; deferral to post-M4 roadmap. | 1 | 4 | **4 (Low)** | **Controlled**<br>Chris Fourie |
| **`RSK-002`** | **Ticket Assignment Race Condition:** Multiple supervisors/technicians claiming a ticket simultaneously causing lost updates. | Architecture / Data | 4 | 4 | **16 (High)** | **Optimistic Concurrency Control (`ADR-006`):** Integer `version` column checked on update; database rejects stale version writes. | Return HTTP 409 Conflict; client UI alerts user and auto-refreshes queue. | 1 | 3 | **3 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-003`** | **RBAC Bypass / Privilege Escalation:** Malicious actor invokes privileged supervisor/technician endpoints. | Security | 3 | 5 | **15 (High)** | Layered defense-in-depth: route-level JWT auth guards + database foreign key checks on `status_transition_rules`. | Invalidate compromised tokens; revoke user session; log security incident in audit log. | 1 | 4 | **4 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-004`** | **Polymorphic Intake Fragility:** Adding or changing category validation rules introduces regression bugs across intake. | Architecture / Quality | 4 | 3 | **12 (Med)** | **Factory Method Pattern (`ADR-005`):** Encapsulates category rules in dedicated creator classes; enforces Open/Closed Principle. | Revert specific factory subclass without altering core intake pipeline. | 1 | 2 | **2 (Low)** | **Mitigated**<br>Lisa Verson |
| **`RSK-005`** | **Notification Gateway Latency & Dual-Write Failure:** Third-party email/SMS provider latency blocking API or failing to send. | Integration / Reliability | 4 | 4 | **16 (High)** | **Transactional Outbox Pattern (`ADR-007`):** Messages buffered atomically in database; background worker dispatches asynchronously. | Exponential backoff retry loop; dead-letter queue table for permanently failed messages. | 1 | 2 | **2 (Low)** | **Mitigated**<br>Lisa Verson |
| **`RSK-006`** | **POPIA Citizen Privacy Breach:** Unmasked citizen contact details exposed to unauthorized ground staff. | Security / Legal | 3 | 5 | **15 (High)** | Database field-level anonymization flag (`is_anonymized_display`); API DTO masks PII before returning data to technician role. | Immediate data breach isolation; supervisor audit review; user privacy flag enforcement. | 1 | 3 | **3 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-007`** | **Database Query Degradation under Load:** Large datasets causing query timeouts and violating p95 <= 500ms (`NFR-001`). | Performance | 3 | 4 | **12 (Med)** | Compound B-tree indexes on `(status_id, department_id, created_at)`; paginated REST cursors with strict query limits. | Query tuning via `EXPLAIN ANALYZE`; introduce in-memory Redis/node-cache for taxonomy. | 1 | 2 | **2 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-008`** | **Cloud Free-Tier Out-of-Memory (OOM) Crash:** Exceeding 512MB RAM cap on free-tier cloud PaaS. | Infrastructure / Cost | 4 | 4 | **16 (High)** | Committed to lightweight Node.js Alpine container (<180MB RAM) in `ADR-008`; rejected memory-heavy brokers (Kafka/RabbitMQ). | Local Docker Compose fallback (`DEC-005`) for offline panel defence; container restart probe. | 1 | 3 | **3 (Low)** | **Mitigated**<br>Chris Fourie |
| **`RSK-009`** | **WCAG 2.1 AA Usability Non-Compliance:** Low contrast ratios or keyboard traps preventing accessible evaluation. | Usability / Compliance | 3 | 3 | **9 (Med)** | High-contrast design tokens ($>= 4.5:1$); semantic HTML5 elements; automated Axe-core CI audit. | Manual accessibility remediation pass focusing on focus rings and ARIA live regions. | 1 | 2 | **2 (Low)** | **Mitigated**<br>Lisa Verson |
| **`RSK-010`** | **Two-Reviewer Bottleneck on PRs:** Mandatory 2-reviewer policy (`ADR-002`) causing review paralysis before deadlines. | Governance / Team | 4 | 4 | **16 (High)** | Establish strict 12-hour PR review SLA in Team Agreement; automated CI checks verify formatting and tests before human review. | Emergency synchronous 15-minute daily standup to conduct live code walkthroughs. | 1 | 3 | **3 (Low)** | **Controlled**<br>Chris Fourie |
| **`RSK-011`** | **Team Member Attrition (Pandora Greyling Departure):** Sudden loss of team member reducing team from 3 to 2 students 34 hours before M2. | Governance / Resource | 5 | 5 | **25 (Critical)** | **Emergency Governance Realignment (`ADR-009`):** Workload restructured (Chris Fourie absorbs ~80%: Architecture, Database, Concurrency, CI, Codebase; Lisa Verson leads Requirements, Design Patterns, UI/UX). PR review policy amended to 1 mandatory peer review + CI gate. | Rapid redistribution of presentation slides and defence questions between Chris and Lisa; rigorous CI pre-verification. | 1 | 3 | **3 (Low)** | **Controlled**<br>Chris Fourie |

---

## 3. Residual Risk Profile Summary
By executing proactive architectural mitigations in Milestone 2 (`ADR-004` through `ADR-009`), **100% of high and critical exposure risks (including `RSK-011`) have been successfully reduced to Low or Acceptable Medium exposure**.
