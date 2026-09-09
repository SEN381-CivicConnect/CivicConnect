# CivicConnect: Stakeholder Analysis & Conflict Resolution Matrix

**Document Reference:** `DOC-REQ-002`  
**Milestone:** Milestone 1 — Engineering Foundation & Requirements Baseline  
**Baseline Version:** 1.0 (Controlled)  

---

## 1. Stakeholder Identification & Profile Analysis

In accordance with **SEN381 NQF Level 8 standards**, software requirements must originate from rigorous stakeholder needs analysis rather than abstract assumptions. For CivicConnect, 6 distinct stakeholder groups have been identified across community requesters, operational staff, and management oversight.

```mermaid
mindmap
  root((CivicConnect Stakeholders))
    Community Requesters
      "Fast, accessible submission without technical complexity."
      "Real-time visibility into progress and resolution updates."
    Operational Field Staff
      "Unambiguous job details, exact location, and clear priority."
      "No spam or duplicate job tickets assigned."
    Department Supervisors
      "Ability to assign, reassign, and load-balance team queues."
      "Track SLA compliance and overdue work."
    Senior Executive Management
      "Aggregated service-performance metrics across departments."
      "Auditable record of operational efficiency and resource allocation."
    System Administrators
      "Granular Role-Based Access Control (RBAC)."
      "Low maintenance overhead and easy account lifecycle management."
    Compliance & Privacy Officers
      "Strict compliance with South African POPIA (Act 4 of 2013)."
      "Complete immutable audit trail of all data modifications."
```

---

## 2. Multi-Dimensional Stakeholder Matrix

| Stakeholder Group | Primary Needs & Expected Business Value | Quality Attributes (NFRs) of Interest | Power / Influence | Interest | Derived Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Community Requesters** (Students, Staff, Residents) | Intuitive self-service request submission, instant confirmation, automated progress notifications, and historical tracking. | Usability, Accessibility (WCAG 2.1 AA), Response Time, Availability. | Medium | High | `FR-001`, `FR-002`, `FR-003`, `FR-004`, `FR-005`, `NFR-003` |
| **Operational Field Staff** (Technicians, Maintenance, Security) | Clear task queues, full ticket context (attachments, location, severity), status transition controls, internal resolution notes. | Operational Efficiency, Data Integrity, Mobile Responsiveness. | Medium | High | `FR-006`, `FR-007`, `FR-008`, `FR-009`, `FR-010`, `FR-011` |
| **Department Supervisors** | Work order assignment, triage and categorization adjustment, overdue ticket alerting, escalation control. | Manageability, Auditability, Throughput, Reliability. | High | High | `FR-008`, `FR-009`, `FR-010`, `FR-012`, `FR-013`, `NFR-006` |
| **Senior Executive Management** | Cross-departmental KPIs, resolution turnaround metrics, category distribution reports, resource justification. | Reporting Accuracy, Observability, Aggregation Performance. | High | Medium | `FR-012`, `FR-013`, `FR-014`, `NFR-001`, `NFR-007` |
| **System Administrators** | Centralized user role management, account provisioning/deprovisioning, system health monitoring, secure configuration. | Security, Maintainability, Configurability, Fault Tolerance. | High | Low | `NFR-004`, `NFR-005`, `NFR-008`, `NFR-009` |
| **Compliance & Data Privacy Officers** | Protection of personally identifiable information (PII), regulatory compliance (POPIA), non-repudiation of audit logs. | Confidentiality, Non-repudiation, Auditability, Data Retention. | High | Medium | `FR-010`, `NFR-004`, `NFR-005`, `NFR-006` |

---

## 3. Power vs Interest Grid

```
       HIGH POWER
           │
           │  [Keep Satisfied]               [Manage Closely]
           │  • System Administrators        • Department Supervisors
           │  • Compliance Officers          • Senior Executive Management
           │
───────────┼───────────────────────────────────────────────────────────
           │  [Monitor - Minimal Effort]     [Keep Informed]
           │                                 • Community Requesters
           │                                 • Operational Field Staff
           │
           └───────────────────────────────────────────────────────────► HIGH INTEREST
```

---

## 4. Inherent Conflict Surfaces & Engineering Trade-Off Resolutions

In complex software systems, stakeholder goals naturally clash. The engineering team has analyzed and resolved three primary conflict surfaces:

### Conflict Surface 1: Frictionless Anonymous Submission vs Data Integrity & Accountability
* **Competing Needs:** Community Requesters demand the ability to submit requests with zero friction and optional anonymity. Conversely, Operational Staff and Compliance Officers demand verified contact details to prevent frivolous spam tickets and enable follow-up communication.
* **Engineering Resolution:** Mandatory authentication or verified guest email submission is enforced for standard requests (`FR-001`). For sensitive reports (e.g. security/whistleblowing), requesters may select an "anonymous display" flag where PII is redacted from operational staff views but system tokens maintain cryptographic traceability for fraud prevention (`NFR-004`).

### Conflict Surface 2: Instant Request Resolution Demands vs Operational Capacity & Triage Latency
* **Competing Needs:** Requesters expect immediate resolution feedback, whereas Field Technicians operate under finite daily labor constraints and require formal triage time.
* **Engineering Resolution:** Implementation of an explicit, formal Request Lifecycle State Machine (`SUBMITTED` $\rightarrow$ `TRIAGED` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`). Automated notifications are triggered at each transition to manage requester expectations without imposing unrealistic resolution SLAs on technicians (`FR-005`, `FR-009`).

### Conflict Surface 3: Comprehensive Immutable Audit Trails vs Database Storage & Performance
* **Competing Needs:** Compliance and Management require complete historical logging of every field edit, status transition, and comment. However, System Administrators and Cost Constraints require lean database performance and minimal cloud storage costs.
* **Engineering Resolution:** Adoption of an append-only audit event log table with indexed foreign keys (`RequestID`, `ActorID`, `ActionTimestamp`) and asynchronous batch archiving, satisfying `NFR-006` without adding synchronous latency to operational CRUD workflows.
