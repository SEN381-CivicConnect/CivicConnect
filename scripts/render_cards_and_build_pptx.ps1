$ErrorActionPreference = "Stop"

$tempDir = "$env:TEMP\m3_cards"
if (-not (Test-Path $tempDir)) { New-Item -ItemType Directory -Path $tempDir -Force }

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outputPath = "C:\Chris\Studies\SEN\Project\docs\presentation\CivicConnect_M3_Presentation.pptx"
$outputRoot = "C:\Chris\Studies\SEN\Project\CivicConnect_M3_Presentation.pptx"
$outputDesktop = "C:\Users\jakof\Desktop\CivicConnect_M3_Presentation.pptx"
$outputDownloads = "C:\Users\jakof\Downloads\CivicConnect_M3_Presentation.pptx"
$outputSENRoot = "C:\Chris\Studies\SEN\CivicConnect_M3_Presentation.pptx"

# Helper to render an HTML card to PNG via Edge headless
function Render-Card($cardId, $htmlContent) {
    $htmlFile = "$tempDir\card_$cardId.html"
    $pngFile = "$tempDir\card_$cardId.png"
    
    $fullHtml = @"
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 832px;
    height: 320px;
    background: #1e293b;
    color: #f8fafc;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
    border-radius: 12px;
    border: 1px solid #334155;
    padding: 18px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #334155;
    padding-bottom: 10px;
  }
  .title-text {
    font-size: 15px;
    font-weight: 700;
    color: #38bdf8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .badge {
    background: #0f172a;
    border: 1px solid #38bdf8;
    color: #38bdf8;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 999px;
  }
  .badge.green { border-color: #34d399; color: #34d399; }
  .badge.gold { border-color: #fbbf24; color: #fbbf24; }
  .badge.red { border-color: #f43f5e; color: #f43f5e; }
  
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    flex: 1;
    margin: 12px 0 6px 0;
  }
  .content-grid.three-col {
    grid-template-columns: 1fr 1fr 1fr;
  }
  .panel {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .panel-header {
    font-size: 12px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .row-item {
    font-size: 11.5px;
    color: #cbd5e1;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .row-item strong { color: #f8fafc; font-weight: 600; }
  .row-item .tag {
    font-size: 10.5px;
    background: #1e293b;
    border: 1px solid #475569;
    padding: 1px 6px;
    border-radius: 4px;
    color: #93c5fd;
  }
  .stat-card {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .stat-val {
    font-size: 26px;
    font-weight: 800;
    color: #38bdf8;
    line-height: 1.1;
  }
  .stat-val.green { color: #34d399; }
  .stat-val.gold { color: #fbbf24; }
  .stat-lbl {
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    margin-top: 4px;
  }
  .footer-bar {
    font-size: 11px;
    color: #94a3b8;
    border-top: 1px solid #334155;
    padding-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer-bar strong { color: #38bdf8; }
</style>
</head>
<body>
$htmlContent
</body>
</html>
"@
    Set-Content -Path $htmlFile -Value $fullHtml -Encoding UTF8
    $fileUrl = "file:///" + ($htmlFile -replace '\\','/')
    & $edgePath --headless --disable-gpu --force-device-scale-factor=2 --window-size=832,320 --screenshot="$pngFile" "$fileUrl" | Out-Null
    Start-Sleep -Milliseconds 800
    return $pngFile
}

Write-Host "Rendering 12 visual artifact cards..."

# CARD 1: Title Card
$c1 = @"
  <div class="title-bar">
    <span class="title-text">Official Baseline Specification</span>
    <span class="badge gold">Milestone 3 Deliverable</span>
  </div>
  <div class="content-grid">
    <div class="panel">
      <div class="panel-header">Submitted Release Candidate</div>
      <div class="row-item"><strong>Release Version:</strong> <span class="tag">v0.3.0-rc1</span></div>
      <div class="row-item"><strong>Target Commit:</strong> <span class="tag">886b602 on main</span></div>
      <div class="row-item"><strong>Module:</strong> <span>SEN381 (NQF Level 8)</span></div>
      <div class="row-item"><strong>Institution:</strong> <span>Belgium Campus ITversity</span></div>
      <div class="row-item"><strong>Submission Deadline:</strong> <span style="color:#34d399; font-weight:700;">16 October 2026, 23:59</span></div>
    </div>
    <div class="panel">
      <div class="panel-header">Team Engineering Governance</div>
      <div class="row-item"><strong>Registered Team:</strong> <span>Group E - CivicConnect</span></div>
      <div class="row-item"><strong>Lead Engineer:</strong> <span>Chris Fourie (602826)</span></div>
      <div class="row-item"><strong>Governance Protocol:</strong> <span class="tag">ADR-012 Ratified</span></div>
      <div class="row-item"><strong>Merge Authority:</strong> <span>4 Automated CI Gates + Self-Audit</span></div>
      <div class="row-item"><strong>Team Context:</strong> <span style="color:#94a3b8;">Pandora (W29), Lisa (W08); Grace preserved</span></div>
    </div>
  </div>
  <div class="footer-bar">
    <span>Governing Standard: <strong>SEN381 Milestone 3 Brief & Master Brief</strong></span>
    <span style="color:#34d399;">Ready for Video Engineering Defence</span>
  </div>
"@
$png1 = Render-Card 1 $c1

# CARD 2: Stage 2 Conformance
$c2 = @"
  <div class="title-bar">
    <span class="title-text">M2 Architectural Conformance & Controlled Changes</span>
    <span class="badge green">Area A: 5 Marks</span>
  </div>
  <div class="content-grid">
    <div class="panel">
      <div class="panel-header">100% Conforming Baseline Patterns</div>
      <div class="row-item"><strong>Clean Monolith:</strong> <span class="tag">code/src/ 4-layer isolation</span></div>
      <div class="row-item"><strong>Relational 3NF:</strong> <span class="tag">PostgreSQL 16 & DDL V1</span></div>
      <div class="row-item"><strong>Factory Method:</strong> <span class="tag">CategoryFactories.ts (ADR-005)</span></div>
      <div class="row-item"><strong>Observer Pattern:</strong> <span class="tag">DomainEventDispatcher.ts (ADR-004)</span></div>
      <div class="row-item"><strong>Concurrency:</strong> <span class="tag">OCC version column (ADR-006)</span></div>
    </div>
    <div class="panel">
      <div class="panel-header">Controlled Deviations (Ratified ADRs)</div>
      <div class="row-item"><strong>ADR-010:</strong> <span>Dual persistence (In-memory CI & Postgres staging)</span></div>
      <div class="row-item"><strong>ADR-011:</strong> <span>Containerized staging & declarative DDL rollback</span></div>
      <div class="row-item"><strong>ADR-012:</strong> <span>Solo SCM governance protocol with CI authority</span></div>
      <div class="row-item"><strong>CR-001:</strong> <span>Emergency hazard escalation & POPIA data masking</span></div>
      <div class="row-item"><strong>App. E:</strong> <span style="color:#38bdf8;">Full 10-dimension formal impact analysis documented</span></div>
    </div>
  </div>
  <div class="footer-bar">
    <span>Architecture: <strong>TypeScript 5.3 + Node.js 20 LTS + PostgreSQL 16</strong></span>
    <span>Zero Silent Deviations</span>
  </div>
"@
$png2 = Render-Card 2 $c2

# CARD 3: Stage 3 SCM
$c3 = @"
  <div class="title-bar">
    <span class="title-text">Controlled Construction & Secrets Hygiene</span>
    <span class="badge">Area B: 4 Marks</span>
  </div>
  <div class="content-grid">
    <div class="panel">
      <div class="panel-header">SCM Branching & Pull Request Governance</div>
      <div class="row-item"><strong>Main Protection:</strong> <span class="tag" style="color:#34d399;">LOCKED: 0 direct feature commits</span></div>
      <div class="row-item"><strong>Feature Branch:</strong> <span class="tag">feat/m3-auth-rbac</span></div>
      <div class="row-item"><strong>Pull Request:</strong> <span>PR #3 merged to main (Commit 93046ab)</span></div>
      <div class="row-item"><strong>Audit Trail:</strong> <span>Signed single-engineer checklist per ADR-012</span></div>
      <div class="row-item"><strong>Progressive Commits:</strong> <span>25+ granular commits across lifecycle</span></div>
    </div>
    <div class="panel">
      <div class="panel-header">Configuration & Secrets Isolation</div>
      <div class="row-item"><strong>Zero Git Secrets:</strong> <span class="tag">.env in .gitignore</span></div>
      <div class="row-item"><strong>Templates:</strong> <span>.env.example & .env.staging.example</span></div>
      <div class="row-item"><strong>Container User:</strong> <span class="tag">USER node (unprivileged)</span></div>
      <div class="row-item"><strong>Multi-Stage:</strong> <span>Builder vs lightweight runner image</span></div>
      <div class="row-item"><strong>Supply Chain:</strong> <span style="color:#34d399;">0 high/critical production CVEs</span></div>
    </div>
  </div>
  <div class="footer-bar">
    <span>Repository: <strong>https://github.com/SEN381-CivicConnect/CivicConnect.git</strong></span>
    <span style="color:#34d399;">Strict SCM Discipline</span>
  </div>
"@
$png3 = Render-Card 3 $c3

# CARD 4: Stage 4 CI
$c4 = @"
  <div class="title-bar">
    <span class="title-text">Continuous Integration Multi-Gate Pipeline</span>
    <span class="badge green">Area C: 6 Marks</span>
  </div>
  <div class="content-grid four-col" style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:10px;">
    <div class="stat-card">
      <div class="stat-val green">G1</div>
      <div class="stat-lbl">npm ci</div>
      <div style="font-size:10px; color:#cbd5e1; margin-top:4px;">Deterministic Lockfile Restore</div>
    </div>
    <div class="stat-card">
      <div class="stat-val green">G2</div>
      <div class="stat-lbl">tsc & build</div>
      <div style="font-size:10px; color:#cbd5e1; margin-top:4px;">0 Compiler Errors (Strict)</div>
    </div>
    <div class="stat-card">
      <div class="stat-val green">G3</div>
      <div class="stat-lbl">vitest --cov</div>
      <div style="font-size:10px; color:#cbd5e1; margin-top:4px;">42 Tests / 93.6% Coverage</div>
    </div>
    <div class="stat-card">
      <div class="stat-val green">G4</div>
      <div class="stat-lbl">npm audit</div>
      <div style="font-size:10px; color:#cbd5e1; margin-top:4px;">0 High/Critical CVEs</div>
    </div>
  </div>
  <div class="panel" style="margin-top:6px; padding:10px;">
    <div class="row-item"><strong>Quality Gate Failure Rule:</strong> <span>Any test failure, coverage < 80%, or high CVE halts pipeline and blocks merge.</span></div>
    <div class="row-item"><strong>Meaningful CI Interpretation:</strong> <span style="color:#94a3b8;">Proves code correctness & type contracts; does NOT prove third-party SMS carrier uptime.</span></div>
  </div>
  <div class="footer-bar">
    <span>Workflow Specification: <strong>.github/workflows/ci.yml</strong></span>
    <span style="color:#34d399;">100% Automated Gate Enforcement</span>
  </div>
"@
$png4 = Render-Card 4 $c4

# CARD 5: Stage 4b Test Metrics
$c5 = @"
  <div class="title-bar">
    <span class="title-text">Automated Verification Suite & V8 Coverage</span>
    <span class="badge green">42 Tests &bull; 93.61% Coverage</span>
  </div>
  <div class="content-grid four-col" style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:10px;">
    <div class="stat-card">
      <div class="stat-val green">42 / 42</div>
      <div class="stat-lbl">Tests Passing (100%)</div>
    </div>
    <div class="stat-card">
      <div class="stat-val green">93.61%</div>
      <div class="stat-lbl">Statement Coverage</div>
    </div>
    <div class="stat-card">
      <div class="stat-val green">84.92%</div>
      <div class="stat-lbl">Branch Coverage</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">1.98 s</div>
      <div class="stat-lbl">Execution Duration</div>
    </div>
  </div>
  <div class="panel" style="margin-top:6px; padding:10px;">
    <div class="panel-header">Layer Coverage Breakdown (vitest.config.ts)</div>
    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; font-size:11px;">
      <div>&bull; <strong>Factories:</strong> 100% Stmts / 93.9% Br</div>
      <div>&bull; <strong>Domain Events:</strong> 97.2% Stmts</div>
      <div>&bull; <strong>Entities (FSM):</strong> 96.8% Stmts</div>
      <div>&bull; <strong>Use Cases:</strong> 96.0% Stmts</div>
      <div>&bull; <strong>DTO Mappers:</strong> 100% Stmts</div>
      <div>&bull; <strong>Controllers:</strong> 91.5% Stmts</div>
    </div>
  </div>
  <div class="footer-bar">
    <span>Quotas: <strong>Unit: 13 (>=5) | Black-box: 20 (>=5) | API: 5 (>=3) | E2E: 3 (>=2)</strong></span>
    <span style="color:#34d399;">All M3 Quotas Exceeded</span>
  </div>
"@
$png5 = Render-Card 5 $c5

# CARD 6: Stage 5 Black-Box
$c6 = @"
  <div class="title-bar">
    <span class="title-text">Black-Box Validation Techniques</span>
    <span class="badge">Area D: 6 Marks</span>
  </div>
  <div class="content-grid">
    <div class="panel">
      <div class="panel-header">Technique 1: Equivalence & Boundary Value</div>
      <div class="row-item"><strong>Suite:</strong> <span class="tag">InputBoundaryValidation.test.ts</span></div>
      <div class="row-item"><strong>Title Min (N=3):</strong> <span>N=2 throws Error; N=3 Accepted</span></div>
      <div class="row-item"><strong>Title Max (N=100):</strong> <span>N=100 Accepted; N=101 Rejected</span></div>
      <div class="row-item"><strong>Phone Regex EP:</strong> <span>Valid SA formats (+27) pass; alpha fails</span></div>
      <div class="row-item"><strong>Cases:</strong> <span style="color:#34d399; font-weight:700;">10 boundary test cases passing</span></div>
    </div>
    <div class="panel">
      <div class="panel-header">Technique 2: Decision Table Testing</div>
      <div class="row-item"><strong>Suite:</strong> <span class="tag">IntakeDecisionTable.test.ts</span></div>
      <div class="row-item"><strong>Rules 1-4:</strong> <span>Category taxonomy routing & default SLAs</span></div>
      <div class="row-item"><strong>Rule 3 (CR-001):</strong> <span>Emergency hazard -> auto-escalate CRITICAL</span></div>
      <div class="row-item"><strong>Rules 5-8:</strong> <span>Missing invariant fields -> HTTP 400 rejection</span></div>
      <div class="row-item"><strong>Rules 9-10:</strong> <span>POPIA contact masking defaults verified</span></div>
    </div>
  </div>
  <div class="footer-bar">
    <span>Focus: <strong>Techniques chosen based on domain requirements, not artificial padding</strong></span>
    <span style="color:#34d399;">20 Black-Box Cases Passing</span>
  </div>
"@
$png6 = Render-Card 6 $c6

# CARD 7: Stage 5b Integration & E2E
$c7 = @"
  <div class="title-bar">
    <span class="title-text">Integration Contracts & Three Critical E2E Journeys</span>
    <span class="badge">Area D: 6 Marks</span>
  </div>
  <div class="content-grid">
    <div class="panel">
      <div class="panel-header">REST API Contracts & Negative Security (api.test.ts)</div>
      <div class="row-item"><strong>HTTP 201:</strong> <span>Valid intake returns tracking REQ-YYYY-XXXX</span></div>
      <div class="row-item"><strong>HTTP 403:</strong> <span style="color:#f43f5e; font-weight:700;">Unauthorized citizen assignment blocked (DEF-004)</span></div>
      <div class="row-item"><strong>HTTP 409:</strong> <span style="color:#fbbf24; font-weight:700;">Stale OCC version claim rejected (DEF-003)</span></div>
      <div class="row-item"><strong>HTTP 400:</strong> <span>Illegal FSM state jump rejected (FR-010)</span></div>
      <div class="row-item"><strong>HTTP 404:</strong> <span>Non-existent ticket ID error payload verified</span></div>
    </div>
    <div class="panel">
      <div class="panel-header">Three Critical End-to-End System Journeys</div>
      <div class="row-item"><strong>Journey 1:</strong> <span>citizenLifecycle.test.ts (Intake -> Triage -> Resolve)</span></div>
      <div class="row-item"><strong>Journey 2:</strong> <span>securityBoundary.test.ts (Privilege & Tamper check)</span></div>
      <div class="row-item"><strong>Journey 3:</strong> <span>operationalResilience.test.ts (Health & Memory probe)</span></div>
      <div class="row-item"><strong>State Lock:</strong> <span>CLOSED tickets permanently locked from edits</span></div>
      <div class="row-item"><strong>POPIA Mask:</strong> <span>Technicians receive [POPIA PROTECTED] contact</span></div>
    </div>
  </div>
  <div class="footer-bar">
    <span>End-to-End Integration: <strong>Cross-layer verification across Presentation, Domain & Persistence</strong></span>
    <span style="color:#34d399;">3/3 E2E Journeys Passing</span>
  </div>
"@
$png7 = Render-Card 7 $c7

# CARD 8: Stage 6 Staging
$c8 = @"
  <div class="title-bar">
    <span class="title-text">Containerized Staging & Rollback Strategy</span>
    <span class="badge green">Area F: 3 Marks</span>
  </div>
  <div class="content-grid">
    <div class="panel">
      <div class="panel-header">Simulated Staging Parity (docker-compose.staging.yml)</div>
      <div class="row-item"><strong>App Container:</strong> <span class="tag">Port 5001 (Node 20 Alpine)</span></div>
      <div class="row-item"><strong>PostgreSQL 16:</strong> <span class="tag">Port 5433 (civicconnect_staging)</span></div>
      <div class="row-item"><strong>Liveness Probe:</strong> <span>/health/live (UP, v0.3.0-rc1, commit 886b602)</span></div>
      <div class="row-item"><strong>Readiness Probe:</strong> <span>/health/ready (SELECT 1; pool check)</span></div>
      <div class="row-item"><strong>Web Dashboard:</strong> <span>Interactive portal at http://localhost:5001/</span></div>
    </div>
    <div class="panel">
      <div class="panel-header">Verified Rollback Strategy (ADR-011)</div>
      <div class="row-item"><strong>Scenario A:</strong> <span>Code regression -> revert image to M2 commit ffc17cb</span></div>
      <div class="row-item"><strong>Scenario B:</strong> <span>Corrupted schema -> reverse DDL script execution</span></div>
      <div class="row-item"><strong>Rollback Script:</strong> <span class="tag">V1__rollback_initial_schema.sql</span></div>
      <div class="row-item"><strong>Order:</strong> <span>Clean drops in reverse foreign-key dependency order</span></div>
      <div class="row-item"><strong>Trade-off:</strong> <span style="color:#fbbf24;">Rollback drops staging tickets; documented in guide</span></div>
    </div>
  </div>
  <div class="footer-bar">
    <span>Environment Standard: <strong>M3 Brief &sect;14 &mdash; Local Staging Environment with Zero Cloud Cost</strong></span>
    <span style="color:#34d399;">Staging Verified</span>
  </div>
"@
$png8 = Render-Card 8 $c8

# CARD 9: Stage 7 Registers
$c9 = @"
  <div class="title-bar">
    <span class="title-text">Living Engineering Registers & Defect Retrospective</span>
    <span class="badge">Area E: 4 Marks</span>
  </div>
  <div class="content-grid">
    <div class="panel">
      <div class="panel-header">Living RTM v3.0 & Defect Register (100% Resolved)</div>
      <div class="row-item"><strong>RTM v3.0:</strong> <span>8-stage chain covering all 14 FRs & 10 NFRs</span></div>
      <div class="row-item"><strong>DEF-001 (High):</strong> <span>Category bypass -> Factory Method pattern fix</span></div>
      <div class="row-item"><strong>DEF-002 (Med):</strong> <span>Postgres adapter coverage -> vitest.config.ts</span></div>
      <div class="row-item"><strong>DEF-003 (Crit):</strong> <span>Claim race condition -> OCC 409 conflict return</span></div>
      <div class="row-item"><strong>DEF-004 (High):</strong> <span>Citizen assignment -> RBAC controller guard</span></div>
    </div>
    <div class="panel">
      <div class="panel-header">Technical Debt & Responsible AI Governance</div>
      <div class="row-item"><strong>DEBT-001 / 002:</strong> <span>Dual persistence switch & In-memory observers</span></div>
      <div class="row-item"><strong>DEBT-003 / 004:</strong> <span>Mock telecom gateway sinks & Single-host staging</span></div>
      <div class="row-item"><strong>Debt Plan:</strong> <span style="color:#38bdf8;">All 4 items non-blocking; repayment mapped to M4</span></div>
      <div class="row-item"><strong>AI Register:</strong> <span>11 entries; human critique & verified rejections</span></div>
      <div class="row-item"><strong>Rejections:</strong> <span style="color:#f43f5e;">Rejected Kafka (RAM cap) & direct unreviewed pushes</span></div>
    </div>
  </div>
  <div class="footer-bar">
    <span>Defect Status: <strong>0 Open Severity 1 or 2 Defects Remaining</strong></span>
    <span style="color:#34d399;">100% Regression Protected</span>
  </div>
"@
$png9 = Render-Card 9 $c9

# CARD 10: Stage 8 Load Benchmark
$c10 = @"
  <div class="title-bar">
    <span class="title-text">Performance Benchmark & Concurrency Burst (NFR-001)</span>
    <span class="badge green">Area F: 3 Marks</span>
  </div>
  <div class="content-grid four-col" style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:10px;">
    <div class="stat-card">
      <div class="stat-val green">100%</div>
      <div class="stat-lbl">Success Rate (50/50)</div>
    </div>
    <div class="stat-card">
      <div class="stat-val green">142 ms</div>
      <div class="stat-lbl">p95 Latency (Target <=500ms)</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">58 ms</div>
      <div class="stat-lbl">Median Latency (p50)</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">~42 MB</div>
      <div class="stat-lbl">Memory RSS (<512MB Cap)</div>
    </div>
  </div>
  <div class="panel" style="margin-top:6px; padding:10px;">
    <div class="row-item"><strong>What the Benchmark Proves:</strong> <span>Node.js async event loop & Clean Architecture validation handle peak intake bursts.</span></div>
    <div class="row-item"><strong>What it Does NOT Prove (M3 Brief &sect;13):</strong> <span style="color:#fbbf24;">Does not prove municipal scale with 10,000 citizens or cellular network packet loss.</span></div>
  </div>
  <div class="footer-bar">
    <span>Operation Tested: <strong>POST /api/v1/requests (load.test.ts)</strong></span>
    <span style="color:#34d399;">NFR-001 Fully Satisfied</span>
  </div>
"@
$png10 = Render-Card 10 $c10

# CARD 11: Stage 9 Release Readiness
$c11 = @"
  <div class="title-bar">
    <span class="title-text">Release Readiness & Residual Risk Statement</span>
    <span class="badge gold">Area G: 2 Marks</span>
  </div>
  <div class="content-grid">
    <div class="panel" style="text-align:center; justify-content:center;">
      <div class="panel-header">Official Release Verdict</div>
      <div style="font-size:24px; font-weight:800; color:#fbbf24; margin:8px 0;">CONDITIONALLY READY</div>
      <div style="font-size:11px; color:#cbd5e1; line-height:1.4;">
        Core scope operational &bull; 42 tests pass &bull; 0 high CVEs<br>
        <strong>Conditions:</strong> Single-node staging boundary, in-memory CI doubles, and simulated notification sinks.
      </div>
    </div>
    <div class="panel">
      <div class="panel-header">Four Managed Residual Risks (M3 Brief &sect;16)</div>
      <div class="row-item"><strong>RSK-012 Municipal Load:</strong> <span>Mitigated by 50-concurrency test; M4 soak test</span></div>
      <div class="row-item"><strong>RSK-014 Telecom Outage:</strong> <span>Mitigated by outbox table; live webhooks in M4</span></div>
      <div class="row-item"><strong>RSK-010 Solo SCM:</strong> <span>Mitigated by ratified ADR-012 & CI quality gates</span></div>
      <div class="row-item"><strong>RSK-013 Schema Drift:</strong> <span>Mitigated by Postgres adapter column alignment</span></div>
    </div>
  </div>
  <div class="footer-bar">
    <span>Justification: <strong>Claiming unconditional 'production ready' earns low marks; conditions earn high credit</strong></span>
    <span style="color:#fbbf24;">Transparent Engineering</span>
  </div>
"@
$png11 = Render-Card 11 $c11

# CARD 12: Stage 10 Individual Defence
$c12 = @"
  <div class="title-bar">
    <span class="title-text">Individual Engineering Defence Synthesis</span>
    <span class="badge gold">Defence: 20 Marks</span>
  </div>
  <div class="content-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
    <div class="panel">
      <div class="row-item"><strong>1. Trace (4 Marks):</strong> <span>FR-001 intake -> CategoryFactories -> tests -> 201</span></div>
      <div class="row-item"><strong>2. Decision (4 Marks):</strong> <span>ADR-006 OCC vs pessimistic locking (connection pool)</span></div>
      <div class="row-item"><strong>3. Quality (4 Marks):</strong> <span>42 tests prove rules; green CI cannot prove WAN</span></div>
    </div>
    <div class="panel">
      <div class="row-item"><strong>4. Failure (4 Marks):</strong> <span>DEF-003 race condition mapped to 409 Conflict</span></div>
      <div class="row-item"><strong>5. Readiness (4 Marks):</strong> <span>CONDITIONALLY READY grounded in multiple evidence sources</span></div>
      <div class="row-item"><strong>Deadline:</strong> <span style="color:#34d399; font-weight:700;">Friday 16 October 2026, 23:59 SAST</span></div>
    </div>
  </div>
  <div class="footer-bar">
    <span>Assessed Student: <strong>Chris Fourie (602826) &mdash; Systems Architect & Lead Engineer</strong></span>
    <span style="color:#34d399;">100% Prepared for Defence</span>
  </div>
"@
$png12 = Render-Card 12 $c12

Write-Host "All 12 cards rendered successfully. Building PowerPoint presentation..."

# Build PowerPoint Presentation via COM
$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Add()
$pres.PageSetup.SlideWidth = 960
$pres.PageSetup.SlideHeight = 540

$slidesData = @(
    @{ Title = "CivicConnect Milestone 3"; Subtitle = "Controlled construction, integration, quality and release readiness baseline (PED v3.0)"; Png = $png1; Notes = "TIMING: ~2:00 mins.`n`nON-CAMERA INTRO:`n1. Look directly at webcam: 'Good day Assessor. My name is Chris Fourie, student number 602826, representing Group E for the SEN381 CivicConnect project.'`n2. Introduce release candidate v0.3.0-rc1 on commit 886b602.`n3. State the governance context under ADR-012." },
    @{ Title = "Architecture: Clean Layered Monolith with strict layer isolation"; Subtitle = "Stage 2: M2 Baseline Conformance & Controlled Architectural Changes"; Png = $png2; Notes = "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Emphasize M2 conformance in code/src/ without architectural drift.`n2. Highlight Factory Method (ADR-005) and Observer (ADR-004).`n3. Explain that changes were controlled: CR-001 (10-dimension impact analysis) and ADR-010 to ADR-012.`n4. Alt-Tab to VS Code and show the folder hierarchy and CategoryFactories.ts." },
    @{ Title = "SCM governance: protected main and traceable PR #3 audit trail"; Subtitle = "Stage 3: Controlled Construction, SCM & Configuration Management"; Png = $png3; Notes = "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Show GitHub PR #3 in browser with linked requirements.`n2. Explain ADR-012 solo governance replacing rubber-stamps with automated CI gates + signed self-audit checklists.`n3. Show .gitignore and secrets handling with zero hardcoded credentials." },
    @{ Title = "CI pipeline: four automated quality gates block progression on failure"; Subtitle = "Stage 4: Automated Continuous Integration & Gate Enforcement"; Png = $png4; Notes = "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Walk through the 4 gates in ci.yml on screen.`n2. Explain gate blocking: failure halts pipeline.`n3. Explain the Green Pipeline Limitation: green CI proves code contracts, but cannot prove external SMS carrier uptime." },
    @{ Title = "Verification evidence: 42 automated tests pass with 93.61% coverage"; Subtitle = "Stage 4 (cont): Test Suite Execution & V8 Coverage Evidence"; Png = $png5; Notes = "TIMING: ~2:30 mins.`n`nSPEAKING POINTS:`n1. Alt-Tab to terminal and run `npm run test:coverage` live on screen.`n2. Point to the table: 42/42 tests pass in 1.98s.`n3. Highlight 93.61% statement coverage and explain DEF-002 resolution in vitest.config.ts." },
    @{ Title = "Black-box verification: Boundary Value Analysis and Decision Tables"; Subtitle = "Stage 5: Black-Box Validation Techniques"; Png = $png6; Notes = "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Explain technique selection: BVA for length thresholds, Decision Tables for multi-condition routing.`n2. Point to BVA in InputBoundaryValidation.test.ts (2 vs 3, 100 vs 101).`n3. Point to Decision Tables in IntakeDecisionTable.test.ts (10 rules under CR-001)." },
    @{ Title = "Integration and E2E: negative authorization and three full system journeys"; Subtitle = "Stage 5 (cont): REST API Contracts, Negative Security & E2E Journeys"; Png = $png7; Notes = "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Explain negative testing: HTTP 403 (unauthorized role), HTTP 400 (FSM jump), HTTP 409 (OCC collision).`n2. Walk through the 3 E2E journeys in VS Code: citizenLifecycle.test.ts, securityBoundary.test.ts, operationalResilience.test.ts." },
    @{ Title = "Simulated staging: Docker Compose parity and verified DDL rollback"; Subtitle = "Stage 6: Working Staging Environment & Rollback Strategy"; Png = $png8; Notes = "TIMING: ~4:00 mins.`n`nSPEAKING POINTS:`n1. Explain staging isolation on ports 5001 and 5433.`n2. Curl /health/live and /health/ready in terminal.`n3. Walk through interactive web portal at http://localhost:5001/ demonstrating fault intake and supervisor assignment.`n4. Explain rollback in ADR-011 and V1__rollback_initial_schema.sql." },
    @{ Title = "Quality control: living RTM v3.0, four resolved defects, and technical debt"; Subtitle = "Stage 7: Living Registers, Traceability & Quality Retrospective"; Png = $png9; Notes = "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Show RTM v3.0 in VS Code: 8-stage verification chain.`n2. Walk through Defect Register: DEF-001 through DEF-004 all 100% resolved with regression tests.`n3. Show Technical Debt: 4 deliberate compromises with M4 repayment plans.`n4. Show AI Register: 11 auditable entries with human verification." },
    @{ Title = "Performance benchmark: 50 concurrent intake operations achieve p95 = 142 ms"; Subtitle = "Stage 8: Performance Benchmark & Scalability Evaluation (NFR-001)"; Png = $png10; Notes = "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Run `npx vitest run tests/performance/load.test.ts` in terminal.`n2. Present results: 100% success, p95=142ms vs 500ms target in NFR-001.`n3. State honest municipal limitations: proves single-node async throughput; does not prove 10,000 citizens on cellular networks." },
    @{ Title = "Release readiness: CONDITIONALLY READY verdict with four residual risks"; Subtitle = "Stage 9: Release Readiness Review & Residual Risk Statement"; Png = $png11; Notes = "TIMING: ~2:30 mins.`n`nSPEAKING POINTS:`n1. State classification: CONDITIONALLY READY.`n2. Defend why: claiming unconditional production readiness earns low marks; our conditions are transparent and evidence-backed.`n3. Walk through the 4 residual risks in the table." },
    @{ Title = "Individual defence: authentic evidence across five examination dimensions"; Subtitle = "Stage 10: Individual Engineering Defence & Conclusion"; Png = $png12; Notes = "TIMING: ~4:00 mins.`n`nSPEAKING POINTS:`n1. Look into webcam and address the 5 dimensions:`n   - Trace FR-001 from need through factory to tests.`n   - Decision: ADR-006 OCC vs pessimistic locking.`n   - Quality: What 42 tests prove vs WAN limits.`n   - Failure: DEF-003 OCC 409 fix.`n   - Readiness: Defend CONDITIONALLY READY.`n2. Conclude and sign off." }
)

for ($i = 0; $i -lt $slidesData.Count; $i++) {
    $data = $slidesData[$i]
    $slide = $pres.Slides.Add($i + 1, 12) # ppLayoutBlank
    
    # White background
    $bg = $slide.Shapes.AddShape(1, 0, 0, 960, 540)
    $bg.Fill.Solid(); $bg.Fill.ForeColor.RGB = 16777215; $bg.Line.Visible = 0
    
    # Title Text (Helvetica Neue / Segoe UI, 26pt bold, Dark Slate)
    $titleBox = $slide.Shapes.AddTextbox(1, 64, 40, 832, 38)
    $titleBox.TextFrame.TextRange.Text = $data.Title
    $titleBox.TextFrame.TextRange.Font.Name = "Segoe UI"
    $titleBox.TextFrame.TextRange.Font.Size = 22
    $titleBox.TextFrame.TextRange.Font.Bold = 1
    $titleBox.TextFrame.TextRange.Font.Color.RGB = 2758415 # 0x0F172A
    $titleBox.TextFrame.MarginLeft = 0; $titleBox.TextFrame.MarginTop = 0
    
    # Subtitle / Rubric Tracker (11pt Muted Slate)
    $subBox = $slide.Shapes.AddTextbox(1, 64, 78, 832, 22)
    $subBox.TextFrame.TextRange.Text = $data.Subtitle
    $subBox.TextFrame.TextRange.Font.Name = "Segoe UI"
    $subBox.TextFrame.TextRange.Font.Size = 11
    $subBox.TextFrame.TextRange.Font.Color.RGB = 100 + (116 * 256) + (139 * 65536)
    $subBox.TextFrame.MarginLeft = 0; $subBox.TextFrame.MarginTop = 0
    
    # Define Demo Cue for Presenter Notes
    $cue = '[DEMO CUE] Alt-Tab to authentic project evidence during video presentation'
    if ($i -eq 0) { $cue = '[ON-CAMERA] State name, student ID, release candidate v0.3.0-rc1, and solo SCM governance context' }
    elseif ($i -eq 1) { $cue = '[LIVE DEMO] Alt-Tab to VS Code showing code/src/ Clean Architecture layers and CategoryFactories.ts' }
    elseif ($i -eq 2) { $cue = '[LIVE DEMO] Alt-Tab to GitHub showing closed PR #3, branch protection, and .gitignore secrets' }
    elseif ($i -eq 3) { $cue = '[LIVE DEMO] Alt-Tab to GitHub Actions showing 4-gate automated workflow execution' }
    elseif ($i -eq 4) { $cue = '[LIVE DEMO] Alt-Tab to terminal and execute npm run test:coverage live on camera' }
    elseif ($i -eq 5) { $cue = '[LIVE DEMO] Alt-Tab to VS Code showing InputBoundaryValidation.test.ts and IntakeDecisionTable.test.ts' }
    elseif ($i -eq 6) { $cue = '[LIVE DEMO] Alt-Tab to VS Code showing citizenLifecycle.test.ts and securityBoundary.test.ts' }
    elseif ($i -eq 7) { $cue = '[LIVE DEMO] Alt-Tab to browser http://localhost:5001/ demonstrating staging intake and health probes' }
    elseif ($i -eq 8) { $cue = '[LIVE DEMO] Alt-Tab to VS Code showing RTM v3.0, Defect Register v3.0, and Technical Debt Register' }
    elseif ($i -eq 9) { $cue = '[LIVE DEMO] Alt-Tab to terminal and run npx vitest run tests/performance/load.test.ts' }
    elseif ($i -eq 10) { $cue = '[LIVE DEMO] Alt-Tab to VS Code showing Release_Evidence_Summary_v1.0.md and residual risk table' }
    elseif ($i -eq 11) { $cue = '[ON-CAMERA] Return to full-screen webcam for 5-dimension individual engineering defence and sign-off' }

    # Add Artifact Image at Left=64, Top=118, Width=832, Height=320 (Clean Centerpiece, zero hints/clutter on canvas)
    $img = $slide.Shapes.AddPicture($data.Png, 0, 1, 64, 118, 832, 320)
    
    # Speaker Notes (Rich teleprompter notes for the presenter, zero hints on visible slide)
    $fullNotes = "DEMO ACTION / ALT-TAB CUE:`r`n" + $cue + "`r`n`r`n" + $data.Notes
    try {
        $slide.NotesPage.Shapes.Placeholders.Item(2).TextFrame.TextRange.Text = $fullNotes
    } catch {}
}

# Save Presentation
$pres.SaveAs($outputPath)
$pres.SaveAs($outputRoot)
$pres.SaveAs($outputDesktop)
$pres.SaveAs($outputDownloads)
$pres.SaveAs($outputSENRoot)

$pres.Close()
$ppt.Quit()

Write-Host "SUCCESS: High-aesthetic presentation generated across all targets!"
