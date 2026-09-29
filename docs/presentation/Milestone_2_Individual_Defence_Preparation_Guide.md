# CivicConnect: Milestone 2 Individual Engineering Defence Preparation Guide
## Comprehensive Examination Master Guide: 16 Indicative Defence Questions & High-Scoring Model Answers

**Project:** CivicConnect (Community Service Request Management Platform)  
**Academic Year:** 2026 | **Module:** Software Engineering 381 (SEN381) — NQF Level 8  
**Governing Standard:** SEN381 Master Project Brief §19, §20.2 & Milestone 2 Brief §13.2, §15  
**Assessment Weight:** 15 Raw Marks (Individual Engineering Defence)  
**Team Roster:**  
* **Chris Fourie (602826):** Systems Architect, Persistence, Concurrency & Governance Lead (~80% Workload)  
* **Lisa Verson (602006):** Lead Requirements, UI/UX & Design Patterns Analyst (~20% Workload)  
*(Note: Former member Pandora Greyling (602369) formally departed on 2026-09-29; all quality, persistence, and concurrency defence items absorbed by Chris Fourie under ADR-009)*  

---

## 1. Defence Structure & Scoring Criteria (15 Raw Marks)

In accordance with **Milestone 2 Brief Section 13.2**, assessors evaluate each student across 5 core competency dimensions (3 marks each = 15 raw marks):
1. **Command of Actual M2 Artefacts & Personal Contribution (3 Marks):** Can the student instantly locate and explain the specific documents, lines of code, and schemas they authored?
2. **Architecture / Data / Technology / Design Reasoning & Trade-offs (3 Marks):** Does the student explain *why* an approach was chosen and justify what trade-offs were accepted?
3. **Application of Research Evidence vs. Mechanical Copying (3 Marks):** Can the student explain how Assignment 2 research informed their engineering judgement without blindly obeying assignment recommendations?
4. **Traceability, Baseline & Downstream Lifecycle Consequences (3 Marks):** Can the student trace a requirement through design to code and explain the downstream impact if a decision changes?
5. **Authenticity, Accountability & Critique of Implementation (3 Marks):** Does the student demonstrate genuine hands-on mastery of the codebase and defend its engineering limitations honestly?

---

## 2. Master Model Answers for all 16 Indicative Defence Questions

---

### Question 1: Show one M1 requirement and trace how its engineering evidence has evolved by M2.
* **Primary Respondent:** Lisa Verson (Requirements Lead) or Chris Fourie (Architect)
* **Target Artefact to Open:** [`docs/requirements/Requirements_Traceability_Matrix_RTM_v2.0.md`](../requirements/Requirements_Traceability_Matrix_RTM_v2.0.md) & [`code/src/application/use-cases/CreateServiceRequest.ts`](../../code/src/application/use-cases/CreateServiceRequest.ts)
* **Model Answer:**
  > *"In Milestone 1, **FR-001** (*Citizen Service Request Submission*) was baselined with testable Gherkin acceptance criteria (`AC-001.1` and `AC-001.2`) and placeholder columns for architecture, design, and code.  
  > By Milestone 2, this requirement has completely evolved across the engineering lifecycle:
  > 1. **ASR Link:** Mapped to `NFR-001` (sub-500ms response time) and `NFR-005` (POPIA data protection).
  > 2. **Architecture Layer:** Allocated across our Presentation Layer (`RequestController.ts`), Application Layer (`CreateServiceRequest.ts`), and Domain Core (`ServiceRequest.ts`).
  > 3. **Data Impact:** Mapped to the `service_requests` table in `V1__initial_schema.sql` with foreign keys to `users`, `departments`, and `priorities`.
  > 4. **Design Decision:** Resolved using the **Factory Method Pattern (`ADR-005`)**, which delegates category-specific validation to specialized creator classes (`FacilitiesRequestFactory`, `ITSupportRequestFactory`).
  > 5. **Technology Decision:** Built on Node.js/TypeScript and PostgreSQL 16 (`ADR-008`).
  > 6. **Implementation Evidence:** Executable in `code/src/application/use-cases/CreateServiceRequest.ts`.
  > 7. **Verification Evidence:** Verified via automated unit tests in `ServiceRequestFactory.test.ts` and integration tests in `api.test.ts` where ticket submission returns HTTP 201."*

