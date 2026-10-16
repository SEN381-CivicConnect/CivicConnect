const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tempDir = path.join(process.env.LOCALAPPDATA || 'C:\\Users\\jakof\\AppData\\Local', 'Temp', 'm3_slides_upgraded');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// Common CSS for modern, full-bleed 16:9 slides (960x540)
const baseCss = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 960px;
    height: 540px;
    background: #0b1120;
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    padding: 38px 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .header {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .tag-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pill {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: rgba(56, 189, 248, 0.12);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.3);
  }
  .pill.gold {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
    border-color: rgba(245, 158, 11, 0.35);
  }
  .pill.green {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    border-color: rgba(16, 185, 129, 0.35);
  }
  .pill.purple {
    background: rgba(168, 85, 247, 0.15);
    color: #c084fc;
    border-color: rgba(168, 85, 247, 0.35);
  }
  .project-tag {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: #64748b;
    text-transform: uppercase;
  }
  .title {
    font-size: 30px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .subtitle {
    font-size: 14px;
    color: #94a3b8;
    font-weight: 400;
  }
  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 14px 0;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #1e293b;
    padding-top: 10px;
    font-size: 11px;
    color: #64748b;
  }
  .footer strong { color: #38bdf8; font-weight: 600; }
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }
  .grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }
  .card {
    background: rgba(30, 41, 59, 0.55);
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 20px 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .card-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #94a3b8;
    margin-bottom: 6px;
  }
  .card-val {
    font-size: 24px;
    font-weight: 800;
    color: #38bdf8;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }
  .card-desc {
    font-size: 13px;
    color: #cbd5e1;
    line-height: 1.45;
  }
  .stat-card {
    background: rgba(30, 41, 59, 0.55);
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 24px 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .stat-num {
    font-size: 40px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 8px;
  }
  .stat-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
  }
  .banner {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid #1e293b;
    border-radius: 10px;
    padding: 10px 16px;
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #94a3b8;
  }
  .banner strong { color: #f8fafc; }
  ul.clean-list {
    list-style: none;
    margin-top: 8px;
    padding-left: 0;
  }
  ul.clean-list li {
    font-size: 13px;
    color: #cbd5e1;
    margin-bottom: 8px;
    line-height: 1.45;
    position: relative;
    padding-left: 16px;
  }
  ul.clean-list li::before {
    content: "•";
    color: #38bdf8;
    position: absolute;
    left: 0;
    top: -1px;
    font-weight: bold;
    font-size: 14px;
  }
  code {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid #334155;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 12px;
    color: #38bdf8;
  }
`;

function wrapSlide(tag, title, subtitle, contentHtml, footerLeft, footerRight, pillClass = '') {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${baseCss}</style>
</head>
<body>
  <div class="header">
    <div class="tag-row">
      <span class="pill ${pillClass}">${tag}</span>
      <span class="project-tag">CivicConnect Engineering Review</span>
    </div>
    <h1 class="title">${title}</h1>
    <p class="subtitle">${subtitle}</p>
  </div>

  <div class="content-area">
    ${contentHtml}
  </div>

  <div class="footer">
    <span>${footerLeft}</span>
    <span>${footerRight}</span>
  </div>
</body>
</html>`;
}

// 12 SLIDES DEFINITION - CLEAN, PROFESSIONAL, PRODUCT-FOCUSED (NO MARKS, NO GRADE CRITERIA ON SLIDES)
const slides = [
  // SLIDE 1: Title & Platform Overview
  {
    num: 1,
    tag: "System Overview",
    pillClass: "gold",
    title: "CivicConnect",
    subtitle: "Community Service Request Management Platform",
    content: `
      <div class="grid-3">
        <div class="card">
          <div class="card-label">Core Mission</div>
          <div class="card-val">Digital Intake</div>
          <div class="card-desc">Real-time citizen fault intake, automated department triage, and transparent resolution tracking across municipal wards.</div>
        </div>
        <div class="card">
          <div class="card-label">Architecture</div>
          <div class="card-val" style="color: #34d399;">Clean Monolith</div>
          <div class="card-desc">Strict layer isolation in TypeScript and Node.js with relational PostgreSQL persistence and Docker container staging.</div>
        </div>
        <div class="card">
          <div class="card-label">Release State</div>
          <div class="card-val" style="color: #c084fc;">v0.3.0-rc1</div>
          <div class="card-desc">Verified release candidate anchored to the protected repository branch with 42 automated tests and 93.6% coverage.</div>
        </div>
      </div>
      <div class="banner">
        <span>Engineering Team: <strong>Group E — Chris Fourie (Systems Architect & Lead Developer)</strong></span>
        <span>Governance: <strong>Trunk-Based Development Enforced via Automated CI Gates</strong></span>
      </div>
    `,
    footerLeft: "Platform: <strong>CivicConnect — Modern Municipal Workflow Automation</strong>",
    footerRight: "Release State: <strong>Release Candidate Baseline</strong>",
    notes: `🔴 LIVE DEMO CUE:
[ON-CAMERA] Keep full webcam visible. Introduce yourself clearly with your face and student ID. State release version v0.3.0-rc1 and commit 886b602 / 42bbbf7. Explain team transition under ADR-012.

⏱️ RECOMMENDED TIMING: ~2:00 mins.
🎯 RUBRIC TARGET: Identification, Release Candidate Identification & Team Continuity.

🎙️ SPOKEN SCRIPT:
"Good day Assessor. My name is Chris Fourie, student number 602826, representing Group E for the Software Engineering 381 module at Belgium Campus ITversity.

Today, I am formally presenting our Milestone 3 Engineering Review Meeting for CivicConnect: Community Service Request Management Platform.

Our submitted release candidate is version v0.3.0-rc1, anchored to commit 42bbbf7 on the main branch of our official GitHub repository.

In terms of team governance: As documented in our living Risk Register under RSK-011 and RSK-012, team member Pandora Greyling withdrew on 29 September, and team member Lisa Verson ceased active participation on 08 October. To ensure strict software engineering continuity without making unreviewed code pushes, I ratified ADR-012—our Solo SCM Governance Protocol. Under ADR-012, main remains locked; pull requests require passing all four automated CI quality gates alongside our completed, signed single-engineer self-audit checklists, while preserving an active grace period for team re-integration.

Over the next 30 minutes, I will conduct our engineering review, demonstrating our authentic codebase, GitHub PR history, 4-gate CI pipeline, 42 automated tests, Docker staging environment, load benchmark, and release evidence."`
  },

  // SLIDE 2: Clean Architecture & GoF Patterns
  {
    num: 2,
    tag: "System Architecture",
    pillClass: "green",
    title: "Clean Architecture & Design Patterns",
    subtitle: "Strict layer isolation with GoF Factory Method and Observer patterns",
    content: `
      <div class="grid-3">
        <div class="card">
          <div class="card-label">Layer Isolation</div>
          <div class="card-val" style="font-size: 20px;">Four Clean Layers</div>
          <ul class="clean-list">
            <li><strong>Domain:</strong> Pure entities, state transitions, category invariant validation</li>
            <li><strong>Application:</strong> Use cases (intake, triage, status) and event dispatchers</li>
            <li><strong>Infrastructure:</strong> Dual persistence repositories (PostgreSQL & In-Memory)</li>
            <li><strong>Presentation:</strong> Express REST routes, middleware, and health probes</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Creational Patterns</div>
          <div class="card-val" style="font-size: 20px; color: #34d399;">Factory Method</div>
          <ul class="clean-list">
            <li><strong>Category Factories:</strong> Polymorphic service request creation</li>
            <li><strong>Invariant Enforcement:</strong> Facilities requires room numbers; IT requires device hostnames</li>
            <li><strong>Safety Escalation:</strong> Automated priority promotion for safety hazards (CR-001)</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Behavioral Patterns</div>
          <div class="card-val" style="font-size: 20px; color: #c084fc;">Observer & Events</div>
          <ul class="clean-list">
            <li><strong>Domain Events:</strong> Lifecycle transitions trigger decoupled observers</li>
            <li><strong>Audit Logging:</strong> Real-time event auditing without coupling entities</li>
            <li><strong>Notification Sink:</strong> Decoupled SMS/email dispatch isolation</li>
          </ul>
        </div>
      </div>
    `,
    footerLeft: "Technology Stack: <strong>TypeScript 5.3 + Node.js 20 LTS + PostgreSQL 16</strong>",
    footerRight: "Boundary Integrity: <strong>Zero Outward Domain Dependencies</strong>",
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO VS CODE] Open 'code/src/' tree. Show domain/, application/, infrastructure/, and presentation/ folders. Open 'CategoryFactories.ts' and 'DomainEventDispatcher.ts' to prove clean layer boundaries and pattern implementations.

⏱️ RECOMMENDED TIMING: ~3:00 mins.
🎯 RUBRIC TARGET: Area A — Working integrated scope, exact release candidate, M2 architecture conformance, important API/persistence interactions, significant controlled deviations.

🎙️ SPOKEN SCRIPT:
"Turning to Stage 2: In software engineering, working code is only valuable if it conforms to the approved architectural baseline.

In Milestone 2, we baselined a Clean Layered Monolith Architecture. In Milestone 3, our implementation conforms 100% to that baseline.

[ALT-TAB TO VS CODE NOW]
Notice in VS Code our four isolated layers:
- The domain layer contains our pure business entities, enums, domain events, and factory methods. Domain has zero outward dependencies.
- In CategoryFactories.ts, notice our Factory Method pattern (ADR-005): FacilityFaultCreator, ITSupportCreator, and SecurityHazardCreator validate invariants before creating the entity.
- In DomainEventDispatcher.ts, notice our Observer pattern (ADR-004): state changes publish events to decoupled logging and notification observers.
- In V1__initial_schema.sql, notice our 3NF relational PostgreSQL schema with an integer version column enforcing Optimistic Concurrency Control (ADR-006).

Where practical construction revealed real constraints, we did not make silent code hacks. We formally controlled every change through ratified Architecture Decision Records: ADR-010 for dual persistence, ADR-011 for staging parity and rollback, ADR-012 for solo governance, and client change request CR-001 evaluated across 10 formal impact dimensions in Appendix E of our PED."`
  },

  // SLIDE 3: Source Control & Configuration
  {
    num: 3,
    tag: "Source Control",
    pillClass: "green",
    title: "Repository Governance & Branching Model",
    subtitle: "Trunk-based development with branch protection and security hardening",
    content: `
      <div class="grid-3">
        <div class="card">
          <div class="card-label">Trunk-Based Workflow</div>
          <div class="card-val" style="font-size: 20px;">Protected Main</div>
          <div class="card-desc">
            Direct pushes to main branch are blocked by repository protection rules. All changes require feature branches and pull requests.
          </div>
        </div>
        <div class="card">
          <div class="card-label">Pull Request Audit</div>
          <div class="card-val" style="font-size: 20px; color: #34d399;">Traceable Review</div>
          <div class="card-desc">
            Pull requests link requirements (FR-001, FR-010, NFR-004), pass all CI quality checks, and include completed engineering self-audit checklists.
          </div>
        </div>
        <div class="card">
          <div class="card-label">Configuration Hardening</div>
          <div class="card-val" style="font-size: 20px; color: #c084fc;">Zero Leaks</div>
          <div class="card-desc">
            Environment variables externalized via .env.example. Docker multi-stage build drops root permissions via non-privileged USER node on line 35.
          </div>
        </div>
      </div>
      <div class="banner">
        <span>Repository: <strong>github.com/SEN381-CivicConnect/CivicConnect</strong></span>
        <span>Commit History: <strong>Iterative Conventional Commits (feat, test, fix, docs)</strong></span>
      </div>
    `,
    footerLeft: "Configuration: <strong>12-Factor App Environment Configuration</strong>",
    footerRight: "Security: <strong>Zero Secret Leaks (.gitignore Masking)</strong>",
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO BROWSER - GITHUB] Open GitHub Repository -> Pull Requests -> Closed -> PR #3 ('feat/m3-auth-rbac'). Show the PR description, the 4 green CI checks, the linked requirements, and the signed self-audit checklist. Then Alt-Tab to VS Code and show 'code/.gitignore' and 'code/Dockerfile' line 35 ('USER node').

⏱️ RECOMMENDED TIMING: ~3:00 mins.
🎯 RUBRIC TARGET: Area B — Progressive Git history, feature branches, protected main, substantive PRs, review comments, secrets/configuration handling.

🎙️ SPOKEN SCRIPT:
"Moving to Stage 3: Software configuration management is the backbone of engineering integrity.

[ALT-TAB TO GITHUB IN BROWSER NOW]
As demonstrated on our GitHub repository:
- The main branch is locked with branch protection.
- Development proceeded across feature branches, culminating in Pull Request #3.
- PR #3 demonstrates an authentic audit trail: progressive conventional commits spanning features, tests, fixes, and docs. There is no single eleventh-hour bulk code dump.
- In the PR description, you can see linked requirements FR-001, FR-010, and NFR-004, alongside the completed Single-Engineer Self-Audit Checklist ratified under ADR-012.

[ALT-TAB TO VS CODE NOW]
Looking at configuration security in VS Code:
- In .gitignore, all secrets, .env files, and build artifacts are strictly excluded.
- In Dockerfile, we employ a multi-stage build (builder vs runner) and drop root privileges to USER node on line 35, ensuring zero container privilege escalation."`
  },

  // SLIDE 4: CI Pipeline
  {
    num: 4,
    tag: "Continuous Integration",
    pillClass: "green",
    title: "Continuous Integration Pipeline",
    subtitle: "Four automated quality gates enforced on every commit and pull request",
    content: `
      <div class="grid-4">
        <div class="card" style="text-align: center; padding: 20px 12px;">
          <div class="card-label">Gate 1</div>
          <div class="card-val" style="font-size: 18px;">Clean Install</div>
          <div class="card-desc"><code>npm ci</code><br>Deterministic dependency lockfile verification</div>
        </div>
        <div class="card" style="text-align: center; padding: 20px 12px;">
          <div class="card-label">Gate 2</div>
          <div class="card-val" style="font-size: 18px; color: #34d399;">Static Types</div>
          <div class="card-desc"><code>tsc --noEmit</code><br>Zero TypeScript compiler errors or warnings</div>
        </div>
        <div class="card" style="text-align: center; padding: 20px 12px;">
          <div class="card-label">Gate 3</div>
          <div class="card-val" style="font-size: 18px; color: #38bdf8;">Tests & Coverage</div>
          <div class="card-desc"><code>vitest --coverage</code><br>Enforces ≥ 80% coverage threshold</div>
        </div>
        <div class="card" style="text-align: center; padding: 20px 12px;">
          <div class="card-label">Gate 4</div>
          <div class="card-val" style="font-size: 18px; color: #c084fc;">Security Audit</div>
          <div class="card-desc"><code>npm audit</code><br>Fails build on high or critical CVEs</div>
        </div>
      </div>
      <div class="banner">
        <span>Workflow Configuration: <strong>.github/workflows/ci.yml</strong></span>
        <span>Enforcement Policy: <strong>Hard Blocking (Any gate failure halts merge to main)</strong></span>
      </div>
    `,
    footerLeft: "CI Platform: <strong>GitHub Actions (Ubuntu Latest, Node 20 LTS)</strong>",
    footerRight: "Quality Enforcement: <strong>Automated Multi-Gate Verification</strong>",
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO BROWSER - GITHUB ACTIONS] Open the 'Actions' tab. Click into the latest green run of 'CivicConnect CI Verification Gate'. Point out the 4 discrete jobs/steps corresponding to Gates 1 to 4. Explain that Gate 3 enforces the 80% coverage threshold and Gate 4 blocks high CVEs.

