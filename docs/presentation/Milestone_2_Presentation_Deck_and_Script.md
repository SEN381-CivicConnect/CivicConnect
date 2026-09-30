# CivicConnect: Milestone 2 Presentation Talking Points & Script
## Group E -- Milestone 2 (M2): Architecture, Technology & Initial Design Baseline

**Project:** CivicConnect (Community Service Request Management Platform)  
**Academic Year:** 2026 | **Module:** Software Engineering 381 (SEN381) -- NQF Level 8  
**Governing Standard:** SEN381 Master Project Brief Section 19, Section 20.2 & Milestone 2 Brief Section 13.2, Section 14  
**Target Duration:** 12:00 - 15:00 Minutes Total (Paced for 13:45 min)  
**Governing Document Reference:** `PED v2.0` (`DOC-PED-002`), `RTM v2.0` (`DOC-REQ-002`)  

---

## 1. Speaker Roster & Target Time Allocations

| Slide | Topic & Core Content | Speaker | Time Window | Controlled Document Reference |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Title, M1 Evolution, NQF 8 Driving Question & Gate Purpose | **Chris Fourie** (Architect) | 0:00 - 1:15 | PED v2.0 Document Control |
| **2** | Architecturally Significant Requirements (ASRs) & Quality Drivers | **Lisa Verson** (Design Lead) | 1:15 - 2:30 | PED v2.0 Section 6 |
| **3** | Macro-Architecture: Clean Layered Monolith & Rejecting Microservices | **Chris Fourie** (Architect) | 2:30 - 4:00 | PED v2.0 Section 7 & Diagrams |
| **4** | Technology Stack Commitment: Resolving ADR-003 via Weighted Matrix | **Chris Fourie** (Architect) | 4:00 - 5:30 | `ADR-008` & PED v2.0 Section 8 |
| **5** | Data & Persistence Baseline: Strict 3NF Relational Model & ERD | **Chris Fourie** (Architect) | 5:30 - 7:00 | `DOC-ARCH-DATA-001` & PED Section 9 |
| **6** | ACID Boundaries & Optimistic Concurrency Control (OCC) | **Chris Fourie** (Architect) | 7:00 - 8:15 | `ADR-006` & Risk Register v2.0 |
| **7** | Design Pattern 1: Observer Pattern for Multi-Channel Notifications | **Lisa Verson** (Design Lead) | 8:15 - 9:30 | `ADR-004` & A2 Task 1 Evidence |
| **8** | Design Pattern 2: Factory Method Pattern for Polymorphic Intake | **Lisa Verson** (Design Lead) | 9:30 - 10:45 | `ADR-005` & A2 Task 1 Evidence |
| **9** | Outbox Gateway Integration & WCAG 2.1 AA Accessible UI | **Lisa Verson** (Design Lead) | 10:45 - 12:00 | `ADR-007` & PED Section 11/12 |
| **10** | Living Traceability (RTM v2.0), Deep Trace Walkthrough & Code Progress | **Chris Fourie** (Architect) | 12:00 - 13:15 | `DOC-REQ-002` & `code/README.md` |
| **11** | Appendix D Baseline Sign-Off Gate (ACCEPTED) & Defence Handoff | **Chris Fourie** (Architect) | 13:15 - 14:00 | `DOC-GOV-004` & Appendix D |

---

## 2. Slide-by-Slide Talking Points, Visual Layouts & Scripts

---

### Slide 1: Executive Title, Team Roster & Milestone Progression
* **Speaker:** Chris Fourie (Systems Architect & Governance Lead)
* **Target Time:** 1:15 min (0:00 - 1:15)
* **Visuals on Slide:**
  * Project Title: **CivicConnect: Community Service Request Management Platform**
  * Sub-header: *Milestone 2 -- Architecture, Technology & Initial Design Baseline (PED v2.0)*
  * Team Roster: Chris Fourie (`602826`), Lisa Verson (`602006`) *(Note: Team member Pandora Greyling departed 2026-09-29; operational reallocations governed under `ADR-009`)*.
  * Driving Question: *"How should we engineer the solution, and why?"*
  * Core Principle: *"A2 Researches -- M2 Decides and Applies."*
