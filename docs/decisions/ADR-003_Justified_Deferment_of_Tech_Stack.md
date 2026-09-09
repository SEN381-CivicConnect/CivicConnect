# ADR-003: Justified Deferment of Technology Stack Selection to Milestone 2

**Status:** ACCEPTED (Deliberately Deferred)  
**Date:** 2026-09-03  
**Deciders:** Lead Requirements Analyst (Student 1), Quality & Risk Engineer (Student 2), Systems Architect & Governance Lead (Student 3)  
**Governing Standard:** SEN381 Milestone 1 Brief §5, Master Project Brief §18.1  

---

## 1. Context & Problem Statement
In novice software projects, teams frequently select programming languages, frameworks, and databases based on personal familiarity, developer hype, or superficial popularity before properly understanding the system's functional requirements, non-functional quality attributes, and deployment constraints.

In SEN381 Milestone 1, the explicit milestone boundary (M1 Brief §5) states that *technology-stack selection is not a Milestone 1 deliverable*. Committing prematurely to a specific framework (e.g. React/Node.js or ASP.NET Core) during M1 violates engineering discipline and risks locking the project into an inappropriate architecture.

---

## 2. Decision Drivers & Constraints
* **Explicit M1 Boundary:** M1 establishes the *what*, *for whom*, and *within what constraints*, while M2 addresses the *how* and *why*.
* **Evidence-Based Technology Selection (Master Project Brief §18.1):** Technology choices must be justified using a weighted decision matrix evaluating requirement fit, team learning curves, security ecosystem, test tooling, deployment cost, and maintainability.
* **Preservation of Options:** Deferring the final commitment preserves architectural flexibility while candidate stacks are researched and benchmarked against baselined NFRs (`NFR-001` through `NFR-010`).

---

## 3. Considered Alternatives

### Alternative 1: Prematurely Lock In Stack in Milestone 1
Select a specific stack (e.g. Next.js + Prisma + PostgreSQL) immediately in Milestone 1.
* *Pros:* Allows early code scaffolding.
* *Cons:* Violates M1 Brief §5; bypasses formal weighted evaluation against baselined NFRs; risks penalty during M1 baseline assessment.

### Alternative 2: Deliberately Defer Stack Selection to Milestone 2 (Selected)
Maintain technology-neutral requirements, domain models, and state-machine specifications in Milestone 1. Define explicit selection criteria and candidate profiles to be formally evaluated via a weighted decision matrix in Milestone 2.
* *Pros:* Strictly complies with M1 guidelines; demonstrates mature engineering restraint and lifecycle awareness; prevents premature architectural bias.
* *Cons:* Code scaffolding is postponed until Milestone 2 start.

---

## 4. Decision Outcome

**Chosen Option:** **Alternative 2: Deliberately Defer Stack Selection to Milestone 2.**

### Positive Consequences
* The team avoids premature technical debt and vendor lock-in.
* Requirements (`FR-001` to `FR-014`) and Quality Attributes (`NFR-001` to `NFR-010`) remain pure, verifiable, and technology-agnostic.
* Establishes a rigorous foundation for the comparative architectural evaluation in Milestone 2.

### Criteria to Guide Milestone 2 Stack Selection
In Milestone 2, candidate stacks (e.g. TypeScript/React/Node.js vs C#/ASP.NET Core 8) will be formally evaluated against:
1. **Requirement & Architecture Fit:** Support for clean layered architecture and RBAC.
2. **Team Capability & Learning Curve:** Realistic delivery velocity within a 3-person team.
3. **Security Ecosystem & Dependency Health:** Built-in protection against OWASP Top 10 vulnerabilities.
4. **Automated Testing Tooling:** Native support for unit, integration, and mocking frameworks.
5. **Deployment Parity & Free-Tier Sustainability:** Zero-cost cloud PaaS hosting with Docker parity.

---

## 5. Traceability & Compliance
* **Linked Guidelines:** SEN381 Milestone 1 Brief §5 & Master Project Brief §18.1
* **Downstream Activity:** Formal evaluation and final selection in PED v2.0 (Milestone 2).