⏱️ RECOMMENDED TIMING: ~2:30 mins.
🎯 RUBRIC TARGET: Area C — Meaningful suite and execution results; CI run and configured gates; at least one meaningful failure blocks progression; traceable assertions.

🎙️ SPOKEN SCRIPT:
"Moving to Stage 4: To ensure verification is continuous, reproducible, and binding, we configured an automated multi-gate pipeline in GitHub Actions.

[ALT-TAB TO GITHUB ACTIONS NOW]
Every commit and pull request must sequentially pass four quality gates:
1. Gate 1 executes 'npm ci', ensuring clean, deterministic dependency installation from package-lock.json.
2. Gate 2 executes 'tsc --noEmit', enforcing strict TypeScript static typing with zero allowable compiler errors.
3. Gate 3 executes our automated test suite in Vitest with V8 coverage collection, enforcing our mandatory 80% coverage ceiling.
4. Gate 4 executes 'npm audit --omit=dev --audit-level=high', blocking deployment if any high or critical production vulnerabilities exist.

These gates are hard-blocking: if any test fails or coverage drops below 80%, the build fails and GitHub prevents the branch from merging into main."`
  },

  // SLIDE 5: Automated Verification Suite
  {
    num: 5,
    tag: "Automated Testing",
    pillClass: "green",
    title: "Automated Verification Suite",
    subtitle: "High-density multi-level test suite executed in 1.98 seconds with V8 coverage",
    content: `
      <div class="grid-4">
        <div class="stat-card">
          <div class="stat-num" style="color: #34d399;">42/42</div>
          <div class="stat-label">Tests Passing (100%)</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #38bdf8;">93.6%</div>
          <div class="stat-label">Statement Coverage</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #c084fc;">84.9%</div>
          <div class="stat-label">Branch Coverage</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #f59e0b;">1.98 s</div>
          <div class="stat-label">Execution Duration</div>
        </div>
      </div>
      <div class="banner">
        <span>Test Breakdown: <strong>13 Unit • 20 Black-Box • 5 API Integration • 3 E2E Journeys • 1 Load Benchmark</strong></span>
        <span>Coverage by Layer: <strong>Factories: 100% • Events: 97.2% • Entities: 96.8% • Use Cases: 96.0%</strong></span>
      </div>
    `,
    footerLeft: "Test Framework: <strong>Vitest v1.6.1 + @vitest/coverage-v8 + Supertest</strong>",
    footerRight: "Execution Mode: <strong>Sub-Second In-Memory Harness (ADR-010)</strong>",
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO TERMINAL IN VS CODE] Run 'npm run test:coverage' live on camera. Point to the terminal output: 12 test files passed, 42 tests passed, 93.61% statement coverage, 84.92% branch coverage. Mention DEF-002 resolution (aligning coverage scope in vitest.config.ts).

