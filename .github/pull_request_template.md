## 1. Pull Request Description & Engineering Context

### Summary of Change
<!-- Provide a concise description of the engineering change, rationale, and scope. -->

### Traceability Links
- **Linked Requirement ID(s):** <!-- e.g., FR-001, FR-005, NFR-003 -->
- **Linked Risk / Defect ID(s):** <!-- e.g., RSK-002, DEF-014 or N/A -->
- **Linked Decision / ADR(s):** <!-- e.g., ADR-001, ADR-002 -->
- **Affected Documentation:** <!-- e.g., PED v1.0 Section 5, RTM v1.0 -->

---

## 2. Type of Change
- [ ] `Feature` (New user-facing functionality satisfying baselined requirement)
- [ ] `Bugfix` (Remediation of defect or baseline non-conformance)
- [ ] `Documentation` (Controlled engineering artefact updates: PED, ADR, RTM)
- [ ] `Refactor` (Code structure change without altering external behavior)
- [ ] `Test` (Automated unit, integration, or regression test suites)
- [ ] `Governance/Tooling` (CI workflow, build tooling, repository configuration)

---

## 3. Engineering Quality & Verification Checklist
*The Author must verify each item prior to requesting peer review:*

- [ ] **Acceptance Criteria:** Verified against all relevant Gherkin `AC-xxx` scenarios in the RTM.
- [ ] **No Secrets:** Confirmed zero API keys, database credentials, or tokens committed.
- [ ] **Code / Doc Standards:** Follows team conventions and avoids unnecessary complexity.
- [ ] **Automated Tests:** Unit or integration tests added/updated where applicable.
- [ ] **AI Usage Recorded:** If AI assistance was utilized, it has been logged in `AI_Usage_Register_v1.0.md` with human verification notes.

---

## 4. Two-Reviewer Approval Verification (MANDATORY per SEN381 §9)
*At least TWO independent team members (excluding the author) must review and approve this PR.*

### Peer Reviewer 1
- **Reviewer Name / ID:** ____________________
- **Date Reviewed:** ____________________
- **Verification Summary:** <!-- e.g., Verified AC-001.1 and confirmed error handling for null payloads. -->
- **Sign-Off:** [ ] Approved

### Peer Reviewer 2
- **Reviewer Name / ID:** ____________________
- **Date Reviewed:** ____________________
- **Verification Summary:** <!-- e.g., Verified security boundaries, confirmed no hardcoded credentials, tested edge cases. -->
- **Sign-Off:** [ ] Approved
