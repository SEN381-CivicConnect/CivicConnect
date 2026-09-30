# SEN381 - SOFTWARE ENGINEERING 381
# INTEGRATED TEAM SOFTWARE ENGINEERING PROJECT (NQF LEVEL 8)
# CIVICCONNECT: COMMUNITY SERVICE REQUEST MANAGEMENT PLATFORM

## MILESTONE 2 (M2): ARCHITECTURE, TECHNOLOGY & INITIAL DESIGN BASELINE
### PROJECT ENGINEERING DOCUMENT (PED v2.0) & CONTROLLED SUBMISSION MASTER

---

### DOCUMENT METADATA & INSTITUTIONAL CONTROL
* **Academic Institution:** Belgium Campus ITversity
* **Module Code & Name:** SEN381 -- Software Engineering 381 (NQF Level 8)
* **Project Name:** CivicConnect (Community Service Request Management Platform)
* **Document Reference Identifier:** `DOC-PED-002` (Controlled Architecture Baseline)
* **Baseline Version:** 2.0 (Supersedes `DOC-PED-001` v1.0 Approved on 2026-09-09)
* **Release Date:** 30 September 2026
* **Target Delivery Gate:** Milestone 2 Assessment Gate (Appendix D Conforming)
* **Assessment Weight:** 50 Raw Marks (25 Project Marks) -- 30 Shared Team Marks + 20 Individual Examination Marks
* **Registered Engineering Team (Group E):**
  * **Chris Fourie (Student ID: 602826)** -- Systems Architect, Persistence & Governance Lead (~80% Workload Allocation)
  * **Lisa Verson (Student ID: 602006)** -- Lead Requirements, UI/UX & Design Analyst (~20% Workload Allocation)
  * *(Former Member Note: Pandora Greyling [Student ID: 602369] formally withdrew from campus on 2026-09-29. All responsibilities, risks, and defence topics were formally absorbed and reallocated under ADR-009 and RSK-011).*

---

## EXECUTIVE SUMMARY & RUBRIC EVALUATION CROSS-REFERENCE

Milestone 2 transitions CivicConnect from the initial requirements baseline established in Milestone 1 into a controlled, defensible, and verified architectural foundation. In strict compliance with the **SEN381 Master Project Brief (Sections 18, 20.2)** and the **Milestone 2 Brief (Sections 4 to 15)**, this document does not present a disconnected "report" or speculative code scaffolding. Instead, it evolves the single Project Engineering Document into **PED v2.0**, combining empirical research evidence from Assignment 2 with practical, test-verified software construction.

### Assessor Marking Guide & Rubric Evidence Index

| Assessment Criterion | Raw Marks | Evidence Focus & Primary Document Sections | Controlled Verification in Repository |
| :--- | :---: | :--- | :--- |
| **Criterion A: PED v2.0 continuity, RTM evolution & controlled M1 changes** | **5 Marks** | Document Control Record; Section 1 ("Apply, Do Not Repeat"); Sections 2-5 (Preserved M1 Baseline); Section 14 (RTM v2.0 Progression); Section 15 (Risk Register v2.0); Section 18 (Appendix D Gate Sign-Off). | Clean single-monorepo history; no disconnected M2 report; unbroken M1 preservation. |
| **Criterion B: ASRs, architecture & Architecture/Technology baseline reasoning** | **5 Marks** | Section 6 (7 Quantified Architecturally Significant Requirements); Section 7 (Clean Layered Modular Architecture, Inward Dependency Inversion, Explicit Evidence-Based Rejection of Distributed Microservices). | Logical architectural layers cleanly separated in `code/src/domain`, `application`, `infrastructure`, and `presentation`. |
| **Criterion C: Data/persistence engineering** | **4 Marks** | Section 9 (Strict 3NF Relational Model, 8 Normalized Tables, Entity-Relationship Diagram, Declarative Foreign Keys, Append-Only Audit Logging, ACID Boundaries, Optimistic Concurrency Control integer versioning). | `code/database/migrations/V1__initial_schema.sql`, `code/database/seeds/01_baseline_seeds.sql`, and `OptimisticConcurrency.test.ts`. |
| **Criterion D: Technology selection & deployment compatibility** | **4 Marks** | Section 8 (Empirical 6-Factor Weighted Decision Matrix in ADR-008 resolving ADR-003: Node.js 20 LTS, TypeScript 5.3, Express, PostgreSQL 16, React 18); Section 13 (4-Tier Environment Parity, Zero-Cost Cloud Free-Tier <= 512MB RAM Cap). | Containerized local parity verified in `code/docker-compose.yml`; process memory verified <180MB RAM under test load. |
| **Criterion E: Research-informed initial design & integration decisions** | **5 Marks** | Section 10 (Observer Pattern in ADR-004 for Multi-Channel Notifications; Factory Method Pattern in ADR-005 for Polymorphic Category Intake); Section 11 (WCAG 2.1 AA Accessible UI); Section 12 (Transactional Outbox Pattern in ADR-007). | Working implementations in `src/domain/factories/CategoryFactories.ts`, `src/domain/events/DomainEventDispatcher.ts`, and test suites. |
| **Criterion F: Meaningful development, application documentation & GitHub evidence** | **7 Marks** | Section 14.2 (End-to-End Deep Traces for FR-001 and FR-010); Section 19 (Codebase Architecture, Docker Onboarding, 16/16 Vitest Tests Passing in 1.01s, 0 Compiler Errors, GitHub Branch & PR History under ADR-009). | `code/README.md`, `code/src/`, `code/tests/`, and GitHub branch `feat/m2-architecture-and-codebase`. |
| **Individual Examination: Presentation (5) & Oral Defence (15)** | **20 Marks** | Appendix 1 (11-Slide Presentation Deck & Script timed at 13:45); Appendix 2 (Model Answers for all 16 Indicative Defence Questions with exact code and line citations). | Chris Fourie (Slides 1, 3-6, 10, 11) & Lisa Verson (Slides 2, 7-9). |
| **TOTAL RAW SCORE** | **50 Marks** | **Converted to 25 Project Marks (50% of Practical Component)** | **100% Fully Addressed & Verified** |

---

## 1. DOCUMENT CONTROL & REVISION HISTORY

| Version | Date | Primary Authors / Contributors | Reviewer(s) & Approval Authority | Baseline Status | Summary of Milestone Scope & Evolution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1.0** | 2026-09-09 | Chris Fourie, Pandora Greyling, Lisa Verson | Full Team (Two-Reviewer Policy) | **APPROVED M1 BASELINE** | Established initial problem framing, 6 operational breakdowns, stakeholder personas, scope baseline, 14 FRs, 10 NFRs, 6-state ticket lifecycle FSM, initial RTM v1.0, Risk Register v1.0, and ADR-001 to ADR-003. |
| **1.5** | 2026-09-18 | Lisa Verson, Pandora Greyling | Chris Fourie | Architecture Draft | Integrated empirical research findings from Assignment 2 (Tasks 1 to 5): Observer pattern, Factory Method pattern, relational 3NF draft, and optimistic concurrency comparison. |
| **2.0** | 2026-09-30 | Chris Fourie, Lisa Verson *(with early M2 inputs from P. Greyling)* | Chris Fourie & Lisa Verson (`ADR-009` Ratified) | **CONTROLLED M2 BASELINE** | Formal M2 Baseline: 7 ASRs, Clean Layered Macro-Architecture, Weighted Tech Stack Matrix (`ADR-008`), Strict 3NF Relational Model (`ADR-006`), Design Patterns (`ADR-004`, `ADR-005`), Transactional Outbox (`ADR-007`), OpenAPI 3.0 specs, WCAG 2.1 AA UI specs, RTM v2.0, Risk Register v2.0, 2-Person Emergency Governance Restructuring (`ADR-009`), Working Codebase (16 passing tests), and Appendix D Sign-Off (**ACCEPTED**). |

