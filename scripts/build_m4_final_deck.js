const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tempDir = path.join(process.env.LOCALAPPDATA || 'C:\\Users\\jakof\\AppData\\Local', 'Temp', 'm4_slides_16');
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
    padding: 32px 42px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .tag-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pill {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 10px;
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
  .pill.red {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border-color: rgba(239, 68, 68, 0.35);
  }
  .project-tag {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: #64748b;
    text-transform: uppercase;
  }
  .title {
    font-size: 25px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .subtitle {
    font-size: 13px;
    color: #94a3b8;
    font-weight: 400;
  }
  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 8px 0;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #1e293b;
    padding-top: 8px;
    font-size: 11px;
    color: #64748b;
  }
  .footer strong { color: #38bdf8; font-weight: 600; }
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  .card {
    background: rgba(30, 41, 59, 0.55);
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .card-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #94a3b8;
    margin-bottom: 4px;
  }
  .card-val {
    font-size: 20px;
    font-weight: 800;
    color: #38bdf8;
    margin-bottom: 6px;
    letter-spacing: -0.01em;
  }
  .card-desc {
    font-size: 12px;
    color: #cbd5e1;
    line-height: 1.4;
  }
  .stat-card {
    background: rgba(30, 41, 59, 0.55);
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 16px 12px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .stat-num {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 6px;
  }
  .stat-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
  }
  .banner {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid #1e293b;
    border-radius: 8px;
    padding: 8px 14px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: #94a3b8;
  }
  .banner strong { color: #f8fafc; }
  ul.clean-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  ul.clean-list li {
    font-size: 12px;
    color: #cbd5e1;
    line-height: 1.35;
    padding-left: 14px;
    position: relative;
  }
  ul.clean-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #38bdf8;
    font-weight: 800;
  }
  .table-clean {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }
  .table-clean th {
    text-align: left;
    padding: 6px 8px;
    background: rgba(15, 23, 42, 0.8);
    color: #38bdf8;
    font-weight: 700;
    border-bottom: 1px solid #334155;
    text-transform: uppercase;
    font-size: 9px;
    letter-spacing: 0.05em;
  }
  .table-clean td {
    padding: 5px 8px;
    border-bottom: 1px solid #1e293b;
    color: #e2e8f0;
  }
  .cue-bar {
    background: rgba(56, 189, 248, 0.08);
    border: 1px dashed rgba(56, 189, 248, 0.4);
    border-radius: 6px;
    padding: 6px 12px;
    margin-top: 8px;
    font-size: 11px;
    color: #38bdf8;
    font-family: 'Consolas', monospace;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  code {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid #334155;
    padding: 2px 5px;
    border-radius: 4px;
    font-family: 'Consolas', monospace;
    font-size: 11px;
    color: #38bdf8;
  }
`;

function wrapSlide(tag, title, subtitle, content, footerLeft, footerRight, pillClass = '') {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${baseCss}</style>
</head>
<body>
  <div class="header">
    <div class="tag-row">
      <span class="project-tag">SEN381 Software Engineering 381 • Capstone Final Project</span>
      <span class="pill ${pillClass}">${tag}</span>
    </div>
    <div class="title">${title}</div>
    <div class="subtitle">${subtitle}</div>
  </div>
  <div class="content-area">
    ${content}
  </div>
  <div class="footer">
    <span>${footerLeft}</span>
    <span>${footerRight}</span>
  </div>
</body>
</html>`;
}

// 16 Focused Slides — Pure Spoken Words in Notes, Clear Visual Cards
const slides = [
  // SLIDE 1
  {
    num: 1,
    tag: "Milestone 4 Final Release",
    pillClass: "gold",
    title: "CivicConnect: Final Product Release & Capstone Engineering Review",
    subtitle: "Finalise • Consolidate • Conclude — Demonstrating Lifecycle Accountability & Engineering Evidence",
    footerLeft: "Chris Fourie (ID: 602826) • Systems Architect & Lead Developer",
    footerRight: "Baseline v0.4.0-final • Commit f1fcdf9 • 18 Oct 2026",
    content: `
      <div class="grid-3">
        <div class="card">
          <div class="card-label">Capstone Identity</div>
          <div class="card-val">Milestone 4</div>
          <div class="card-desc">Closing the loop: What was committed in M1, what was delivered, what changed under control, and what remains incomplete.</div>
        </div>
        <div class="card">
          <div class="card-label">Final Release Baseline</div>
          <div class="card-val" style="color: #34d399;">v0.4.0-final</div>
          <div class="card-desc">Anchored to commit <strong>f1fcdf9</strong> on protected <code>main</code>. 42 automated tests passing, 93.60% coverage, 0 CVEs.</div>
        </div>
        <div class="card">
          <div class="card-label">Governance & Team</div>
          <div class="card-val" style="color: #fbbf24;">ADR-012 Solo SCM</div>
          <div class="card-desc">Following team member attrition, 100% of engineering delivery, automated testing, and lifecycle documentation was maintained by Chris Fourie.</div>
        </div>
      </div>
      <div class="cue-bar">
        [LIVE CUE] Presenter on camera; display student card / ID 602826; introduce Capstone Defence scope.
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[ON-CAMERA] Keep full webcam visible. State your full name and student number 602826. Identify release tag v0.4.0-final and commit f1fcdf9. Mention ADR-012 solo governance.

⏱️ TIMING: ~1:30 mins.
🎯 RUBRIC TARGET: Identification, Release Baseline Integrity & Team Continuity.

🎙️ SPOKEN SCRIPT:
"Good day Assessor. My name is Chris Fourie, student number 602826, representing Group E for the Software Engineering 381 module at Belgium Campus ITversity.

Today, I am formally presenting our Milestone 4 Final Capstone Engineering Demonstration for CivicConnect: Community Service Request Management Platform.

As set out in the Final Project Brief, Milestone 4 is not a new development window. Our explicit engineering principle is to Finalise, Consolidate, and Conclude.

Our assessed final release baseline is version v0.4.0-final, anchored to commit f1fcdf9 on the protected main branch of our official GitHub repository.

In terms of team governance: As documented in our living Risk Register under RSK-011 and RSK-012, our team experienced total member attrition with Pandora Greyling departing in Milestone 2 and Lisa Verson withdrawing in Milestone 3. In response, I ratified ADR-012, our Solo SCM Governance Protocol. Under ADR-012, direct pushes to main remained blocked; merging required passing all automated CI quality gates alongside our completed, signed single-engineer self-audit checklists.

Over this final demonstration, I will trace our commitments from M1 to final delivery, prove our 98.2% scope completion, demonstrate our containerized simulated production environment, and defend our engineering decisions."`
  },

  // SLIDE 2
  {
    num: 2,
    tag: "Assessment Rubric Alignment",
    pillClass: "purple",
    title: "Executive Assessment Cross-Walk: Dual-Rubric Evidence Index",
    subtitle: "Harmonizing Moodle Criteria (A–F + Viva) with M4 Final Project Standards (50 Raw Marks)",
    footerLeft: "PED v4.0 Final (Section 1.1) • Moodle Rubric Cross-Walk",
    footerRight: "Raw Marks: 50 | Practical Weighting: 30%",
    content: `
      <table class="table-clean">
        <thead>
          <tr>
            <th>Moodle Criterion</th>
            <th>Marks</th>
            <th>Governing M4 Final Expectation</th>
            <th>Repository & Dossier Evidence</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>A. PED Continuity & Controlled Changes</strong></td>
            <td>5 Marks</td>
            <td>Continuous dossier (v1.0→v4.0); M1 scope reconciliation; 98.2% completion.</td>
            <td><code>PED_v4.0_Final.md</code> (Section 2, 3); <code>RTM_v4.0_Final.md</code></td>
          </tr>
          <tr>
            <td><strong>B. ASRs & Architecture Baseline</strong></td>
            <td>5 Marks</td>
            <td>Clean Layered Monolith; 7 ASRs; rejection of microservices (Deutsch).</td>
            <td><code>src/domain/</code>, <code>application/</code>, <code>infrastructure/</code></td>
          </tr>
          <tr>
            <td><strong>C. Data / Persistence Engineering</strong></td>
            <td>4 Marks</td>
            <td>Strict 3NF (8 tables); OCC versioning; ACID boundaries; dual persistence.</td>
            <td><code>V1__initial_schema.sql</code>; <code>OptimisticConcurrency.test.ts</code></td>
          </tr>
          <tr>
            <td><strong>D. Tech Selection & Deployment</strong></td>
            <td>4 Marks</td>
            <td>TypeScript/Node.js/Postgres (ADR-008); Docker staging; defended No-Go.</td>
            <td><code>docker-compose.staging.yml</code>; ports 5001/5433 parity</td>
          </tr>
          <tr>
            <td><strong>E. Research-Informed Design & Integration</strong></td>
            <td>5 Marks</td>
            <td>A1/A2/A3 research continuity; GoF Factory Method, Observer, Outbox.</td>
            <td><code>CategoryFactories.ts</code>; <code>DomainEventDispatcher.ts</code></td>
          </tr>
          <tr>
            <td><strong>F. Development, Quality & GitHub Evidence</strong></td>
            <td>7 Marks</td>
            <td>42 automated tests; 93.60% coverage; 0 CVEs; 4 closed defects; ADR-012.</td>
            <td>GitHub Actions CI; commit log; <code>Defect_Register_v4.0.md</code></td>
          </tr>
          <tr>
            <td><strong>Individual Defence & SE Understanding</strong></td>
            <td>20 Marks</td>
            <td>Viva questioning across 11 dimensions using 5-step answering formula.</td>
            <td><code>Milestone_4_Individual_Defence_Preparation_Guide.md</code></td>
          </tr>
        </tbody>
      </table>
    `,
    notes: `🔴 LIVE DEMO CUE:
[SLIDE REVIEW] Walk through the dual-rubric cross-walk. Show how Moodle's 50 marks map directly to the Final Brief requirements.

⏱️ TIMING: ~1:15 mins.
🎯 RUBRIC TARGET: Executive Alignment & Marking Guide Mapping.

🎙️ SPOKEN SCRIPT:
"Turning to Slide 2: We have cross-referenced every single assessment criterion from the Moodle portal against the Milestone 4 Final Project Brief.

Our submission maps cleanly across all six criteria:
- Criterion A is evidenced by our unbroken PED v4.0 dossier and our quantified 98.2% scope completion calculation.
- Criterion B is evidenced by our Clean Layered Architecture and explicit rejection of distributed microservices based on Deutsch's Eight Fallacies.
- Criterion C is evidenced by our 8-table normalized 3NF PostgreSQL relational model and integer version Optimistic Concurrency Control.
- Criterion D is evidenced by our containerized staging parity and defended Staging No-Go decision.
- Criterion E is evidenced by our research-informed GoF patterns: Factory Method for polymorphic intake and Observer for event decoupling.
- Criterion F is evidenced by our 42 automated tests passing at 93.60% coverage and zero CVEs.
- And finally, our 20-mark Individual Defence component is prepared using our 5-step engineering answering formula."`
  },

  // SLIDE 3
  {
    num: 3,
    tag: "Stage 1: Final Integrated Product",
    pillClass: "green",
    title: "Stage 1: The Final Integrated Product & System Architecture",
    subtitle: "One Combined, Stable, and Identifiable Release Baseline Operating in Simulated Production",
    footerLeft: "Docker Compose Staging • Ports 5001 (App) & 5433 (Postgres)",
    footerRight: "Clean Layered Monolith • Inward Dependency Inversion",
    content: `
      <div class="grid-4" style="margin-bottom: 10px;">
        <div class="stat-card">
          <div class="stat-num" style="color: #38bdf8;">Node 20</div>
          <div class="stat-label">TypeScript 5.3 Engine</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #34d399;">3NF PG16</div>
          <div class="stat-label">PostgreSQL Relational DB</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #a855f7;">&lt;180MB</div>
          <div class="stat-label">Container RAM Footprint</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #fbbf24;">HTTP 200</div>
          <div class="stat-label">Live Healthcheck Probes</div>
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-label">Architectural Layering</div>
          <ul class="clean-list">
            <li><strong>Presentation:</strong> Express REST routes, role authorization guards, accessible UI portal.</li>
            <li><strong>Application:</strong> Decoupled use cases (Create, Assign, UpdateStatus) and POPIA DTO mappers.</li>
            <li><strong>Domain Core:</strong> Zero-dependency entities (ServiceRequest), FSM guards, Factory Registry.</li>
            <li><strong>Infrastructure:</strong> Dual repositories (Postgres 16 / InMemory), Observer sinks, Outbox DDL.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Operational Stability</div>
          <ul class="clean-list">
            <li><strong>Process Isolation:</strong> Runs under unprivileged <code>USER node</code> in Alpine container.</li>
            <li><strong>Network Isolation:</strong> Internal Docker bridge network; host port remapping (5433).</li>
            <li><strong>Liveness / Readiness:</strong> Endpoints at <code>/health/live</code> and <code>/health/ready</code>.</li>
            <li><strong>Zero Secrets in Git:</strong> All database credentials injected via environment variables.</li>
          </ul>
        </div>
      </div>
      <div class="cue-bar">
        [LIVE CUE] Alt-Tab to Browser http://localhost:5001/ and http://localhost:5001/health/live; show uptime & memory stats.
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO BROWSER] Navigate to http://localhost:5001/ and http://localhost:5001/health/live. Show the JSON response returning status: UP, uptimeSeconds, and memoryUsageMB: 142MB.

⏱️ TIMING: ~1:30 mins.
🎯 RUBRIC TARGET: Stage 1 — Final Integrated Product, Clean Monolith Architecture & Operational Probes.

🎙️ SPOKEN SCRIPT:
"Moving to Stage 1: The Final Integrated Product.

As required by Brief Section 4, the strongest evidence in Milestone 4 is a single, coherent, stable product. We are not demonstrating disconnected prototypes.

CivicConnect is built as a Clean Layered Monolith adhering strictly to inward dependency inversion:
- The Presentation layer handles HTTP routing, JWT/role extraction, and serves our semantic web dashboard.
- The Application layer orchestrates business use cases without referencing Express or SQL.
- The Domain core encapsulates enterprise rules, FSM state guards, and category factories with zero external dependencies.
- And the Infrastructure layer implements our dual-persistence repositories and notification observers.

[ALT-TAB TO BROWSER NOW]
Notice in my browser that our application is running live inside Docker on port 5001, backed by PostgreSQL 16 on port 5433. Our health probe at slash health slash live returns status UP with a memory footprint of just 142 megabytes—comfortably inside our 512MB container quota."`
  },

  // SLIDE 4
  {
    num: 4,
    tag: "Stage 1: User Journeys",
    pillClass: "green",
    title: "Stage 1 (Cont.): User Journey 1 — Citizen Intake & Factory Invariants",
    subtitle: "Polymorphic Request Intake Governed by GoF Factory Method Pattern (FR-001, FR-002, ADR-005)",
    footerLeft: "code/src/domain/factories/CategoryFactories.ts",
    footerRight: "Defect DEF-001 Closed & Verified",
    content: `
      <div class="grid-2">
        <div class="card">
          <div class="card-label">Citizen Intake Flow (FR-001 & FR-002)</div>
          <ul class="clean-list">
            <li>Citizen selects category: Facilities, IT Support, Security, or Maintenance.</li>
            <li>System enforces category-specific mandatory invariants before ticket instantiation.</li>
            <li>Facilities requires building and room number; IT requires device hostname; Security requires incident severity.</li>
            <li>Generates human-readable tracking reference: <code>REQ-2026-XXXX</code>.</li>
            <li>Initial state set to <code>SUBMITTED</code>, version initialized to 1.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Design Pattern Implementation (ADR-005)</div>
          <ul class="clean-list">
            <li><strong>Pattern:</strong> GoF Factory Method with specialized domain creators.</li>
            <li><strong>Class Hierarchy:</strong> <code>FacilityFaultCreator</code>, <code>ItSupportCreator</code>, <code>SecurityHazardCreator</code>.</li>
            <li><strong>Defect DEF-001 Resolution:</strong> Prevented invariant bypass where facility tickets were submitted without room numbers.</li>
            <li><strong>Verification:</strong> 10 automated Decision Table test cases in <code>IntakeDecisionTable.test.ts</code> passing 100%.</li>
          </ul>
        </div>
      </div>
      <div class="cue-bar">
        [LIVE CUE] Alt-Tab to Web Dashboard: submit a Facilities fault; show that omitting room number triggers validation; complete valid submission.
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO BROWSER] In the web dashboard form: select 'Facilities Fault'. Leave Room Number empty and click Submit. Show that the UI and API reject with HTTP 400. Enter 'Room 302' and submit. Show ticket REQ-2026-0042 created in SUBMITTED status.

⏱️ TIMING: ~1:30 mins.
🎯 RUBRIC TARGET: Critical Journey 1, Factory Method Pattern & DEF-001 Resolution.

🎙️ SPOKEN SCRIPT:
"Here on Slide 4, we examine our first critical user journey: Citizen Fault Intake and Category Invariants.

When a citizen reports a fault, our platform enforces controlled categorization under FR-001 and FR-002.

Rather than using a fragile switch-statement, we implemented the GoF Factory Method Pattern under ADR-005. Each category is handled by a specialized domain creator: FacilityFaultCreator, ItSupportCreator, and SecurityHazardCreator.

In Milestone 3, we logged Defect 001 because initial intake allowed facility tickets to be created without a room number. We resolved this by embedding invariant validation directly into the factory methods.

[ALT-TAB TO BROWSER NOW]
As demonstrated live in our portal: attempting to submit a facility fault without a room number immediately fails validation. When I supply Room 302, the ticket instantiates cleanly with tracking reference REQ-2026-0042, initialized to SUBMITTED status."`
  },

  // SLIDE 5
  {
    num: 5,
    tag: "Stage 1: User Journeys",
    pillClass: "green",
    title: "Stage 1 (Cont.): User Journey 2 — Lifecycle FSM & Resolution Notes",
    subtitle: "Deterministic State Progression & Mandatory Accountability (FR-010, FR-011, DEC-004)",
    footerLeft: "code/src/domain/entities/ServiceRequest.ts",
    footerRight: "FSM Guards Enforced • Zero Illegal State Jumps",
    content: `
      <div class="grid-2">
        <div class="card">
          <div class="card-label">Finite State Machine (FR-010 & DEC-004)</div>
          <ul class="clean-list">
            <li>Strict deterministic state transitions: <code>SUBMITTED</code> → <code>ASSIGNED</code> → <code>IN_PROGRESS</code> → <code>RESOLVED</code> → <code>CLOSED</code>.</li>
            <li>Illegal state jumps (e.g. <code>SUBMITTED</code> directly to <code>RESOLVED</code>) are rejected with <code>InvalidStateTransitionError</code>.</li>
            <li>Enforced at domain entity level: <code>ServiceRequest.transitionToStatus()</code>.</li>
            <li>Database relational table <code>status_transition_rules</code> mirrors domain guards.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Mandatory Resolution Accountability (FR-011)</div>
          <ul class="clean-list">
            <li>Transitioning to <code>RESOLVED</code> strictly mandates non-empty resolution notes.</li>
            <li>Empty notes throw <code>ValidationError: Resolution notes are mandatory</code>.</li>
            <li>Each transition automatically logs an immutable record in <code>service_request_audit_logs</code>.</li>
            <li>Audit records capture actor ID, previous status, new status, and microsecond timestamp.</li>
          </ul>
        </div>
      </div>
      <div class="cue-bar">
        [LIVE CUE] Alt-Tab to Web Dashboard: transition ticket to IN_PROGRESS; then transition to RESOLVED showing resolution notes mandatory check.
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO BROWSER] Open ticket REQ-2026-0042. Transition status to IN_PROGRESS. Then attempt to mark as RESOLVED with blank notes. Show validation failure. Enter 'Replaced circuit breaker and verified voltage.' Ticket resolves successfully.

⏱️ TIMING: ~1:30 mins.
🎯 RUBRIC TARGET: Critical Journey 2, FSM Lifecycle Integrity & Audit Accountability.

🎙️ SPOKEN SCRIPT:
"Continuing to Slide 5: User Journey 2 demonstrates Lifecycle State Machine Validation and Resolution Notes under FR-010 and FR-011.

Municipal service requests cannot allow arbitrary state transitions. We implemented a server-side Finite State Machine governed by Decision 004. A ticket must strictly progress from SUBMITTED, to ASSIGNED, to IN_PROGRESS, to RESOLVED.

Direct state jumps—such as attempting to resolve an unassigned ticket—are blocked at the domain boundary, throwing an InvalidStateTransitionError.

Furthermore, under FR-011, moving a ticket to RESOLVED mandates non-empty resolution notes to ensure operational accountability.

[ALT-TAB TO BROWSER NOW]
In our live demonstration: attempting to mark the ticket as resolved with empty notes fails immediately. Once I provide the technician notes confirming the repair, the ticket resolves, and an immutable audit log row is appended with the timestamp and actor ID."`
  },

  // SLIDE 6
  {
    num: 6,
    tag: "Stage 1: User Journeys",
    pillClass: "green",
    title: "Stage 1 (Cont.): User Journey 3 — Concurrency & POPIA Privacy",
    subtitle: "Optimistic Concurrency Control (OCC) and Citizen Data Masking (FR-008, FR-009, NFR-005)",
    footerLeft: "Optimistic Concurrency • Integer Version Field",
    footerRight: "POPIA Citizen Data Masking • DEF-003 & DEF-004 Closed",
    content: `
      <div class="grid-2">
        <div class="card">
          <div class="card-label">Optimistic Concurrency Control (FR-009 & DEF-003)</div>
          <ul class="clean-list">
            <li>Multiple supervisors claiming tickets simultaneously risk lost updates.</li>
            <li>Integer <code>version</code> column increments on every mutation.</li>
            <li>First coordinator claim updates assigned staff and increments version 1 → 2.</li>
            <li>Second concurrent claim on stale version 1 throws <code>ConcurrencyConflictError</code>.</li>
            <li>API maps conflict to <strong>HTTP 409 Conflict</strong>; zero lost updates.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">POPIA Privacy & RBAC Protection (FR-008 & DEF-004)</div>
          <ul class="clean-list">
            <li>Compliance with South African POPIA Act (Protection of Personal Information).</li>
            <li>DTO mapper dynamically masks citizen phone numbers for ground technicians: <code>[POPIA PROTECTED]</code>.</li>
            <li>Administrator role retains authorized access to unmasked contact info.</li>
            <li>DEF-004 resolution: Centralized RBAC guards block unprivileged assignment requests with HTTP 403.</li>
          </ul>
        </div>
      </div>
      <div class="cue-bar">
        [LIVE CUE] Alt-Tab to VS Code: show OptimisticConcurrency.test.ts and AnonymizationMask.test.ts. Show HTTP 409 and POPIA masking logic.
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO VS CODE] Open 'tests/unit/entities/OptimisticConcurrency.test.ts' and 'tests/unit/dtos/AnonymizationMask.test.ts'. Highlight the OCC version check and the [POPIA PROTECTED] string mask.

⏱️ TIMING: ~1:30 mins.
🎯 RUBRIC TARGET: Critical Journey 3, OCC Concurrency Control, POPIA Privacy & DEF-003/DEF-004.

🎙️ SPOKEN SCRIPT:
"Slide 6 presents our third critical user journey: Concurrency Protection and Citizen Privacy.

In multi-user operations, two coordinators might attempt to assign the same ticket simultaneously. In Milestone 3, we logged Defect 003 because concurrent writes silently overwrote each other.

We resolved this by implementing Optimistic Concurrency Control under ADR-006. Our ServiceRequest entity maintains an integer version column. When Supervisor A claims a ticket, the version increments from 1 to 2. If Supervisor B concurrently submits an update against version 1, the system intercepts the collision and throws a ConcurrencyConflictError, mapped to HTTP 409 Conflict.

Simultaneously, under NFR-005 and POPIA compliance, our ServiceRequestDTOMapper masks citizen contact numbers with [POPIA PROTECTED] for operational ground crew, while granting unmasked access strictly to authenticated administrators."`
  },

  // SLIDE 7
  {
    num: 7,
    tag: "Stage 2: Scope Reconciliation",
    pillClass: "purple",
    title: "Stage 2: Mandatory M1 Scope Baseline → Final Delivery Reflection",
    subtitle: "Complete Accounting of All Baselined Functional & Non-Functional Commitments",
    footerLeft: "SEN381 Final Project Brief Section 5 • Scope Reconciliation Table",
    footerRight: "14 FRs + 10 NFRs Baselined • 0 Dropped Commitments",
    content: `
      <table class="table-clean">
        <thead>
          <tr>
            <th>M1 Requirement</th>
            <th>Priority</th>
            <th>Final Status</th>
            <th>Acceptance Criteria</th>
            <th>Verification Evidence</th>
            <th>Engineering Conclusion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>FR-001–002</code> Intake & Categories</td>
            <td>Must</td>
            <td><span style="color:#34d399;">IMPLEMENTED</span></td>
            <td>Met (1.0)</td>
            <td><code>CategoryFactories.ts</code>; Decision Tables</td>
            <td>Delivered as committed with Factory invariants.</td>
          </tr>
          <tr>
            <td><code>FR-003–004</code> Tracking & History</td>
            <td>Must</td>
            <td><span style="color:#34d399;">IMPLEMENTED</span></td>
            <td>Met (1.0)</td>
            <td><code>RequestController.ts</code>; API tests</td>
            <td>Delivered as committed with paginated queries.</td>
          </tr>
          <tr>
            <td><code>FR-005</code> Lifecycle Alerts</td>
            <td>Must</td>
            <td><span style="color:#34d399;">IMPLEMENTED</span></td>
            <td>Met (1.0)</td>
            <td><code>DomainEventDispatcher.ts</code>; Observer</td>
            <td>Delivered as committed via decoupled events.</td>
          </tr>
          <tr>
            <td><code>FR-006–008</code> Staff Queues & POPIA</td>
            <td>Must</td>
            <td><span style="color:#34d399;">IMPLEMENTED</span></td>
            <td>Met (1.0)</td>
            <td><code>ServiceRequestDTOMapper.ts</code></td>
            <td>Delivered as committed; PII masked for staff.</td>
          </tr>
          <tr>
            <td><code>FR-009–011</code> Assignment, FSM & Notes</td>
            <td>Must</td>
            <td><span style="color:#34d399;">IMPLEMENTED</span></td>
            <td>Met (1.0)</td>
            <td><code>ServiceRequest.ts</code>; OCC tests</td>
            <td>Delivered as committed; OCC versioning verified.</td>
          </tr>
          <tr>
            <td><code>FR-012–013</code> Dashboard & SLAs</td>
            <td>Should</td>
            <td><span style="color:#34d399;">IMPLEMENTED</span></td>
            <td>Met (1.0)</td>
            <td><code>public/index.html</code>; Audit log</td>
            <td>Delivered as committed; live summary cards active.</td>
          </tr>
          <tr>
            <td><code>FR-014</code> Data Export</td>
            <td>Could</td>
            <td><span style="color:#fbbf24;">PARTIAL</span></td>
            <td>Partially Met (0.5)</td>
            <td><code>RequestController.list</code> (JSON)</td>
            <td>JSON operational; streaming CSV deferred under ADR-012.</td>
          </tr>
          <tr>
            <td><code>NFR-001–010</code> Quality Attributes</td>
            <td>All</td>
            <td><span style="color:#34d399;">IMPLEMENTED</span></td>
            <td>Met (1.0)</td>
            <td>42 tests; load test; health probes</td>
            <td>100% verified against quantitative thresholds.</td>
          </tr>
        </tbody>
      </table>
    `,
    notes: `🔴 LIVE DEMO CUE:
[SLIDE REVIEW] Walk through the Scope Reconciliation Table. Emphasize that all Must-have requirements are 100% implemented, and the single partial item (FR-014 CSV) is an approved controlled deferral.

⏱️ TIMING: ~1:30 mins.
🎯 RUBRIC TARGET: Stage 2 — M1 Scope Baseline Reconciliation, Variance Accounting & Controlled Scope Change.

🎙️ SPOKEN SCRIPT:
"Turning to Stage 2: Scope Reconciliation.

Milestone 1 established an explicit commitment baseline. As required by Brief Section 5, we close that loop honestly without making excuses or hiding omissions.

Looking at our baseline commitments:
- Must-Have Requirements, from FR-001 through FR-011: Every single one is IMPLEMENTED and verified. Citizen intake, categorization, tracking, queues, search, POPIA masking, concurrency, state machine transitions, and resolution notes are fully operational.
- Should-Have Requirements: Both FR-012 executive dashboard and FR-013 SLA metrics are fully delivered.
- Could-Have Requirement, FR-014: This is classified as PARTIALLY IMPLEMENTED. Structured JSON export is operational; streaming CSV export was deliberately deferred to post-release to protect core stability under solo engineering governance.

Crucially, our deliberately deferred items from M1—such as SMS/WhatsApp webhooks and automated AI triage—correctly remained deferred, avoiding third-party recurring costs and classification hallucination risks."`
  },

  // SLIDE 8
  {
    num: 8,
    tag: "Stage 2: Quantified Scope",
    pillClass: "purple",
    title: "Stage 2 (Cont.): Quantified Scope Completion Percentage",
    subtitle: "Mathematical Verification from the M1 Acceptance-Criteria Baseline (Formula: Page 8)",
    footerLeft: "Sum Completion Values: 27.5 / 28 (FRs) + 10 / 10 (NFRs)",
    footerRight: "Score Band: 90–100% (Very High Completion)",
    content: `
      <div class="grid-3" style="margin-bottom: 12px;">
        <div class="stat-card">
          <div class="stat-num" style="color: #34d399;">98.2%</div>
          <div class="stat-label">Functional Scope (27.5 / 28)</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #38bdf8;">100.0%</div>
          <div class="stat-label">NFR Quality Scope (10 / 10)</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #fbbf24;">98.7%</div>
          <div class="stat-label">Master Combined Scope</div>
        </div>
      </div>
      <div class="card">
        <div class="card-label">Mathematical Calculation & Formula Breakdown</div>
        <div style="font-family: 'Consolas', monospace; font-size: 13px; color: #38bdf8; margin: 6px 0;">
          Scope Completion % = (Sum of Final Acceptance Criteria Values / Total Approved Criteria) × 100
        </div>
        <ul class="clean-list">
          <li><strong>Functional Scope:</strong> 14 Requirements × 2 Acceptance Criteria = 28 Total Criteria. 27 Met (27 × 1.0) + 1 Partially Met (1 × 0.5 for FR-014 CSV) = <strong>27.5 / 28 = 98.21%</strong>.</li>
          <li><strong>Non-Functional Scope:</strong> 10 NFRs × 1 Quantitative Metric = 10 Criteria. 10 Met (10 × 1.0) = <strong>10.0 / 10 = 100.0%</strong>.</li>
          <li><strong>Final Assessment Interpretation:</strong> Comfortably exceeds the 80% minimum threshold, landing in the highest evaluation band (90–100%: <em>Very high completion of approved scope</em>).</li>
          <li><strong>Controlled Change Discipline:</strong> Omission of streaming CSV export is transparently defended—preventing rushed unverified features while preserving full JSON export capability.</li>
        </ul>
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[SLIDE REVIEW] Point to the three metric cards: 98.2% Functional, 100% NFR, 98.7% Combined. State the formula clearly.

⏱️ TIMING: ~1:15 mins.
🎯 RUBRIC TARGET: Stage 2 — Quantified Scope Completion Calculation & Assessment Band.

🎙️ SPOKEN SCRIPT:
"Continuing Stage 2 on Slide 8: We have calculated our Quantified Scope Completion Percentage strictly using the formula prescribed on Page 8 of the Milestone 4 Brief.

Across our 14 functional requirements with 2 acceptance criteria each, 27 criteria are fully Met with a value of 1.0, and 1 criterion—AC-014.2 for CSV streaming—is Partially Met with a value of 0.5. This yields a completion sum of 27.5 divided by 28, or 98.21% functional completion.

Across our 10 Non-Functional Requirements, all 10 quantitative metrics are verified, yielding 100% NFR completion.

Combined, CivicConnect achieves 98.68% overall scope completion. This places our project in the highest evaluation band—90 to 100%: Very high completion of approved scope—far surpassing the faculty's 80% minimum requirement, while proving disciplined scope control."`
  },

  // SLIDE 9
  {
    num: 9,
    tag: "Stage 3: Defect Closure",
    pillClass: "gold",
    title: "Stage 3: Milestone 3 → Final Closure: Defect Register v4.0",
    subtitle: "Complete Accounting of Defects, Root Causes & Automated Regression Verification",
    footerLeft: "DOC-DEF-004 • Defect Register v4.0 Final",
    footerRight: "4/4 Resolved • 0 Open S1/S2 Defects",
    content: `
      <div class="grid-2">
        <div class="card">
          <div class="card-label">DEF-001 (Sev 2) & DEF-002 (Sev 3)</div>
          <ul class="clean-list">
            <li><strong>DEF-001: Category Invariant Bypass:</strong> Facility tickets could be created without room numbers. Resolved via Factory Method invariants in <code>CategoryFactories.ts</code>. Verified by 10 decision table tests.</li>
            <li><strong>DEF-002: Coverage Threshold Anomaly:</strong> Adding PostgreSQL adapter (250 lines) dropped statement coverage below 80% due to unreachable network fault paths. Resolved in <code>vitest.config.ts</code> by isolating adapter; core coverage exceeds 93.60%.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">DEF-003 (Sev 1) & DEF-004 (Sev 2)</div>
          <ul class="clean-list">
            <li><strong>DEF-003: Ticket Claim Race Condition:</strong> Concurrent coordinator assignments resulted in lost updates. Resolved via Optimistic Concurrency Control (OCC) integer <code>version</code> checking in <code>ServiceRequest.ts</code>. Verified in <code>OptimisticConcurrency.test.ts</code> (HTTP 409).</li>
            <li><strong>DEF-004: Unprivileged Assignment Vulnerability:</strong> Non-staff users could invoke ticket assignment endpoints. Resolved via centralized RBAC guards in <code>RequestController.ts</code> (HTTP 403 Forbidden).</li>
          </ul>
        </div>
      </div>
      <div class="banner">
        <span><strong>Defect Resolution Rate:</strong> 100% (4/4 Closed). Zero open blocking defects in release baseline v0.4.0-final.</span>
        <span style="color: #34d399; font-weight: 700;">Regression Shield: Active in CI Gate 3</span>
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO VS CODE] Open 'docs/risk/Defect_Register_v4.0.md'. Point to DEF-001 through DEF-004. Show that each defect has an associated regression test in 'tests/unit/'.

⏱️ TIMING: ~1:30 mins.
🎯 RUBRIC TARGET: Stage 3 — Defect Register Finalisation, Root Cause Analysis & Regression Evidence.

🎙️ SPOKEN SCRIPT:
"Moving to Stage 3: Milestone 3 Issue Closure.

Brief Section 7 emphasizes that closure does not mean claiming perfection; it means knowing the exact final status of all engineering issues.

In our Defect Register v4.0: All 4 defects logged across construction are 100% resolved and guarded by automated regression tests in CI:
- DEF-001 resolved category invariant bypasses via our Factory Method creators.
- DEF-002 resolved our CI coverage configuration anomaly, ensuring our domain core maintains over 93% coverage.
- DEF-003 resolved concurrent ticket assignment race conditions via Optimistic Concurrency Control integer versioning.
- And DEF-004 resolved unprivileged assignment attempts via centralized role-based access control guards.

There are zero open Severity 1 or 2 defects in our final release baseline."`
  },

  // SLIDE 10
  {
    num: 10,
    tag: "Stage 3: Debt & Risk Closure",
    pillClass: "gold",
    title: "Stage 3 (Cont.): Technical Debt Register v2.0 & Risk Register v4.0",
    subtitle: "Transparent Accounting of Deliberate Architectural Trade-Offs & Mitigated Project Risks",
    footerLeft: "Registers Concluded: Debt v2.0 (DOC-ARCH-004) • Risk v4.0 (DOC-RSK-004)",
    footerRight: "4 Debt Items Accounted • 15/15 Risks Controlled",
    content: `
      <div class="grid-2">
        <div class="card">
          <div class="card-label">Technical Debt Register v2.0 (4 Items Concluded)</div>
          <ul class="clean-list">
            <li><strong>DEBT-001 (Persistence):</strong> Dual-persistence switch (In-memory for CI, Postgres for staging). Protected by interface; zero domain leak.</li>
            <li><strong>DEBT-002 (Events):</strong> In-memory Observer dispatching. Outbox table DDL established; worker poll loop queued for scaling.</li>
            <li><strong>DEBT-003 (Gateways):</strong> Mock notification sinks avoiding paid SMS costs. Handover adapter ready for live webhooks.</li>
            <li><strong>DEBT-004 (Deployment):</strong> Single-host Docker Compose staging. Documented as part of justified cloud No-Go decision.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Project Risk Register v4.0 (15 Risks Controlled)</div>
          <ul class="clean-list">
            <li><strong>RSK-011 & RSK-012 (Team Member Attrition):</strong> Total team attrition (Pandora withdrew M2; Lisa withdrew M3). Workload absorbed by Chris Fourie under ratified <code>ADR-009</code> and <code>ADR-012</code>.</li>
            <li><strong>RSK-002 (Concurrency):</strong> Mitigated via OCC integer versioning.</li>
            <li><strong>RSK-006 (POPIA):</strong> Mitigated via field-level masking in DTOs.</li>
            <li><strong>RSK-008 (Memory Cap):</strong> Mitigated via lightweight Node.js (<180MB RAM).</li>
            <li><strong>RSK-015 (Green Pipeline Fallacy):</strong> Mitigated via multi-technique verification.</li>
          </ul>
        </div>
      </div>
      <div class="banner">
        <span><strong>Handover Principle:</strong> All debt items isolated behind clean SOLID interfaces; zero ripple effects.</span>
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO VS CODE] Open 'docs/architecture/Technical_Debt_Register_v2.0.md' and 'docs/risk/Project_Risk_Register_v4.0.md'. Highlight the interface boundaries isolating each debt item.

⏱️ TIMING: ~1:30 mins.
🎯 RUBRIC TARGET: Stage 3 — Technical Debt Closure, Handover Plan & Risk Register Finalisation.

🎙️ SPOKEN SCRIPT:
"Continuing Stage 3 on Slide 10: We examine our Technical Debt Register v2.0 and Risk Register v4.0.

In software engineering, technical debt is not accidental negligence; it is a deliberate, transparent engineering trade-off.

All 4 active technical debt items in our register are isolated behind clean SOLID interface abstractions:
- Our dual-persistence switch allows sub-12-second CI test runs while preserving PostgreSQL staging.
- Our in-memory observer dispatching enforces our zero-cost constraint while our outbox table schema provides the post-release migration path.
- And our mock notification sinks avoided committing credentials or incurring third-party billing.

In our Risk Register: All 15 risks are controlled. The severe team attrition shocks of losing both partners were stabilized via ADR-009 and ADR-012 without a single quality compromise."`
  },

  // SLIDE 11
  {
    num: 11,
    tag: "Stage 3: AI Governance",
    pillClass: "purple",
    title: "Stage 3 (Cont.): AI Usage Register v4.0 & Academic Integrity",
    subtitle: "Auditable Register of AI Engineering Contributions, Verification & Hallucinations Rectified",
    footerLeft: "DOC-GOV-004 • AI Usage Register v4.0 Final",
    footerRight: "11 Entries Verified • 100% Human Accountability",
    content: `
      <div class="grid-2">
        <div class="card">
          <div class="card-label">Mandatory 5-Stage Verification Protocol</div>
          <div style="font-family: 'Consolas', monospace; font-size: 11px; color: #38bdf8; line-height: 1.4; margin: 6px 0;">
            Prompt Specification ──► AI Generation ──► Domain Cross-Verification ──► Critical Correction ──► Committed Baseline
          </div>
          <ul class="clean-list">
            <li>AI is used strictly as an engineering assistant; transfers zero student accountability.</li>
            <li>All AI suggestions were cross-referenced against authoritative lecture principles.</li>
            <li>Subject to the same branch, build, test, and security gates as human code.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Critical Hallucinations Rectified Across Lifecycle</div>
          <ul class="clean-list">
            <li><strong>2026-09-15 (Architecture):</strong> Claude suggested Apache Kafka for notifications. <em>Rejected:</em> Requires 1GB+ RAM, causing instant OOM crashes on free-tier containers. Selected Observer Pattern (ADR-004).</li>
            <li><strong>2026-09-17 (Concurrency):</strong> ChatGPT suggested pessimistic row locking. <em>Rejected:</em> Causes connection pool starvation. Selected Optimistic Concurrency Control (ADR-006).</li>
            <li><strong>2026-10-07 (Governance):</strong> Antigravity AI suggested pushing directly to main after team attrition. <em>Rejected:</em> Destroys SCM audit trail. Ratified ADR-012 preserving protected main.</li>
          </ul>
        </div>
      </div>
      <div class="banner">
        <span><strong>Student Attestation:</strong> Signed by Chris Fourie (ID: 602826) — 100% personal engineering responsibility.</span>
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO VS CODE] Open 'docs/governance/AI_Usage_Register_v4.0.md'. Show the table and student attestation signature.

⏱️ TIMING: ~1:15 mins.
🎯 RUBRIC TARGET: Stage 3 — AI Governance, Critical Corrections & Academic Integrity.

🎙️ SPOKEN SCRIPT:
"Slide 11 details our AI Usage Register v4.0.

In strict compliance with Master Brief Section 10, Artificial Intelligence was utilized solely as an engineering assistant. AI output is never treated as authoritative evidence and transfers zero accountability away from the student.

Every AI suggestion followed our 5-stage verification pipeline, and our register records 11 entries across the lifecycle.

Crucially, our register proves rigorous human-in-the-loop critique:
- When Claude suggested deploying Apache Kafka, I rejected it because its 1-gigabyte memory requirement would crash our free-tier container.
- When ChatGPT suggested pessimistic database locking, I rejected it because it would cause connection pool starvation during queue browsing.
- And when an AI suggested bypassing branch protection after team attrition, I rejected it and ratified ADR-012 instead."`
  },

  // SLIDE 12
  {
    num: 12,
    tag: "Stage 4: Traceability Chain",
    pillClass: "green",
    title: "Stage 4: Living RTM v4.0 & Closed Traceability Chain",
    subtitle: "Unbroken 8-Stage Chain: Stakeholder Need → Requirement → Design → Code → Test → Final Outcome",
    footerLeft: "DOC-REQ-004 • Requirements Traceability Matrix v4.0 Final",
    footerRight: "Bidirectional Forward & Backward Traceability",
    content: `
      <div class="card" style="margin-bottom: 12px; padding: 12px 14px;">
        <div class="card-label">Authoritative 8-Stage Verification Traceability Chain</div>
        <div style="font-family: 'Consolas', monospace; font-size: 11px; color: #34d399; line-height: 1.4;">
          Need ──► Requirement ──► Acceptance Criteria ──► Decision/ADR ──► Implementation ──► Test / Evidence ──► Defect Link ──► Final Outcome
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-label">Deep Trace 1: FR-001 Citizen Fault Intake</div>
          <ul class="clean-list">
            <li><strong>Need:</strong> Digital campus fault reporting without paperwork.</li>
            <li><strong>Criteria:</strong> AC-001.1 (Valid creation) & AC-001.2 (Missing fields 400).</li>
            <li><strong>Decision:</strong> Factory Method Pattern (ADR-005).</li>
            <li><strong>Code:</strong> <code>CreateServiceRequest.ts</code> & <code>CategoryFactories.ts</code>.</li>
            <li><strong>Test:</strong> <code>TC-UNIT-FAC-01</code> & <code>TC-API-REQ-01</code> (Pass in CI Gate 3).</li>
            <li><strong>Outcome:</strong> <strong>MET (1.0)</strong> — DEF-001 closed.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Deep Trace 2: FR-009 / FR-010 Concurrency & FSM</div>
          <ul class="clean-list">
            <li><strong>Need:</strong> Prevent double-booking & enforce lifecycle integrity.</li>
            <li><strong>Criteria:</strong> AC-009.2 (Concurrent claim 409) & AC-010.1 (FSM sequence).</li>
            <li><strong>Decision:</strong> Relational OCC (ADR-006) & Server-side FSM (DEC-004).</li>
            <li><strong>Code:</strong> <code>ServiceRequest.ts</code> (OCC version) & <code>AssignServiceRequest.ts</code>.</li>
            <li><strong>Test:</strong> <code>OptimisticConcurrency.test.ts</code> & <code>ServiceRequestFSM.test.ts</code>.</li>
            <li><strong>Outcome:</strong> <strong>MET (1.0)</strong> — DEF-003 closed.</li>
          </ul>
        </div>
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO VS CODE] Open 'docs/requirements/Requirements_Traceability_Matrix_RTM_v4.0_Final.md'. Walk through the deep trace for FR-001 and FR-009/FR-010.

⏱️ TIMING: ~1:30 mins.
🎯 RUBRIC TARGET: Stage 4 — Living RTM Continuity, Closed Traceability Chain & Deep-Trace Demonstration.

🎙️ SPOKEN SCRIPT:
"Turning to Stage 4: Living RTM Traceability.

In accordance with Brief Section 9, we did not create a disconnected final report. Our living RTM v4.0 closes the complete 8-stage verification chain:
Stakeholder Need, to Requirement, to Acceptance Criteria, to Engineering Decision, to Implementation, to Test Evidence, to Defect Link, to Final Outcome.

To demonstrate our deep trace:
Take FR-001: The community requester needed digital fault reporting without paperwork. This mapped to AC-001.1 and AC-001.2. In architecture, it is governed by ADR-005 Factory Method. In code, it is implemented in CreateServiceRequest.ts and CategoryFactories.ts. In testing, it is verified by TC-UNIT-FAC-01 and API integration tests in CI Gate 3. When an invariant bypass was discovered, it was logged as DEF-001, resolved, and verified. Final outcome: MET.

Similarly, FR-009 concurrency traces through ADR-006, integer version OCC checking in ServiceRequest.ts, and our automated race condition tests, resolving DEF-003. Final outcome: MET."`
  },

  // SLIDE 13
  {
    num: 13,
    tag: "Stage 4: Verification Evidence",
    pillClass: "green",
    title: "Stage 4 (Cont.): Automated Quality Gates & Verification Evidence",
    subtitle: "42 Automated Tests Across 12 Files • 93.60% Coverage • 0 CVEs • p95 = 142ms",
    footerLeft: "GitHub Actions CI Pipeline • ci.yml (Gate 1 to Gate 4)",
    footerRight: "Vitest V8 Reporter • Zero Flaky Tests",
    content: `
      <div class="grid-4" style="margin-bottom: 12px;">
        <div class="stat-card">
          <div class="stat-num" style="color: #34d399;">42/42</div>
          <div class="stat-label">Tests Passed (100%)</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #38bdf8;">93.60%</div>
          <div class="stat-label">Statement Coverage</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #a855f7;">142ms</div>
          <div class="stat-label">Load p95 Latency (&lt;500ms)</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #fbbf24;">0 High</div>
          <div class="stat-label">Production CVEs</div>
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-label">Multi-Technique Verification Suite</div>
          <ul class="clean-list">
            <li><strong>Unit Tests:</strong> Factory invariants, FSM state guards, OCC race condition simulation.</li>
            <li><strong>Black-Box:</strong> 10-rule Decision Tables (Intake) and Boundary Value Analysis (2-value).</li>
            <li><strong>API Integration:</strong> Status codes, DTO mapping, negative auth (403 Forbidden).</li>
            <li><strong>E2E System Journeys:</strong> Citizen lifecycle, operational resilience, security boundary.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Continuous Integration Quality Gates</div>
          <ul class="clean-list">
            <li><strong>Gate 1 (Build):</strong> Strict TypeScript compilation (<code>tsc --noEmit</code>) with zero errors.</li>
            <li><strong>Gate 2 (Security):</strong> <code>npm audit</code> with 0 high/critical vulnerabilities.</li>
            <li><strong>Gate 3 (Test & Coverage):</strong> 42 tests passing; coverage exceeds 80% threshold.</li>
            <li><strong>Gate 4 (Packaging):</strong> Docker multi-stage container build and healthcheck probe.</li>
          </ul>
        </div>
      </div>
      <div class="cue-bar">
        [LIVE CUE] Alt-Tab to Terminal: run "npm test" to execute all 42 tests live in 11s; display Vitest test summary.
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[ALT-TAB TO TERMINAL] In 'code/' folder, run 'npm test'. Watch Vitest run 12 test files and pass 42 tests live in 11 seconds. Show the green summary table.

⏱️ TIMING: ~1:30 mins.
🎯 RUBRIC TARGET: Stage 4 — Automated Testing, CI Quality Gates & Coverage Evidence.

🎙️ SPOKEN SCRIPT:
"Continuing Stage 4 on Slide 13: Our automated verification evidence.

We do not rely on subjective claims of quality. Our GitHub Actions pipeline enforces four automated quality gates on every commit:
- Gate 1 validates clean TypeScript compilation with zero errors.
- Gate 2 validates dependencies with npm audit, reporting zero high or critical CVEs.
- Gate 3 executes our 42 automated tests across 12 files in under 12 seconds, achieving 93.60% statement coverage, 85.20% branch coverage, and 92.50% function coverage.
- Gate 4 verifies our Docker container build and healthcheck probes.

[ALT-TAB TO TERMINAL NOW]
As you can see running live in my terminal: all 12 test files and 42 test cases pass cleanly in 11 seconds. Furthermore, our load benchmark under 50 concurrent requests achieved a p95 latency of 142 milliseconds—well within our 500 millisecond NFR-001 threshold with zero failed requests."`
  },

  // SLIDE 14
  {
    num: 14,
    tag: "Stage 5: Deployment Decision",
    pillClass: "gold",
    title: "Stage 5: Final Deployment Baseline & Defended Go-Live Decision",
    subtitle: "Simulated Production Release with an Evidence-Based Staging No-Go for Cloud Production",
    footerLeft: "SEN381 Final Project Brief Section 11 • Final Deployment State",
    footerRight: "Environment Parity • Docker Compose Staging",
    content: `
      <div class="card" style="margin-bottom: 12px; padding: 12px 16px; border-left: 4px solid #34d399;">
        <div class="card-label" style="color: #34d399;">Official Release Declaration</div>
        <div style="font-size: 15px; font-weight: 700; color: #ffffff;">
          Declared Final State: SIMULATED PRODUCTION RELEASE with a Defended NO-GO DECISION for Public Cloud
        </div>
      </div>
      <div class="grid-3">
        <div class="card">
          <div class="card-label">Condition 1: Concurrency Soak</div>
          <div class="card-val" style="font-size: 16px; color: #fbbf24;">Municipal Scale Limit</div>
          <div class="card-desc">Load test certified 50 concurrent users at p95=142ms. Municipal burst load (5,000+ users) requires multi-region pooling and Redis caching unverified under $0 cost cap.</div>
        </div>
        <div class="card">
          <div class="card-label">Condition 2: Gateway Decoupling</div>
          <div class="card-val" style="font-size: 16px; color: #38bdf8;">Telecom Sandbox Safety</div>
          <div class="card-desc">Live paid SMS/Email provider APIs (Twilio/SendGrid) decoupled via Observer (ADR-004) and Outbox (ADR-007) to avoid committing credentials and incurring recurring cloud costs.</div>
        </div>
        <div class="card">
          <div class="card-label">Condition 3: Operational Risk</div>
          <div class="card-val" style="font-size: 16px; color: #f87171;">Solo Maintenance Limit</div>
          <div class="card-desc">Following team attrition, rolling to public unmonitored production without a 24/7 on-call incident response team violates operational reliability principles.</div>
        </div>
      </div>
      <div class="banner">
        <span><strong>Brief Section 11 Standard:</strong> <em>"A well-evidenced no-go decision based on credible security, reliability or operational concerns is sound software-engineering judgement."</em></span>
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[SLIDE REVIEW] Walk through the three engineering conditions justifying the Staging No-Go decision. Cite Brief Section 11.

⏱️ TIMING: ~1:30 mins.
🎯 RUBRIC TARGET: Stage 5 — Release Readiness, Environment Parity & Defended Staging No-Go Decision.

🎙️ SPOKEN SCRIPT:
"Moving to Stage 5: Final Deployment and Go-Live Decision.

Brief Section 11 explicitly instructs teams to declare and defend their release state: production, simulated production, or staging under a justified no-go decision. It notes that teams must not lose marks for refusing to race into production to meet a deadline.

Our declared final state is SIMULATED PRODUCTION RELEASE with a defended NO-GO DECISION for public cloud production.

Our decision is grounded in three engineering realities:
1. Concurrency Soak: We benchmarked 50 users at 142ms, but true municipal scale with thousands of concurrent citizens requires multi-region clustering not verifiable under academic zero-cost constraints.
2. Gateway Decoupling: We decoupled external telecom providers via Observer and Outbox patterns to protect against billing spikes and network flakiness.
3. Solo Maintenance: With single-engineer continuity under ADR-012, releasing to live public users without a 24/7 on-call rotation represents an irresponsible operational risk.

Remaining in verified Simulated Production while defending a Staging No-Go protects stakeholder value."`
  },

  // SLIDE 15
  {
    num: 15,
    tag: "Stage 5: Decision Reflection",
    pillClass: "purple",
    title: "Stage 5 (Cont.): Decision Consequence Reflection & Lessons Learned",
    subtitle: "Evaluating Architectural Choices, Trade-offs & Downstream Lifecycle Consequences",
    footerLeft: "Master Project Brief Section 22 • Decision Consequence Reflection",
    footerRight: "ADR-004, ADR-005, ADR-006, ADR-008, ADR-010, ADR-012",
    content: `
      <table class="table-clean">
        <thead>
          <tr>
            <th>Decision & ADR</th>
            <th>Expected Benefit</th>
            <th>Observed Downstream Consequence</th>
            <th>Assessment Verdict</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>ADR-008: TypeScript Monolith</strong></td>
            <td>Rapid velocity, single language, &lt;180MB RAM.</td>
            <td>Enabled 1 engineer to absorb full workload; sub-second CI builds.</td>
            <td><span style="color:#34d399;">RETAIN 100%</span></td>
          </tr>
          <tr>
            <td><strong>ADR-005: Factory Method Intake</strong></td>
            <td>Encapsulate category invariants, OCP.</td>
            <td>Isolating categories made fixing DEF-001 trivial without intake ripple.</td>
            <td><span style="color:#34d399;">RETAIN 100%</span></td>
          </tr>
          <tr>
            <td><strong>ADR-006: Relational 3NF & OCC</strong></td>
            <td>ACID boundaries, zero lost updates.</td>
            <td>Integer version OCC eliminated ticket race conditions (DEF-003).</td>
            <td><span style="color:#34d399;">RETAIN 100%</span></td>
          </tr>
          <tr>
            <td><strong>ADR-004: In-Memory Observer</strong></td>
            <td>Decouple notifications, protect memory cap.</td>
            <td>Zero OOM crashes; in-flight events volatile on hard crash (DEBT-002).</td>
            <td><span style="color:#fbbf24;">RETAIN WITH OUTBOX</span></td>
          </tr>
          <tr>
            <td><strong>ADR-010: Dual Persistence</strong></td>
            <td>Sub-12s CI test runs without flaky timeouts.</td>
            <td>Blazing fast CI; required careful schema alignment with Postgres.</td>
            <td><span style="color:#34d399;">RETAIN 100%</span></td>
          </tr>
          <tr>
            <td><strong>ADR-012: Solo SCM Protocol</strong></td>
            <td>Prevent PR review deadlock after attrition.</td>
            <td>Preserved branch protection; enabled 100% on-time project completion.</td>
            <td><span style="color:#34d399;">CRITICAL SUCCESS</span></td>
          </tr>
        </tbody>
      </table>
    `,
    notes: `🔴 LIVE DEMO CUE:
[SLIDE REVIEW] Walk through the ADR reflection table. Highlight ADR-008 as the primary enabler of solo velocity, and ADR-012 as the governance protector.

⏱️ TIMING: ~1:30 mins.
🎯 RUBRIC TARGET: Stage 5 — Decision Consequence Reflection, Trade-offs & Post-Project Evaluation.

🎙️ SPOKEN SCRIPT:
"Continuing Stage 5 on Slide 15: Decision Consequence Reflection.

Section 22 of the Master Brief asks us to reflect on our earlier architectural decisions using authentic evidence rather than hindsight alone.

Selecting a TypeScript Clean Monolith under ADR-008 was our most vital decision: its shared language and low memory footprint allowed a single engineer to absorb the entire project after team attrition.

Adopting the Factory Method Pattern under ADR-005 made resolving Defect 001 straightforward because category validation was isolated from our core intake pipeline.

Implementing Optimistic Concurrency Control under ADR-006 successfully eliminated race conditions during concurrent work order assignments.

And ratifying ADR-012 preserved our SCM governance, allowing us to complete the capstone on time with full NQF Level 8 audit compliance."`
  },

  // SLIDE 16
  {
    num: 16,
    tag: "Stage 5: Capstone Conclusion",
    pillClass: "gold",
    title: "Stage 5 (Cont.): Final Project Conclusion & Executive Sign-Off",
    subtitle: "Consolidated Engineering Achievements, Handover Readiness & Concluding Reflection",
    footerLeft: "Chris Fourie (ID: 602826) • Systems Architect & Lead Developer",
    footerRight: "SEN381 Final Project Closure • Release Baseline v0.4.0-final",
    content: `
      <div class="grid-3" style="margin-bottom: 12px;">
        <div class="card">
          <div class="card-label">Problem & Value Delivery</div>
          <div class="card-val" style="font-size: 16px; color: #38bdf8;">Unified Digital Intake</div>
          <div class="card-desc">Eliminated paper and chat silos across campus departments; enforced POPIA masking on citizen data; live status visibility via real-time FSM tracking.</div>
        </div>
        <div class="card">
          <div class="card-label">Engineering Discipline</div>
          <div class="card-val" style="font-size: 16px; color: #34d399;">98.2% Scope • 0 Defects</div>
          <div class="card-desc">42 automated tests (93.60% coverage); zero security vulnerabilities; all 4 defects permanently regression-shielded in GitHub Actions CI.</div>
        </div>
        <div class="card">
          <div class="card-label">Future Handover Path</div>
          <div class="card-val" style="font-size: 16px; color: #fbbf24;">Clean Decoupled Ports</div>
          <div class="card-desc">SOLID interfaces (IServiceRequestRepository, INotificationSink) allow seamless commercial telecom binding and cloud scale-out without refactoring core domain.</div>
        </div>
      </div>
      <div class="banner">
        <span><strong>Capstone Conclusion:</strong> Software Engineering is the disciplined control of architecture, constraints, trade-offs, and quality across the entire lifecycle.</span>
        <span style="color: #34d399; font-weight: 700;">Milestone 4 Concluded</span>
      </div>
    `,
    notes: `🔴 LIVE DEMO CUE:
[ON-CAMERA] Face examiner directly. Deliver the final professional closing statement for the recorded demonstration video. State completion of Milestone 4.

⏱️ TIMING: ~1:15 mins.
🎯 RUBRIC TARGET: Stage 5 — Final Project Conclusion, Stakeholder Value, Lifecycle Reflection & Handover Readiness.

🎙️ SPOKEN SCRIPT:
"To conclude our final project demonstration on Slide 16:

Milestone 4 brings the CivicConnect engineering journey to a formal, successful close.

Despite the severe operational shock of total team attrition, we maintained absolute software engineering discipline:
- We delivered 98.2% of our approved scope commitments, with 100% of our non-functional requirements verified.
- We achieved 93.60% automated test coverage across 42 tests running green in our CI pipeline.
- We resolved all four logged defects, permanently guarding them against regression.
- And we preserved unbroken traceability from original stakeholder need to final operational outcome.

Our Clean Layered Architecture and decoupled interfaces ensure that any future team can easily take this platform forward into municipal production.

CivicConnect demonstrates that real software engineering is not the hasty writing of code, but the disciplined management of architecture, trade-offs, and quality under real-world constraints.

Thank you, Assessor. This concludes the Milestone 4 final capstone video demonstration for CivicConnect."`
  }
];

// Step 1: Render slides via HTML + Edge headless
console.log('Rendering 16 upgraded full-bleed slides with Edge headless (2x Retina scale)...');
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
console.log('Building 16-slide PowerPoint deck with full-bleed Retina slides and integrated Presenter Notes...');
const psScript = path.join(tempDir, 'build_m4_16_deck.ps1');

const allPaths = [
  'C:\\Users\\jakof\\Desktop\\SEN381_Final_Project_GroupE\\CivicConnect_Final_Project_Presentation.pptx',
  'C:\\Users\\jakof\\Desktop\\SEN381_Final_Project_GroupE\\Present.pptx',
  'C:\\Chris\\Studies\\SEN\\Project\\docs\\presentation\\CivicConnect_Final_Project_Presentation.pptx',
  'C:\\Chris\\Studies\\SEN\\Project\\CivicConnect_Final_Project_Presentation.pptx',
  'C:\\Chris\\Studies\\SEN\\CivicConnect_Final_Project_Presentation.pptx'
];

const psContent = `
$allPaths = @(
    ${allPaths.map(p => `"${p.replace(/\\/g, '\\\\')}"`).join(',\n    ')}
)

# Ensure parent directories exist
foreach ($p in $allPaths) {
    $parent = Split-Path $p -Parent
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force }
}

$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Add([Microsoft.Office.Core.MsoTriState]::msoTrue)
$pres.PageSetup.SlideWidth = 960
$pres.PageSetup.SlideHeight = 540

$slidesJson = Get-Content -Raw "${tempDir.replace(/\\/g, '\\\\')}\\\\slides_manifest.json" | ConvertFrom-Json

for ($i = 0; $i -lt $slidesJson.Count; $i++) {
    $item = $slidesJson[$i]
    $slide = $pres.Slides.Add($i + 1, 12) # ppLayoutBlank
    
    # Insert Full-Bleed 16:9 Retina Image
    $img = $slide.Shapes.AddPicture($item.png, 0, 1, 0, 0, 960, 540)
    
    # Speaker Notes (Full teleprompter script for the presenter)
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

Write-Host "M4_16_DECK_BUILD_SUCCESS"
`;

fs.writeFileSync(path.join(tempDir, 'slides_manifest.json'), JSON.stringify(renderedSlides, null, 2), 'utf8');
fs.writeFileSync(psScript, psContent, 'utf8');

const psCmd = `powershell -ExecutionPolicy Bypass -File "${psScript}"`;
const out = execSync(psCmd).toString();
console.log(out);
console.log('16-Slide Milestone 4 Final PowerPoint generated successfully across all targets!');
