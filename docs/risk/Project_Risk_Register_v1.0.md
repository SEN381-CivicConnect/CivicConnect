# CivicConnect: Project Risk Register v1.0

**Document Reference:** `DOC-RSK-001`  
**Milestone:** Milestone 1 — Engineering Foundation & Requirements Baseline  
**Baseline Version:** 1.0 (Controlled)  
**Governing Standard:** SEN381 Master Project Brief §12  

---

## 1. Risk Management Framework & Taxonomy

In accordance with **SEN381 NQF Level 8 standards**, risk management is not an administrative checkbox; it is a proactive engineering discipline. A **Risk** is a distinct future uncertain event that, if it occurs, has an adverse impact on project objectives. 

Risks are evaluated using a standard $5 \times 5$ Risk Exposure Matrix:

$$\text{Risk Exposure} = \text{Probability (1–5)} \times \text{Impact (1–5)}$$

* **Critical Risk (Score 16–25):** Immediate engineering intervention required; mandatory baseline risk treatment plan.
* **High Risk (Score 10–15):** Proactive mitigation controls implemented in M1/M2; continuously monitored.
* **Medium Risk (Score 5–9):** Tracked with defined contingency triggers.
* **Low Risk (Score 1–4):** Accepted with minimal overhead.

```
       5 │   5 (Med)    10 (High)   15 (High)   20 (Crit)   25 (Crit)
       4 │   4 (Low)     8 (Med)    12 (High)   16 (Crit)   20 (Crit)
IMPACT 3 │   3 (Low)     6 (Med)     9 (Med)    12 (High)   15 (High)
       2 │   2 (Low)     4 (Low)     6 (Med)     8 (Med)    10 (High)
       1 │   1 (Low)     2 (Low)     3 (Low)     4 (Low)     5 (Med)
         └─────────────────────────────────────────────────────────────
                1           2           3           4           5
                               PROBABILITY
```

---

## 2. Master Project Risk Register Table