---

## 2. GOVERNING PRINCIPLES & RELATIONSHIP TO MASTER BRIEF

### 2.1 Compliance with "Apply, Do Not Repeat" (Master Project Brief Section 1)
In strict accordance with **SEN381 Master Project Brief Section 1**, this document deliberately refrains from reciting textbook definitions of design patterns, normal forms, or architectural styles. Instead, every section applies engineering standards (ISO/IEC/IEEE 29148 for requirements, ISO/IEC 25010 for software quality, IEEE 1016 for design descriptions) directly to CivicConnect's operational constraints, demonstrating *why* decisions were made, *what* trade-offs were accepted, and *how* verified code translates those decisions into practice.

### 2.2 Compliance with "A2 Researches -- M2 Commits" (M2 Brief Section 2)
Assignment 2 explored problem spaces, compared theoretical alternatives, and formulated recommendations. Milestone 2 evaluates those recommendations against CivicConnect's real-world constraints (e.g., zero cloud budget, 512MB RAM cap, 2-person team capacity). Where our final engineering decision diverged from early research drafts (such as rejecting Apache Kafka and pessimistic locking), the project-specific technical justification is formally defended in dedicated Architecture Decision Records (`ADR-004`, `ADR-006`).

---

## 3. PROBLEM ANALYSIS & STAKEHOLDER CONFLICT RESOLUTION (BASELINED M1)

### 3.1 Operational Breakdowns in Existing Workflows
CivicConnect replaces fragmented, informal communication channels (WhatsApp groups, paper logs, unshared spreadsheets) that previously resulted in:
1. **Ticket Loss & Duplication:** Identical municipal faults logged repeatedly across separate sheets without deduplication.
2. **Zero Citizen Tracking:** Requesters received no confirmation receipt, tracking identifier, or automated progress alerts.
3. **Queue Ambiguity:** Technicians lacked clear task queues, resulting in dropped tickets or conflicting double-assignments.
4. **Unaccountable Status Changes:** Statuses altered verbally without non-repudiable audit logs of authorization.
5. **Lack of Performance Telemetry:** Supervisors could not track resolution velocity, overdue tickets, or SLA compliance.
6. **POPIA Privacy Violations:** Unencrypted citizen contact details shared across public community chat groups.

### 3.2 Stakeholder Conflict Resolution Matrix

| Stakeholder Persona | Core Operational Priority | Systemic Conflict Surface | Engineering Resolution in Milestone 2 |
| :--- | :--- | :--- | :--- |
| **Community Requester (Dr. S. Khumalo)** | Sub-2-minute submission; live tracking visibility. | Desires frequent notifications, but manual messaging creates unsustainable staff burden. | **Observer Pattern (`ADR-004`)** and **Transactional Outbox (`ADR-007`)** automate SMS/email alerts upon state changes without staff manual intervention. |
| **Field Technician (J. Sithole)** | Unambiguous queue; clear location; mobile clarity. | Needs fault data but must not be distracted by citizen chat or exposed to citizen PII liability. | **Factory Method Pattern (`ADR-005`)** validates mandatory structural data; DTO masks citizen contact details on technician screens (`NFR-005`). |
| **Department Supervisor (M. Patel)** | Dynamic triage; fast assignment; SLA enforcement. | Multiple supervisors assigning tickets concurrently causes race conditions and lost updates. | **Optimistic Concurrency Control (`ADR-006`)** with integer `version` checking prevents double-assignment collisions and returns HTTP 409 Conflict. |
| **Compliance Officer (R. Van Der Merwe)** | Complete auditability; strict POPIA data privacy. | Full audit logging must not introduce query latency bottlenecks to standard API paths. | Append-only `service_request_audit_logs` table committed in atomic ACID transactions; queries execute against non-blocking read replicas. |

---

## 4. SCOPE BASELINE & BOUNDARY CONTROL

* **Committed In-Scope Capabilities (Milestones 1 to 4):**
  * `FR-001` to `FR-014`: Citizen fault submission, 5-category taxonomy, tracking reference generation (`REQ-YYYY-NNNN`), role-based queues, technician assignment, 6-state FSM state enforcement, resolution recording with mandatory action notes, executive analytics dashboard, SLA performance tracking, and CSV data export.
* **Deliberately Deferred Capabilities (Justified in `ADR-001`):**
  * Multi-language UI localization (Deferred to Post-M4).
  * Direct WhatsApp conversational chatbot integration (Deferred to Post-M4 due to third-party API licensing costs violating `NFR-010`).
  * Live GPS vehicle telematics tracking (Deferred to Post-M4).
* **Explicitly Out-of-Scope Exclusions:**
  * Municipal billing/tariff collection systems, council procurement systems, physical hardware sensors.

---

## 5. BASELINED REQUIREMENTS & ACCEPTANCE CRITERIA

### 5.1 Functional Requirements Summary (`FR-001` to `FR-014`)
* `FR-001` -- Citizen Service Request Submission with dynamic category validation.
* `FR-002` -- Multi-Category Intake Classification (`FAC_FAULT`, `IT_SUPPORT`, `SECURITY_HAZARD`, `GENERAL_MAINT`, `LOST_PROPERTY`).
* `FR-003` -- Public Tracking Status Lookup via unique reference number.
* `FR-004` -- Authenticated Requester Submission History.
* `FR-005` -- Automated Multi-Channel Citizen Status Notifications.
* `FR-006` -- Role-Based Operational Work Queues (`STAFF`, `SUPERVISOR`, `ADMIN`).
* `FR-007` -- Multi-Criteria Ticket Filtering, Sorting, and Pagination.
* `FR-008` -- Request Detail Inspection with POPIA Citizen PII Masking.
* `FR-009` -- Technician Ticket Assignment and Ownership Claiming.
* `FR-010` -- Server-Side Finite State Machine Status Transition Integrity.
* `FR-011` -- Mandatory Resolution Evidence Logging (Action Notes and Actor ID).
* `FR-012` -- Executive Service Activity Analytics Dashboard.
* `FR-013` -- SLA Overdue Calculation and Priority Performance Metrics.
* `FR-014` -- Structured Reporting and Historical Data Export (CSV).

### 5.2 Six-State Finite State Machine Lifecycle (`DEC-004`)
The platform enforces a deterministic, server-side validated state transition graph:
```
[SUBMITTED] ---> [TRIAGED] ---> [ASSIGNED] ---> [IN_PROGRESS] ---> [RESOLVED] ---> [CLOSED]
     |
     +-------------> [REJECTED] (Terminal state on invalid/duplicate submission)
```
* **Guard Rules:**
  1. A ticket cannot skip intermediate states (e.g., `SUBMITTED` directly to `RESOLVED` is strictly rejected with HTTP 400).
  2. Transitioning to `RESOLVED` or `CLOSED` enforces mandatory non-empty resolution notes (`FR-011`).
  3. Reversible workflows are supported where justified (e.g., `RESOLVED` back to `IN_PROGRESS` if QA verification fails).

