# ADR-005: Factory Method Pattern for Polymorphic Service Request Intake & Categorical Validation

**Status:** ACCEPTED  
**Date:** 2026-09-17  
**Deciders:** Lead Requirements & Design Analyst (Lisa Verson), Systems Architect (Chris Fourie), Quality Engineer (Pandora Greyling)  
**Governing Standard:** SEN381 Master Project Brief §13, §18.1; Milestone 2 Brief §5.6; Assignment 2 Task 1 Research  
**Document Reference:** `DOC-ADR-005`  

---

## 1. Context & Problem Statement

CivicConnect ingests diverse categories of service requests from community members (`FR-001`, `FR-002`):
* **Facilities & Campus Infrastructure (`FAC_FAULT`):** Requires structural location (building, floor, room) and utility type (water, electrical, HVAC). Default priority: `HIGH`.
* **IT Support (`IT_SUPPORT`):** Requires asset/workstation tag, lab identifier, and connectivity type. Default priority: `MEDIUM`.
* **Campus Security & Safety (`SECURITY_HAZARD`):** Requires emergency urgency level, physical landmarks, and optional POPIA anonymization flag. Default priority: `CRITICAL`.
* **Damaged Equipment (`DAMAGED_EQUIPMENT`):** Requires photographic attachment hash and equipment classification. Default priority: `MEDIUM`.
* **General Maintenance (`GENERAL_MAINT`):** Routine cleaning, waste removal, groundskeeping. Default priority: `LOW`.
* **Lost Property (`LOST_PROPERTY`):** Requires item category, date/time lost, and custodial collection notes. Default priority: `LOW`.

If all validation logic, priority assignments, routing rules, and instantiation parameters are embedded in a single monolithic controller using nested `switch` or `if/else` statements, any change to a category's rules requires modifying the central controller. This violates the Open/Closed Principle (OCP), creates high cyclomatic complexity, increases defect risk (`RSK-004`), and complicates unit testing.

---

## 2. Decision Drivers & Quality Attributes

* **Extensibility & Open/Closed Principle (OCP):** Introducing a new municipal category (e.g., Environmental Health, Traffic Management) must only require adding a new validator/intake subclass without altering existing intake routes.
* **Domain Validation Correctness (`NFR-009`):** Category-specific invariants must be validated before persisting records to the database.
* **Testability (`NFR-008`):** Each category intake validator must be independently verifiable through isolated unit tests.
* **Maintainability:** Clear separation between generic intake workflows and domain-specific validation logic.

---

## 3. Considered Alternatives (Informed by Assignment 2 Research)

### Alternative 1: Monolithic Switch-Case Statement in Controller
Handle all category checks and payload parsing inside the HTTP route handler:
```typescript
switch (payload.category) {
  case 'FAC_FAULT': /* 30 lines of validation */ break;
  case 'IT_SUPPORT': /* 25 lines of validation */ break;
  // ...
}
```
* *Pros:* Simple to write initially; requires no additional classes.
* *Cons:* Severe code smell; violates OCP; cyclomatic complexity scales linearly with categories; high merge collision risk when multiple developers add categories.

### Alternative 2: Dynamic Reflection / Runtime String Class Loading
Load validator classes dynamically at runtime based on string category codes.
* *Pros:* Complete decoupling in source code.
* *Cons:* Bypasses compile-time type safety; difficult to trace and debug; introduces runtime `ClassNotFound` errors; violates NQF Level 8 defensible engineering standards.

### Alternative 3: Factory Method Pattern with Specialized Domain Creators (Selected)
Define an abstract creator/factory interface `ServiceRequestFactory` declaring a factory method `createServiceRequest(dto: CreateRequestDTO): ServiceRequest`. Concrete factories (`FacilitiesRequestFactory`, `ITSupportRequestFactory`, `SecurityHazardRequestFactory`, etc.) implement category-specific validation, default SLA priority assignment, and domain entity instantiation.
* *Pros:* Strict adherence to OCP and SRP; each factory encapsulates category rules; easily mockable in unit tests; compile-time type safety guaranteed.
* *Cons:* Introduced complexity: increases the total number of classes and requires a factory registry or resolver mechanism.

---

## 4. Decision Outcome

**Chosen Option:** **Alternative 3: Factory Method Pattern with Specialized Domain Creators.**

### Positive Consequences
* **Architectural Cleanliness:** The application use case (`CreateServiceRequestUseCase`) depends purely on the `ServiceRequestFactoryRegistry` and the abstract `ServiceRequestFactory` interface, keeping the intake pipeline completely decoupled from specific category rules.
* **Extensibility:** New municipal categories can be registered dynamically by registering a new concrete factory into the DI container without modifying core business logic.
* **Zero-Defect Intake:** Category-specific required fields (e.g., location coordinates, asset tags) are enforced before database persistence, preventing malformed data from entering the database.

### Negative Consequences & Accepted Complexity
* **Class Proliferation:** Requires defining an interface, an abstract base factory, and dedicated concrete factory classes for each category. Accepted because the structural clarity and isolated testability far outweigh the initial boilerplate.

---

## 5. Architectural & Implementation Mapping

* **Base Interfaces:** `IServiceRequestFactory`, `ServiceRequestFactoryRegistry`
* **Concrete Implementations:** `FacilitiesRequestFactory`, `ITSupportRequestFactory`, `SecurityHazardRequestFactory`, `GeneralMaintenanceRequestFactory`, `LostPropertyRequestFactory`
* **Affected Layers:** `Application Services Layer` (intake coordination) $\to$ `Domain Core Layer` (entity instantiation and validation).
* **Traced Requirements:** `FR-001` (Request Submission), `FR-002` (Categorization Taxonomy), `NFR-008` (Modularity), `NFR-009` (Data Correctness).
