# CivicConnect: Team Working Agreement & Governance Charter (v2.0)

**Document Reference:** `DOC-GOV-001`  
**Milestone:** Milestone 2 — Architecture, Technology & Initial Design Baseline  
**Baseline Version:** 2.0 (Amended for Two-Person Operation)  
**Governing Standard:** SEN381 Master Project Brief §7.1, §8, §9, §10; `ADR-002`, `ADR-009`  

---

## 1. Team Composition & Workload Restructuring

### 1.1 Original Baseline vs. Emergency Restructuring
CivicConnect Group E originally commenced with three registered students. On **29 September 2026**, **Pandora Greyling (Student ID: 602369)** officially withdrew from the institution and departed campus.

In accordance with **`ADR-009`**, the remaining engineering team formally restructured roles and workload allocations to guarantee uninterrupted delivery across Milestones 2–4:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COLLECTIVE ACCOUNTABILITY                       │
│                                                                        │
│   ┌──────────────────────────────────┐  ┌───────────────────────────┐  │
│   │ Chris Fourie (602826)            │  │ Lisa Verson (602006)      │  │
│   │ Systems Architect, Lead Dev &    │  │ Lead Requirements &       │  │
│   │ Governance Lead (~80% Workload)  │  │ Design Analyst (~20% Load)│  │
│   └──────────────────────────────────┘  └───────────────────────────┘  │
│                    ▲                                  ▲                │
│                    └──────── 100% PEER REVIEW ────────┘                │
│                       (+ Automated CI Quality Gate)                    │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Current Engineering Role Allocation

| Role | Responsible Owner | Reallocated Responsibilities & Engineering Accountabilities |
| :--- | :--- | :--- |
| **Systems Architect, Lead Developer & Governance Lead** | **Chris Fourie** (`602826`)<br>*(~80% Project Workload)* | • Macro-Architecture & Clean/Layered Monolith decomposition (`PED v2.0`).<br>• Technology Stack commitment via Weighted Decision Matrix (`ADR-008`).<br>• Relational Database Persistence Architecture (`DOC-ARCH-DATA-001`), PostgreSQL 16 3NF DDL migrations, and baseline seed data (absorbed from Pandora).<br>• Optimistic Concurrency Control implementation (`ADR-006`) & test suites (absorbed from Pandora).<br>• Project Risk Register v2.0 maintenance and mitigation tracking (absorbed from Pandora).<br>• Complete backend codebase construction, Express server, and Docker Compose container parity (`DEC-005`).<br>• SCM governance, GitHub CI quality gates, and PED v2.0 consolidation.<br>• Lead Presenter and Defence Lead for Milestones 2–4. |
| **Lead Requirements & Design Analyst** | **Lisa Verson** (`602006`)<br>*(~20% Project Workload)* | • Problem framing, stakeholder conflict surfaces, and scope baseline validation.<br>• Functional Requirements (`FR-001`–`FR-014`) and acceptance criteria.<br>• GoF Design Pattern specifications: In-memory Observer Pattern (`ADR-004`) and Factory Method Pattern (`ADR-005`).<br>• External Gateway Integration architecture (Transactional Outbox `ADR-007`).<br>• Information Architecture, user workflows, and UI wireframes conforming to WCAG 2.1 AA.<br>• Co-Presenter and Co-Defence partner for Milestones 2–4. |

---

## 2. Communication Rhythms & Collaboration Norms

* **Daily Stand-ups:** Daily synchronous 15-minute alignment at **09:00 SAST** (Discord / WhatsApp) to coordinate task progress and unblock PR reviews.
* **Milestone Baseline Reviews:** Formal baseline gate reviews conducted 48 hours prior to each milestone deadline.
* **Primary Communication Channel:** Dedicated Discord server `#civicconnect-dev` for async discussions, commit alerts, and CI build status notifications.
* **Response Time SLA:** Maximum **6-hour response turnaround** during academic weekdays, reflecting the increased communication intensity required in a two-person team.

---

## 3. Pull Request & Branch Review Policy (Amended by ADR-009)

In accordance with **`ADR-009`** (superseding the two-reviewer mandate of `ADR-002` due to team downsizing):
1. **Single Mandatory Independent Peer Review:** Because the team consists of two members, every Pull Request entering protected `main` requires **100% peer review approval from the remaining partner**.
2. **Zero Self-Approvals:** The author cannot merge their own code without the partner’s explicit approval.
3. **Automated CI Quality Gate:** Every PR must automatically pass `.github/workflows/pr-governance-check.yml` (verifying traceability tags, test suites, and secret scanning) before the merge button is unlocked.
4. **Review Turnaround SLA:** Review requests must be inspected and acted upon within **12 hours**.

---

## 4. Definition of Ready (DoR) and Definition of Done (DoD)

### 4.1 Definition of Ready (DoR)
* Feature/Bug mapped to an explicit requirement ID (`FR-xxx`, `NFR-xxx`) or risk ID (`RSK-xxx`).
* Gherkin acceptance criteria defined or architectural rationale documented in an ADR.
* Branch created following standard naming convention (`feat/FR-xxx` or `docs/xxx`).

### 4.2 Definition of Done (DoD)
* Code compiles cleanly with zero TypeScript errors (`npm run build`).
* Automated unit/integration tests pass with 100% success rate (`npm test`).
* Code conforms to Clean Layered Architecture boundaries.
* Zero plaintext secrets or credentials committed (verified by CI scan).
* PR reviewed and approved by the partner with technical review comments.
* Living RTM v2.0 updated with implementation evidence and status.

---

## 5. Team Attestation & Commitment

We, the remaining engineering team members, confirm our commitment to this revised governance charter and assume full collective and individual accountability for delivering CivicConnect to distinction standard.

* **Chris Fourie (602826):** *Signed — 2026-09-29*
* **Lisa Verson (602006):** *Signed — 2026-09-29*