---

## 6. ARCHITECTURALLY SIGNIFICANT REQUIREMENTS (ASRs) & QUALITY DRIVERS

In Milestone 2, architecture is shaped specifically by the quality attributes and constraints that enforce systemic boundaries:

| ASR Identifier | Driving NFR / FR | Quantitative Threshold / Target | Architectural Mechanism in Milestone 2 |
| :--- | :--- | :--- | :--- |
| **`ASR-001` (Latency & Throughput)** | `NFR-001`, `FR-001` | p95 server response time <= 500ms under 50 concurrent active users. | Relational B-Tree index optimization; asynchronous non-blocking Node.js event loop; in-memory caching of taxonomy tables. |
| **`ASR-002` (Zero-Cost Sustainability)** | `NFR-010` | \$0.00/month operational spend; container memory <= 512MB RAM. | Selection of lightweight Node.js Alpine runtime (<180MB RAM peak in `ADR-008`); rejection of standalone JVM message brokers. |
| **`ASR-003` (Integrity & Concurrency)** | `NFR-009`, `FR-009` | Zero lost updates during concurrent ticket claiming; 100% referential integrity. | Strict 3NF PostgreSQL schema with foreign key constraints; Optimistic Concurrency Control using integer `version` checking (`ADR-006`). |
| **`ASR-004` (Lifecycle Non-Repudiation)**| `NFR-006`, `FR-010` | 100% immutable capture of actor ID, timestamp, old state, and new state. | Append-only `service_request_audit_logs` table written inside the same ACID database transaction as the status update. |
| **`ASR-005` (POPIA Citizen Privacy)** | `NFR-005`, `FR-008` | Zero unauthorized citizen PII exposure; field-level privacy masking. | Database `is_anonymized_display` flag; application service DTO masks citizen contact details on operational technician screens. |
| **`ASR-006` (Decoupled Notification Sinks)**| `FR-005`, `NFR-002` | External gateway outages must never fail or roll back ticket state updates. | In-memory **Observer Pattern (`ADR-004`)** combined with asynchronous **Transactional Outbox (`ADR-007`)**. |
| **`ASR-007` (Extensible Intake Pipeline)** | `FR-001`, `FR-002` | Adding new municipal categories requires zero modification to intake routes. | **Factory Method Pattern (`ADR-005`)** isolates category-specific validation into independent creator classes (Open/Closed Principle). |

---

## 7. MACRO-ARCHITECTURE & COMPONENT DECOMPOSITION

### 7.1 Clean Layered Modular Monolith Architecture
CivicConnect implements a Clean Layered Architecture with strict inward dependency inversion:

```
+-------------------------------------------------------------------------+
|                           PRESENTATION LAYER                            |
|   - Web Client UI (React 18 / Tailwind CSS -- WCAG 2.1 AA Compliant)     |
|   - REST API Controllers / Route Handlers (JSON Request/Response)       |
|   - Global Error Handling & Request Logging Middleware                  |
+------------------------------------+------------------------------------+
                                     | Invokes DTOs & Use Cases
+------------------------------------v------------------------------------+
|                        APPLICATION SERVICES LAYER                       |
|   - Use Cases: CreateRequest, AssignTicket, UpdateStatus, ResolveTicket  |
|   - Role-Based Route Guards & JWT Claims Authorization Filters          |
|   - Domain Event Dispatcher Coordinator (Observer Subject -- ADR-004)    |
|   - Transactional Outbox Background Worker (ADR-007)                    |
+------------------------------------+------------------------------------+
                                     | Coordinates Entities
+------------------------------------v------------------------------------+
|                            DOMAIN CORE LAYER                            |
|   - Core Aggregates & Entities: ServiceRequest, User, Category, Audit   |
|   - Finite State Machine Transition Invariants & Guard Checks           |
|   - Category Polymorphic Validation (Factory Method -- ADR-005)          |
|   - Domain Event Definitions: ServiceRequestStatusChangedEvent          |
|   - Repository Interfaces: IServiceRequestRepository, IUserRepository   |
+------------------------------------^------------------------------------+
                                     | Implements Abstractions
+------------------------------------+------------------------------------+
|                       INFRASTRUCTURE / DATA LAYER                       |
|   - Relational Persistence: PostgreSQL 16 (Strict 3NF Schema -- ADR-006)  |
|   - Repository Implementations & Optimistic Locking Version Verifiers   |
|   - External Gateways: Email / SMS Dispatchers (Simulated / Free-Tier)  |
|   - Local Docker Compose Orchestration & Volume Persistence (DEC-005)   |
+-------------------------------------------------------------------------+
```

### 7.2 Proportional Architecture Defence: Explicit Rejection of Microservices
In accordance with **Milestone 2 Brief Section 5.3**, a distributed microservices architecture was considered and explicitly rejected:
1. **Distributed Transaction Tax:** Splitting CivicConnect into independent microservices (Auth, Intake, Queue, Notification, Analytics) would mandate distributed 2PC or Saga orchestrators to maintain consistency across requests, audit logs, and outbox tables.
2. **Network Serialization Overhead:** Inter-service REST/gRPC calls introduce network latency hops, directly threatening our sub-500ms p95 response time target (`ASR-001`).
3. **Severe Resource Breach:** Running 5 distinct microservice containers requires over 1.5GB of RAM, immediately breaching the free-tier 512MB RAM cap (`ASR-002`) and causing container Out-Of-Memory (OOM) crashes.
4. **Team Capacity:** Building, testing, and operating a distributed service mesh in a 2-person student team within 7 weeks represents unwarranted over-engineering.
* **Conclusion:** A **Clean Layered Modular Monolith** achieves identical logical decoupling and module testability while operating at <180MB RAM with zero distributed latency overhead.

---

## 8. TECHNOLOGY STACK COMMITMENT (RESOLVING ADR-003 VIA ADR-008)

### 8.1 Empirical Weighted Decision Matrix
In `ADR-003` (Milestone 1), technology selection was deliberately deferred. In `ADR-008`, this deferment was formally resolved by scoring three candidate stacks across 6 weighted criteria:

| Evaluation Criterion | Weight | Candidate A: TypeScript / Node.js | Candidate B: C# / ASP.NET Core 8 | Candidate C: Python / FastAPI |
| :--- | :---: | :---: | :---: | :---: |
| **Free-Tier Quota & Memory Footprint (<= 512MB RAM)** | 20% | **9.0** (1.80) | 6.0 (1.20) | 7.5 (1.50) |
| **Architecture & NFR Fit (Typing, Modularity, DTOs)** | 25% | **9.0** (2.25) | 9.5 (2.38) | 8.0 (2.00) |
| **Team Velocity & Learning Curve (2-Person Delivery)** | 20% | **9.5** (1.90) | 7.0 (1.40) | 7.5 (1.50) |
| **Automated Testing & Mocking Tooling Maturity** | 15% | **9.0** (1.35) | 9.0 (1.35) | 8.5 (1.28) |
| **Docker Parity & Build Efficiency (Image Size)** | 10% | **9.0** (0.90) | 7.5 (0.75) | 8.0 (0.80) |
| **Ecosystem Stability & Security Maintenance** | 10% | **8.5** (0.85) | 9.0 (0.90) | 8.5 (0.85) |
| **TOTAL WEIGHTED SCORE** | **100%** | **9.05 / 10 (SELECTED)** | **7.98 / 10** | **7.93 / 10** |