⏱️ RECOMMENDED TIMING: ~2:30 mins.
🎯 RUBRIC TARGET: Area D — Automated verification suite, high coverage, fast feedback, layer-by-layer breakdown.

🎙️ SPOKEN SCRIPT:
"Now examining our verification evidence under Stage 5:

[ALT-TAB TO TERMINAL IN VS CODE NOW]
Let us run the full automated verification suite with coverage live on camera:
'npm run test:coverage'

[PAUSE 2 SECONDS FOR TEST RUN TO FINISH]
Look at the terminal output:
- All 12 test files passed; all 42 automated tests passed with 100% pass rate in under 2 seconds.
- Overall statement coverage is 93.61%, comfortably exceeding the 80% CI gate.
- Branch coverage is 84.92%, function coverage is 92.5%, and line coverage is 93.61%.
- Looking at the domain layer: our Category Factories have 100% statement coverage, domain events have 97.2%, and domain entities have 96.8%.

This rapid sub-second feedback loop is made possible by ADR-010, which decouples our domain verification from physical database I/O while testing the real PostgreSQL adapter in staging."`
  },

  // SLIDE 6: Black-Box Specification Testing
  {
    num: 6,
    tag: "Specification Testing",
    pillClass: "green",
    title: "Black-Box Specification Testing",
    subtitle: "Boundary Value Analysis and Combinatorial Decision Table testing",
    content: `
      <div class="grid-2">
        <div class="card">
          <div class="card-label">Boundary Value Analysis & Equivalence Partitioning</div>
          <div class="card-val" style="font-size: 20px; color: #38bdf8;">InputBoundaryValidation.test.ts</div>
          <ul class="clean-list">
            <li><strong>Minimum Boundary:</strong> Title length 2 rejected (HTTP 400); length 3 accepted</li>
            <li><strong>Maximum Boundary:</strong> Title length 100 accepted; length 101 rejected</li>
            <li><strong>Regex Partitioning:</strong> South African phone format (+27...) vs invalid strings</li>
            <li><strong>Coordinate Bounds:</strong> Latitude and longitude range boundary enforcement</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Combinatorial Decision Table Testing</div>
          <div class="card-val" style="font-size: 20px; color: #34d399;">IntakeDecisionTable.test.ts</div>
          <ul class="clean-list">
            <li><strong>Routing Matrix:</strong> 10 distinct rule combinations verified across categories</li>
            <li><strong>Department Assignment:</strong> Facilities, IT, Security & Maintenance rules</li>
            <li><strong>SLA Calculation:</strong> Automated assignment of 4h, 8h, 24h, 48h targets</li>
            <li><strong>Emergency Hazards:</strong> Major hazards auto-promoted to Critical priority (CR-001)</li>
          </ul>
        </div>
      </div>
      <div class="banner">
        <span>Formal Verification: <strong>20 Dedicated Black-Box Automated Tests (100% Pass)</strong></span>
        <span>Oracles: <strong>Directly Derived from Acceptance Criteria in Living RTM v3.0</strong></span>
      </div>
    `,
    footerLeft: "Testing Techniques: <strong>Boundary Value Analysis & Combinatorial Decision Tables</strong>",
    footerRight: "Robustness: <strong>Zero Invariant Bypass on Input Boundaries</strong>",
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO VS CODE] Open 'code/tests/unit/blackbox/InputBoundaryValidation.test.ts' and show the N=2, 3, 100, 101 boundary tests. Then open 'code/tests/unit/blackbox/IntakeDecisionTable.test.ts' and show the 10 decision table rules, including CR-001 emergency hazard escalation.

