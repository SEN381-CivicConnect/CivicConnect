# CivicConnect: Scope Baseline Statement & Boundary Control

**Document Reference:** `DOC-REQ-003`  
**Milestone:** Milestone 1 — Engineering Foundation & Requirements Baseline  
**Baseline Version:** 1.0 (Controlled)  

---

## 1. Scope Baseline Purpose & Principle

In accordance with **SEN381 Master Project Brief §4 and §14**, uncontrolled scope creep is one of the primary drivers of software project failure. Establishing an explicit, baselined scope boundary ensures that engineering effort is strictly focused on delivering a high-quality, fully tested, and defensible platform rather than an unfinished feature set.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CIVICCONNECT SCOPE BOUNDARY                     │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ IN-SCOPE (Milestones 1–4 Baseline)                             │   │
│   │ • 3 Core Capabilities (Requester, Staff, Management)           │   │
│   │ • Controlled Request State Machine & Role-Based Access         │   │
│   │ • Search, Filter, Prioritised Queues & Work Assignment         │   │
│   │ • Real-Time Notifications & Auditable Resolution Notes         │   │
│   │ • Management Performance Dashboards & CSV Export               │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ DEFERRED SCOPE (Post-M1 Justified Consideration)               │   │
│   │ • Multi-Channel Ingestion (SMS / WhatsApp Webhooks)            │   │
│   │ • Automated AI Ticket Triage & Severity Prediction             │   │
│   │ • Native Mobile Application Offline Caching                    │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ EXPLICITLY OUT-OF-SCOPE (Non-Deliverables)                     │   │
│   │ • Financial Billing & Payment Gateway Integration              │   │
│   │ • Real-time GPS Vehicle / Fleet Telematics                     │   │
│   │ • Third-Party External Contractor Invoicing Engines            │   │
│   │ • Multi-Tenant Enterprise SaaS Infrastructure                  │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. In-Scope Functional Capabilities (Committed Baseline)

The committed baseline comprises 14 functional requirements grouped into 3 business pillars:

### 2.1 Requester Capability Pillar
* **`FR-001` (Service Request Submission):** Web-based multi-field submission form capturing category, priority indicator, detailed textual description, physical location/building, and optional file/image attachments.
* **`FR-002` (Controlled Category Classification):** Predefined, controlled categorization mechanism (Facility Faults, IT Support, Damaged Equipment, Security Concern, Maintenance, Lost Property).
* **`FR-003` (Live Request Status Tracking):** Real-time tracking interface displaying current state, assigned department, and last updated timestamp.
* **`FR-004` (Request History & Audit Overview):** User-specific dashboard showing all active and historical requests submitted by the authenticated user.
* **`FR-005` (Automated Requester Feedback Notifications):** Immediate email/in-app notifications when a request is submitted, triaged, assigned, status-updated, or resolved.

### 2.2 Operational Staff Capability Pillar
* **`FR-006` (Authorised Request Queue):** Role-partitioned dashboard displaying active tickets relevant to the staff member's department.
* **`FR-007` (Multi-Criteria Search, Filtering & Sorting):** Dynamic filtering by category, status, priority, date submitted, and assigned technician.
* **`FR-008` (Detailed Request View):** Comprehensive ticket view showing full requester description, metadata, attachments, location, and past status history.
* **`FR-009` (Work Order Assignment & Acceptance):** Supervisor ticket assignment to technicians, and self-assignment capabilities for available staff.
* **`FR-010` (Controlled Status Transition Engine):** Strict state-machine workflow (`SUBMITTED` $\rightarrow$ `TRIAGED` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED` / `REJECTED`) preventing invalid state jumps.
* **`FR-011` (Action Logging & Resolution Notes):** Mandatory resolution description and timestamped internal commentary prior to marking a ticket resolved.

### 2.3 Management & Oversight Capability Pillar
* **`FR-012` (Service Activity & Operational Dashboard):** High-level dashboard displaying volume of open, in-progress, overdue, and resolved requests.
* **`FR-013` (Performance & SLA Breach Metrics):** Aggregated metrics tracking average resolution time, overdue tickets against SLAs, and departmental throughput.
* **`FR-014` (Exportable Audit & Analytical Reports):** Filtered operational report generation and export in standard tabular formats (CSV/PDF) for executive review.

---

## 3. Deliberately Deferred Scope (Evaluated for Future Phases)

The following capabilities provide theoretical stakeholder value but are **intentionally deferred** from Milestone 1 baseline commitment:

| Deferred Capability | Stakeholder Rationale | Technical & Constraint Justification for Deferment | Milestone Review Gate |
| :--- | :--- | :--- | :--- |
| **Multi-Channel Webhook Ingestion (SMS / WhatsApp)** | Allows requesters to log tickets via instant messaging. | Introduces paid third-party API dependencies (e.g. Twilio/Meta Business API), webhook security complexity, and potential cost overruns on free-tier hosting. | Deferred to Milestone 3 (Change Request Phase). |
| **Automated AI Ticket Triage & Severity Prediction** | Automatically assigns categories and priorities based on text descriptions. | High risk of classification hallucinations and incorrect SLA priority assignment without substantial domain training datasets. | Deferred to Milestone 3 / Optional Add-on. |
| **Native Mobile Offline Caching** | Allows field technicians in basements without signal to log updates offline. | Introduces complex local SQLite synchronization and conflict-resolution algorithms that threaten the 4-milestone academic schedule. | Deferred to Milestone 4 Evolution Roadmap. |

---

## 4. Explicitly Out-of-Scope (Deliberate Exclusions)

To protect schedule, cost, and security integrity, the following features are non-negotiably excluded from the CivicConnect project:

1. **Financial Billing & Payment Processing:** CivicConnect manages public community service requests; commercial invoicing and credit-card payments introduce unnecessary PCI-DSS compliance overhead.
2. **Real-time GPS Fleet Telematics:** Tracking technician vehicles via live GPS map overlays requires specialized hardware and excessive map API subscription costs.
3. **Multi-Tenant Enterprise SaaS Partitioning:** The system is engineered as a dedicated instance for a single community/institution; multi-tenant database isolation is excluded to maintain architectural simplicity.

---

## 5. Scope Boundary Defence & Change Management Protocol

Any proposed modification to this baselined scope must strictly follow the **SEN381 Change Management Standard (§14)**:
1. Formal submission of a **Change Request Form** (Appendix E).
2. Comprehensive **Impact Analysis** evaluating requirements, architecture, security, testing, schedule, and cost.
3. Unanimous 3-member team review and formal lecturer authorization prior to baseline amendment.