* **Selection Rationale:** While ASP.NET Core 8 scored high in compile-time typing, its base runtime idles at 250MB-350MB of RAM, leaving negligible headroom under the 512MB container limit. Candidate Stack A (TypeScript / Node.js 20 LTS + PostgreSQL 16) won decisively with **9.05 / 10**. Node.js idles at ~45MB of RAM and peaks at <180MB under load, builds 110MB Alpine containers, and shares DTO interfaces between React and Express, maximizing delivery velocity.

---

## 9. DATA & PERSISTENCE ARCHITECTURE (STRICT 3NF & CONCURRENCY CONTROL)

### 9.1 Relational Schema & Entity-Relationship Architecture (`DOC-ARCH-DATA-001`)
The persistence model enforces strict Third Normal Form (3NF) across 8 normalized tables in PostgreSQL 16:
* `roles` (`role_id`, `role_name`, `description`) -- Lookup table for RBAC.
* `departments` (`department_id`, `code`, `name`, `sla_escalation_email`) -- Lookup table.
* `users` (`user_id`, `email`, `password_hash`, `role_id`, `full_name`, `phone_number`) -- User entities.
* `staff_profiles` (`staff_id`, `user_id`, `department_id`, `is_on_duty`) -- 1-to-1 operational extension of users.
* `priorities` (`priority_id`, `code`, `name`, `sla_target_hours`, `weight`) -- Lookup table.
* `request_categories` (`category_id`, `code`, `name`, `department_id`, `default_priority_id`) -- Lookup table.
* `service_requests` (`request_id`, `tracking_reference`, `title`, `description`, `category_id`, `department_id`, `requester_id`, `assigned_staff_id`, `priority_id`, `status_id`, `is_anonymized_display`, `version`, `submitted_at`, `updated_at`) -- Primary operational aggregate.
* `service_request_audit_logs` (`audit_id`, `request_id`, `actor_id`, `previous_status_id`, `new_status_id`, `action_notes`, `logged_at`) -- Append-only immutable log.
* `outbox_messages` (`message_id`, `event_type`, `aggregate_id`, `payload`, `status`, `retry_count`, `created_at`, `dispatched_at`) -- Transactional outbox.
* `status_transition_rules` (`rule_id`, `from_status_id`, `to_status_id`, `allowed_role_id`) -- Database-enforced FSM matrix.

### 9.2 ACID Boundaries & Optimistic Concurrency Control (OCC -- `ADR-006`)
* **The Lost Update Risk (`RSK-002`):** When multiple supervisors triage open queues simultaneously, or two technicians attempt to claim the same unassigned ticket, concurrent updates can overwrite each other.
* **Why Reject Pessimistic Locking:** Holding row-level locks (`SELECT FOR UPDATE`) causes database connection pool exhaustion and query deadlocks under concurrent traffic.
* **Optimistic Locking Implementation:** The `service_requests` table incorporates an integer `version` column. Every state transition or assignment executes using atomic conditional updates:
  ```sql
  UPDATE service_requests
  SET assigned_staff_id = $1, status_id = $2, version = version + 1, updated_at = NOW()
  WHERE request_id = $3 AND version = $expectedVersion;
  ```
  If zero rows are updated, another user already modified the ticket. The database transaction rolls back, and the API returns **HTTP 409 Conflict** with an informative message, prompting the client UI to refresh.

---

## 10. RESEARCH-INFORMED INITIAL DESIGN PATTERNS

### 10.1 Design Problem 1: Decoupled Multi-Channel Notifications (Observer Pattern -- `ADR-004`)
* **Problem & Context:** Modifying a ticket status must notify the citizen (`FR-005`), alert technicians (`FR-006`), log audit records (`NFR-006`), and calculate SLA timers (`FR-013`). Directly invoking email or SMS services inside the core `ServiceRequest` entity tightly couples domain logic to volatile third-party networks, causing tickets to fail if an external email gateway times out.
* **Research Evidence:** Assignment 2 Task 1 evaluated procedural calls vs in-memory Observer vs distributed message brokers (Kafka/RabbitMQ). Kafka was rejected due to 1GB+ RAM footprints violating `NFR-010`.
* **Milestone 2 Decision:** Implemented the in-memory **Observer Pattern with Domain Event Dispatcher**. When a transition occurs, `ServiceRequest` publishes a `ServiceRequestStatusChangedEvent`. Registered observers (`NotificationDispatchObserver`, `AuditLoggingObserver`) process events independently.
* **Trade-Off & Introduced Complexity:** Introduces indirect control flow. Mitigated by wrapping observer executions in isolated `try/catch` error containment blocks so that a failed email notification cannot corrupt the database transaction.

### 10.2 Design Problem 2: Polymorphic Request Intake (Factory Method Pattern -- `ADR-005`)
* **Problem & Context:** CivicConnect processes heterogeneous municipal categories with conflicting validation rules: Facilities faults require building/room numbers; IT support tickets require hardware asset tags; Security hazards require mandatory emergency priority escalation (`FR-001`, `FR-002`). Handling this via monolithic `switch/case` statements violates the Open/Closed Principle (OCP).
* **Research Evidence:** Assignment 2 Task 1 evaluated Factory Method vs Abstract Factory vs runtime reflection.
* **Milestone 2 Decision:** Implemented the GoF **Factory Method Pattern**. An abstract interface `IServiceRequestFactory` is implemented by 5 concrete creator classes (`FacilitiesRequestFactory`, `ITSupportRequestFactory`, `SecurityHazardRequestFactory`, `GeneralMaintenanceRequestFactory`, `LostPropertyRequestFactory`) managed by a singleton `ServiceRequestFactoryRegistry`.
* **Trade-Off & Introduced Complexity:** Class proliferation (an interface, a registry, and 5 creators instead of a 20-line switch block). Accepted because each category is completely isolated and independently testable. Adding a new category requires zero changes to existing intake handlers.

---

## 11. INFORMATION ARCHITECTURE & ACCESSIBLE UI DESIGN

### 11.1 Role-Based User Workflows
1. **Community Requester Journey:** 3-step submission modal (Category Selection -> Fault Description/Photo Upload -> Instant Reference Generation `REQ-YYYY-NNNN`) followed by a live tracking lookup portal.
2. **Field Technician Journey:** Filtered department queue prioritized by SLA deadline, featuring quick-action drawers to claim tickets, add progress notes, and submit resolution evidence.
3. **Department Supervisor Journey:** Comprehensive operational dashboard with live status distributions, overdue alert flags, and technician assignment controls.