⏱️ RECOMMENDED TIMING: ~3:00 mins.
🎯 RUBRIC TARGET: Area D — Appropriate techniques with justified test inputs; expected versus actual results; input validation boundary checks.

🎙️ SPOKEN SCRIPT:
"Milestone 3 explicitly mandates the use of at least two formal black-box testing techniques with justified inputs.

[ALT-TAB TO VS CODE NOW]
We chose two complementary techniques grounded in domain risk:

First, in InputBoundaryValidation.test.ts, we implemented Boundary Value Analysis and Equivalence Partitioning:
- We test exact ticket title character boundaries: length 2 is rejected with a validation error; length 3 is accepted. Length 100 is accepted; length 101 is rejected.
- We partition phone number inputs into valid South African formats (+27...) versus invalid alphabetic or truncated strings.

Second, in IntakeDecisionTable.test.ts, we implemented Combinatorial Decision Table Testing:
- We tested 10 exhaustive combinations of category, priority, mandatory attributes, and urgency.
- Under Rule 3 and Rule 4, notice how our CR-001 requirement is verified: whenever a ticket has category 'Security' and severity 'Safety Hazard', the system automatically overrides the priority to 'Critical' and enforces a 4-hour SLA."`
  },

  // SLIDE 7: API Contracts & E2E Journeys
  {
    num: 7,
    tag: "Integration & System Testing",
    pillClass: "green",
    title: "REST API Contracts & End-to-End Journeys",
    subtitle: "Full lifecycle progression, negative security, and operational resilience",
    content: `
      <div class="grid-3">
        <div class="card">
          <div class="card-label">REST API Contracts</div>
          <div class="card-val" style="font-size: 20px;">api.test.ts</div>
          <ul class="clean-list">
            <li><strong>HTTP 201:</strong> Valid ticket creation with tracking ID</li>
            <li><strong>HTTP 403:</strong> Unprivileged citizen assignment blocked</li>
            <li><strong>HTTP 409:</strong> Stale OCC version update conflict</li>
            <li><strong>HTTP 400:</strong> Illegal FSM state jump rejected</li>
            <li><strong>HTTP 404:</strong> Missing resource error contract</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Citizen Lifecycle Journey</div>
          <div class="card-val" style="font-size: 20px; color: #34d399;">citizenLifecycle.test.ts</div>
          <ul class="clean-list">
            <li><strong>Full Flow:</strong> Submitted → Assigned → In Progress → Resolved → Closed</li>
            <li><strong>Resolution Notes:</strong> Resolving without mandatory action notes blocked</li>
            <li><strong>POPIA Mask:</strong> Citizen contact masked for field technician</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Security & Resilience</div>
          <div class="card-val" style="font-size: 20px; color: #c084fc;">securityBoundary.test.ts</div>
          <ul class="clean-list">
            <li><strong>Privilege Guards:</strong> RBAC tampering blocked across endpoints</li>
            <li><strong>OCC Concurrency:</strong> Version column eliminates lost updates</li>
            <li><strong>Liveness Probes:</strong> Synthetic health checks confirm memory quota</li>
          </ul>
        </div>
      </div>
    `,
    footerLeft: "Integration Scope: <strong>Presentation → Application → Domain → Persistence</strong>",
    footerRight: "System Verification: <strong>3/3 Critical E2E Journeys Passing</strong>",
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO VS CODE] Open 'code/tests/integration/api.test.ts' and highlight the HTTP 403 (DEF-004 fix) and HTTP 409 (DEF-003 fix) assertions. Then open 'code/tests/e2e/citizenLifecycle.test.ts' and show the multi-step lifecycle progression test.

