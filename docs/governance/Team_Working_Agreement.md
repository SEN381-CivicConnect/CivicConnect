# CivicConnect: Team Working Agreement & Governance Charter

**Document Reference:** `DOC-GOV-001`  
**Milestone:** Milestone 1 — Engineering Foundation & Requirements Baseline  
**Baseline Version:** 1.0 (Controlled)  
**Governing Standard:** SEN381 Master Project Brief §7.1, §8, §9, §10  

---

## 1. Team Composition & Role Responsibilities

The CivicConnect engineering team consists of three registered students, each holding primary ownership over specific engineering pillars while maintaining collective accountability across the entire engineered product:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COLLECTIVE ACCOUNTABILITY                       │
│                                                                        │
│   ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────┐  │
│   │ Student 1            │  │ Student 2            │  │ Student 3   │  │
│   │ Lead Requirements    │  │ Quality & Risk       │  │ Systems &   │  │
│   │ Analyst              │  │ Engineer             │  │ Governance  │  │
│   └──────────────────────┘  └──────────────────────┘  └─────────────┘  │
│              ▲                         ▲                     ▲         │
│              └─────────────────────────┼─────────────────────┘         │
│                                        │                               │
│                         TWO-REVIEWER PEER VERIFICATION                 │
└────────────────────────────────────────────────────────────────────────┘
```

| Role | Primary Responsible Owner | Core Responsibilities & Deliverables |
| :--- | :--- | :--- |
| **Lead Requirements Analyst** | **Student 1** | Problem space decomposition, stakeholder conflict resolution, Functional Requirements (`FR-001`–`FR-014`), Gherkin acceptance criteria, domain modeling. |
| **Quality & Risk Engineer** | **Student 2** | Non-Functional Requirements (`NFR-001`–`NFR-010`), Project Risk Register (`RSK-001`–`RSK-010`), testability architecture, performance benchmarks. |
| **Systems Architect & Governance Lead** | **Student 3** | GitHub configuration management, branch protection enforcement, ADR authoring, RTM synchronization, AI Usage Register oversight. |

---

## 2. Communication Rhythms & Collaboration Norms

* **Stand-ups & Sync Meetings:** 
  - Synchronous team sync: **Tuesdays & Thursdays at 16:00 SAST** (Microsoft Teams / Discord).
  - Milestone baseline review: **Saturdays at 10:00 SAST**.
* **Primary Communication Channel:** Dedicated Discord server `#civicconnect-dev` for async engineering discussions and GitHub webhook alerts.
* **Response Time SLA:** Team members commit to acknowledging and responding to asynchronous messages within **12 hours** during academic weekdays.

---

## 3. Pull Request & Review Turnaround Standards

In accordance with **Master Project Brief §9 and ADR-002**:
1. **Review SLA:** When a team member opens a Pull Request and requests reviews, the remaining two team members must complete their reviews within **24 hours**.
2. **Review Rigor:** Reviewers must verify traceability, acceptance criteria, security, and tests. Approvals with no comments or simple "LGTM" without technical checks are non-compliant.
3. **Blocked PR Escalation:** If a PR receives change requests, the author has **24 hours** to push corrections or schedule a sync session.

---

## 4. Definition of Ready (DoR) and Definition of Done (DoD)

### 4.1 Definition of Ready (DoR) for Work Items
A task or requirement is ready for implementation only when:
- [ ] It has a unique identifier (`FR-xxx` or `NFR-xxx`).
- [ ] It specifies clear business context and stakeholder source.
- [ ] It contains explicit, testable Gherkin acceptance criteria (`AC-xxx`).
- [ ] Dependent ADRs or database models have been baselined.

### 4.2 Definition of Done (DoD) for Baseline Artifacts & Features
A work item is considered Done only when:
- [ ] All code/doc changes follow project conventions.
- [ ] Traceability links in the RTM are verified and updated.
- [ ] Automated tests pass with zero regressions.
- [ ] AI usage (if applicable) is logged in the AI Usage Register with human verification notes.
- [ ] Two non-author team members have formally approved the PR.
- [ ] The branch is squashed and merged into protected `main`.

---

## 5. Conflict Resolution & Individual Accountability Protocol

1. **Technical Disagreements:** Resolved by evaluating competing options against baselined constraints (Schedule, Cost, Quality, Security) using a weighted decision matrix. If tied, the primary role owner holds the deciding vote, documented in an ADR.
2. **Contribution Imbalances:** If a team member fails to attend syncs or deliver agreed tasks for >48 hours without prior notice, the issue is logged in the team retrospective and escalated to the lecturer in accordance with SEN381 institutional guidelines.