### 11.2 Usability & WCAG 2.1 AA Compliance (`NFR-003`)
* **Contrast Ratios:** All UI text maintains a minimum contrast ratio of 4.5:1 against backgrounds (Tailwind Slate-900 `#0F172A` on pure White `#FFFFFF`; status badges pair high-contrast colors with clear text labels).
* **Keyboard Navigation:** All modal windows trap focus for Tab navigation; form fields incorporate visible focus rings (`focus:ring-2 focus:ring-blue-600`); all interactive elements are reachable without a mouse.
* **Screen Reader Accessibility:** All input fields feature explicit `<label for="...">` markup; dynamic status updates utilize `aria-live="polite"` regions.
* **POPIA Contact Protection:** Citizen phone numbers and emails are automatically masked (`"[POPIA PROTECTED]"`) on operational technician screens, while visible to compliance administrators (`NFR-005`).

---

## 12. API CONTRACTS & TRANSACTIONAL OUTBOX INTEGRATION

### 12.1 Core RESTful Endpoints (OpenAPI 3.0 Contract)
All API endpoints communicate via JSON over HTTPS, using standard HTTP status codes:
* `GET /health/live` -- Returns HTTP 200 `{ status: "UP", memoryUsageMB: 48, uptimeSeconds }` (`NFR-002`).
* `GET /health/ready` -- Returns HTTP 200 `{ status: "READY", database: "CONNECTED" }`.
* `POST /api/v1/requests` -- Citizen creates a service request; validates via Factory Method; returns HTTP 201 Created with tracking reference.
* `GET /api/v1/requests` -- Returns paginated, filtered ticket collection (`status`, `departmentId`, `page`, `limit`).
* `GET /api/v1/requests/:id` -- Retrieves full ticket details with POPIA masking applied for technicians (`FR-008`).
* `PATCH /api/v1/requests/:id/assign` -- Assigns technician; validates integer version; returns **HTTP 409 Conflict** on version mismatch (`ADR-006`).
* `PATCH /api/v1/requests/:id/status` -- Executes state transition; returns **HTTP 409 Conflict** on stale version, **HTTP 400 Bad Request** on invalid FSM jump or missing FR-011 resolution notes.

### 12.2 Transactional Outbox Pattern (`ADR-007`)
* **The Dual-Write Hazard:** If a backend route saves a ticket and then synchronously calls SendGrid/Twilio, an external network timeout blocks the user's thread (violating the 500ms latency target), and external gateway crashes leave the database in an inconsistent state.
* **Outbox Implementation:** State changes write both the ticket update and an outbox record into `outbox_messages` within the *same atomic database transaction*. An asynchronous background polling worker reads pending outbox messages, transmits them to external providers, and applies exponential backoff retries upon failure.

---

## 13. DEPLOYMENT, ENVIRONMENT PARITY & OPERATIONAL READINESS

### 13.1 Four-Tier Environment Model (`FEC-004`)
1. **Local Development (Workstation):** Docker Compose orchestrating PostgreSQL 16 Alpine container and hot-reloading Node.js server.
2. **Automated CI (GitHub Actions):** Operationalized `.github/workflows/pr-governance-check.yml` executing PR validation, traceability checks, and secret scans.
3. **Staging / Demonstration (Cloud PaaS):** Deployed to Render / Vercel connected to a Neon PostgreSQL 16 free-tier database.
4. **Production / Release Evaluation:** Controlled staging environment utilized for formal classroom academic defence.

### 13.2 Zero-Cost Hosting & Resource Limits (`NFR-010`)
* Free-tier cloud PaaS platforms enforce strict container memory limits (512MB RAM cap).
* Our TypeScript/Node.js runtime idles at ~45MB RAM and peaks at <180MB RAM under full test execution, guaranteeing zero Out-Of-Memory (OOM) container crashes without requiring paid cloud infrastructure.

---

## 14. REQUIREMENTS TRACEABILITY EVOLUTION (RTM v2.0 SUMMARY)

The Requirements Traceability Matrix (`DOC-REQ-002`) has evolved from an M1 requirements table into a living engineering instrument with all 12 mandatory columns populated across all 24 requirements.

### 14.1 Deep End-to-End Trace Walkthroughs

#### Deep Trace 1: `FR-001` (Citizen Service Request Submission)
1. **Requirement ID & Wording:** `FR-001` -- Citizen submits a service request with category, description, and location.
2. **Stakeholder & Priority:** Community Requester (Dr. S. Khumalo) -- Priority: Must Have (MoSCoW).
3. **Acceptance Criteria:** `AC-001.1` (Valid payload returns HTTP 201 and tracking code); `AC-001.2` (Missing location returns HTTP 400).
4. **ASR / Quality Link:** `ASR-001` (Latency <= 500ms), `ASR-002` (Zero-cost hosting), `ASR-007` (Polymorphic intake).
5. **Architecture Layer:** Presentation Layer (`RequestController.ts`) -> Application Layer (`CreateServiceRequest.ts`) -> Domain Core (`ServiceRequest.ts`).
6. **Data / Persistence Impact:** Insert into `service_requests` table in `V1__initial_schema.sql` with foreign keys to `users`, `departments`, `priorities`.
7. **Design Decision:** Factory Method Pattern (`ADR-005`) delegating validation to specialized category creators (`FacilitiesRequestFactory`, etc.).
8. **Technology Decision:** Node.js 20 LTS, TypeScript 5.3, Express, PostgreSQL 16 (`ADR-008`).
9. **Implementation Evidence:** Source file `code/src/application/use-cases/CreateServiceRequest.ts`.
10. **Verification Evidence:** Automated unit tests in `ServiceRequestFactory.test.ts` and integration test in `api.test.ts` (`POST /api/v1/requests` returns 201).
11. **Lifecycle Status:** **Implemented**.
12. **ADR / Change Reference:** `ADR-005` (Factory Method), `ADR-008` (Tech Stack).

#### Deep Trace 2: `FR-010` (Finite State Machine Status Transition Integrity)
1. **Requirement ID & Wording:** `FR-010` -- Platform enforces deterministic lifecycle state transitions and prevents illegal status jumps.
2. **Stakeholder & Priority:** Department Supervisor (M. Patel) / Compliance Officer -- Priority: Must Have.
3. **Acceptance Criteria:** `AC-010.1` (Valid transition updates status and writes audit log); `AC-010.2` (Illegal jump throws error and aborts).
4. **ASR / Quality Link:** `ASR-003` (Data Integrity), `ASR-004` (Auditability), `ASR-006` (Decoupled Notifications).
5. **Architecture Layer:** Presentation (`RequestController.ts`) -> Application (`UpdateServiceRequestStatus.ts`) -> Domain (`ServiceRequest.ts`).
6. **Data / Persistence Impact:** Atomic update to `service_requests.status_id`, insert to `service_request_audit_logs`, insert to `outbox_messages`.
7. **Design Decision:** In-memory Observer Pattern (`ADR-004`) publishing `ServiceRequestStatusChangedEvent`; FSM transition matrix (`DEC-004`).
8. **Technology Decision:** TypeScript custom FSM invariants and PostgreSQL 16 transaction boundaries (`ADR-006`).
9. **Implementation Evidence:** Method `ServiceRequest.transitionToStatus(...)` in `code/src/domain/entities/ServiceRequest.ts`.
10. **Verification Evidence:** Automated unit tests in `ServiceRequestFSM.test.ts` (4 passed) asserting invalid jumps throw `InvalidStateTransitionError`.
11. **Lifecycle Status:** **Implemented**.
12. **ADR / Change Reference:** `DEC-004` (FSM Model), `ADR-004` (Observer), `ADR-006` (Relational OCC).

---