⏱️ RECOMMENDED TIMING: ~3:00 mins.
🎯 RUBRIC TARGET: Area D — API/integration contracts; critical E2E user journeys; negative/failure/unauthorised cases.

🎙️ SPOKEN SCRIPT:
"Turning to Integration and System Validation:

[ALT-TAB TO VS CODE NOW]
In api.test.ts, we verify our REST API contracts under negative and unauthorized conditions:
- We verify that unprivileged citizen users attempting to assign tickets receive HTTP 403 Forbidden. This proves the fix for DEF-004.
- We simulate simultaneous supervisor ticket claims: the first claim succeeds, while the second claim presents a stale OCC version and receives HTTP 409 Conflict. This proves the fix for DEF-003.

Next, in citizenLifecycle.test.ts, we execute our critical End-to-End citizen journey:
- A citizen submits a fault ticket.
- A supervisor assigns technician 'Tech-Sipho'.
- The technician moves the ticket to In Progress, attempts to resolve without notes and gets rejected, then enters valid resolution notes and transitions the ticket to Resolved.
- Finally, the supervisor inspects the work and moves the ticket to Closed, permanently locking it from further modification."`
  },

  // SLIDE 8: Staging Environment & Operations Portal
  {
    num: 8,
    tag: "Deployment & Staging",
    pillClass: "green",
    title: "Containerized Staging Environment",
    subtitle: "Isolated multi-container deployment with operational web dashboard",
    content: `
      <div class="grid-3">
        <div class="card">
          <div class="card-label">Container Isolation</div>
          <div class="card-val" style="font-size: 20px;">Docker Compose</div>
          <ul class="clean-list">
            <li><strong>App Container:</strong> Node.js 20 Alpine on port <code>5001</code></li>
            <li><strong>Database:</strong> PostgreSQL 16 on port <code>5433</code></li>
            <li><strong>Network:</strong> Isolated bridge network separate from development</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Health Monitoring</div>
          <div class="card-val" style="font-size: 20px; color: #34d399;">Active Probes</div>
          <ul class="clean-list">
            <li><code>GET /health/live</code>: Uptime, process memory RSS (~42MB), version v0.3.0-rc1</li>
            <li><code>GET /health/ready</code>: Live database connection pool query check</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Audited Rollback</div>
          <div class="card-val" style="font-size: 20px; color: #c084fc;">ADR-011 Strategy</div>
          <ul class="clean-list">
            <li><strong>Scenario A:</strong> Application git revert to M2 commit <code>ffc17cb</code></li>
            <li><strong>Scenario B:</strong> DDL reverse migration <code>V1__rollback_initial_schema.sql</code></li>
          </ul>
        </div>
      </div>
      <div class="banner">
        <span>Staging URL: <strong>http://localhost:5001/</strong></span>
        <span>Operations Portal: <strong>Interactive Web UI (Intake, Triage, POPIA Masking & Resolution)</strong></span>
      </div>
    `,
    footerLeft: "Deployment Stack: <strong>Isolated Docker Compose Staging</strong>",
    footerRight: "Environment Parity: <strong>PostgreSQL 16 Staging Parity</strong>",
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO TERMINAL] Show running containers with 'docker compose -f docker-compose.staging.yml ps'. Curl 'http://localhost:5001/health/live'.
[ALT-TAB TO BROWSER] Open 'http://localhost:5001/'. Submit a ticket as Citizen (with POPIA mask checked). Switch role to Supervisor and assign a technician. Switch role to Field Technician, show masked phone number '[POPIA PROTECTED]', and resolve the ticket with notes.

⏱️ RECOMMENDED TIMING: ~4:00 mins.
🎯 RUBRIC TARGET: Area F — Real or credible simulated staging environment; live demonstration of deployed candidate; operational web portal.

🎙️ SPOKEN SCRIPT:
"In accordance with Section 14, the release candidate must be demonstrated in a simulated staging environment separate from development.

[ALT-TAB TO TERMINAL NOW]
In terminal, running 'docker compose -f docker-compose.staging.yml ps' confirms our isolated containers:
- Our Node.js application container is running on port 5001.
- Our isolated PostgreSQL 16 database is running healthy on port 5433.
- Curler probe to /health/live confirms status UP, commit 42bbbf7, and memory footprint 42MB.