* **Speaker Script (Verbatim):**
  > *"Good morning, panel and colleagues. Welcome to Group E's Milestone 2 presentation for CivicConnect. In Milestone 1, we baselined the problem, 14 functional requirements, and 10 non-functional drivers, while deliberately deferring technology commitments in ADR-003.  
  > Today, Milestone 2 answers the central engineering question: 'How should we engineer the solution, and why?'  
  > We have not created a disconnected report; we have evolved our single Project Engineering Document into PED v2.0. Using research evidence from Assignment 2, we have established our macro-architecture, committed to our technology stack via a formal weighted matrix, normalized our relational persistence model to strict 3NF, implemented GoF design patterns to isolate volatility, and initiated meaningful, verified construction with 16 automated tests in our repository.  
  > Lisa will now walk us through the Architecturally Significant Requirements that drove our design decisions."*

---

### Slide 2: Architecturally Significant Requirements (ASRs) & Quality Drivers
* **Speaker:** Lisa Verson (Lead Requirements & Design Analyst)
* **Target Time:** 1:15 min (1:15 - 2:30)
* **Visuals on Slide:**
  * Table of 5 Key ASRs with measurable thresholds:
    * `ASR-001` Latency: p95 <= 500ms under 50 concurrent active users (`NFR-001`).
    * `ASR-002` Zero-Cost: \$0.00/month operational spend, memory <= 512MB RAM (`NFR-010`).
    * `ASR-003` Integrity & Concurrency: Zero lost updates during concurrent ticket claiming (`NFR-009`, `FR-009`).
    * `ASR-004` Non-Repudiation: 100% immutable audit logging on status transitions (`NFR-006`, `FR-010`).
    * `ASR-005` POPIA Privacy: Field-level citizen PII masking for operational field staff (`NFR-005`).
* **Speaker Script (Verbatim):**
  > *"Thank you, Chris. In software engineering, not every requirement shapes architecture. We isolated the critical Architecturally Significant Requirements that govern our boundaries.  
  > First, ASR-001 and ASR-002 enforce strict performance and cost sustainability: our API p95 response time must remain under 500 milliseconds, operating strictly within a zero-dollar cloud budget on a 512-megabyte RAM container cap.  
  > Second, ASR-003 and ASR-004 address our highest operational risks: concurrent supervisors triaging queues cannot overwrite each other, and every single state transition must create an immutable, non-repudiable audit trail.  
  > Finally, ASR-005 enforces South Africa's POPIA regulatory mandate, requiring field-level privacy masking so ground technicians see fault details without exposing personal citizen phone numbers.  
  > Chris will now explain how our macro-architecture satisfies these drivers without unnecessary complexity."*

---

### Slide 3: Macro-Architecture: Clean Layered Monolith & Microservices Rejection
* **Speaker:** Chris Fourie (Systems Architect & Governance Lead)
* **Target Time:** 1:30 min (2:30 - 4:00)
* **Visuals on Slide:**
  * Clean / Layered Architecture diagram showing 4 concentric rings / horizontal tiers:
    * `Presentation Layer` (React 18 / REST Controllers) -> `Application Layer` (Use Cases / DTOs) -> `Domain Core Layer` (Entities / Invariants / Events) $\leftarrow$ `Infrastructure Layer` (PostgreSQL 16 / Outbox).
  * Inward Dependency Inversion arrows (->).
  * Comparison Callout: *Why We Explicitly Rejected Microservices*.
* **Speaker Script (Verbatim):**
  > *"To satisfy our quality attributes, CivicConnect adopts a Clean Layered Modular Architecture with strict inward dependency inversion.  
  > The Presentation Layer handles HTTP and WCAG-accessible UI. It invokes the Application Services Layer, which coordinates our use cases. At the center lies our Domain Core -- housing our ServiceRequest aggregate, FSM transition invariants, and domain events -- completely isolated from frameworks or databases. The Infrastructure Layer implements data persistence and external gateway adapters.  
  > In accordance with Milestone 2 Brief Section 5.3, we considered a distributed microservices architecture and explicitly rejected it. Distributing CivicConnect across multiple container services would introduce distributed transaction overhead, network latency violating ASR-001, and memory footprints exceeding 1.5 gigabytes, which directly breaches our free-tier 512-megabyte cap. Our Clean Modular Monolith provides complete logical decoupling while running at under 180 megabytes of RAM."*

