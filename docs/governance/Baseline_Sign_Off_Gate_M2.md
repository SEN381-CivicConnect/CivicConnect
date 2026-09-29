# CivicConnect: Milestone 2 Baseline Sign-Off & Gate Decision

**Document Reference:** `DOC-GOV-004`  
**Milestone:** Milestone 2 — Architecture, Technology & Initial Design Baseline  
**Governing Standard:** SEN381 Master Project Brief Appendix D & Section 20.2; Milestone 2 Brief Section 6  

---

## 1. Formal Baseline Sign-Off Record (Appendix D Conforming)

| Assessment Attribute | Formal Evaluation Record |
| :--- | :--- |
| **Project** | **CivicConnect: Community Service Request Management Platform** |
| **Baseline Type** | **Milestone 2 — Architecture, Technology & Initial Design Baseline** |
| **Version** | **v2.0 (Controlled Baseline)** |
| **Date** | **2026-09-30** |
| **Scope Reviewed** | **YES** — M1 Scope baseline confirmed unchanged; all 14 FRs and 10 NFRs validated against architectural allocations. |
| **Architecture & ASRs Checked** | **YES** — Proportional Clean/Layered architecture justified; macro-architecture diagrams and component interactions verified against ASRs. |
| **Data & Persistence Checked** | **YES** — Strict 3NF relational schema, ERD, ACID boundaries, and Optimistic Concurrency Control (`ADR-006`) verified in PostgreSQL 16 migrations. |
| **Technology Selection Checked** | **YES** — Formally evaluated and committed via Weighted Decision Matrix (`ADR-008`), resolving `ADR-003` under \$0.00 cloud hosting caps. |
| **Initial Design Decisions Checked** | **YES** — At least two genuine design patterns committed (Observer `ADR-004`, Factory Method `ADR-005`, Outbox `ADR-007`) informed by A2 research. |
| **Requirements Traceability Checked** | **YES** — Evolved RTM v2.0 fully populated across all 12 mandatory columns with active code, schema, and verification links. |
| **Risk Review Completed** | **YES** — 11 architectural, technical, and operational risks evaluated in Risk Register v2.0, including team restructuring risk (`RSK-011`). |
| **Controlled Development Checked** | **YES** — Meaningful domain models, factories, observers, migrations, Docker Compose parity, and unit test suites verified in repository. |
| **Team Governance & SCM Checked** | **YES** — Restructured to 2-person operation under `ADR-009` following withdrawal of Pandora Greyling (602369) on 2026-09-29. |
| **Outcome** | **ACCEPTED** |

---

## 2. Gate Review Summary & Justification

The CivicConnect engineering team has achieved all required Milestone 2 architectural, technical, and developmental milestones:
1. **Defensible Architectural Commitment:** Successfully answered *"How should we engineer the solution, and why?"* by selecting a Clean Layered Architecture over unwarranted microservices complexity, directly protecting free-tier resource limits.
2. **Evidence-Based Technology Selection:** Transitioned from the justified deferment of `ADR-003` to an empirical, multi-criteria Weighted Decision Matrix (`ADR-008`), committing to a high-velocity TypeScript/Node.js/PostgreSQL stack.
3. **Robust Data & Concurrency Model:** Delivered a strict 3NF relational persistence model (`DOC-ARCH-DATA-001`) with declarative constraints and Optimistic Concurrency Control (`ADR-006`), guaranteeing data integrity and zero lost updates.
4. **Research-Informed Design Patterns:** Applied the Observer Pattern (`ADR-004`) to decouple notification channels and the Factory Method Pattern (`ADR-005`) for extensible polymorphic intake, directly reflecting research findings from Assignment 2.
5. **Living Traceability & Controlled Construction:** Populated all 12 columns of RTM v2.0, verified containerized replication in Docker Compose, and initiated meaningful code construction under the adjusted review policy (`ADR-009`).
6. **Responsible Governance Adaptation:** Successfully adapted repository governance and workload allocations following the unexpected withdrawal of Pandora Greyling on 2026-09-29, ensuring full continuity with zero dropped requirements.

The architecture and design baseline `PED v2.0` is officially signed off and controlled, unblocking full-scale construction for **Milestone 3 (Controlled Construction, Integration, Quality & Release Readiness)**.

---

## 3. Registered Team Signatures

* **Lisa Verson (Lead Requirements & Design Analyst — 602006):** *Signed — 2026-09-30*
* **Chris Fourie (Systems Architect, Lead Dev & Governance Lead — 602826):** *Signed — 2026-09-30*
* *(Note on Record: Pandora Greyling [602369] officially withdrew from institution on 2026-09-29. All responsibilities absorbed under ADR-009).*