| Risk ID | Category | Description & Specific Root Cause | Prob (1-5) | Imp (1-5) | Exposure Score | Priority | Proactive Mitigation Strategy | Reactive Contingency Plan | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`RSK-001`** | **Requirements & Scope** | **Scope Creep via Late Feature Requests:** Uncontrolled addition of complex features (e.g., GPS tracking, WhatsApp chatbot) during M2/M3 without adjusting deadline or resources. | 4 | 4 | **16** | **Critical** | Establish strict Scope Baseline in M1 (`DOC-REQ-003`) and formal Change Control Protocol (Appendix E) requiring unanimous approval and impact analysis. | Defer all unbudgeted features to post-M4 roadmap; deliver only the baselined 14 FRs. | Student 1 (Lead Analyst) | **Active** |
| **`RSK-002`** | **Security & Privacy** | **POPIA Violation via Exposure of Sensitive PII:** Requesters submitting private contact data, security complaints, or internal faults exposed to unprivileged users or leaked via logs. | 3 | 5 | **15** | **High** | Implement strict Role-Based Access Control (RBAC) at the API and database layer; redact PII from general logs; enforce TLS 1.3 encryption. | Immediate session revocation, database token rotation, security patch release, and incident disclosure log. | Student 2 (Quality & Risk) | **Active** |
| **`RSK-003`** | **Schedule & Team** | **Team Member Illness / Unequal Velocity Bottleneck:** Loss of one team member's capacity during construction (M3) causing blocked PR reviews and delivery delays. | 3 | 4 | **12** | **High** | Maintain modular architecture with low coupling; cross-train all 3 members on core codebase; enforce comprehensive documentation. | Re-allocate non-critical tasks; invoke 2-reviewer fast-track protocol; adjust optional MoSCoW "Could" requirements. | Student 3 (Governance) | **Monitored** |
| **`RSK-004`** | **Governance & Git** | **Branch Governance Violation & Broken Baseline:** Direct pushes to `main` bypassing the 2-reviewer rule or merging breaking changes without tests. | 2 | 5 | **10** | **High** | Enable GitHub branch protection on `main` requiring 2 mandatory reviews, linear history, and passing automated CI checks (`ADR-002`). | Immediate revert of unauthorized commits via Git history rollback; post-incident engineering review. | Student 3 (Governance) | **Mitigated** |
| **`RSK-005`** | **Technology & Cost** | **Free-Tier Exhaustion & Cloud Service Lockout:** Database connection limits, compute hour caps, or cold starts on free cloud hosting during final assessment demonstrations. | 3 | 3 | **9** | **Medium** | Benchmark cloud resource usage in staging; design for zero-cost local container execution (Docker Compose) as a local fallback mirror. | Instantly pivot demonstration to local production-like Docker container mirror if cloud instance degrades. | Student 2 (Quality & Risk) | **Active** |
| **`RSK-006`** | **AI Engineering** | **Unverified AI Code Injection & Hallucinated APIs:** Team members accepting syntactically plausible but insecure or hallucinated AI suggestions without verification. | 3 | 3 | **9** | **Medium** | Enforce mandatory 5-step human verification protocol and log all AI interactions in `AI_Usage_Register_v1.0.md` before merging PRs. | Reject unverified PRs during peer review; audit git blame history against AI register logs. | Student 1 (Lead Analyst) | **Active** |
| **`RSK-007`** | **Architecture & Quality** | **State Machine Inconsistency & Deadlocked Workflows:** Requests entering unresolvable orphaned states due to unhandled exceptions or concurrent status edits. | 2 | 4 | **8** | **Medium** | Implement a deterministic finite state machine (FSM) with strict transition validation in domain layer and database foreign-key status constraints. | Automated database script to detect and reassign orphaned tickets; add comprehensive state-transition integration tests. | Student 2 (Quality & Risk) | **Active** |
| **`RSK-008`** | **Integration & Test** | **Late Discovery of Integration Defects:** Deferring automated integration testing until late in M3, resulting in unexpected API/Database contract mismatches. | 2 | 4 | **8** | **Medium** | Define OpenAPI/contract specifications early in M2; implement automated integration tests and mock data fixtures in CI pipeline. | Schedule dedicated 48-hour testing freeze prior to M3 release; prioritize critical-path E2E smoke tests. | Student 2 (Quality & Risk) | **Active** |
| **`RSK-009`** | **Operational Readiness** | **Data Loss Due to Lack of Database Persistence Backup:** Unplanned database container tear-down or cloud cluster reset destroying test and audit records. | 1 | 5 | **5** | **Medium** | Configure automated persistent volume mounts in Docker and automated database dump scripts scheduled via cron. | Restore database state from nightly automated SQL dump snapshot within 15 minutes. | Student 3 (Governance) | **Mitigated** |
| **`RSK-010`** | **Usability & WCAG** | **Accessibility Failure on Mobile/Assistive Devices:** Requesters on low-end mobile browsers or using screen readers unable to complete form submission. | 2 | 2 | **4** | **Low** | Incorporate WCAG 2.1 AA design tokens in UI components; run automated Axe-core scans during M2 wireframing and M3 frontend builds. | Refactor form labels, ARIA tags, and color contrast tokens during designated M3 UI review sprint. | Student 1 (Lead Analyst) | **Active** |

---

## 3. Deep-Dive Defence of Highest Priority Risk (`RSK-001`)

### Engineering Defence Context
During the Milestone 1 Engineering Defence, assessors specifically examine the team's ability to identify and defend their highest-priority risk.

* **Risk Identification:** `RSK-001` (Scope Creep via Late Feature Requests)
* **Why `RSK-001` Deserves the Most Attention in M1:**
  1. **The Compounding Cost of Late Change:** As proven by Boehm's Cost of Change curve, a scope modification introduced during construction or release costs 50–100× more than resolving it during the requirements baseline phase.
  2. **Finite Fixed Constraints:** In SEN381, the schedule (fixed delivery deadline) and team size (exactly 3 students) are strictly immutable. Any unplanned expansion in scope directly degrades quality, compresses test coverage, and escalates burnout risk.
  3. **Concrete Mitigation:** The team has locked in a 14-requirement baseline with formal Gherkin acceptance criteria, documented deliberate out-of-scope exclusions, and established an auditable Change Request procedure (`ADR-001`).