---

### Slide 4: Technology Stack Commitment: Resolving ADR-003 via ADR-008
* **Speaker:** Chris Fourie (Systems Architect & Governance Lead)
* **Target Time:** 1:30 min (4:00 - 5:30)
* **Visuals on Slide:**
  * Weighted Decision Matrix Table from `ADR-008`:
    * Criteria: Memory & Free Tier (20%), Arch Fit (25%), Team Velocity (20%), Testing (15%), Docker (10%), Security (10%).
    * Scores: **TypeScript / Node.js (9.05)** vs C# / ASP.NET 8 (7.98) vs Python / FastAPI (7.93).
  * Tech Stack Badges: TypeScript 5.3, Node.js 20 LTS, Express, React 18, PostgreSQL 16, Vitest, Docker Compose.
* **Speaker Script (Verbatim):**
  > *"In Milestone 1, we justified deferring our technology stack in ADR-003. In Milestone 2, we resolved this deferment through an empirical Weighted Decision Matrix in ADR-008.  
  > We evaluated three candidate stacks against six weighted criteria. While ASP.NET Core scored high on compile-time typing, its base runtime memory footprint of 250 to 350 megabytes risked out-of-memory crashes on free-tier cloud containers.  
  > Candidate Stack A -- TypeScript on Node.js 20 LTS paired with PostgreSQL 16 -- won decisively with 9.05 out of 10. Node.js idles at just 45 megabytes, easily surviving our 512MB RAM cap. Furthermore, sharing TypeScript DTO interfaces between our React frontend and Express backend eliminates serialization drift and accelerates our delivery velocity.  
  > I will now walk through our Relational Data and Persistence Architecture."*

---

### Slide 5: Data & Persistence Baseline: Strict 3NF Relational Model & ERD
* **Speaker:** Chris Fourie (Systems Architect & Concurrency Lead)
* **Target Time:** 1:30 min (5:30 - 7:00)
* **Visuals on Slide:**
  * Mermaid ERD showing 8 core normalized tables: `roles`, `users`, `departments`, `staff_profiles`, `priorities`, `request_categories`, `service_requests`, `service_request_audit_logs`, `outbox_messages`, `status_transition_rules`.
  * Key columns highlighted: `version` (INT, OCC), `is_anonymized_display` (BOOLEAN), `category_code` (UK).
* **Speaker Script (Verbatim):**
  > *"Moving directly into our persistence architecture: In accordance with Section 5.4 of the M2 Brief and document DOC-ARCH-DATA-001, we established a strict Third Normal Form relational model in PostgreSQL 16.  
  > We rejected unstructured document databases like MongoDB because community service requests require declarative referential integrity. In our schema, categories, departments, and priority SLAs are isolated into dedicated lookup tables with foreign keys enforcing ON DELETE RESTRICT.  
  > To ensure non-repudiation, we separated active ticket state from historical records: the service_request_audit_logs table is strictly append-only, with no UPDATE or DELETE permissions granted. Furthermore, our status_transition_rules junction table stores our state machine directly in the database, ensuring illegal status jumps are rejected even if an API consumer bypasses frontend validation."*

---

### Slide 6: ACID Boundaries & Optimistic Concurrency Control (ADR-006)
* **Speaker:** Chris Fourie (Systems Architect & Concurrency Lead)
* **Target Time:** 1:15 min (7:00 - 8:15)
* **Visuals on Slide:**
  * Diagram of the Lost Update Problem vs Optimistic Concurrency Control (`ADR-006`):
    * Supervisor A & Supervisor B fetch Ticket v1 simultaneously.
    * Supervisor A commits: `version` becomes 2.
    * Supervisor B attempts update with `WHERE version = 1` -> 0 rows updated -> HTTP 409 Conflict returned!
  * Risk Register v2.0 highlight: `RSK-002` reduced from Exposure 16 (High) to 3 (Low).
