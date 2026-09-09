# CivicConnect: Requirements Traceability Matrix (RTM) v1.0

**Document Reference:** `DOC-REQ-001`  
**Milestone:** Milestone 1 — Engineering Foundation & Requirements Baseline  
**Baseline Version:** 1.0 (Controlled)  
**Governing Standard:** SEN381 Master Project Brief §11 & §11.1  

---

## 1. Traceability Architecture & Purpose

In accordance with **SEN381 NQF Level 8 standards**, traceability is the mechanism that guarantees engineering intent is preserved from initial stakeholder identification through design, implementation, and automated verification. 

The CivicConnect RTM establishes bidirectional traceability across the complete engineering lifecycle:

$$\text{Stakeholder Need} \longleftrightarrow \text{Requirement (FR/NFR)} \longleftrightarrow \text{Acceptance Criteria} \longleftrightarrow \text{Architecture/ADR} \longleftrightarrow \text{Issue/PR} \longleftrightarrow \text{Implementation} \longleftrightarrow \text{Test Suite} \longleftrightarrow \text{Release Evidence}$$

---

## 2. Master Functional Requirements Traceability Table

| Req ID | Category | MoSCoW | Stakeholder / Source | Functional Requirement Description | Acceptance Criteria ID | Architecture Ref (M2) | Issue/PR Ref (M3) | Code Module (M3) | Test Case (M3) | Verification Evidence (M4) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`FR-001`** | Submission | **Must** | Community Requesters | Authenticated users can submit a service request with category, priority, description, location, and attachments. | `AC-001.1`<br>`AC-001.2`<br>`AC-001.3` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-002`** | Classification | **Must** | Operational Staff & Supervisors | System enforces a controlled categorization taxonomy (Facilities, IT, Security, Maintenance, Grounds, Lost Property). | `AC-002.1`<br>`AC-002.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-003`** | Visibility | **Must** | Community Requesters | Requesters can view the live status, assigned department, and update timeline of their submitted requests. | `AC-003.1`<br>`AC-003.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-004`** | History | **Must** | Community Requesters | Requesters can view an auditable historical list of all requests previously submitted by their account. | `AC-004.1`<br>`AC-004.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-005`** | Feedback | **Must** | Community Requesters | System automatically triggers feedback notifications to the requester upon status transitions (Accepted, Assigned, In-Progress, Resolved, Rejected). | `AC-005.1`<br>`AC-005.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-006`** | Operations | **Must** | Field Technicians & Staff | Authorised operational staff can access a filtered queue containing requests relevant to their assigned department. | `AC-006.1`<br>`AC-006.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-007`** | Operations | **Must** | Field Technicians & Supervisors | Staff can search, filter, and sort requests by ID, keyword, status, priority, department, and submission date. | `AC-007.1`<br>`AC-007.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-008`** | Operations | **Must** | Field Technicians & Staff | Staff can view full request details including description, location, attachments, requester contact info, and status history. | `AC-008.1`<br>`AC-008.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-009`** | Workflow | **Must** | Department Supervisors & Staff | Supervisors can assign requests to specific technicians; technicians can accept ownership of unassigned tickets. | `AC-009.1`<br>`AC-009.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-010`** | Workflow | **Must** | Compliance & System Admins | Status changes must follow a strictly validated state machine preventing invalid or unauthenticated state jumps. | `AC-010.1`<br>`AC-010.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-011`** | Auditability | **Must** | Field Technicians & Supervisors | Staff must record resolution details and action notes prior to marking a ticket `RESOLVED` or `CLOSED`. | `AC-011.1`<br>`AC-011.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-012`** | Analytics | **Should** | Senior Management | Executive dashboard displays aggregated summary cards of open, in-progress, overdue, and resolved requests. | `AC-012.1`<br>`AC-012.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-013`** | Governance | **Should** | Senior Management & Supervisors | System calculates SLA performance metrics (average time-to-triage, average time-to-resolution, overdue breach counts). | `AC-013.1`<br>`AC-013.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |
| **`FR-014`** | Reporting | **Could** | Senior Management | Management can export filtered request records and performance summaries into CSV and PDF format. | `AC-014.1`<br>`AC-014.2` | *TBD (M2)* | *TBD (M3)* | *TBD (M3)* | *TBD (M3)* | *TBD (M4)* |

---

## 3. Master Non-Functional Requirements (NFR) Traceability Table