---

### Question 2: Which ASR most influenced your architecture, and what evidence supports that judgement?
* **Primary Respondent:** Chris Fourie (Systems Architect)
* **Target Artefact to Open:** [`docs/PED/PED_v2.0_Architecture_and_Design_Baseline.md`](../PED/PED_v2.0_Architecture_and_Design_Baseline.md#section-6-architecturally-significant-requirements-asrs--quality-drivers) & [`docs/decisions/ADR-008_Technology_Stack_Commitment.md`](../decisions/ADR-008_Technology_Stack_Commitment.md)
* **Model Answer:**
  > *"The single ASR that most heavily influenced our macro-architecture was **`ASR-002` (Cost & Resource Sustainability / `NFR-010`)** paired with **`ASR-001` (Latency / `NFR-001`)**.  
  > Our project constraint mandates a strictly \$0.00/month cloud hosting footprint on free-tier infrastructure (e.g. Render, Neon, Supabase) where container memory is capped at **512 MB of RAM**.  
  > This single driver eliminated distributed microservices, heavy Java/Spring runtimes, and standalone message brokers like Apache Kafka or RabbitMQ, which individually require over 1GB of memory. It directly dictated our selection of a **Clean Layered Modular Monolith** in TypeScript on Node.js 20 LTS. Node.js idles at ~45MB of RAM and peaks at <180MB under concurrent load, guaranteeing our application will not experience Out-of-Memory (OOM) container crashes while achieving our sub-500ms p95 latency target."*

---

### Question 3: What architecture alternative did you reject and why?
* **Primary Respondent:** Chris Fourie (Systems Architect)
* **Target Artefact to Open:** [`docs/PED/PED_v2.0_Architecture_and_Design_Baseline.md`](../PED/PED_v2.0_Architecture_and_Design_Baseline.md#72-proportional-architecture-defence-why-reject-microservices)
* **Model Answer:**
  > *"We considered and explicitly rejected a **Distributed Microservices Architecture**.  
  > While microservices are frequently taught as modern practice, adopting them for CivicConnect in a 3-person team under a 7-week academic schedule would represent gross over-engineering.  
  > Decomposing the platform into separate microservices (Auth, Intake, Queue, Notification, Analytics) would introduce:
  > 1. Distributed transaction complexity requiring Saga orchestrators to maintain consistency across tickets and audit logs.
  > 2. Network serialization latency across HTTP/gRPC boundaries, threatening our 500ms p95 latency SLA (`NFR-001`).
  > 3. Running 5 separate container instances would require over 1.5GB of RAM, immediately breaching our free-tier 512MB limit (`NFR-010`).  
  > We chose a **Clean Modular Monolith**: it gives us identical domain isolation and independent module testability in a single process without network or container tax."*

---

### Question 4: Show a data/persistence decision that protects business correctness.
* **Primary Respondent:** Chris Fourie (Systems Architect & Concurrency Lead)
* **Target Artefact to Open:** [`docs/decisions/ADR-006_Relational_Persistence_Optimistic_Concurrency.md`](../decisions/ADR-006_Relational_Persistence_Optimistic_Concurrency.md) & [`code/database/migrations/V1__initial_schema.sql`](../../code/database/migrations/V1__initial_schema.sql)
* **Model Answer:**
  > *"In `ADR-006` and our database migration `V1__initial_schema.sql`, we implemented **Optimistic Concurrency Control (OCC)** using an integer `version` column on the `service_requests` table to prevent the **Lost Update Problem**.  
  > In municipal service operations, multiple department supervisors triage open queues simultaneously, or two technicians may attempt to claim the same high-priority ticket at the same time (`FR-009`).  
  > Instead of pessimistic row locking—which starves database connection pools and causes query deadlocks—our application executes updates using atomic version checks:
  > `UPDATE service_requests SET assigned_staff_id = :staff_id, version = version + 1 WHERE request_id = :id AND version = :expected_version;`  
  > If zero rows are updated, another supervisor already modified the ticket. The transaction aborts cleanly, and our API returns an HTTP `409 Conflict` response with an explanatory message, prompting the client UI to refresh. This is verified by our automated test in `tests/unit/entities/OptimisticConcurrency.test.ts`."*

---

### Question 5: Show the evidence behind one technology-stack choice and the alternative considered.
* **Primary Respondent:** Chris Fourie (Systems Architect)
* **Target Artefact to Open:** [`docs/decisions/ADR-008_Technology_Stack_Commitment.md`](../decisions/ADR-008_Technology_Stack_Commitment.md#4-empirical-weighted-decision-matrix)
* **Model Answer:**
  > *"In `ADR-008`, we committed to **Node.js 20 LTS with TypeScript and Express** after evaluating it against **C# / ASP.NET Core 8 Web API** and **Python / FastAPI** using a formal Weighted Decision Matrix across 6 criteria.  
  > The primary alternative considered was C# / ASP.NET Core 8. While .NET Core scored highest in built-in compile-time type safety and enterprise DI (9.5/10), it scored poorly on Free-Tier Memory Footprint (6.0/10). The .NET base container runtime idles at 240MB–350MB of RAM. Under concurrent requests, it risks hitting the hard 512MB RAM cap on free-tier cloud PaaS.  
  > Candidate Stack A (TypeScript / Node.js) scored **9.05 out of 10** overall. It idles at 45MB RAM, builds lightweight 110MB Alpine Docker containers, and shares DTO interfaces between frontend React and backend Express, dramatically boosting our delivery velocity."*

---

### Question 6: Identify one A2 research finding that materially informed an M2 decision.
* **Primary Respondent:** Lisa Verson (Design Lead) or Chris Fourie (Architect)
* **Target Artefact to Open:** [`Assignments/Assignment_2/SEN381_Assignment_2_Research_to_Engineering_Decisions.md`](../../Assignments/Assignment_2/SEN381_Assignment_2_Research_to_Engineering_Decisions.md#32-comparative-evaluation-of-integration-mechanisms) & [`docs/decisions/ADR-007_Transactional_Outbox_Integration.md`](../decisions/ADR-007_Transactional_Outbox_Integration.md)
* **Model Answer:**
  > *"In Assignment 2 Task 3, our research investigated external notification gateway integration (email/SMS) and identified the **Dual-Write Problem**.  
  > If a backend controller updates the database and then immediately invokes an external third-party API like SendGrid synchronously, two severe failure modes arise:
  > 1. External network latency (often 800ms–2500ms) blocks the user's thread, violating `NFR-001` (p95 $\le 500\text{ms}$).
  > 2. If the external API fails or the database crashes midway, the system enters an inconsistent dual-write state where an email is sent for a ticket that was never saved.  
  > This research finding directly informed **`ADR-007`**, where we adopted the **Transactional Outbox Pattern**. Outbox event records are committed inside the *same atomic ACID database transaction* as the ticket update, and a lightweight background worker dispatches them asynchronously with exponential backoff retries."*

---

### Question 7: For one of your two design problems, what alternatives did A2 research identify and why is your final M2 choice appropriate here?
* **Primary Respondent:** Lisa Verson (Lead Requirements & Design Analyst)
* **Target Artefact to Open:** [`docs/decisions/ADR-004_Observer_Pattern_Notifications.md`](../decisions/ADR-004_Observer_Pattern_Notifications.md)
* **Model Answer:**
  > *"For Design Problem 1 (*Decoupled Multi-Channel Notification Dispatching*), Assignment 2 Task 1 evaluated three architectural alternatives:
  > 1. **Direct Procedural Invocations:** The controller sequentially calls email, SMS, and audit services. Rejected due to tight coupling and cascading failure risk.
  > 2. **Distributed Message Brokers (Apache Kafka / RabbitMQ):** Publishing events to an external cluster. Rejected because operating a dedicated broker requires over 1GB of RAM, violating our \$0.00 free-tier budget (`NFR-010`).
  > 3. **In-Memory Observer Pattern with Domain Event Dispatcher:** Selected in `ADR-004`.  
  > The in-memory Observer Pattern is optimal because it completely isolates our `ServiceRequest` entity from volatile notification channels using native TypeScript interfaces. Observers can be registered or swapped dynamically without modifying the entity, and it runs with zero additional memory overhead."*

---

### Question 8: Did any final M2 decision differ from the A2 recommendation? If so, what CivicConnect-specific evidence changed the judgement?
* **Primary Respondent:** Lisa Verson or Chris Fourie
* **Target Artefact to Open:** [`docs/governance/AI_Usage_Register_v2.0.md`](../governance/AI_Usage_Register_v2.0.md) & [`docs/decisions/ADR-004_Observer_Pattern_Notifications.md`](../decisions/ADR-004_Observer_Pattern_Notifications.md)
* **Model Answer:**
  > *"Yes. During our initial research drafting for Assignment 2 Task 1, generative AI strongly recommended deploying an **Apache Kafka message broker** to decouple event notifications, arguing that enterprise-scale event-driven architectures require distributed streaming.  
  > As human software engineers, our team critically evaluated this recommendation against our baselined constraints. Operating an Apache Kafka cluster requires a JVM running at least 1GB to 2GB of RAM and dedicated Zookeeper/KRaft coordination. On Render or Fly.io free tiers, container memory is hard-capped at 512MB RAM. Adopting Kafka would cause immediate Out-Of-Memory container termination and blow our \$0.00 budget (`NFR-010`).  
  > We explicitly rejected Kafka and pivoted to an **in-memory Observer Pattern paired with a database-backed Transactional Outbox**. This satisfies decoupling and reliability while consuming less than 5MB of heap memory."*

---

### Question 9: Show where a selected design pattern/approach appears in your design/application. What complexity did it introduce?
* **Primary Respondent:** Lisa Verson (Design Lead)
* **Target Artefact to Open:** [`code/src/domain/factories/CategoryFactories.ts`](../../code/src/domain/factories/CategoryFactories.ts) & [`tests/unit/factories/ServiceRequestFactory.test.ts`](../../code/tests/unit/factories/ServiceRequestFactory.test.ts)
* **Model Answer:**
  > *"The **Factory Method Pattern (`ADR-005`)** is implemented in `code/src/domain/factories/CategoryFactories.ts`.  
  > The abstract creator interface is `IServiceRequestFactory`, and the specialized creators are `FacilitiesRequestFactory`, `ITSupportRequestFactory`, `SecurityHazardRequestFactory`, `GeneralMaintenanceRequestFactory`, and `LostPropertyRequestFactory`.  
  > In `CreateServiceRequestUseCase.ts`, the application queries `ServiceRequestFactoryRegistry.getInstance().getFactory(dto.categoryCode)`.  
  > **Complexity Introduced:** The pattern introduces class proliferation—instead of a single 20-line switch-statement, we have an interface, a registry, and 5 distinct factory classes.  
  > **Why It Was Accepted:** It strictly enforces the **Open/Closed Principle (OCP)**. If a new municipal category (e.g., Road Hazards) is added next month, we write a single new factory class and register it. The intake pipeline and existing factories remain 100% untouched and protected from regression bugs."*

---

### Question 10: Show an ADR and explain what other PED/RTM/application artefacts would change if the decision changed.
* **Primary Respondent:** Chris Fourie (Systems Architect)
* **Target Artefact to Open:** [`docs/decisions/ADR-008_Technology_Stack_Commitment.md`](../decisions/ADR-008_Technology_Stack_Commitment.md)
* **Model Answer:**
  > *"If we look at **`ADR-008`** (*Technology Stack Commitment*), where we committed to TypeScript/Node.js and PostgreSQL 16:  
  > If this decision were changed—for instance, switching to C# / ASP.NET Core 8:
  > 1. **PED v2.0:** Section 8 (Tech Stack Matrix) would need a change rationale; Section 13 (Deployment) would need updated base Docker images (`mcr.microsoft.com/dotnet/aspnet:8.0`); Section 15 (Risk Register) would need to increase `RSK-008` (RAM limit) from Low to High.
  > 2. **RTM v2.0:** Column 8 (*Technology Decision*) across all 24 requirements would change from TypeScript/Express to C#/ASP.NET; Column 9 (*Implementation Evidence*) would point to `.cs` files instead of `.ts`.
  > 3. **Application Codebase:** `code/package.json` and `tsconfig.json` would be replaced with a `.csproj` solution; Express route handlers would be rewritten as ASP.NET API Controllers; Vitest test suites would be rewritten in xUnit/FluentAssertions.
  > 4. **Infrastructure:** `docker-compose.yml` would need larger memory limits, and the GitHub Actions CI pipeline would switch from `actions/setup-node` to `actions/setup-dotnet`."*

---

### Question 11: Open the RTM. Which columns have progressed since M1 and why?
* **Primary Respondent:** Lisa Verson (Requirements Lead)
* **Target Artefact to Open:** [`docs/requirements/Requirements_Traceability_Matrix_RTM_v2.0.md`](../requirements/Requirements_Traceability_Matrix_RTM_v2.0.md)
* **Model Answer:**
  > *"In Milestone 1, the RTM had placeholder columns marked 'TBD (M2)' because technology, detailed architecture, and patterns were deliberately deferred under `ADR-003`.  
  > In RTM v2.0, **6 entire columns have actively progressed**:
  > 1. **ASR / Quality-Driver Link:** Mapped each FR to its driving NFR (`NFR-001`, `NFR-004`, `NFR-006`, etc.).
  > 2. **Architecture Layer & Module:** Identifies whether the requirement belongs to Presentation, Application, Domain, or Infrastructure.
  > 3. **Data / Persistence Impact:** Names exact PostgreSQL tables, foreign key relationships, and ACID boundaries.
  > 4. **Design / Interface Decision:** Links applied GoF design patterns (`ADR-004` Observer, `ADR-005` Factory Method) and OpenAPI contracts.
  > 5. **Technology Decision:** Documents our committed runtime, framework, and database versions (`ADR-008`).
  > 6. **Implementation Evidence:** Points to concrete source files (e.g. `CreateServiceRequest.ts`, `V1__initial_schema.sql`).
  > 7. **Status:** Transitioned from pure 'Approved' to 'In Development' and 'Implemented'."*

---

### Question 12: Show a requirement marked In Development and its repository/application evidence.
* **Primary Respondent:** Chris Fourie (Systems Architect)
* **Target Artefact to Open:** [`docs/requirements/Requirements_Traceability_Matrix_RTM_v2.0.md`](../requirements/Requirements_Traceability_Matrix_RTM_v2.0.md#2-functional-requirements-traceability-matrix-fr-001-to-fr-014) & [`code/src/application/use-cases/AssignServiceRequest.ts`](../../code/src/application/use-cases/AssignServiceRequest.ts)
* **Model Answer:**
  > *"In RTM v2.0, **`FR-009`** (*Technician Assignment & Queue Ownership*) is marked **In Development**.  
  > Its repository and application evidence consists of:
  > 1. **Domain Logic:** `ServiceRequest.assignTechnician()` in `code/src/domain/entities/ServiceRequest.ts` (lines 142–165), which enforces that only tickets in `SUBMITTED` or `TRIAGED` can be assigned, increments the OCC `version` counter, and emits a `ServiceRequestAssignedEvent`.
  > 2. **Application Use Case:** `AssignServiceRequestUseCase` in `code/src/application/use-cases/AssignServiceRequest.ts`.
  > 3. **REST Controller:** `RequestController.assign` in `code/src/presentation/controllers/RequestController.ts`, mapped to `PATCH /api/v1/requests/:id/assign`.
  > 4. **Database Migration:** Table `service_requests` in `V1__initial_schema.sql` defining `assigned_staff_id UUID REFERENCES users(user_id)`.
  > 5. **Unit Verification:** Verified in `tests/unit/entities/OptimisticConcurrency.test.ts` where concurrent assignments throw `ConcurrencyConflictError`."*

---

### Question 13: Show your application documentation and explain how another developer would run/continue the project.
* **Primary Respondent:** Chris Fourie (Systems Architect)
* **Target Artefact to Open:** [`code/README.md`](../../code/README.md)
* **Model Answer:**
  > *"Our application documentation is located at `code/README.md`. It provides complete onboarding instructions for any new developer or assessor:
  > 1. **Prerequisites:** Lists Node.js v20 LTS, Docker Desktop v24+, and Git.
  > 2. **Turnkey Setup:** 
  >    - Run `npm install` to install dependencies.
  >    - Copy the environment template: `cp .env.example .env`.
  >    - Run `docker compose up -d` to provision our containerized PostgreSQL 16 database, which automatically mounts and executes our DDL migration `V1__initial_schema.sql` and baseline seeds `01_baseline_seeds.sql`.
  > 3. **Verification:** Run `npm test` to execute all 16 Vitest unit and integration tests.
  > 4. **Execution:** Run `npm run dev` to launch the API server on `http://localhost:3000`, verifiable via `http://localhost:3000/health/live`.  
  > The README also maps our Clean Architecture folder structure and lists all OpenAPI 3.0 REST endpoints with their HTTP status codes."*

---

### Question 14: What part of your implementation is meaningful project-specific work rather than generated scaffolding?
* **Primary Respondent:** Chris Fourie (Systems Architect) or Lisa Verson (Design Lead)
* **Target Artefact to Open:** [`code/src/domain/entities/ServiceRequest.ts`](../../code/src/domain/entities/ServiceRequest.ts) & [`code/src/domain/factories/CategoryFactories.ts`](../../code/src/domain/factories/CategoryFactories.ts)
* **Model Answer:**
  > *"Our implementation contains zero boilerplate scaffolding. Every single class directly reflects CivicConnect's domain rules:
  > 1. **Domain FSM Invariants:** `ServiceRequest.ts` contains our proprietary 6-state state machine transition validation graph, preventing illegal status jumps and enforcing `FR-011` mandatory action notes on resolution.
  > 2. **Optimistic Concurrency Control:** Explicit `version` increment logic and `ConcurrencyConflictError` exception handling that maps to HTTP 409 responses.
  > 3. **Custom GoF Factory Implementations:** In `CategoryFactories.ts`, we wrote domain-specific validation for `FAC_FAULT` (mandating building/room identifiers), `IT_SUPPORT` (connectivity details), and `SECURITY_HAZARD` (automatic priority escalation to CRITICAL with emergency tagging).
  > 4. **POPIA Anonymization Logic:** In `ServiceRequestDTO.ts`, custom masking logic intercepts technician views to anonymize citizen contact details while revealing them to administrators.
  > 5. **SQL Migrations & FSM Junction Rules:** In `V1__initial_schema.sql` and `01_baseline_seeds.sql`, 500 lines of custom SQL establishing foreign keys, check constraints, and FSM transition matrix rules."*

---

### Question 15: Which A2/Week 4 collaboration or CI recommendation have you adopted already, and which remains deferred?
* **Primary Respondent:** Chris Fourie (Governance Lead)
* **Target Artefact to Open:** [`.github/workflows/pr-governance-check.yml`](../../.github/workflows/pr-governance-check.yml), [`docs/decisions/ADR-002_GitHub_Governance_and_Two_Reviewer_Policy.md`](../decisions/ADR-002_GitHub_Governance_and_Two_Reviewer_Policy.md), & [`docs/decisions/ADR-009_Governance_Adjustment_Two_Person_Team.md`](../decisions/ADR-009_Governance_Adjustment_Two_Person_Team.md)
* **Model Answer:**
  > *"From our Assignment 2 Task 4 research and Week 4 teaching:  
  > **Adopted Already & Dynamically Adapted:**
  > 1. **Protected `main` Branch & Adaptive Peer Review Policy (`ADR-002` & `ADR-009`):** Direct pushes to `main` remain strictly blocked. When our third team member Pandora Greyling departed on 2026-09-29, retaining a two-reviewer threshold became mathematically impossible. We enacted `ADR-009`, adapting the policy to a **Single Mandatory Independent Peer Review (100% partner approval between Chris and Lisa) backed by an Automated CI Quality Gate**.
  > 2. **Automated CI Quality Gate:** Operationalized `.github/workflows/pr-governance-check.yml`, which verifies PR template completeness, traceability tag references (`FR-xxx`, `NFR-xxx`, `RSK-xxx`), and runs a secrets leak scan before any merge is permitted.
  > 3. **Short-Lived Feature Branches:** Adopting GitHub Flow with branches named `feat/db-persistence-v1` and `feat/m2-architecture-and-codebase`.  
  > **Deliberately Deferred to Milestone 3:**
  > Full automated CI build-and-test deployment pipeline with Docker image publishing, staging CD deployment, and mutation testing coverage gates. The Milestone 2 Brief explicitly clarifies that M2 requires repeatable automated checks, while a mature CI/CD pipeline belongs to Milestone 3."*

---

### Question 16: What did AI assist with, what did the team verify, and where is the evidence?
* **Primary Respondent:** Chris Fourie (Systems Architect) or Lisa Verson (Design Lead)
* **Target Artefact to Open:** [`docs/governance/AI_Usage_Register_v2.0.md`](../governance/AI_Usage_Register_v2.0.md)
* **Model Answer:**
  > *"In accordance with Section 10 of the Master Project Brief, all AI use is recorded in `docs/governance/AI_Usage_Register_v2.0.md`.  
  > AI was used strictly as an assistive research and drafting tool. Crucially, our register documents **three major instances of critical human oversight and rejection**:
  > 1. **Rejection of Apache Kafka (2026-09-15):** Claude 3.5 Sonnet recommended deploying Kafka for event notifications. Lisa Verson cross-referenced this against `NFR-010` (\$0 cloud cost) and 512MB RAM free-tier limits, recognizing Kafka would cause container OOM termination. We rejected it and implemented an in-memory Observer Pattern (`ADR-004`).
  > 2. **Rejection of Pessimistic Locking (2026-09-17):** ChatGPT proposed database row locks (`SELECT FOR UPDATE`). Chris Fourie and Pandora Greyling analyzed this against concurrency literature (Kleppmann, 2017) and rejected it due to connection pool starvation and deadlocks, selecting Optimistic Concurrency Control (`ADR-006`).
  > 3. **Rejection of Synchronous Third-Party API Calls (2026-09-18):** AI drafted direct HTTP calls to SendGrid inside the request loop. We rejected it due to latency amplification and Dual-Write inconsistency, selecting the Transactional Outbox Pattern (`ADR-007`).  
  > 100% of generated code and documentation was reviewed, refined, and tested by human team members."*
