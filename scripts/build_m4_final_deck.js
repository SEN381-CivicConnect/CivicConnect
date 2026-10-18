const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tempDir = path.join(process.env.LOCALAPPDATA || 'C:\\Users\\jakof\\AppData\\Local', 'Temp', 'm4_slides_final');
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
    padding: 34px 44px;
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
    font-size: 26px;
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
    margin: 10px 0;
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
    padding: 18px 12px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .stat-num {
    font-size: 34px;
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
    padding: 6px 8px;
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
      <span class="project-tag">SEN381 Software Engineering 381 • Integrated Capstone Final Project</span>
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

// 12 High-Impact Milestone 4 Slides
const slides = [
  // SLIDE 1
  {
    num: 1,
    tag: "Milestone 4 Final Release",
    pillClass: "gold",
    title: "CivicConnect: Final Product Release & Capstone Engineering Review",
    subtitle: "Finalise • Consolidate • Conclude — Demonstrating Lifecycle Accountability & Engineering Evidence",
    footerLeft: "Chris Fourie (ID: 602826) • Systems Architect & Lead Developer",
    footerRight: "Baseline v0.4.0-final • Commit c2d7def • 18 Oct 2026",
    content: `
      <div class="grid-3">
        <div class="card">
          <div class="card-label">Capstone Identity</div>
          <div class="card-val">Milestone 4</div>
          <div class="card-desc">
            Closing the lifecycle loop: What was committed in M1, what was delivered, what changed under control, and what remains incomplete.
          </div>
        </div>
        <div class="card">
          <div class="card-label">Final Release Baseline</div>
          <div class="card-val" style="color: #34d399;">v0.4.0-final</div>
          <div class="card-desc">
            Anchored to commit <strong>c2d7def</strong> on protected <code>main</code>. 42 automated tests passing, 93.60% coverage, 0 CVEs.
          </div>
        </div>
        <div class="card">
          <div class="card-label">Governance & Team</div>
          <div class="card-val" style="color: #fbbf24;">ADR-012 Solo SCM</div>
          <div class="card-desc">
            Following team attrition, 100% engineering delivery, test execution, and lifecycle documentation maintained by Chris Fourie.
          </div>
        </div>
      </div>
      <div class="cue-bar">
        [LIVE CUE] Presenter on camera; display student card / ID 602826; introduce Capstone Defence scope.
      </div>
    `,
    notes: `"Good day Assessor. My name is Chris Fourie, student number 602826, presenting the Final Project and Capstone Engineering Defence for CivicConnect: Community Service Request Management Platform for SEN381 at Belgium Campus ITversity.

Today marks the culmination of our seven-week engineering journey. Milestone 4 is not a new development window; its explicit mandate is to Finalise, Consolidate, and Conclude.

Our assessed final release baseline is version v0.4.0-final, anchored to commit c2d7def on the protected main branch of our official repository.

As documented in our living Risk Register under RSK-011 and RSK-012, our team experienced total member attrition with Pandora Greyling departing in M2 and Lisa Verson in M3. In response, I ratified ADR-012, our Solo SCM Governance Protocol, ensuring that main remained protected and every merge required passing our automated multi-gate CI pipeline and signed self-audit checklists.

Over this final demonstration, I will trace our original M1 commitments to final delivery, prove our 98.2% scope completion, demonstrate our containerized simulated production environment, and defend our engineering decisions."`
  },

  // SLIDE 2
  {
    num: 2,
    tag: "Assessment Rubric Alignment",
    pillClass: "purple",
    title: "Executive Assessment Cross-Walk: Dual-Rubric Evidence Index",
    subtitle: "Harmonizing Moodle Criteria (A–F + Viva) with M4 Final Project Standards (50 Raw Marks)",
    footerLeft: "PED v4.0 Final (§1.1) • Moodle Rubric Cross-Walk",
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
            <td><code>PED_v4.0_Final.md</code> (§2, §3); <code>RTM_v4.0_Final.md</code></td>
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
    notes: `"Turning to Slide 2: We have cross-referenced every single assessment criterion from the Moodle portal against the Final Project Brief.

Our submission directly addresses:
- Criterion A with our unbroken PED v4.0 dossier and quantified 98.2% scope completion calculation.
- Criterion B with our Clean Layered Architecture and explicit rejection of distributed microservices based on Deutsch's Eight Fallacies.
- Criterion C with our 8-table normalized 3NF PostgreSQL relational model and integer version Optimistic Concurrency Control.
- Criterion D with our Docker containerized staging parity and defended live go-live / staging no-go decision.
- Criterion E with our research-informed GoF patterns: Factory Method for polymorphic intake and Observer for event decoupling.
- Criterion F with our 42 automated tests passing at 93.60% coverage and zero CVEs.
- And finally, the 20-mark Individual Defence component, supported by our 5-step engineering answering formula."`
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
    notes: `"Moving to Stage 1: The Final Integrated Product.

As required by Brief Section 4, the strongest evidence in Milestone 4 is a single, coherent, stable product. We are not demonstrating disconnected prototypes.

CivicConnect is built as a Clean Layered Monolith adhering strictly to inward dependency inversion:
- The Presentation layer handles HTTP routing, JWT/role extraction, and serves our semantic web dashboard.
- The Application layer orchestrates business use cases without referencing Express or SQL.
- The Domain core encapsulates enterprise rules, FSM state guards, and category factories with zero external dependencies.
- And the Infrastructure layer implements our dual-persistence repositories and notification observers.

In our containerized staging environment, the application runs on Node.js 20 LTS with PostgreSQL 16 on port 5433, consuming under 180MB of RAM and reporting live health metrics."`
  },

  // SLIDE 4
  {
    num: 4,
    tag: "Stage 1: User Journeys",
    pillClass: "green",
    title: "Stage 1 (Cont.): Three Verified Critical End-to-End User Journeys",
    subtitle: "Complete Lifecycle Traversal Without Relaying on Disconnected Prototypes",
    footerLeft: "E2E Test Suites • citizenLifecycle, operationalResilience, securityBoundary",
    footerRight: "Automated & UI Verified • Zero Data Loss",
    content: `
      <div class="grid-3">
        <div class="card">
          <div class="card-label">Journey 1: Citizen Intake to Resolution</div>
          <div class="card-val" style="font-size: 16px; color: #34d399;">FR-001, 002, 010, 011</div>
          <ul class="clean-list">
            <li>Citizen submits ticket with category validation invariants (Facilities room# required).</li>
            <li>Status transitions through FSM: SUBMITTED → ASSIGNED → IN_PROGRESS → RESOLVED.</li>
            <li>Moving to RESOLVED mandates non-empty resolution notes; triggers audit log.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Journey 2: Supervisor OCC Concurrency</div>
          <div class="card-val" style="font-size: 16px; color: #38bdf8;">FR-009, NFR-009 (DEF-003)</div>
          <ul class="clean-list">
            <li>Supervisor 1 claims unassigned ticket; version increments 1 → 2.</li>
            <li>Supervisor 2 concurrently attempts claim on stale version 1.</li>
            <li>System intercepts collision, rejects with <strong>HTTP 409 Conflict</strong>, zero lost updates.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Journey 3: RBAC & POPIA Protection</div>
          <div class="card-val" style="font-size: 16px; color: #a855f7;">FR-008, NFR-004, NFR-005</div>
          <ul class="clean-list">
            <li>Field technician queries queue; citizen contact numbers masked to <code>[POPIA PROTECTED]</code>.</li>
            <li>Unauthenticated user attempting assignment receives <strong>HTTP 403 Forbidden</strong>.</li>
            <li>System administrator retains authorized full access for legal auditing.</li>
          </ul>
        </div>
      </div>
      <div class="cue-bar">
        [LIVE CUE] Alt-Tab to Web Dashboard: submit a ticket, view it in staff queue, demonstrate POPIA masking and status transition.
      </div>
    `,
    notes: `"Here on Slide 4, we examine our three critical end-to-end user journeys, which operate seamlessly across our web portal and API:

Journey 1 demonstrates Citizen Intake to Resolution. The requester logs a fault, our Factory Method validates category invariants, and our FSM transitions the ticket from SUBMITTED through ASSIGNED to RESOLVED, mandating resolution notes.

Journey 2 demonstrates Concurrency Protection, resolving Defect 003. When two coordinators attempt to claim the same ticket, our Optimistic Concurrency Control checks the integer version column, granting the first claim and cleanly rejecting the second with HTTP 409 Conflict.

Journey 3 demonstrates Security and Privacy. Citizen personal details are masked with [POPIA PROTECTED] for ground technicians, while unauthorized state changes are blocked by our role-based authorization guards."`
  },

  // SLIDE 5
  {
    num: 5,
    tag: "Stage 2: Scope Reconciliation",
    pillClass: "purple",
    title: "Stage 2: Mandatory M1 Scope Baseline → Final Delivery Reflection",
    subtitle: "Complete Accounting of All Baselined Functional & Non-Functional Commitments",
    footerLeft: "SEN381 Final Project Brief §5 • Scope Reconciliation Table",
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
    notes: `"Turning to Stage 2: Scope Reconciliation.

In Milestone 1, we established an explicit baseline. As mandated by Brief Section 5, we close that loop honestly without making excuses or hiding omissions.

Every single Must-have functional requirement from FR-001 through FR-011 is 100% IMPLEMENTED and verified.
Our Should-have requirements—FR-012 executive dashboard and FR-013 SLA metrics—are fully operational.

Our only variance is FR-014 data export, classified as PARTIALLY IMPLEMENTED. Structured JSON export is fully operational; streaming CSV export was deliberately deferred to post-release to protect core stabilization after our team transition under ADR-012.

Furthermore, our deliberately deferred items from M1—such as SMS/WhatsApp webhooks and automated AI ticket classification—correctly remained deferred, avoiding third-party recurring costs and hallucination risks."`
  },

  // SLIDE 6
  {
    num: 6,
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
    notes: `"Continuing Stage 2 on Slide 6: We have calculated our Quantified Scope Completion Percentage strictly using the formula prescribed on Page 8 of the Milestone 4 Brief.

Across our 14 functional requirements with 2 acceptance criteria each, 27 are fully Met with a value of 1.0, and 1 is Partially Met with a value of 0.5. This yields 27.5 divided by 28, or 98.21% functional completion.

Across our 10 Non-Functional Requirements, all 10 quantitative metrics are verified, yielding 100% NFR completion.

Combined, our project achieves 98.68% overall scope completion. This places CivicConnect firmly in the highest 90 to 100% band, far surpassing the faculty's 80% requirement, while proving disciplined scope control."`
  },

  // SLIDE 7
  {
    num: 7,
    tag: "Stage 3: M3 Closure",
    pillClass: "gold",
    title: "Stage 3: Milestone 3 → Final Project Closure & Register Finalisation",
    subtitle: "Complete Accounting of Defects, Technical Debt, Residual Risks & AI Governance",
    footerLeft: "Registers Concluded: Defect v4.0 • Debt v2.0 • Risk v4.0 • AI v4.0",
    footerRight: "Zero Open S1/S2 Defects • 100% Traceable",
    content: `
      <div class="grid-2">
        <div class="card">
          <div class="card-label">Defect Register v4.0 (4/4 Resolved)</div>
          <ul class="clean-list">
            <li><strong>DEF-001 (Sev 2):</strong> Category invariant bypass; resolved via Factory Method in <code>CategoryFactories.ts</code>.</li>
            <li><strong>DEF-002 (Sev 3):</strong> Postgres adapter coverage gate; resolved via configuration isolation in <code>vitest.config.ts</code>.</li>
            <li><strong>DEF-003 (Sev 1):</strong> Concurrent ticket claim race condition; resolved via integer <code>version</code> OCC in <code>ServiceRequest.ts</code>.</li>
            <li><strong>DEF-004 (Sev 2):</strong> Unprivileged citizen ticket assignment; resolved via centralized RBAC guards in <code>RequestController.ts</code>.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Technical Debt Register v2.0 (4 Items Concluded)</div>
          <ul class="clean-list">
            <li><strong>DEBT-001 (Persistence):</strong> Dual-persistence switch (In-memory for CI, Postgres for staging). Protected by interface; zero leak.</li>
            <li><strong>DEBT-002 (Events):</strong> In-memory Observer dispatching. Outbox table DDL established; worker poll queued for scaling.</li>
            <li><strong>DEBT-003 (Gateways):</strong> Mock notification sinks avoiding paid SMS costs. Handover adapter ready for live webhooks.</li>
            <li><strong>DEBT-004 (Deployment):</strong> Single-host Docker Compose staging. Documented as part of justified cloud No-Go decision.</li>
          </ul>
        </div>
      </div>
      <div class="banner">
        <span><strong>Risk Register v4.0:</strong> 15/15 risks controlled. Team attrition shocks (RSK-011, RSK-012) fully absorbed via ADR-009 & ADR-012.</span>
        <span style="color: #34d399; font-weight: 700;">AI Register v4.0: 11 entries verified</span>
      </div>
    `,
    notes: `"Moving to Stage 3: Milestone 3 Issue Closure.

Section 7 of the brief emphasizes that closure does not mean perfection; it means knowing the exact final status of all engineering issues.

In our Defect Register v4.0:
- All 4 logged defects—DEF-001 through DEF-004—are 100% resolved and guarded by automated regression tests in CI. There are zero open Severity 1 or 2 defects.

In our Technical Debt Register v2.0:
- All 4 deliberate trade-offs are accounted for behind clean interface boundaries: our dual-persistence switch, in-memory observer dispatching, mock notification sinks, and single-host containerized staging.

In our Risk Register v4.0:
- All 15 risks are controlled. The catastrophic team attrition shocks of losing both partners were stabilized via ADR-009 and ADR-012.

And in our AI Usage Register v4.0:
- All 11 AI interactions across the lifecycle are fully documented with domain verification and hallucinations rectified."`
  },

  // SLIDE 8
  {
    num: 8,
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
    notes: `"Turning to Stage 4: Living Traceability.

Brief Section 9 mandates continuing the existing RTM rather than creating a disconnected final document. Our living RTM v4.0 enforces the full 8-stage verification chain.

To demonstrate our deep trace:
Take FR-001: The community requester needed digital fault reporting. This mapped to AC-001.1 and AC-001.2. In architecture, it is governed by ADR-005 Factory Method. In code, it is implemented in CreateServiceRequest.ts and CategoryFactories.ts. In testing, it is verified by TC-UNIT-FAC-01 and API integration tests in CI Gate 3. When an invariant bypass was discovered, it was logged as DEF-001, resolved, and verified. Final outcome: MET.

Similarly, FR-009 concurrency and FR-010 FSM trace through ADR-006, integer version OCC checking in ServiceRequest.ts, and our automated race condition tests, fully closing DEF-003.

This is empirical proof of requirements preservation from inception to release."`
  },

  // SLIDE 9
  {
    num: 9,
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
    notes: `"Continuing Stage 4 on Slide 9: Our automated verification evidence.

We do not rely on subjective claims of quality. Our GitHub Actions pipeline enforces four automated quality gates on every commit:
- Gate 1 validates clean TypeScript compilation with zero errors.
- Gate 2 validates dependencies with npm audit, reporting zero high or critical CVEs.
- Gate 3 executes our 42 automated tests across 12 files in under 12 seconds, achieving 93.60% statement coverage, 85.20% branch coverage, and 92.50% function coverage.
- Gate 4 verifies our Docker container build and healthcheck probes.

Furthermore, our load benchmark under 50 concurrent requests achieved a p95 latency of 142 milliseconds—well within our 500 millisecond NFR-001 threshold with zero failed requests."`
  },

  // SLIDE 10
  {
    num: 10,
    tag: "Stage 5: Deployment Decision",
    pillClass: "gold",
    title: "Stage 5: Final Deployment Baseline & Defended Go-Live Decision",
    subtitle: "Simulated Production Release with an Evidence-Based Staging No-Go for Cloud Production",
    footerLeft: "SEN381 Final Project Brief §11 • Final Deployment State",
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
          <div class="card-desc">
            Load test certified 50 concurrent users at p95=142ms. Municipal burst load (5,000+ users) requires multi-region pooling and Redis caching unverified under $0 cost cap.
          </div>
        </div>
        <div class="card">
          <div class="card-label">Condition 2: Gateway Decoupling</div>
          <div class="card-val" style="font-size: 16px; color: #38bdf8;">Telecom Sandbox Safety</div>
          <div class="card-desc">
            Live paid SMS/Email provider APIs (Twilio/SendGrid) decoupled via Observer (ADR-004) and Outbox (ADR-007) to avoid committing credentials and incurring recurring cloud costs.
          </div>
        </div>
        <div class="card">
          <div class="card-label">Condition 3: Operational Risk</div>
          <div class="card-val" style="font-size: 16px; color: #f87171;">Solo Maintenance Limit</div>
          <div class="card-desc">
            Following team attrition, rolling to public unmonitored production without a 24/7 on-call incident response team violates operational reliability principles.
          </div>
        </div>
      </div>
      <div class="banner">
        <span><strong>Brief §11 Standard:</strong> <em>"A well-evidenced no-go decision based on credible security, reliability or operational concerns is sound software-engineering judgement."</em></span>
      </div>
    `,
    notes: `"Moving to Stage 5: Final Deployment and Go-Live Decision.

Brief Section 11 explicitly instructs teams to declare and defend their release state: production, simulated production, or staging under a justified no-go decision. It notes that teams must not lose marks for refusing to race into production to meet a deadline.

Our declared final state is SIMULATED PRODUCTION RELEASE with a defended NO-GO DECISION for public cloud production.

Our decision is grounded in three engineering realities:
1. Concurrency Soak: We benchmarked 50 users at 142ms, but true municipal scale with thousands of concurrent citizens requires multi-region clustering not verifiable under academic zero-cost constraints.
2. Gateway Decoupling: We decoupled external telecom providers via Observer and Outbox patterns to protect against billing spikes and network flakiness.
3. Solo Maintenance: With single-engineer continuity under ADR-012, releasing to live public users without a 24/7 on-call rotation represents an irresponsible operational risk.

Remaining in verified Simulated Production while defending a Staging No-Go protects stakeholder value."`
  },

  // SLIDE 11
  {
    num: 11,
    tag: "Stage 5: Decision Reflection",
    pillClass: "purple",
    title: "Stage 5 (Cont.): Decision Consequence Reflection & Lessons Learned",
    subtitle: "Evaluating Architectural Choices, Trade-offs & Downstream Lifecycle Consequences",
    footerLeft: "Master Project Brief §22 • Decision Consequence Reflection",
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
    notes: `"Continuing Stage 5 on Slide 11: Decision Consequence Reflection.

Section 22 of the Master Brief asks us to reflect on our earlier architectural decisions using authentic evidence rather than hindsight alone.

Selecting a TypeScript Clean Monolith under ADR-008 was our most vital decision: its shared language and low memory footprint allowed a single engineer to absorb the entire project after team attrition.

Adopting the Factory Method Pattern under ADR-005 made resolving Defect 001 straightforward because category validation was isolated from our core intake pipeline.

Implementing Optimistic Concurrency Control under ADR-006 successfully eliminated race conditions during concurrent work order assignments.

And ratifying ADR-012 preserved our SCM governance, allowing us to complete the capstone on time with full NQF Level 8 audit compliance."`
  },

  // SLIDE 12
  {
    num: 12,
    tag: "Stage 6: Individual Defence",
    pillClass: "gold",
    title: "Stage 6: Individual Engineering Defence & Capstone Conclusion",
    subtitle: "Universal 5-Step Defence Answering Formula & Academic Integrity Attestation",
    footerLeft: "Chris Fourie (ID: 602826) • Sole Active Lead Engineer",
    footerRight: "SEN381 NQF Level 8 • Final Capstone Defence Ready",
    content: `
      <div class="card" style="margin-bottom: 12px; padding: 12px 16px;">
        <div class="card-label">Universal 5-Step Oral Defence Answering Formula</div>
        <div style="font-family: 'Consolas', monospace; font-size: 12px; color: #38bdf8; line-height: 1.4;">
          [1. Live Artefact Evidence] ──► [2. Engineering Concern / ASR] ──► [3. Architectural Pattern / Control] ──► [4. Trade-off & Cost] ──► [5. Justified Outcome & Verification]
        </div>
      </div>
      <div class="grid-3">
        <div class="card">
          <div class="card-label">Defence Readiness Dimensions</div>
          <ul class="clean-list">
            <li><strong>Contribution & Code:</strong> 100% command of domain, use cases, tests, and CI.</li>
            <li><strong>Traceability:</strong> Ability to trace any FR from stakeholder need to test oracle.</li>
            <li><strong>Decisions & Trade-offs:</strong> Defending ADR-001 through ADR-012 with empirical evidence.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Quality & Risk Command</div>
          <ul class="clean-list">
            <li><strong>Defects:</strong> Explaining root cause and regression fix for DEF-001 to 004.</li>
            <li><strong>Technical Debt:</strong> Articulating maintenance impacts of DEBT-001 to 004.</li>
            <li><strong>Uncertainty:</strong> Transparently explaining municipal soak limitations.</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-label">Final Project Conclusion</div>
          <ul class="clean-list">
            <li><strong>98.2% Scope Completion:</strong> 100% of Must-have commitments delivered.</li>
            <li><strong>Zero Drop in Quality:</strong> 93.60% coverage maintained despite team attrition.</li>
            <li><strong>Integrity:</strong> 100% human-verified engineering; AI held accountable.</li>
          </ul>
        </div>
      </div>
      <div class="banner">
        <span><strong>Academic Attestation:</strong> All code, tests, and dossiers verified under full individual accountability.</span>
        <span style="color: #38bdf8; font-weight: 700;">Ready for Panel Examination</span>
      </div>
    `,
    notes: `"Finally, Stage 6: Individual Engineering Defence.

As the sole active engineer who designed the architecture, wrote the backend, configured Docker, authored the automated tests, and maintained our living dossiers, I am prepared to answer panel questions across all 11 assessment dimensions using our 5-step engineering formula:
Connecting live artefact evidence, to the underlying engineering concern, the architectural pattern applied, the accepted trade-off, and the verified empirical outcome.

CivicConnect proves that Software Engineering is about discipline, traceability, and accountability under real-world constraints.

Thank you, Assessor. I welcome your questions and look forward to defending our engineering record."`
  }
];

// Step 1: Render slides via HTML + Edge headless
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
const psScript = path.join(tempDir, 'build_m4_deck.ps1');

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

Write-Host "M4_DECK_BUILD_SUCCESS"
`;

fs.writeFileSync(path.join(tempDir, 'slides_manifest.json'), JSON.stringify(renderedSlides, null, 2), 'utf8');
fs.writeFileSync(psScript, psContent, 'utf8');

const psCmd = `powershell -ExecutionPolicy Bypass -File "${psScript}"`;
const out = execSync(psCmd).toString();
console.log(out);
console.log('Milestone 4 Final PowerPoint generated successfully across all targets!');