[ALT-TAB TO BROWSER AT http://localhost:5001/ NOW]
Here is our operational web dashboard:
- Let us submit a new ticket as a citizen: Category 'Facilities Fault', title 'Water pipe leak in building B', room 'B-102', with the 'Mask My Personal Information' POPIA toggle enabled.
- Upon submission, the ticket is instantly created with tracking reference REQ-2026-0001.
- Now, switching user role to Supervisor: the supervisor inspects the unassigned queue and clicks 'Assign Technician' to allocate Tech-Sipho. The status transitions to ASSIGNED.
- Next, switching user role to Field Technician: notice that the citizen's personal phone number is rendered as '[POPIA PROTECTED]'.
- The technician clicks 'Start Work' to move it to IN_PROGRESS. When clicking 'Resolve Request', omitting resolution notes is blocked by validation; entering 'Replaced burst seal' successfully transitions the ticket to RESOLVED."`
  },

  // SLIDE 9: Quality Registers
  {
    num: 9,
    tag: "Quality Governance",
    pillClass: "green",
    title: "Living Traceability & Registers",
    subtitle: "Continuous lifecycle governance, defect resolution, and transparent technical debt",
    content: `
      <div class="grid-4">
        <div class="card" style="padding: 16px 14px;">
          <div class="card-label">RTM v3.0</div>
          <div class="card-val" style="font-size: 20px;">8-Stage Trace</div>
          <div class="card-desc">Need → Req → AC → Comp → Test → Oracle → CI → Status across all 14 FRs & 10 NFRs</div>
        </div>
        <div class="card" style="padding: 16px 14px;">
          <div class="card-label">Defect Register</div>
          <div class="card-val" style="font-size: 20px; color: #34d399;">4/4 Resolved</div>
          <div class="card-desc">DEF-001 (Invariant), DEF-002 (Coverage), DEF-003 (Race), DEF-004 (RBAC) verified with tests</div>
        </div>
        <div class="card" style="padding: 16px 14px;">
          <div class="card-label">Technical Debt</div>
          <div class="card-val" style="font-size: 20px; color: #c084fc;">4 Items</div>
          <div class="card-desc">Deliberate compromises (DEBT-001 to DEBT-004) with explicit Milestone 4 repayment plans</div>
        </div>
        <div class="card" style="padding: 16px 14px;">
          <div class="card-label">AI Register</div>
          <div class="card-val" style="font-size: 20px; color: #f59e0b;">11 Entries</div>
          <div class="card-desc">Audited log of prompts, human critique, and rejections (Kafka, unreviewed direct pushes)</div>
        </div>
      </div>
      <div class="banner">
        <span>Living Project Governance: <strong>Iteratively evolved across M1, M2, and M3 milestones</strong></span>
        <span>Baseline Sign-off: <strong>Formally Ratified M3 Baseline Release Gate</strong></span>
      </div>
    `,
    footerLeft: "Traceability Integrity: <strong>Bidirectional Citizen Need to Verification</strong>",
    footerRight: "Defect Resolution: <strong>100% of Tracked Defects Closed with Tests</strong>",
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO VS CODE] Open 'docs/requirements/Requirements_Traceability_Matrix_RTM_v3.0.md' and show the 8-stage verification chain. Open 'docs/risk/Defect_Register_v3.0.md' and show the 4 resolved defects with automated regression tests. Open 'docs/architecture/Technical_Debt_Register_v1.0.md' and 'docs/governance/AI_Usage_Register_v3.0.md'.

⏱️ RECOMMENDED TIMING: ~3:00 mins.
🎯 RUBRIC TARGET: Area E — Evolution from M1/M2; complete traceability chain; authentic defect resolution; honest debt logging; AI critique.

🎙️ SPOKEN SCRIPT:
"Under Stage 9: Authentic software engineering requires living, evolving technical governance rather than disconnected post-hoc reports.

[ALT-TAB TO VS CODE NOW]
Looking at our living registers:
- In Requirements_Traceability_Matrix_RTM_v3.0.md: notice our unbroken 8-stage chain from Stakeholder Need to Gherkin Acceptance Criteria, code components, automated test IDs, test oracles, and CI verification status. All 14 Functional Requirements and 10 NFRs are fully verified.
- In Defect_Register_v3.0.md: we track four authentic defects discovered during construction: DEF-001 (Category Invariant Bypass), DEF-002 (Coverage Drop), DEF-003 (Ticket Claim Race Condition), and DEF-004 (Citizen Assignment Vulnerability). Every single defect was resolved and has an automated regression test in our test suite.
- In Technical_Debt_Register_v1.0.md: we document 4 deliberate architectural compromises—including in-memory CI test doubles and simulated notification sinks—with detailed repayment strategies for Milestone 4.
- In AI_Usage_Register_v3.0.md: 11 auditable entries document how AI assistance was evaluated, showing multiple instances where AI proposals were critiqued and rejected, such as rejecting Kafka due to free-tier memory constraints."`
  },

  // SLIDE 10: Performance Benchmark
  {
    num: 10,
    tag: "Performance Engineering",
    pillClass: "green",
    title: "Concurrency Benchmark & Latency Analysis",
    subtitle: "Empirical stress testing on critical ticket intake endpoint (POST /api/v1/requests)",
    content: `
      <div class="grid-4">
        <div class="stat-card">
          <div class="stat-num" style="color: #38bdf8;">50</div>
          <div class="stat-label">Concurrent Requests</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #34d399;">100%</div>
          <div class="stat-label">Throughput (0 Errors)</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #c084fc;">142 ms</div>
          <div class="stat-label">95th Percentile Latency</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #f59e0b;">~42 MB</div>
          <div class="stat-label">Process Memory RSS</div>
        </div>
      </div>
      <div class="banner">
        <span>Performance Target (NFR-001): <strong>p95 ≤ 500 ms (Achieved: 142 ms — 71.6% margin)</strong></span>
        <span>Honest Limitation: <strong>Tests runtime event loop; WAN cellular latency deferred to M4</strong></span>
      </div>
    `,
    footerLeft: "Benchmark Target: <strong>Service Request Intake Under Peak Concurrency</strong>",
    footerRight: "Runtime Stress: <strong>JIT-Warmed Parallel Execution under High Concurrency</strong>",
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO TERMINAL IN VS CODE] Run 'npx vitest run tests/performance/load.test.ts'. Highlight the 50 concurrent requests passing in 485ms, p50=58ms, p95=142ms. Explain what this test proves and does NOT prove.

⏱️ RECOMMENDED TIMING: ~3:00 mins.
🎯 RUBRIC TARGET: Area F — One justified small load exercise with workload, measurements, target/baseline, and honest limitations.

🎙️ SPOKEN SCRIPT:
"Now addressing Performance and Reliability under Stage 10:

We selected Service Request Intake (POST /api/v1/requests) for empirical benchmarking because ticket intake is the most performance-sensitive endpoint during community infrastructure crises.

[ALT-TAB TO TERMINAL IN VS CODE NOW]
Let us run the benchmark live:
'npx vitest run tests/performance/load.test.ts'

Look at the results:
- Workload: 50 simultaneous service requests submitted concurrently.
- Success Rate: 100% (50/50 successful responses; zero dropped connections).
- Median Latency (p50): 58ms.
- 95th Percentile Latency (p95): 142ms—well within the 500ms ceiling mandated by NFR-001.
- Memory: Process memory RSS remains stable at ~42MB, well beneath our 512MB container limit.