## 15. UNCERTAINTY MANAGEMENT & PROJECT RISK REGISTER v2.0

Risk Register v2.0 (`DOC-RSK-002`) tracks 11 project-specific risks evaluated using the quantitative formula $\text{Risk Exposure (RE)} = \text{Probability (P)} \times \text{Impact (I)}$ on a 1-to-5 scale:

| Risk ID | Risk Description & Cause | Pre-RE | Proactive Architectural Mitigation | Reactive Contingency Plan | Post-RE | Status & Owner |
| :--- | :--- | :---: | :--- | :--- | :---: | :--- |
| **`RSK-001`** | **Container Out-Of-Memory Crashes:** Heavy runtimes or message brokers breach the free-tier 512MB RAM cap. | $4 \times 5 = \mathbf{20}$ | Committed to lightweight Node.js Alpine runtime (<180MB RAM) in `ADR-008`; rejected Kafka. | Configure Node.js `--max-old-space-size=256` memory throttle. | $1 \times 3 = \mathbf{3}$ | Controlled (Chris Fourie) |
| **`RSK-002`** | **Concurrent Assignment Lost Updates:** Multiple supervisors assigning the same ticket overwrite changes. | $4 \times 4 = \mathbf{16}$ | Implemented Optimistic Concurrency Control with integer `version` checking in `ADR-006`. | Application catches collision and returns HTTP 409 Conflict, prompting UI refresh. | $1 \times 3 = \mathbf{3}$ | Controlled (Chris Fourie) |
| **`RSK-003`** | **Cascading Gateway Outages:** External email/SMS timeouts cause ticket persistence transactions to fail. | $4 \times 4 = \mathbf{16}$ | Adopted Observer Pattern (`ADR-004`) and Transactional Outbox Pattern (`ADR-007`). | Outbox background worker retries asynchronously with exponential backoff. | $1 \times 3 = \mathbf{3}$ | Controlled (Lisa Verson) |
| **`RSK-004`** | **Dual-Write Data Inconsistency:** Database commits ticket but external notification fails midway. | $3 \times 4 = \mathbf{12}$ | Transactional Outbox commits messages in the same ACID database transaction (`ADR-007`). | Poison-message dead letter queue for messages failing after 5 retries. | $1 \times 2 = \mathbf{2}$ | Controlled (Lisa Verson) |
| **`RSK-005`** | **Class Proliferation / Indirection:** Design patterns introduce excessive classes and complex debugging. | $4 \times 3 = \mathbf{12}$ | Consolidated factory classes into a single cohesive domain module; registered in singleton map. | Comprehensive unit tests for factory registry and event dispatcher. | $2 \times 2 = \mathbf{4}$ | Controlled (Lisa Verson) |
| **`RSK-006`** | **Unauthorized Citizen PII Leakage:** Operational staff view citizen phone numbers, violating POPIA. | $4 \times 4 = \mathbf{16}$ | Automated DTO masking in `ServiceRequestDTOMapper` intercepts technician views (`NFR-005`). | Field-level database encryption and immediate role revocation upon audit breach. | $1 \times 3 = \mathbf{3}$ | Controlled (Lisa Verson) |
| **`RSK-007`** | **Premature Microservices Complexity:** Splitting into microservices causes network tax and schedule delay. | $4 \times 4 = \mathbf{16}$ | Explicitly rejected microservices in PED Section 7; built Clean Layered Modular Monolith. | Modular directory boundaries allow splitting into separate services post-M4 if load warrants. | $1 \times 3 = \mathbf{3}$ | Controlled (Chris Fourie) |
| **`RSK-008`** | **Database Single Point of Failure:** Free-tier cloud database instance experiences downtime. | $3 \times 4 = \mathbf{12}$ | Fully reproducible containerized PostgreSQL 16 schema in `docker-compose.yml` (`DEC-005`). | Daily automated SQL logical backup dump to cloud object storage. | $1 \times 3 = \mathbf{3}$ | Controlled (Chris Fourie) |
| **`RSK-009`** | **Non-Conforming AI Scaffolding:** Generative AI produces boilerplate violating project standards. | $4 \times 3 = \mathbf{12}$ | Enforced 5-stage human verification in `AI_Usage_Register_v2.0.md`; rejected AI suggestions. | Reject and rewrite unverified AI code during mandatory PR peer reviews. | $1 \times 2 = \mathbf{2}$ | Controlled (Chris Fourie) |
| **`RSK-010`** | **Schedule Compression for M2:** Delaying decisions causes unverified development before deadline. | $4 \times 4 = \mathbf{16}$ | Resolved `ADR-003` early; executed concurrent documentation and construction work streams. | Scope triage reducing non-essential UI views while maintaining core domain logic. | $1 \times 3 = \mathbf{3}$ | Controlled (Chris Fourie) |
| **`RSK-011`** | **Team Member Attrition (Capacity Loss):** Team member Pandora Greyling (602369) departed on 2026-09-29. | $5 \times 5 = \mathbf{25}$ | Enacted Emergency Governance Realignment (`ADR-009`); Chris Fourie absorbed ~80% workload; Lisa absorbed ~20%. | Adapted review threshold to Single Mandatory Independent Peer Review (100% partner sign-off) + CI Gate. | $1 \times 3 = \mathbf{3}$ | Controlled (Chris Fourie) |

---

## 16. FORWARD ENGINEERING CONSIDERATIONS REGISTER (M3 PREPARATION)

* **`FEC-001` (Hardened Authentication):** Transitioning from basic JWT claims to secure refresh token rotation stored in HTTP-only, SameSite cookies in Milestone 3.
* **`FEC-002` (Mutation & Integration Testing):** Expanding unit test suites to mutation testing (Stryker) and end-to-end Supertest integration coverage.
* **`FEC-003` (Audit Log Partitioning):** Evaluating monthly PostgreSQL range partitioning for `service_request_audit_logs` before production volumes.
* **`FEC-004` (Staging Parity):** Verifying cloud staging deployment parity against local Docker Compose configurations.
* **`FEC-005` (Observability & Logging):** Integrating structured Winston JSON logging with unique correlation IDs (`X-Correlation-ID`) across asynchronous outbox lifecycles.
* **`FEC-006` (Cloud Quota Guardrails):** Implementing automated query execution time budgets to ensure zero unexpected cloud cost spikes.

---

## 17. MASTER ENGINEERING DECISION LOG & ADR SUMMARY

* `ADR-001` -- Scope Baseline and Change Control Policy (**Accepted**, Milestone 1).
* `ADR-002` -- GitHub Governance and Two-Reviewer Approval Policy (**Accepted**, Milestone 1).
* `ADR-003` -- Justified Deferment of Technology Stack Selection (**Superseded by ADR-008**, Milestone 2).
* `DEC-004` -- Server-Side Finite State Machine Integrity Model (**Accepted**, Milestone 1).
* `DEC-005` -- Cloud Free-Tier Deployment with Docker Compose Parity (**Accepted**, Milestone 1).
* `ADR-004` -- In-Memory Observer Pattern for Lifecycle Event Notifications (**Accepted**, Milestone 2).
* `ADR-005` -- Factory Method Pattern for Polymorphic Request Intake & Validation (**Accepted**, Milestone 2).
* `ADR-006` -- Relational Persistence (Strict 3NF) with Optimistic Concurrency Control (**Accepted**, Milestone 2).
* `ADR-007` -- Transactional Outbox Pattern for External Gateway Integration (**Accepted**, Milestone 2).
* `ADR-008` -- Technology Stack Commitment via Weighted Decision Matrix (**Accepted**, Milestone 2).
* `ADR-009` -- Emergency Governance Adjustment & Workload Reallocation for Two-Person Operation (**Accepted**, Milestone 2).