* **Speaker Script (Verbatim):**
  > *"One of our critical findings in Assignment 2 Task 2 was the danger of race conditions during ticket assignment. When multiple supervisors triage an influx of tickets, or two technicians attempt to claim the same unassigned ticket, a lost-update anomaly can occur.  
  > In ADR-006, we evaluated pessimistic row locking versus optimistic locking. We rejected pessimistic locking because holding database row locks exhausts connection pools and causes query deadlocks.  
  > Instead, we implemented Optimistic Concurrency Control via an integer version column. When an update occurs, the SQL query checks WHERE version equals the expected version. If a collision occurs, exactly one transaction succeeds, while the other is rejected with an HTTP 409 Conflict response, prompting the UI to refresh. This completely mitigates Risk RSK-002 without blocking database reads.  
  > Lisa will now introduce our design pattern implementations."*

---

### Slide 7: Design Pattern 1: Observer Pattern for Multi-Channel Notifications (ADR-004)
* **Speaker:** Lisa Verson (Lead Requirements & Design Analyst)
* **Target Time:** 1:15 min (8:15 - 9:30)
* **Visuals on Slide:**
  * UML Class Diagram of the Observer Pattern (`ADR-004`):
    * `ServiceRequest` (Aggregate) -> `DomainEventDispatcher` (Subject) -> `IDomainEventObserver` (Interface).
    * Concrete Observers: `NotificationDispatchObserver`, `AuditLoggingObserver`.
  * Highlight: *Decoupling Domain Core from Volatile Sinks*.
* **Speaker Script (Verbatim):**
  > *"Thank you, Chris. Milestone 2 requires identifying at least two genuine design problems and resolving them using design patterns informed by Assignment 2 research.  
  > Our first design problem was the tight coupling of our ServiceRequest entity to secondary side-effects. When a ticket status changes, we must dispatch citizen notifications, alert technicians, and write audit logs. If the entity calls email or SMS services directly, external network failures break core ticket processing.  
  > In ADR-004, we implemented the in-memory Observer Pattern with a centralized DomainEventDispatcher. When a status transition occurs, the entity publishes a ServiceRequestStatusChangedEvent. Registered observers handle citizen messaging and audit logging independently.  
  > The introduced complexity is indirect control flow, which we mitigated by wrapping observer invocations in isolated error handlers so that a failed email notification can never corrupt ticket state."*

---

### Slide 8: Design Pattern 2: Factory Method Pattern for Polymorphic Intake (ADR-005)
* **Speaker:** Lisa Verson (Lead Requirements & Design Analyst)
* **Target Time:** 1:15 min (9:30 - 10:45)
* **Visuals on Slide:**
  * UML Class Diagram of the Factory Method Pattern (`ADR-005`):
    * `IServiceRequestFactory` (Interface) -> `ServiceRequestFactoryRegistry`.
    * Concrete Creators: `FacilitiesRequestFactory`, `ITSupportRequestFactory`, `SecurityHazardRequestFactory`, `GeneralMaintenanceRequestFactory`, `LostPropertyRequestFactory`.
  * Highlight: *Enforcing Open/Closed Principle (OCP)*.
* **Speaker Script (Verbatim):**
  > *"Our second design problem was heterogeneous category validation during ticket intake. CivicConnect processes diverse municipal categories: facilities faults require structural building numbers; IT tickets require asset tags; security hazards require immediate critical priority escalation.  
  > If we handled this using monolithic switch-case statements in our controllers, every new category would risk breaking existing intake routes, violating the Open/Closed Principle.  
  > In ADR-005, we implemented the GoF Factory Method Pattern. Each category has a dedicated creator class implementing IServiceRequestFactory. The application use case simply queries the factory registry. Adding a new municipal category in the future requires zero changes to core business logic -- we simply register a new factory. Our automated test suite exercises each factory in complete isolation."*