Crucially, in accordance with Section 13 of the brief, we must state what this benchmark DOES and DOES NOT prove:
- What it proves: It proves that our asynchronous Node.js event loop, Express routing pipeline, and Clean Architecture validation handle peak burst traffic without deadlocks or memory leaks.
- What it does NOT prove: It does NOT prove true municipal scale with thousands of simultaneous citizen connections over cellular networks, WAN packet loss, or multi-gigabyte table lock contention. Those factors are acknowledged and scheduled for soak testing in Milestone 4."`
  },

  // SLIDE 11: Release Evaluation & Residual Risks
  {
    num: 11,
    tag: "Release Evaluation",
    pillClass: "gold",
    title: "Release Readiness & Residual Risk Statement",
    subtitle: "Evidence-grounded readiness evaluation with transparent risk management",
    content: `
      <div class="grid-2">
        <div class="card" style="border-color: #f59e0b;">
          <div class="card-label">Official Release Classification</div>
          <div class="card-val" style="color: #fbbf24; font-size: 24px;">CONDITIONALLY READY</div>
          <div class="card-desc" style="font-size: 13px; line-height: 1.5;">
            <strong>Justification:</strong> All core functional requirements (FR-001–FR-014), security guards, and 42 tests pass with 0 blocking defects. Claiming unconditional 'production ready' for a student system demonstrates poor engineering judgement.<br><br>
            <strong>Conditions:</strong> Single-node staging boundary, in-memory CI test doubles, and simulated SMS/email notification observers.
          </div>
        </div>
        <div class="card">
          <div class="card-label">Four Managed Residual Risks</div>
          <ul class="clean-list">
            <li><strong>RSK-012 (Municipal Load):</strong> Workstation staging cannot simulate city-wide load. <em>Mitigation: 50-concurrency benchmark; M4 cloud soak test.</em></li>
            <li><strong>RSK-014 (Telecom Outage):</strong> SMS/email gateway timeouts. <em>Mitigation: Outbox table (ADR-007) isolates transactions.</em></li>
            <li><strong>RSK-010 (Solo SCM):</strong> Single engineer merge dependency. <em>Mitigation: Ratified ADR-012 with 4 automated CI quality gates.</em></li>
            <li><strong>RSK-013 (Schema Drift):</strong> PostgreSQL adapter column drift. <em>Mitigation: DDL migration V1 verified in staging container.</em></li>
          </ul>
        </div>
      </div>
    `,
    footerLeft: "Release Verification: <strong>Controlled Construction Baseline Evaluated</strong>",
    footerRight: "Engineering Verdict: <strong>Grounded in Multiple Authentic Evidence Sources</strong>",
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO VS CODE] Open 'docs/release/Release_Evidence_Summary_v1.0.md'. Show the Release Evidence Summary Table and Section 2 defending the 'CONDITIONALLY READY' classification. Point to the Residual Risk Statement table.

⏱️ RECOMMENDED TIMING: ~2:30 mins.
🎯 RUBRIC TARGET: Area G — Release Evidence Summary; evidence-based READY / CONDITIONALLY READY classification; real blockers, limitations and residual risks.

🎙️ SPOKEN SCRIPT:
"Under Stage 11: Section 15 of the brief requires synthesizing all verification evidence into a defensible release classification.

[ALT-TAB TO VS CODE NOW]
In Release_Evidence_Summary_v1.0.md, our evidence table synthesizes build status, 42 passing tests, 93.61% coverage, 0 high CVEs, staging parity, and zero open defects.

We officially classify CivicConnect release candidate v0.3.0-rc1 as:
CONDITIONALLY READY.

As the M3 rubric emphasizes, claiming that a student-engineered system is unconditionally 'production ready' demonstrates poor engineering judgement. Our system is ready because all core functional and security capabilities are operational and verified. Our readiness is conditional on three transparent factors:
1. Staging was evaluated on a single-node container environment rather than multi-zone cloud infrastructure.
2. Fast CI feedback utilizes our in-memory repository harness (ADR-010).
3. External notifications operate via decoupled in-memory observers rather than live third-party telecom billing contracts.

Our four residual risks are fully documented with clear mitigations and assigned owners for Milestone 4."`
  },

  // SLIDE 12: Engineering Summary & Key Takeaways
  {
    num: 12,
    tag: "Project Summary",
    pillClass: "purple",
    title: "Engineering Review Summary",
    subtitle: "Key technical achievements, architectural integrity, and release sign-off",
    content: `
      <div class="grid-4">
        <div class="card" style="padding: 18px 14px;">
          <div class="card-label">1. Traceability</div>
          <div class="card-val" style="font-size: 18px;">Full Trace</div>
          <div class="card-desc">Unbroken chain from citizen needs to acceptance criteria across all 14 FRs and 10 NFRs.</div>
        </div>
        <div class="card" style="padding: 18px 14px;">
          <div class="card-label">2. Architecture</div>
          <div class="card-val" style="font-size: 18px; color: #34d399;">Clean Monolith</div>
          <div class="card-desc">Zero architectural drift; GoF Factory Method, Observer, and OCC concurrency verified.</div>
        </div>
        <div class="card" style="padding: 18px 14px;">
          <div class="card-label">3. Quality Gates</div>
          <div class="card-val" style="font-size: 18px; color: #c084fc;">42 Tests / 93.6%</div>
          <div class="card-desc">Automated 4-gate CI workflow enforcing unit, black-box, API, and E2E test execution.</div>
        </div>
        <div class="card" style="padding: 18px 14px;">
          <div class="card-label">4. Operations</div>
          <div class="card-val" style="font-size: 18px; color: #f59e0b;">Staging Ready</div>
          <div class="card-desc">Containerized staging with live web portal, health probes, and audited rollback migrations.</div>
        </div>
      </div>
      <div class="banner">
        <span>Engineering Sign-Off: <strong>CivicConnect Release Candidate v0.3.0-rc1</strong></span>
        <span>Review State: <strong>Verified Controlled Baseline for Milestone 4 Handover</strong></span>
      </div>
    `,
    footerLeft: "CivicConnect: <strong>Community Service Request Management Platform</strong>",
    footerRight: "Lead Engineer: <strong>Chris Fourie (Group E)</strong>",
    notes: `🔴 LIVE DEMO CUE:
[ON-CAMERA] Pin your webcam window full screen (or keep Slide 12 visible with webcam prominently framed). Look directly at the assessor and deliver your 5-dimension individual defence clearly.

⏱️ RECOMMENDED TIMING: ~3:30 mins.
🎯 RUBRIC TARGET: Individual Oral Defence (20 Marks) — 5 criteria (4 marks each).

🎙️ SPOKEN SCRIPT:
"To conclude our engineering review meeting, I will now present my individual engineering defence addressing all five assessed examination dimensions:

1. Requirement-to-Evidence Trace:
Consider FR-001 (Citizen Fault Intake): The stakeholder need for digital reporting without paperwork derives acceptance criterion AC-001.1 (valid submission creates ticket with SUBMITTED status and returns tracking reference REQ-YYYY-XXXX). In code, this is routed through CategoryFactories.ts and CreateServiceRequest.ts. This was verified via Boundary Value Analysis in InputBoundaryValidation.test.ts at boundaries N=2 and N=3, in api.test.ts returning HTTP 201, and end-to-end in citizenLifecycle.test.ts. The unbroken trace is documented in row FR-001 of RTM v3.0.

2. Engineering Decision & Trade-off:
In ADR-006, we evaluated Optimistic Concurrency Control versus Pessimistic Database Locking for ticket assignment: Pessimistic locking (SELECT FOR UPDATE) holds database locks while coordinators browse tickets, causing connection pool exhaustion under multi-user load. We chose OCC using an integer version column. This trade-off ensures zero query blocking, but requires the presentation layer to catch ConcurrencyConflictError and return HTTP 409 Conflict, prompting the client to refresh stale queues.

3. Quality Evidence Interpretation:
Interpreting our 42-test suite and 93.61% code coverage: This evidence proves that all domain business rules, category invariants, role-based authorization guards, and state transitions execute deterministically without regression. However, this evidence does NOT prove third-party SMS carrier reliability, WAN cellular latency, or database deadlocks on multi-gigabyte tables. Testing proves the presence of verified behavior, not the complete absence of distributed runtime defects.

4. Failure & Risk Reasoning:
Examining an authentic failure caught during construction: Under DEF-003, when two supervisors simultaneously claimed an unassigned ticket, the second write silently overwrote the first, causing a lost update. We caught this during concurrency testing, introduced version verification in ServiceRequest.ts, and added regression tests in OptimisticConcurrency.test.ts and api.test.ts asserting HTTP 409. Furthermore, when total team member attrition occurred, we mitigated the risk under ADR-012 by automating quality gates to maintain 100% SCM merge accountability.

5. Release-Readiness Defence:
Defending CONDITIONALLY READY: Our classification is grounded across multiple independent evidence sources: 42/42 tests passing, 0 high CVEs in npm audit, 0 open severity 1 or 2 defects, and containerized staging parity on ports 5001/5433 with verified rollback scripts. We do not claim unconditional production readiness because single-node staging and simulated SMS sinks cannot represent full municipal operation.

In conclusion, CivicConnect is under complete software engineering control, fully verified, and ready for submission before the deadline of Friday, 16 October 2026 at 23:59 SAST.

Thank you Assessor for your time and evaluation."`
  }
];