---

## 18. BASELINE SIGN-OFF GATE RECORD (APPENDIX D CONFORMING)

| Assessment Attribute | Formal Evaluation Record |
| :--- | :--- |
| **Project Name** | **CivicConnect: Community Service Request Management Platform** |
| **Baseline Type** | **Milestone 2 -- Architecture, Technology & Initial Design Baseline** |
| **Document Version** | **v2.0 (Controlled Architecture Baseline)** |
| **Evaluation Date** | **30 September 2026** |
| **Scope Reviewed** | **YES** -- Milestone 1 scope confirmed unchanged; all 14 FRs and 10 NFRs validated against architectural allocations. |
| **Architecture & ASRs Checked** | **YES** -- Proportional Clean Layered Architecture justified; 7 ASRs defined with quantitative metrics; microservices rejected with evidence. |
| **Data & Persistence Checked** | **YES** -- Strict 3NF relational schema, ERD, declarative constraints, and Optimistic Concurrency Control (`ADR-006`) verified in PostgreSQL 16 migrations. |
| **Technology Selection Checked** | **YES** -- Formally evaluated and committed via Weighted Decision Matrix (`ADR-008`), resolving `ADR-003` under the zero-cost free-tier limit. |
| **Design Decisions Checked** | **YES** -- Two genuine GoF design patterns committed (Observer `ADR-004`, Factory Method `ADR-005`, Outbox `ADR-007`) informed by Assignment 2 research. |
| **Requirements Traceability Checked** | **YES** -- Living RTM v2.0 fully populated across all 12 mandatory columns with active source code, schema, and verification links. |
| **Risk Review Completed** | **YES** -- 11 risks evaluated quantitatively in Risk Register v2.0, including team restructuring risk (`RSK-011`). |
| **Controlled Development Checked** | **YES** -- Meaningful domain models, category creators, event dispatchers, migrations, Docker parity, and 16 passing automated tests verified in repository. |
| **Governance & SCM Checked** | **YES** -- Restructured to 2-person operation under `ADR-009` (Single Mandatory Independent Peer Review + Automated CI Gate) following student exit. |
| **GATE OUTCOME** | **ACCEPTED** |

*Formally Ratified Sign-Off Authority:*  
* **Lisa Verson (Lead Requirements & Design Analyst -- 602006):** *Signed -- 2026-09-30*  
* **Chris Fourie (Systems Architect, Persistence & Governance Lead -- 602826):** *Signed -- 2026-09-30*  
*(Record Note: Pandora Greyling [602369] formally withdrew on 2026-09-29; baseline sign-off ratified under ADR-009 two-person team governance charter).*

---

## 19. MEANINGFUL DEVELOPMENT & REPOSITORY EVIDENCE (CRITERION F)

### 19.1 Repository Structure & Clean Architecture Alignment
The practical codebase in `code/` strictly reflects Clean Architecture boundaries:
```
code/
├── database/                                  # Data tier & persistence scripts
│   ├── migrations/                            # PostgreSQL 16 3NF DDL (V1__initial_schema.sql)
│   └── seeds/                                 # Baseline taxonomy & FSM transition rules (01_baseline_seeds.sql)
├── src/                                       # Clean Architecture Source Code
│   ├── domain/                                # Enterprise Domain Core (Independent of frameworks)
│   │   ├── entities/                          # ServiceRequest aggregate (enforcing FSM & OCC versioning)
│   │   ├── enums/                             # RequestStatus, Role, PriorityLevel, SLA targets
│   │   ├── events/                            # IDomainEvent, DomainEventDispatcher (Observer Pattern - ADR-004)
│   │   ├── factories/                         # IServiceRequestFactory & Category Creators (Factory Method - ADR-005)
│   │   └── repositories/                      # IServiceRequestRepository interface abstractions
│   ├── application/                           # Application Services & Business Use Cases
│   │   ├── dtos/                              # ServiceRequestDTOMapper (POPIA masking - NFR-005)
│   │   ├── observers/                         # NotificationDispatchObserver, AuditLoggingObserver (ADR-004)
│   │   └── use-cases/                         # CreateServiceRequest, AssignServiceRequest, UpdateServiceRequestStatus
│   ├── infrastructure/                        # External adapters & persistence implementations
│   │   ├── outbox/                            # TransactionalOutboxService (ADR-007)
│   │   └── repositories/                      # InMemoryServiceRequestRepository, PostgresServiceRequestRepository
│   ├── presentation/                          # HTTP controllers, Express routers, and middleware
│   │   ├── controllers/                       # RequestController (handling OCC HTTP 409 responses)
│   │   └── routes/                            # requestRoutes, healthRoutes (/health/live, /health/ready)
│   ├── app.ts                                 # Express application factory & centralized error handling
│   └── server.ts                              # Production bootstrap entry point
├── tests/                                     # Automated Verification Suites (Vitest)
│   ├── integration/                           # Supertest API tests (health probes, request CRUD, OCC conflict 409)
│   └── unit/                                  # Unit tests for FSM, Factories, Observer, POPIA DTO, and OCC
├── docker-compose.yml                         # PostgreSQL 16 Alpine container parity (DEC-005)
├── package.json                               # Dependencies & npm scripts
├── tsconfig.json                              # Strict TypeScript configuration
└── .env.example                               # Environment secrets template
```

### 19.2 Automated Verification Results
Automated test suites executed via Vitest v1.6.1:
```
> npm test
 [PASS] tests/unit/entities/OptimisticConcurrency.test.ts  (2 tests) 6ms
 [PASS] tests/unit/entities/ServiceRequestFSM.test.ts        (4 tests) 8ms
 [PASS] tests/unit/factories/ServiceRequestFactory.test.ts  (4 tests) 7ms
 [PASS] tests/unit/events/ObserverPattern.test.ts          (1 test) 7ms
 [PASS] tests/unit/dtos/AnonymizationMask.test.ts           (2 tests) 4ms
 [PASS] tests/integration/api.test.ts                      (3 tests) 59ms

 Test Files  6 passed (6)
      Tests  16 passed (16)
   Duration  1.01s (100% Pass Rate)
```
* **TypeScript Compiler (`tsc`):** 0 errors, 0 warnings.
* **Git Status:** Clean working tree; committed on feature branch `feat/m2-architecture-and-codebase` tracking remote origin.

---

## 20. ACADEMIC REFERENCES & STANDARDS CITATIONS

