# CivicConnect: AI Usage Register v1.0

**Document Reference:** `DOC-GOV-002`  
**Milestone:** Milestone 1 — Engineering Foundation & Requirements Baseline  
**Baseline Version:** 1.0 (Controlled)  
**Governing Standard:** SEN381 Master Project Brief §10 & §10.1  

---

## 1. Responsible AI Policy & Human-in-the-Loop Protocol

In accordance with **SEN381 Master Project Brief §10**, Artificial Intelligence is utilized solely as an engineering assistant. AI output is never authoritative evidence and does not transfer accountability away from the team.

Every AI contribution undergoes a mandatory 5-stage human verification pipeline:

$$\text{Prompt Specification} \longrightarrow \text{AI Generation} \longrightarrow \text{Domain Cross-Verification} \longrightarrow \text{Correction / Rejection} \longrightarrow \text{Logged Baseline Commitment}$$

---

## 2. Master AI Usage Register Table

| Date | Student | Tool & Model | Engineering Task | AI Contribution | Verification Method Applied | Decision | Issues / Hallucinations Found & Rectified |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-09-02 | Student 1 | Claude 3.5 Sonnet / Antigravity | Initial drafting of CivicConnect stakeholder persona statements. | Generated 8 candidate stakeholder user stories and expectations. | Evaluated against Master Project Brief §2 & §3. Checked relevance to community service request management. | **Modified** | AI included "Commercial Contractor Invoicing" and "Credit Card Payment Gateways" which violate M1 project scope. Redacted out-of-scope personas and refined community requester needs. |
| 2026-09-02 | Student 2 | Gemini 3.7 Flash | Scaffolding initial draft of Non-Functional Requirements metrics. | Suggested latency, availability, and recovery time objectives for cloud apps. | Cross-referenced against ISO/IEC 25010 and free-tier cloud hosting limitations (Render/Neon). | **Modified** | AI suggested "99.999% high availability with multi-region failover", which is impossible on a \$0 free tier. Adjusted metric to $\ge 99.0\%$ during core hours (`NFR-002`). |
| 2026-09-03 | Student 3 | GitHub Copilot | Generating Gherkin acceptance criteria syntax for `FR-001` and `FR-010`. | Generated initial `Given-When-Then` test scenarios for request submission and state transitions. | Reviewed against domain state machine rules. Verified status transition constraints. | **Accepted with edits** | AI allowed an invalid transition from `SUBMITTED` directly to `RESOLVED` without triage or technician assignment. Added explicit failure scenario `AC-010.1` blocking invalid state jumps. |
| 2026-09-03 | Student 2 | ChatGPT (GPT-4o) | Brainstorming potential project risks for municipal service platforms. | Provided a list of 15 generic software risks (e.g. "team communication breakdown", "server crash"). | Filtered against SEN381 risk taxonomy (distinguishing constraints vs risks) and CivicConnect specifics. | **Rejected generic items; rewritten** | AI generated generic "coding bugs" rather than specific root causes. Replaced with concrete risks: `RSK-001` (Scope creep), `RSK-002` (POPIA PII leak), `RSK-005` (Cloud free-tier exhaustion). |
| 2026-09-03 | Student 3 | Antigravity AI | Drafting repository pull request template and GitHub Actions workflow stub. | Generated `.github/pull_request_template.md` and CI check yaml. | Inspected syntax against GitHub Actions v4 specification and Master Project Brief §9 two-reviewer rule. | **Accepted** | Confirmed that two independent reviewer checkboxes and explicit traceability fields are strictly enforced. |

---

## 3. Student Academic Integrity & Accountability Attestation

The undersigned students hereby confirm that all AI-assisted contributions have been independently verified for correctness, safety, and compliance with the SEN381 Master Project Brief. We assume full, 100% individual and collective engineering responsibility for all baselined artifacts.

* **Student 1 (Lead Requirements Analyst):** *Signed electronically*
* **Student 2 (Quality & Risk Engineer):** *Signed electronically*
* **Student 3 (Systems Architect & Governance Lead):** *Signed electronically*