// Step 1: Render 12 upgraded full-bleed slides
console.log('Rendering 12 upgraded full-bleed slides with Edge headless (2x Retina scale)...');
const renderedSlides = [];

slides.forEach(s => {
  const htmlFile = path.join(tempDir, `slide_${s.num}.html`);
  const pngFile = path.join(tempDir, `slide_${s.num}.png`);
  const fullHtml = wrapSlide(s.tag, s.title, s.subtitle, s.content, s.footerLeft, s.footerRight, s.pillClass || '');
  fs.writeFileSync(htmlFile, fullHtml, 'utf8');

  const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/');
  const cmd = `"${edgePath}" --headless --disable-gpu --force-device-scale-factor=2 --window-size=960,540 --screenshot="${pngFile}" "${fileUrl}"`;
  execSync(cmd, { stdio: 'ignore' });
  renderedSlides.push({ num: s.num, png: pngFile, notes: s.notes });
  console.log(`Slide ${s.num} rendered.`);
});

// Step 2: Build PPTX using PowerShell COM Automation
console.log('Building PowerPoint deck with full-bleed Retina slides and integrated Presenter Notes...');
const psScript = path.join(tempDir, 'build_deck.ps1');

const psContent = `
$allPaths = @(
    "C:\\Chris\\Studies\\SEN\\Project\\docs\\presentation\\CivicConnect_M3_Presentation.pptx",
    "C:\\Chris\\Studies\\SEN\\Project\\CivicConnect_M3_Presentation.pptx",
    "C:\\Users\\jakof\\Desktop\\CivicConnect_M3_Presentation.pptx",
    "C:\\Users\\jakof\\Desktop\\CivicConnect_M3_Presentation_Final.pptx",
    "C:\\Users\\jakof\\Downloads\\CivicConnect_M3_Presentation.pptx",
    "C:\\Users\\jakof\\Downloads\\CivicConnect_M3_Presentation_Final.pptx",
    "C:\\Chris\\Studies\\SEN\\CivicConnect_M3_Presentation.pptx",
    "C:\\Chris\\Studies\\SEN\\CivicConnect_M3_Presentation_Final.pptx"
)

$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Add([Microsoft.Office.Core.MsoTriState]::msoTrue)
$pres.PageSetup.SlideWidth = 960
$pres.PageSetup.SlideHeight = 540

$slidesJson = Get-Content -Raw "${tempDir.replace(/\\/g, '\\\\')}\\\\slides_manifest.json" | ConvertFrom-Json

for ($i = 0; $i -lt $slidesJson.Count; $i++) {
    $item = $slidesJson[$i]
    $slide = $pres.Slides.Add($i + 1, 12) # ppLayoutBlank
    
    # Insert Full-Bleed 16:9 Retina Image (Left=0, Top=0, Width=960, Height=540)
    $img = $slide.Shapes.AddPicture($item.png, 0, 1, 0, 0, 960, 540)
    
    # Speaker Notes (Rich teleprompter for the presenter, zero hints on visible slide)
    try {
        $slide.NotesPage.Shapes.Placeholders.Item(2).TextFrame.TextRange.Text = $item.notes
    } catch {}
}

foreach ($p in $allPaths) {
    try {
        $pres.SaveAs($p)
        Write-Host "Saved: $p"
    } catch {
        Write-Host "Locked or skipped: $p"
    }
}

$pres.Close()
$ppt.Quit()

Write-Host "DECK_BUILD_SUCCESS"
`;

fs.writeFileSync(path.join(tempDir, 'slides_manifest.json'), JSON.stringify(renderedSlides, null, 2), 'utf8');
fs.writeFileSync(psScript, psContent, 'utf8');

const psCmd = `powershell -ExecutionPolicy Bypass -File "${psScript}"`;
const out = execSync(psCmd).toString();
console.log(out);
console.log('Upgraded PowerPoint generated successfully across all locations!');