| NFR ID | Quality Attribute | Target Metric / Threshold | Source / Constraint | Architectural Implication (M2) | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`NFR-001`** | **Performance (Latency)** | 95% of standard CRUD requests complete with server response time $\le 500\text{ms}$ under 50 concurrent active users. | Management & Requesters | Efficient query indexing, optimized payload sizes, lightweight API design. | Automated Load Testing (k6 / Artillery). |
| **`NFR-002`** | **Availability & Uptime** | Platform achieves $\ge 99.0\%$ uptime during core operational hours (07:00–19:00 SAST). | Operational Staff & Supervisors | Resilient cloud host, health check endpoint, graceful crash restarts. | Synthetic Uptime Monitoring / CI Health Check. |
| **`NFR-003`** | **Usability & Accessibility** | UI conforms to WCAG 2.1 Level AA standards (contrast $\ge 4.5:1$, full keyboard navigation, screen reader ARIA tags). | Community Requesters | Accessible semantic HTML, responsive design tokens, high-contrast palette. | Axe-core automated accessibility scanner + manual tab navigation audit. |
| **`NFR-004`** | **Security & Access Control** | Role-Based Access Control (RBAC) strictly segregates permissions across Requester, Staff, Supervisor, Admin roles. | Compliance & SysAdmins | JWT token authentication, route-level authorization guards, least-privilege APIs. | Automated RBAC permission matrix unit/integration test suite. |
| **`NFR-005`** | **Data Privacy (POPIA)** | All personal contact details and descriptions are encrypted in transit (TLS 1.3) and at rest (AES-256). | Compliance & Legal (POPIA Act 4 of 2013) | Enforced HTTPS, encrypted database storage, strict environment variable secrets. | SSL Labs scan + database encryption verification audit. |
| **`NFR-006`** | **Auditability & Non-Repudiation** | 100% of status changes, reassignments, and resolution notes generate an immutable, timestamped audit log. | Compliance & Management | Append-only audit table with ActorID, Timestamp, PreviousState, NewState. | Database trigger / transaction integration test verifying audit log generation. |
| **`NFR-007`** | **Scalability & Data Volume** | Database supports at least 20,000 requests and 100,000 audit records without query degradation ($< 1.0\text{s}$ query time). | Long-term Operations | Foreign key indexing on `Status`, `CategoryID`, `CreatedAt`, `AssignedTo`. | Database benchmark script populating 100k synthetic records. |
| **`NFR-008`** | **Maintainability & Modularity** | Codebase maintains $\ge 80\%$ test coverage on core business logic; modular separation between domain logic and persistence. | SEN381 Engineering Standard | Layered/Clean architecture pattern, dependency injection, high cohesion. | Code coverage reports (Jest/Vitest/xUnit) in CI pipeline. |
| **`NFR-009`** | **Fault Tolerance & Error Recovery** | In the event of transient network or database disconnection, system fails safely and displays informative user messages without data corruption. | Operational Staff | Database ACID transactions, global exception handling middleware. | Chaos testing / simulated database drop integration tests. |
| **`NFR-010`** | **Cost & Free-Tier Sustainability** | Complete development, staging, and educational deployment footprint operates within \$0.00/month free-tier limits. | Project Constraint (Cost) | Lightweight container/serverless deployment (e.g. Render/Vercel/Neon/Supabase). | Monthly cloud resource usage audit and cost monitoring report. |

---

## 4. Testable Acceptance Criteria Specifications (Gherkin Format)

### `AC-001.1`: Successful Service Request Submission
```gherkin
Feature: Service Request Submission (FR-001)
  Scenario: Authenticated user submits a valid maintenance request
    Given an authenticated user is on the "Create Service Request" page
    When the user selects category "Facility Faults"
    And enters title "Broken window in Lab 302"
    And enters description "Large crack on lower pane posing a safety hazard"
    And enters location "Building B, Floor 3, Room 302"
    And selects priority "High"
    And clicks "Submit Request"
    Then the system creates a new request record with status "SUBMITTED"
    And displays a confirmation message with a unique Tracking Reference (e.g., "REQ-2026-0104")
    And sends a confirmation notification to the requester's registered email
```

### `AC-001.2`: Validation Error on Incomplete Submission
```gherkin
  Scenario: User attempts to submit request without required fields
    Given an authenticated user is on the "Create Service Request" page
    When the user leaves the "Description" and "Location" fields blank
    And clicks "Submit Request"
    Then the request is NOT created in the database
    And the UI highlights the missing fields with error messages "Description is required" and "Location is required"
```

### `AC-009.1`: Supervisor Assigns Request to Technician
```gherkin
Feature: Work Order Assignment (FR-009)
  Scenario: Department supervisor assigns an open request to an operational technician
    Given an authenticated user with role "Supervisor" is viewing unassigned ticket "REQ-2026-0104"
    When the supervisor selects technician "John Doe (Electrical Team)" from the staff dropdown
    And clicks "Assign Request"
    Then the request status transitions from "SUBMITTED" to "ASSIGNED"
    And the "AssignedTechnician" field is updated to "John Doe"
    And an immutable audit record is appended with actor "Supervisor" and timestamp
    And an automated notification is dispatched to "John Doe"
```

### `AC-010.1`: State Machine Transition Validation
```gherkin
Feature: Controlled Status Transitions (FR-010)
  Scenario: System blocks illegal status transitions
    Given a request currently has status "SUBMITTED"
    When a staff member attempts an API call to set status directly to "RESOLVED" without being "ASSIGNED" or "IN_PROGRESS"
    Then the system rejects the request with HTTP 400 Bad Request
    And returns error message "Invalid state transition from SUBMITTED to RESOLVED"
    And no database change is committed
```