1. Gamma, E., Helm, R., Johnson, R. and Vlissides, J. (1994) *Design Patterns: Elements of Reusable Object-Oriented Software*. Boston, MA: Addison-Wesley.
2. Fowler, M. (2002) *Patterns of Enterprise Application Architecture*. Boston, MA: Addison-Wesley.
3. Martin, R.C. (2018) *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Boston, MA: Prentice Hall.
4. Kleppmann, M. (2017) *Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems*. Sebastopol, CA: O'Reilly Media.
5. ISO/IEC/IEEE (2018) *ISO/IEC/IEEE 29148:2018 Systems and software engineering -- Life cycle processes -- Requirements engineering*. Geneva: International Organization for Standardization.
6. ISO/IEC (2023) *ISO/IEC 25010:2023 Systems and software engineering -- Systems and software Quality Requirements and Evaluation (SQuaRE) -- Product quality model*. Geneva: International Organization for Standardization.
7. IEEE (2009) *IEEE Std 1016-2009 IEEE Standard for Information Technology -- Systems Design -- Software Design Descriptions*. New York: IEEE.
8. W3C (2018) *Web Content Accessibility Guidelines (WCAG) 2.1*. W3C Recommendation. Available at: https://www.w3.org/TR/WCAG21/ (Accessed: 20 September 2026).
9. OWASP Foundation (2021) *OWASP Top 10: 2021 -- The Ten Most Critical Web Application Security Risks*. Available at: https://owasp.org/Top10/ (Accessed: 20 September 2026).
10. Richardson, C. (2018) *Microservices Patterns: With examples in Java*. Shelter Island, NY: Manning Publications.

---

## APPENDIX 1: PRESENTATION DECK & SCRIPT (5 MARKS)
*(Controlled Document Reference: `Milestone_2_Presentation_Deck_and_Script.md`)*
* **Paced Duration:** 13:45 Minutes Total (Rubric Window: 12:00 to 15:00 Minutes).
* **Speaker Roster:**
  * Slide 1 (Executive Title & Purpose) -- Chris Fourie (0:00 - 1:15)
  * Slide 2 (ASRs & Quality Drivers) -- Lisa Verson (1:15 - 2:30)
  * Slide 3 (Macro-Architecture & Microservices Rejection) -- Chris Fourie (2:30 - 4:00)
  * Slide 4 (Technology Stack Weighted Matrix -- ADR-008) -- Chris Fourie (4:00 - 5:30)
  * Slide 5 (Data & Persistence Baseline -- Strict 3NF) -- Chris Fourie (5:30 - 7:00)
  * Slide 6 (ACID Boundaries & Optimistic Concurrency -- ADR-006) -- Chris Fourie (7:00 - 8:15)
  * Slide 7 (Design Pattern 1: Observer Pattern -- ADR-004) -- Lisa Verson (8:15 - 9:30)
  * Slide 8 (Design Pattern 2: Factory Method Pattern -- ADR-005) -- Lisa Verson (9:30 - 10:45)
  * Slide 9 (Outbox Gateway Integration & WCAG UI) -- Lisa Verson (10:45 - 12:00)
  * Slide 10 (Living Traceability & Verified Codebase) -- Chris Fourie (12:00 - 13:15)
  * Slide 11 (Appendix D Baseline Sign-Off Gate & Handoff) -- Chris Fourie (13:15 - 14:00)

---

## APPENDIX 2: INDIVIDUAL ENGINEERING DEFENCE MASTER GUIDE (15 MARKS)
*(Controlled Document Reference: `Milestone_2_Individual_Defence_Preparation_Guide.md`)*

### Summary of Model Answers for all 16 Indicative Examination Questions:
* **Q1 (Trace M1 Requirement Progression):** Traces `FR-001` through `NFR-001`, Application layer, 3NF schema, Factory Method `ADR-005`, and passing Vitest test `api.test.ts`. (Respondent: Lisa Verson or Chris Fourie).
* **Q2 (ASR Most Influencing Architecture):** Defends `ASR-002` (\$0 budget / 512MB RAM cap) eliminating microservices/Kafka and dictating a Clean Layered Monolith in Node.js (<180MB RAM). (Respondent: Chris Fourie).
* **Q3 (Architecture Alternative Rejected):** Defends rejecting distributed microservices due to Saga overhead, network latency violating `ASR-001`, and 1.5GB RAM usage violating `ASR-002`. (Respondent: Chris Fourie).
* **Q4 (Data Persistence Decision for Correctness):** Defends Optimistic Concurrency Control (`ADR-006`) with integer `version` checking preventing the Lost Update Problem during concurrent supervisor triage, verified in `OptimisticConcurrency.test.ts`. (Respondent: Chris Fourie).
* **Q5 (Technology Stack Choice Evidence):** Defends Weighted Decision Matrix in `ADR-008` where TypeScript/Node.js won (9.05/10) over ASP.NET 8 (7.98) due to free-tier memory safety and team delivery velocity. (Respondent: Chris Fourie).
* **Q6 (A2 Research Informs M2):** Defends Assignment 2 Task 3 identifying the Dual-Write Problem, directly informing the Transactional Outbox Pattern in `ADR-007`. (Respondent: Lisa Verson or Chris Fourie).
* **Q7 (Design Problem 1 Alternatives):** Defends rejecting procedural calls and Kafka, selecting in-memory Observer Pattern (`ADR-004`) to isolate domain entities from external notification failures. (Respondent: Lisa Verson).
* **Q8 (M2 Decision Differing from A2):** Explains how AI and early A2 research recommended Apache Kafka, which was rejected by human engineers because 1GB+ RAM footprints violate `NFR-010` (512MB RAM cap). (Respondent: Lisa Verson or Chris Fourie).
* **Q9 (Design Pattern Complexity & Trade-Off):** Explains Factory Method Pattern (`ADR-005`) in `CategoryFactories.ts`, accepting class count complexity in exchange for enforcing the Open/Closed Principle. (Respondent: Lisa Verson).
* **Q10 (ADR Change Impact):** Explains downstream consequences if `ADR-008` switched to C#/.NET 8: PED Section 8, RTM Column 8, `.csproj` rewrites, Docker base image changes, and xUnit rewrites. (Respondent: Chris Fourie).
* **Q11 (RTM Progressed Columns):** Highlights that 6 entire columns progressed since M1 (ASR links, architecture layer, data impact, design pattern, tech decision, implementation/verification evidence). (Respondent: Lisa Verson).
* **Q12 (Requirement In Development):** Demonstrates `FR-009` (Technician Assignment) in `ServiceRequest.assignTechnician(...)`, `AssignServiceRequest.ts`, `V1__initial_schema.sql`, and `OptimisticConcurrency.test.ts`. (Respondent: Chris Fourie).
* **Q13 (Application Documentation & Continuation):** Explains `code/README.md` onboarding steps: `npm install`, `cp .env.example .env`, `docker compose up -d`, `npm test`, and `npm run dev`. (Respondent: Chris Fourie).
* **Q14 (Meaningful Work vs Boilerplate):** Defends proprietary 6-state FSM validation, OCC version check exceptions, custom category factories, POPIA DTO masking, and custom SQL migrations. (Respondent: Chris Fourie or Lisa Verson).
* **Q15 (A2/CI Adopted vs Deferred):** Explains that protected `main` and adaptive peer review (`ADR-009`) + automated CI checks (`pr-governance-check.yml`) are adopted now, while full staging CD is deferred to Milestone 3. (Respondent: Chris Fourie).
* **Q16 (AI Assistance & Human Verification):** Explains `AI_Usage_Register_v2.0.md` logging 10 entries with human rejections of Kafka (OOM risk), pessimistic locking (deadlock risk), and synchronous HTTP calls (dual-write hazard). (Respondent: Chris Fourie or Lisa Verson).