---

### Slide 9: Outbox Gateway Integration & WCAG 2.1 AA Accessible UI
* **Speaker:** Lisa Verson (Lead Requirements & Design Analyst)
* **Target Time:** 1:15 min (10:45 - 12:00)
* **Visuals on Slide:**
  * Transactional Outbox Pattern Flow (`ADR-007`): Database Transaction writes Ticket + Audit + Outbox -> Worker thread polls Outbox -> External SMS/Email Provider.
  * UI Wireframe Mockup: Accessible citizen submission portal, high-contrast badges ($>= 4.5:1$), visible focus rings, ARIA landmarks.
* **Speaker Script (Verbatim):**
  > *"To integrate with external email and SMS gateways without risking the Dual-Write Problem, we adopted the Transactional Outbox Pattern in ADR-007. Outbound messages are committed into an outbox table within the exact same database transaction as the ticket update. An internal polling worker dispatches messages asynchronously with exponential backoff retries, ensuring zero notification loss and sub-50ms API responses.  
  > On the user interface front, our wireframes adhere strictly to WCAG 2.1 Level AA standards. All interactive elements have a minimum contrast ratio of 4.5 to 1, all modals trap focus for full keyboard tab navigation, and citizen contact information is automatically masked on field technician screens to guarantee POPIA compliance.  
  > Chris will now demonstrate our living traceability and verified codebase."*

---

### Slide 10: Living Traceability (RTM v2.0), Deep Trace & Code Progress
* **Speaker:** Chris Fourie (Systems Architect & Governance Lead)
* **Target Time:** 1:15 min (12:00 - 13:15)
* **Visuals on Slide:**
  * Evolved RTM v2.0 Snapshot showing all 12 columns populated: Req ID -> ASR -> Layer -> Data Impact -> Design Pattern -> Tech -> File Path -> Verification Status.
  * Live Terminal / Code Snapshot: `16 passed (16)` in Vitest test runner; `docker compose up` healthy status.
* **Speaker Script (Verbatim):**
  > *"Thank you, Lisa. The Milestone 2 Brief explicitly mandates that the Requirements Traceability Matrix must be a living engineering instrument.  
  > In RTM v2.0, we have populated all 12 mandatory columns across all 14 functional and 10 non-functional requirements. For example, tracing FR-001 connects citizen need directly to ASR-001, to our Application Use Case, to our PostgreSQL 3NF table, to the Factory Method in ADR-005, to our implementation file CreateServiceRequest.ts, and to our passing Vitest integration test.  
  > In our repository, we have proven that controlled development has begun. We have implemented our domain entities, factories, observers, and REST controllers. Our automated test suite executes 16 unit and integration tests covering our state machine, optimistic concurrency, and factory validation -- achieving 100% passing tests in 1.2 seconds."*

---

### Slide 11: Appendix D Baseline Sign-Off Gate & Defence Handoff
* **Speaker:** Chris Fourie (Systems Architect & Governance Lead)
* **Target Time:** 0:45 min (13:15 - 14:00)
* **Visuals on Slide:**
  * Formal Appendix D Sign-Off Table: Version 2.0, Date 2026-09-30, Outcome: **ACCEPTED**.
  * Signatures of active team members: Chris Fourie, Lisa Verson (governed under `ADR-009` two-person operation).
  * Closing Slide: *Ready for Individual Engineering Defence*.
* **Speaker Script (Verbatim):**
  > *"In strict accordance with Appendix D of the Master Project Brief, our engineering team conducted a formal gate review and signed off on the Milestone 2 Baseline under our amended two-person governance agreement ADR-009.  
  > We have verified that our scope remains controlled, our architecture is defensible and proportionate, our tech stack is empirically justified, our data model is normalized and concurrency-safe, and our codebase demonstrates meaningful, authentic construction with automated CI quality gates and 100% peer review.  
  > We are confident in our engineering evidence, and we now welcome the panel's individual defence questions. Thank you."*
