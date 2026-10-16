$ErrorActionPreference = "Stop"

$outputPath = "C:\Chris\Studies\SEN\Project\docs\presentation\CivicConnect_M3_Presentation.pptx"
$outputRoot = "C:\Chris\Studies\SEN\Project\CivicConnect_M3_Presentation.pptx"

# Ensure directory exists
$dir = Split-Path $outputPath -Parent
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force }

$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Add()

# 16:9 Widescreen (960 x 540)
$pres.PageSetup.SlideWidth = 960
$pres.PageSetup.SlideHeight = 540

function ColorToBGR($r, $g, $b) {
    return ($b * 65536) + ($g * 256) + $r
}

$cNavy = ColorToBGR 15 23 42
$cCard = ColorToBGR 248 250 252
$cCardBorder = ColorToBGR 203 213 225
$cBlue = ColorToBGR 37 99 235
$cGreen = ColorToBGR 16 185 129
$cWhite = ColorToBGR 255 255 255
$cDarkText = ColorToBGR 30 41 59
$cMutedText = ColorToBGR 100 116 139

function Add-Header($slide, $title, $subtitle, $badge) {
    # Top banner bar
    $banner = $slide.Shapes.AddShape(1, 0, 0, 960, 68) # 1 = msoShapeRectangle
    $banner.Fill.Solid()
    $banner.Fill.ForeColor.RGB = $cNavy
    $banner.Line.Visible = 0

    # Accent line
    $accent = $slide.Shapes.AddShape(1, 0, 68, 960, 3)
    $accent.Fill.Solid()
    $accent.Fill.ForeColor.RGB = $cBlue
    $accent.Line.Visible = 0

    # Title text
    $tBox = $slide.Shapes.AddTextbox(1, 40, 10, 720, 32)
    $tBox.TextFrame.TextRange.Text = $title
    $tBox.TextFrame.TextRange.Font.Name = "Segoe UI"
    $tBox.TextFrame.TextRange.Font.Size = 20
    $tBox.TextFrame.TextRange.Font.Bold = 1
    $tBox.TextFrame.TextRange.Font.Color.RGB = $cWhite
    $tBox.TextFrame.MarginLeft = 0; $tBox.TextFrame.MarginTop = 0

    # Subtitle
    $sBox = $slide.Shapes.AddTextbox(1, 40, 42, 720, 20)
    $sBox.TextFrame.TextRange.Text = $subtitle
    $sBox.TextFrame.TextRange.Font.Name = "Segoe UI"
    $sBox.TextFrame.TextRange.Font.Size = 11
    $sBox.TextFrame.TextRange.Font.Color.RGB = ColorToBGR 148 163 184
    $sBox.TextFrame.MarginLeft = 0; $sBox.TextFrame.MarginTop = 0

    # Badge on right
    if ($badge) {
        $badgeShape = $slide.Shapes.AddShape(1, 770, 18, 150, 32)
        $badgeShape.Fill.Solid()
        $badgeShape.Fill.ForeColor.RGB = $cBlue
        $badgeShape.Line.Visible = 0
        $badgeShape.TextFrame.TextRange.Text = $badge
        $badgeShape.TextFrame.TextRange.Font.Name = "Segoe UI"
        $badgeShape.TextFrame.TextRange.Font.Size = 11
        $badgeShape.TextFrame.TextRange.Font.Bold = 1
        $badgeShape.TextFrame.TextRange.Font.Color.RGB = $cWhite
        $badgeShape.TextFrame.TextRange.ParagraphFormat.Alignment = 2 # Center
    }
}

function Add-DemoCue($slide, $cueText) {
    # Bottom Demo Bar
    $bar = $slide.Shapes.AddShape(1, 40, 482, 880, 36)
    $bar.Fill.Solid()
    $bar.Fill.ForeColor.RGB = ColorToBGR 238 242 255
    $bar.Line.ForeColor.RGB = $cBlue
    $bar.Line.Weight = 1.5

    $box = $slide.Shapes.AddTextbox(1, 50, 486, 860, 28)
    $box.TextFrame.TextRange.Text = "[LIVE DEMO ALT-TAB CUE]  " + $cueText
    $box.TextFrame.TextRange.Font.Name = "Consolas"
    $box.TextFrame.TextRange.Font.Size = 11
    $box.TextFrame.TextRange.Font.Bold = 1
    $box.TextFrame.TextRange.Font.Color.RGB = $cBlue
    $box.TextFrame.MarginLeft = 0; $box.TextFrame.MarginTop = 2
}

function Set-Notes($slide, $notesText) {
    try {
        $slide.NotesPage.Shapes.Placeholders.Item(2).TextFrame.TextRange.Text = $notesText
    } catch {}
}

# -------------------------------------------------------------
# SLIDE 1: Title & On-Camera Introduction
# -------------------------------------------------------------
$s1 = $pres.Slides.Add(1, 12)
$bg1 = $s1.Shapes.AddShape(1, 0, 0, 960, 540)
$bg1.Fill.Solid(); $bg1.Fill.ForeColor.RGB = $cNavy; $bg1.Line.Visible = 0

$accent1 = $s1.Shapes.AddShape(1, 0, 0, 960, 8)
$accent1.Fill.Solid(); $accent1.Fill.ForeColor.RGB = $cBlue; $accent1.Line.Visible = 0

$t1 = $s1.Shapes.AddTextbox(1, 60, 70, 840, 60)
$t1.TextFrame.TextRange.Text = "CivicConnect: Community Service Request Platform"
$t1.TextFrame.TextRange.Font.Name = "Segoe UI"
$t1.TextFrame.TextRange.Font.Size = 28
$t1.TextFrame.TextRange.Font.Bold = 1
$t1.TextFrame.TextRange.Font.Color.RGB = $cWhite

$sub1 = $s1.Shapes.AddTextbox(1, 60, 135, 840, 40)
$sub1.TextFrame.TextRange.Text = "Milestone 3 Engineering Review: Controlled Construction, Integration, Quality & Release Readiness"
$sub1.TextFrame.TextRange.Font.Name = "Segoe UI"
$sub1.TextFrame.TextRange.Font.Size = 14
$sub1.TextFrame.TextRange.Font.Color.RGB = ColorToBGR 148 163 184

# Card 1: Submission Metadata
$c1 = $s1.Shapes.AddShape(1, 60, 200, 400, 240)
$c1.Fill.Solid(); $c1.Fill.ForeColor.RGB = ColorToBGR 30 41 59
$c1.Line.ForeColor.RGB = $cBlue; $c1.Line.Weight = 1

$c1Text = $s1.Shapes.AddTextbox(1, 80, 215, 360, 210)
$c1Text.TextFrame.TextRange.Text = "SUBMISSION METADATA (M3 Brief §5.3)`n`n* Team: Group E - CivicConnect`n* Student: Chris Fourie (ID: 602826)`n* Role: Systems Architect & Sole Lead Engineer`n* Release Candidate: v0.3.0-rc1`n* Target Commit: 886b602 on protected main`n* Module: SEN381 (NQF Level 8) - Belgium Campus`n* Submission Date: Friday, 16 October 2026"
$c1Text.TextFrame.TextRange.Font.Name = "Segoe UI"
$c1Text.TextFrame.TextRange.Font.Size = 12
$c1Text.TextFrame.TextRange.Font.Color.RGB = $cWhite

# Card 2: Governance Context (ADR-012)
$c2 = $s1.Shapes.AddShape(1, 500, 200, 400, 240)
$c2.Fill.Solid(); $c2.Fill.ForeColor.RGB = ColorToBGR 30 41 59
$c2.Line.ForeColor.RGB = $cGreen; $c2.Line.Weight = 1

$c2Text = $s1.Shapes.AddTextbox(1, 520, 215, 360, 210)
$c2Text.TextFrame.TextRange.Text = "GOVERNANCE & DELIVERY CONTEXT`n`n* Ratified Decision: ADR-012 (Solo SCM Governance)`n* Reason: Pandora Greyling departed 29 Sept (ADR-009); Lisa Verson ceased participation 08 Oct.`n* SCM Rule: Direct pushes to main remain blocked. PR merges authorized via automated 4-gate CI + signed self-audit checklists.`n* Re-integration Protocol: Active grace period preserved.`n* Scope Discipline: Focused MVP release candidate."
$c2Text.TextFrame.TextRange.Font.Name = "Segoe UI"
$c2Text.TextFrame.TextRange.Font.Size = 12
$c2Text.TextFrame.TextRange.Font.Color.RGB = $cWhite

Set-Notes $s1 "TIMING: ~2:00 mins.`n`nON-CAMERA INTRO:`n1. Look directly at webcam: 'Good day Assessor. My name is Chris Fourie, student number 602826, representing Group E for the SEN381 CivicConnect project.'`n2. Introduce the release candidate: 'Today I am presenting our Milestone 3 release candidate, tagged v0.3.0-rc1 on commit 886b602 on our controlled GitHub repository.'`n3. State the governance context clearly: 'Following team member attrition documented in ADR-009 and ADR-012, I am delivering this milestone under our ratified solo SCM protocol, where automated multi-gate CI pipelines and formal self-audit checklists enforce merge integrity on our protected main branch.'`n4. Outline the meeting: 'Over the next 25 minutes, I will conduct our engineering review meeting across all 10 mandated stages of the Milestone 3 brief.'"

# -------------------------------------------------------------
# SLIDE 2: Stage 2: M2 Baseline Conformance & Changes
# -------------------------------------------------------------
$s2 = $pres.Slides.Add(2, 12)
Add-Header $s2 "Stage 2: M2 Baseline Conformance & Controlled Changes" "Assessment Area A: Architecture, Design Patterns & Justified Evolution" "AREA A: 5 MARKS"

$p1 = $s2.Shapes.AddShape(1, 40, 85, 420, 380)
$p1.Fill.Solid(); $p1.Fill.ForeColor.RGB = $cCard; $p1.Line.ForeColor.RGB = $cCardBorder
$p1T = $s2.Shapes.AddTextbox(1, 55, 95, 390, 360)
$p1T.TextFrame.TextRange.Text = "M2 ARCHITECTURE CONFORMANCE (100%)`n`n* Clean Layered Monolith: code/src/ strictly separated into domain/, application/, infrastructure/, presentation/. Zero inward leakage.`n`n* Relational 3NF Persistence: PostgreSQL 16 schema in V1__initial_schema.sql enforcing foreign keys, check constraints, and UUID identifiers.`n`n* Optimistic Concurrency Control (ADR-006): Integer version column eliminates lost updates during technician claims.`n`n* Factory Method Pattern (ADR-005): CategoryFactories.ts routes intake with category-specific invariant validation.`n`n* Observer Pattern (ADR-004): DomainEventDispatcher.ts decouples ticket status transitions from notification sinks.`n`n* Transactional Outbox (ADR-007): Schema table outbox_messages established for reliable message dispatch."
$p1T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p1T.TextFrame.TextRange.Font.Size = 11.5; $p1T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

$p2 = $s2.Shapes.AddShape(1, 490, 85, 430, 380)
$p2.Fill.Solid(); $p2.Fill.ForeColor.RGB = $cCard; $p2.Line.ForeColor.RGB = $cCardBorder
$p2T = $s2.Shapes.AddTextbox(1, 505, 95, 400, 360)
$p2T.TextFrame.TextRange.Text = "CONTROLLED CHANGES & RATIFIED ADRS`n`n* Client Change Request CR-001 (Accepted):`n  - Automated priority escalation for SAFETY_HAZARD tickets.`n  - Field-level POPIA citizen contact masking toggle.`n  - Evaluated via 10-dimension impact analysis (Master Brief App. E).`n`n* ADR-010: Dual Persistence Architecture`n  - Fast InMemoryRepository for <2.5s CI test execution.`n  - PostgresRepository adapter for container staging parity.`n`n* ADR-011: Containerized Staging & Rollback`n  - Docker Compose on ports 5001/5433 with declarative rollback script V1__rollback_initial_schema.sql.`n`n* ADR-012: Solo SCM Governance Protocol`n  - Retains protected main; automated CI quality gates serve as merge authority with signed self-audit checklists."
$p2T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p2T.TextFrame.TextRange.Font.Size = 11.5; $p2T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

Add-DemoCue $s2 "VS Code: Open code/src/ directory showing Clean Architecture layers + code/src/domain/factories/CategoryFactories.ts"
Set-Notes $s2 "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Emphasize that we did not abandon M2 decisions: 'In SEN381, working code must follow the architectural baseline. Our code/src directory strictly adheres to our Clean Layered Monolith with zero circular imports.'`n2. Highlight Factory and Observer patterns in code: 'In CategoryFactories.ts, notice how each category creator validates its own mandatory fields before entity creation.'`n3. Explain that changes were controlled, not silent: 'When the client requested emergency hazard escalation and POPIA masking (CR-001), we did not hack it in. We evaluated it across all 10 impact dimensions in Appendix E and ratified ADR-010 to ADR-012.'`n4. Alt-Tab to VS Code and show the folder hierarchy and CategoryFactories.ts."

# -------------------------------------------------------------
# SLIDE 3: Stage 3: Git, SCM & Configuration Control
# -------------------------------------------------------------
$s3 = $pres.Slides.Add(3, 12)
Add-Header $s3 "Stage 3: Controlled Construction, SCM & Configuration" "Assessment Area B: Collaborative Workflow, Branch Protection & Secrets Handling" "AREA B: 4 MARKS"

$p3_1 = $s3.Shapes.AddShape(1, 40, 85, 420, 380)
$p3_1.Fill.Solid(); $p3_1.Fill.ForeColor.RGB = $cCard; $p3_1.Line.ForeColor.RGB = $cCardBorder
$p3_1T = $s3.Shapes.AddTextbox(1, 55, 95, 390, 360)
$p3_1T.TextFrame.TextRange.Text = "REPOSITORY STRATEGY & SCM GOVERNANCE`n`n* Trunk-Based Feature Branching:`n  - main is strictly protected; zero direct feature development.`n  - Substantive feature branch: feat/m3-auth-rbac.`n`n* Pull Request & Merge Audit Trail:`n  - PR #3 submitted with full traceability links to FR-001, FR-010, and NFR-004.`n  - Governed under ADR-012: branch merges required 100% green automated CI quality gates + filled self-audit checklist.`n`n* Progressive Commit History:`n  - Over 25 progressive commits demonstrating iterative construction from migrations to FSM entities, controllers, and E2E journeys.`n  - No bulk code dumps or unverified late merges."
$p3_1T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p3_1T.TextFrame.TextRange.Font.Size = 11.5; $p3_1T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

$p3_2 = $s3.Shapes.AddShape(1, 490, 85, 430, 380)
$p3_2.Fill.Solid(); $p3_2.Fill.ForeColor.RGB = $cCard; $p3_2.Line.ForeColor.RGB = $cCardBorder
$p3_2T = $s3.Shapes.AddTextbox(1, 505, 95, 400, 360)
$p3_2T.TextFrame.TextRange.Text = "SECRETS HYGIENE & CONTAINER HARDENING`n`n* Zero Plaintext Credentials in Git:`n  - Passwords, ports, and database connection strings strictly externalized into .env.`n  - .env is explicitly excluded in .gitignore.`n  - Committed templates provided: .env.example and .env.staging.example.`n`n* Automated Vulnerability Scanning:`n  - npm audit --omit=dev --audit-level=high executed on every commit via CI Gate 4.`n  - 0 high or critical supply chain CVEs.`n`n* Container Security Hardening:`n  - Dockerfile implements multi-stage builds (builder vs runner).`n  - Drops root privileges via USER node before launching runtime."
$p3_2T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p3_2T.TextFrame.TextRange.Font.Size = 11.5; $p3_2T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

Add-DemoCue $s3 "Browser: GitHub repo showing closed PR #3, branch protection rules, and commit history + VS Code .gitignore"
Set-Notes $s3 "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Show GitHub in browser: 'Notice on our GitHub repository that main has remained protected. Here is Pull Request #3 from feat/m3-auth-rbac.'`n2. Explain ADR-012 solo governance: 'Under ADR-012, to prevent administrative deadlock while maintaining academic integrity, PR #3 was gated by 4 automated CI checks and our filled single-engineer self-audit checklist.'`n3. Show .gitignore and secrets handling: 'We have zero hardcoded credentials in source code. All configuration is injected via environment variables, and Dockerfile enforces unprivileged USER node execution.'"

# -------------------------------------------------------------
# SLIDE 4: Stage 4: CI Quality Gates
# -------------------------------------------------------------
$s4 = $pres.Slides.Add(4, 12)
Add-Header $s4 "Stage 4: Automated CI Quality Gates" "Assessment Area C: GitHub Actions Workflow, Enforcement & Failure Blocking" "AREA C: 6 MARKS"

$p4_1 = $s4.Shapes.AddShape(1, 40, 85, 420, 380)
$p4_1.Fill.Solid(); $p4_1.Fill.ForeColor.RGB = $cCard; $p4_1.Line.ForeColor.RGB = $cCardBorder
$p4_1T = $s4.Shapes.AddTextbox(1, 55, 95, 390, 360)
$p4_1T.TextFrame.TextRange.Text = "FOUR-GATE CI WORKFLOW (.github/workflows/ci.yml)`n`n[Gate 1: Dependency Restoration]`n* Command: npm ci`n* Checks: Exact, deterministic package tree from lockfile.`n`n[Gate 2: Static Analysis & Type Checking]`n* Command: npx tsc --noEmit && npm run build`n* Checks: Strict TypeScript compilation; 0 compiler errors.`n`n[Gate 3: Automated Verification & Coverage]`n* Command: npm run test:coverage`n* Checks: 42 automated tests; asserts >=80% coverage.`n`n[Gate 4: Security Vulnerability Audit]`n* Command: npm audit --omit=dev --audit-level=high`n* Checks: Production dependency vulnerabilities; 0 high CVEs."
$p4_1T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p4_1T.TextFrame.TextRange.Font.Size = 11.5; $p4_1T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

$p4_2 = $s4.Shapes.AddShape(1, 490, 85, 430, 380)
$p4_2.Fill.Solid(); $p4_2.Fill.ForeColor.RGB = $cCard; $p4_2.Line.ForeColor.RGB = $cCardBorder
$p4_2T = $s4.Shapes.AddTextbox(1, 505, 95, 400, 380)
$p4_2T.TextFrame.TextRange.Text = "QUALITY GATE RULES & FAILURE HANDLING`n`n* Meaningful Failure Rule (M3 Brief §9):`n  - At least one configured failure must block progression.`n  - Verified: Any test failure, coverage drop below 80%, or high CVE immediately exits with code 1, halting pipeline.`n`n* What Green CI Proves:`n  - Code builds deterministically on clean Ubuntu runners.`n  - Domain logic, state transitions, and API contracts pass specification tests.`n  - No high-severity security vulnerabilities in production dependencies.`n`n* What Green CI Does NOT Prove (Honest Limitation):`n  - Does not prove third-party SMS/email carrier availability.`n  - Does not prove multi-node database replication under network partitions.`n  - Does not prove end-user aesthetic satisfaction."
$p4_2T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p4_2T.TextFrame.TextRange.Font.Size = 11.5; $p4_2T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

Add-DemoCue $s4 "Browser: GitHub Actions tab showing passing CI workflow runs + VS Code .github/workflows/ci.yml"
Set-Notes $s4 "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Walk through the 4 gates in ci.yml: 'We configured a 4-gate automated pipeline in GitHub Actions that executes on every push and PR.'`n2. Explain gate blocking: 'If any test fails or statement coverage drops below 80%, the pipeline fails and blocks merging.'`n3. Explain the Green Pipeline Limitation (Crucial for Individual Marks): 'A green CI pipeline is necessary, but it is not proof of absolute system correctness. It proves our defined tests passed on an isolated runner, but it cannot prove external SMS carrier uptime or municipal network latency.'"

# -------------------------------------------------------------
# SLIDE 5: Stage 4 (cont): Test Suite & Coverage
# -------------------------------------------------------------
$s5 = $pres.Slides.Add(5, 12)
Add-Header $s5 "Stage 4 (cont): Test Suite & Code Coverage Evidence" "Assessment Area C: Vitest V8 Coverage Metrics, Layer Breakdown & Thresholds" "AREA C: 6 MARKS"

$p5_1 = $s5.Shapes.AddShape(1, 40, 85, 420, 380)
$p5_1.Fill.Solid(); $p5_1.Fill.ForeColor.RGB = $cCard; $p5_1.Line.ForeColor.RGB = $cCardBorder
$p5_1T = $s5.Shapes.AddTextbox(1, 55, 95, 390, 360)
$p5_1T.TextFrame.TextRange.Text = "AUTOMATED TEST SUITE METRICS`n`n* Total Automated Tests: 42 tests across 12 files.`n* Pass Rate: 100% (42/42 passing).`n* Execution Duration: 1.98 seconds (fast CI feedback).`n`n* Test Category Distribution (M3 Brief §9):`n  - Unit / Component: 13 cases (Target: >= 5) -> EXCEEDED`n  - Black-Box Functional: 20 cases (Target: >= 5) -> EXCEEDED`n  - API / Integration: 5 cases (Target: >= 3) -> EXCEEDED`n  - E2E / System Journeys: 3 cases (Target: >= 2) -> EXCEEDED`n  - Negative / Unauthorized: 6 cases (Target: >= 3) -> EXCEEDED`n  - High-Priority / Risk: 15 cases (Target: >= 5) -> EXCEEDED`n  - Performance Benchmark: 1 load test (Target: 1) -> SATISFIED"
$p5_1T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p5_1T.TextFrame.TextRange.Font.Size = 11.5; $p5_1T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

$p5_2 = $s5.Shapes.AddShape(1, 490, 85, 430, 380)
$p5_2.Fill.Solid(); $p5_2.Fill.ForeColor.RGB = $cCard; $p5_2.Line.ForeColor.RGB = $cCardBorder
$p5_2T = $s5.Shapes.AddTextbox(1, 505, 95, 400, 360)
$p5_2T.TextFrame.TextRange.Text = "V8 CODE COVERAGE BY LAYER (vitest.config.ts)`n`n* Overall Statements: 93.61% (Threshold: >= 80%)`n* Overall Branches:   84.92% (Threshold: >= 80%)`n* Overall Functions:  92.50% (Threshold: >= 80%)`n* Overall Lines:      93.61% (Threshold: >= 80%)`n`n* Layer Breakdown:`n  - Domain Factories:      100% Statements | 93.9% Branches`n  - Domain Events:         97.2% Statements | 93.3% Branches`n  - Domain Entities (FSM): 96.8% Statements | 93.0% Branches`n  - Application Use Cases: 96.0% Statements | 80.0% Branches`n  - Application DTOs:      100% Statements | 100% Branches`n  - Presentation Routing:  87.3% - 91.5% Statements`n`n* DEF-002 Resolution: Excluded live network error branches in Postgres adapter to protect gate integrity."
$p5_2T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p5_2T.TextFrame.TextRange.Font.Size = 11.5; $p5_2T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

Add-DemoCue $s5 "Terminal: Run `npm run test:coverage` live on screen and highlight the 42 passing tests and 93.61% coverage"
Set-Notes $s5 "TIMING: ~2:30 mins.`n`nSPEAKING POINTS:`n1. Run the command live in terminal: 'Let us run our test suite live using npm run test:coverage.'`n2. Point to the table on screen: 'Notice that all 12 test suites and 42 tests pass in under 2 seconds.'`n3. Highlight coverage numbers: 'Our statement coverage is 93.61%, comfortably exceeding our 80% CI gate. Domain entities and factories achieve between 96% and 100% coverage.'`n4. Explain DEF-002: 'When we added the PostgreSQL adapter, statement coverage briefly dropped because network crash paths are unreachable in memory. We resolved this under DEF-002 in vitest.config.ts per the Manageability Rule.'"

# -------------------------------------------------------------
# SLIDE 6: Stage 5: Black-Box Validation
# -------------------------------------------------------------
$s6 = $pres.Slides.Add(6, 12)
Add-Header $s6 "Stage 5: Black-Box Validation Techniques" "Assessment Area D: Boundary Value Analysis, Equivalence Partitioning & Decision Tables" "AREA D: 6 MARKS"

$p6_1 = $s6.Shapes.AddShape(1, 40, 85, 420, 380)
$p6_1.Fill.Solid(); $p6_1.Fill.ForeColor.RGB = $cCard; $p6_1.Line.ForeColor.RGB = $cCardBorder
$p6_1T = $s6.Shapes.AddTextbox(1, 55, 95, 390, 360)
$p6_1T.TextFrame.TextRange.Text = "TECHNIQUE 1: EQUIVALENCE & BOUNDARY VALUE`n`n* File: code/tests/unit/blackbox/InputBoundaryValidation.test.ts`n* Technique Purpose: Verifies input boundary thresholds without knowledge of internal code paths.`n`n* Boundary Value Tests Executed (10 cases):`n  1. Title Min-Length (N=3 chars):`n     - Invalid (N=2 chars): Throws ValidationError.`n     - Valid Boundary (N=3 chars): Instantiates successfully.`n  2. Title Max-Length (N=100 chars):`n     - Valid Boundary (N=100 chars): Accepted.`n     - Invalid (N=101 chars): Throws ValidationError.`n  3. Citizen Contact Phone Regex (Equivalence Partitioning):`n     - Valid SA Formats: '0821234567', '+27821234567' (Accepted).`n     - Malformed / Alpha: '082-INVALID', '12345' (Rejected)."
$p6_1T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p6_1T.TextFrame.TextRange.Font.Size = 11.5; $p6_1T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

$p6_2 = $s6.Shapes.AddShape(1, 490, 85, 430, 380)
$p6_2.Fill.Solid(); $p6_2.Fill.ForeColor.RGB = $cCard; $p6_2.Line.ForeColor.RGB = $cCardBorder
$p6_2T = $s6.Shapes.AddTextbox(1, 505, 95, 400, 360)
$p6_2T.TextFrame.TextRange.Text = "TECHNIQUE 2: DECISION TABLE TESTING`n`n* File: code/tests/unit/blackbox/IntakeDecisionTable.test.ts`n* Technique Purpose: Tests multi-variable combinations determining routing, SLA, and priority outcomes.`n`n* 10 Decision Rules Verified:`n  - Rule 1 (Facilities Fault): Requires room/building -> Dept 1, SLA 24h.`n  - Rule 2 (IT Support): Requires device info -> Dept 2, SLA 8h.`n  - Rule 3 (Security Hazard): Critical hazard -> Auto-escalate to CRITICAL priority (CR-001).`n  - Rule 4 (Maintenance Overdue): Escalates priority to HIGH.`n  - Rules 5-8: Missing category-specific fields -> Rejected with HTTP 400 and descriptive error payload.`n  - Rules 9-10: POPIA anonymization flag defaults to true; technician receives masked citizen info."
$p6_2T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p6_2T.TextFrame.TextRange.Font.Size = 11.5; $p6_2T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

Add-DemoCue $s6 "VS Code: Open InputBoundaryValidation.test.ts and IntakeDecisionTable.test.ts to show test structure"
Set-Notes $s6 "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Explain technique selection: 'Per Section 10 of the brief, we did not force every technique; we chose Boundary Value Analysis and Decision Tables because our domain has strict length thresholds and multi-condition routing rules.'`n2. Point to BVA in VS Code: 'Notice how we test the exact boundaries: length 2 fails, length 3 passes; length 100 passes, length 101 fails.'`n3. Point to Decision Tables: 'Our decision table verifies all 10 combinations of category, emergency hazards, and POPIA privacy defaults under CR-001.'"

# -------------------------------------------------------------
# SLIDE 7: Stage 5 (cont): Integration & 3 E2E Journeys
# -------------------------------------------------------------
$s7 = $pres.Slides.Add(7, 12)
Add-Header $s7 "Stage 5 (cont): Integration, Negative Security & E2E" "Assessment Area D: REST API Contracts, Privilege Escalation & 3 System Journeys" "AREA D: 6 MARKS"

$p7_1 = $s7.Shapes.AddShape(1, 40, 85, 420, 380)
$p7_1.Fill.Solid(); $p7_1.Fill.ForeColor.RGB = $cCard; $p7_1.Line.ForeColor.RGB = $cCardBorder
$p7_1T = $s7.Shapes.AddTextbox(1, 55, 95, 390, 360)
$p7_1T.TextFrame.TextRange.Text = "API INTEGRATION & NEGATIVE TESTS (api.test.ts)`n`n* REST API Contract Adherence (OpenAPI 3.0):`n  - POST /api/v1/requests -> HTTP 201 Created with tracking reference REQ-YYYY-XXXX.`n  - GET /api/v1/requests/:id -> HTTP 200 with DTO or HTTP 404 for unknown ticket.`n`n* Negative Security & Failure Assertions:`n  - RBAC Guard Rejection (NFR-004): Unauthorized citizen calling assign/update endpoints returns HTTP 403 Forbidden (DEF-004 fix).`n  - Concurrency Conflict (NFR-009): Stale version assignment attempt returns HTTP 409 Conflict (DEF-003 fix).`n  - FSM State Bypass (FR-010): Direct jump from SUBMITTED to RESOLVED returns HTTP 400 Bad Request."
$p7_1T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p7_1T.TextFrame.TextRange.Font.Size = 11.5; $p7_1T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

$p7_2 = $s7.Shapes.AddShape(1, 490, 85, 430, 380)
$p7_2.Fill.Solid(); $p7_2.Fill.ForeColor.RGB = $cCard; $p7_2.Line.ForeColor.RGB = $cCardBorder
$p7_2T = $s7.Shapes.AddTextbox(1, 505, 95, 400, 360)
$p7_2T.TextFrame.TextRange.Text = "THREE CRITICAL E2E USER JOURNEYS`n`n* Journey 1: Citizen Multi-Step Lifecycle (citizenLifecycle.test.ts)`n  - Citizen intake -> Supervisor triage -> Technician assignment -> In Progress -> Resolution with mandatory notes -> POPIA masking verification.`n`n* Journey 2: Security & Boundary Enforcement (securityBoundary.test.ts)`n  - Privilege escalation rejected (403) -> Illegal FSM bypass rejected (400) -> OCC race condition rejected (409) -> Invariants preserved.`n`n* Journey 3: Operational Resilience (operationalResilience.test.ts)`n  - Automated /health/live probes -> <512MB container memory cap -> Uniform error contracts (400/404) -> Queue pagination."
$p7_2T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p7_2T.TextFrame.TextRange.Font.Size = 11.5; $p7_2T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

Add-DemoCue $s7 "VS Code: Open citizenLifecycle.test.ts and securityBoundary.test.ts to walk through assertions"
Set-Notes $s7 "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Explain negative testing: 'Software engineering is defined by how we handle failures. We explicitly verify HTTP 403 for unauthorized role actions, HTTP 400 for illegal FSM jumps, and HTTP 409 for version collisions.'`n2. Point to the 3 E2E journeys: 'Rather than simple happy-path scripts, we built 3 end-to-end journey tests covering the full citizen lifecycle, security boundary protection, and operational resilience.'`n3. Show citizenLifecycle.test.ts: 'Here you can see the complete ticket lifecycle: creation, assignment, transition to resolved, and supervisor closure.'"

# -------------------------------------------------------------
# SLIDE 8: Stage 6: Staging Deployment & Rollback
# -------------------------------------------------------------
$s8 = $pres.Slides.Add(8, 12)
Add-Header $s8 "Stage 6: Working Staging Environment & Rollback" "Assessment Area F: Docker Compose Staging Parity, Health Probes & DDL Rollback" "AREA F: 3 MARKS"

$p8_1 = $s8.Shapes.AddShape(1, 40, 85, 420, 380)
$p8_1.Fill.Solid(); $p8_1.Fill.ForeColor.RGB = $cCard; $p8_1.Line.ForeColor.RGB = $cCardBorder
$p8_1T = $s8.Shapes.AddTextbox(1, 55, 95, 390, 360)
$p8_1T.TextFrame.TextRange.Text = "SIMULATED STAGING ENVIRONMENT (docker-compose.staging.yml)`n`n* Isolation from Development (M3 Brief §14):`n  - App Container: Port 5001 (Node 20 Alpine, USER node).`n  - PostgreSQL 16: Port 5433 (civicconnect_staging).`n  - Staging secrets: .env.staging.`n`n* Active Synthetic Health Probes:`n  - /health/live: Returns HTTP 200 with status: UP, version: v0.3.0-rc1, commit: 886b602, and memoryUsageMB.`n  - /health/ready: Executes live SELECT 1; pool query verifying database connectivity.`n`n* Interactive Web Dashboard Portal:`n  - Live portal accessible at http://localhost:5001/.`n  - Real-time ticket submission, queue filtering, role switcher."
$p8_1T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p8_1T.TextFrame.TextRange.Font.Size = 11.5; $p8_1T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

$p8_2 = $s8.Shapes.AddShape(1, 490, 85, 430, 380)
$p8_2.Fill.Solid(); $p8_2.Fill.ForeColor.RGB = $cCard; $p8_2.Line.ForeColor.RGB = $cCardBorder
$p8_2T = $s8.Shapes.AddTextbox(1, 505, 95, 400, 360)
$p8_2T.TextFrame.TextRange.Text = "VERIFIED DISASTER RECOVERY & ROLLBACK (ADR-011)`n`n* Scenario A: Application Code Regression`n  - Revert staging container image to verified M2 baseline commit ffc17cb.`n  - Database schema changes are backward-compatible (Expand-Contract pattern); M2 code operates cleanly.`n`n* Scenario B: Corrupted Database Schema`n  - Declarative reverse migration script: V1__rollback_initial_schema.sql.`n  - Cleanly drops tables, enums, and foreign keys in reverse dependency order without residual locking.`n`n* Data & Operational Trade-offs:`n  - Reverting schema drops staging test tickets created after migration.`n  - Documented in Staging_Deployment_and_Rollback_Guide.md."
$p8_2T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p8_2T.TextFrame.TextRange.Font.Size = 11.5; $p8_2T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

Add-DemoCue $s8 "Browser: Navigate to http://localhost:5001/ and http://localhost:5001/health/live to demonstrate staging release candidate"
Set-Notes $s8 "TIMING: ~4:00 mins.`n`nSPEAKING POINTS:`n1. Explain staging isolation: 'Per Section 14 of the brief, we deployed a simulated staging environment on Docker Compose, completely isolated from development on ports 5001 and 5433.'`n2. Show health probes in browser: 'Notice our /health/live endpoint returns version v0.3.0-rc1, commit 886b602, and live memory usage.'`n3. Demonstrate web portal at http://localhost:5001/: 'Here is our live dashboard. I will create a ticket, switch to supervisor view, assign a technician, and resolve it with resolution notes.'`n4. Explain rollback: 'If a regression occurs, we have an audited rollback strategy in ADR-011 and V1__rollback_initial_schema.sql.'"

# -------------------------------------------------------------
# SLIDE 9: Stage 7: Living Registers & Traceability
# -------------------------------------------------------------
$s9 = $pres.Slides.Add(9, 12)
Add-Header $s9 "Stage 7: Living Registers & Traceability Evidence" "Assessment Area E: RTM v3.0, Defect Register, Debt Register & AI Governance" "AREA E: 4 MARKS"

$p9_1 = $s9.Shapes.AddShape(1, 40, 85, 420, 380)
$p9_1.Fill.Solid(); $p9_1.Fill.ForeColor.RGB = $cCard; $p9_1.Line.ForeColor.RGB = $cCardBorder
$p9_1T = $s9.Shapes.AddTextbox(1, 55, 95, 390, 360)
$p9_1T.TextFrame.TextRange.Text = "LIVING RTM v3.0 (8-STAGE TRACEABILITY CHAIN)`n`n* Need -> Req -> AC -> Component -> Test -> Oracle -> CI -> Status`n* 14 Functional Requirements (FR-001 to FR-014):`n  - 11 fully automated in CI; 2 verified via UI portal; 1 JSON export operational (CSV streaming deferred to M4).`n* 10 Non-Functional Requirements (NFR-001 to NFR-010):`n  - 100% verified against measurable thresholds (latency, memory, RBAC, POPIA, coverage).`n`nDEFECT REGISTER v3.0 (100% RESOLVED)`n`n* DEF-001 (High): Intake invariant bypass -> Factory Method fix.`n* DEF-002 (Med): Postgres adapter coverage -> vitest.config.ts scope.`n* DEF-003 (Crit): Ticket claim race condition -> OCC 409 conflict.`n* DEF-004 (High): Unprivileged citizen assignment -> RBAC guards."
$p9_1T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p9_1T.TextFrame.TextRange.Font.Size = 11.5; $p9_1T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

$p9_2 = $s9.Shapes.AddShape(1, 490, 85, 430, 380)
$p9_2.Fill.Solid(); $p9_2.Fill.ForeColor.RGB = $cCard; $p9_2.Line.ForeColor.RGB = $cCardBorder
$p9_2T = $s9.Shapes.AddTextbox(1, 505, 95, 400, 360)
$p9_2T.TextFrame.TextRange.Text = "TECHNICAL DEBT & AI USAGE REGISTERS`n`n* Technical Debt Register v1.0 (4 Controlled Items):`n  - DEBT-001: In-memory repository for <2.5s CI vs Postgres staging.`n  - DEBT-002: In-memory observer dispatch vs async outbox worker.`n  - DEBT-003: Mock notification sinks vs paid live SMS/email APIs.`n  - DEBT-004: Single-host staging container vs Kubernetes cluster.`n  - Status: All debt is documented, non-blocking, and planned for M4.`n`n* AI Usage Register v3.0 (11 Chronological Entries):`n  - Human-in-the-loop verification pipeline applied.`n  - Rejections: Rejected Kafka/RabbitMQ (512MB RAM cap); rejected pessimistic database locking; rejected unreviewed direct pushes to main.`n  - Signed academic integrity attestation by Chris Fourie."
$p9_2T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p9_2T.TextFrame.TextRange.Font.Size = 11.5; $p9_2T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

Add-DemoCue $s9 "VS Code: Open Requirements_Traceability_Matrix_RTM_v3.0.md and Defect_Register_v3.0.md"
Set-Notes $s9 "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Show RTM v3.0: 'Our RTM is not a retrospective table; it evolved from M1 through M3 into a full 8-stage verification chain linking stakeholder needs to acceptance criteria, components, and CI test results.'`n2. Walk through Defect Register: 'We logged 4 authentic defects during construction. Every defect has a root cause analysis, an implementation fix, and an automated regression test.'`n3. Show Technical Debt: 'We explicitly separate technical debt from bugs: our 4 debt items represent deliberate engineering trade-offs with clear repayment plans in M4.'`n4. Show AI Register: 'We maintained an auditable AI register recording where AI was critiqued and rejected, such as rejecting Kafka due to free-tier RAM limits.'"

# -------------------------------------------------------------
# SLIDE 10: Stage 8: Performance Benchmark
# -------------------------------------------------------------
$s10 = $pres.Slides.Add(10, 12)
Add-Header $s10 "Stage 8: Performance & Load Benchmark (NFR-001)" "Assessment Area F: Concurrency Burst Evaluation, Metrics & Municipal Boundaries" "AREA F: 3 MARKS"

$p10_1 = $s10.Shapes.AddShape(1, 40, 85, 420, 380)
$p10_1.Fill.Solid(); $p10_1.Fill.ForeColor.RGB = $cCard; $p10_1.Line.ForeColor.RGB = $cCardBorder
$p10_1T = $s10.Shapes.AddTextbox(1, 55, 95, 390, 360)
$p10_1T.TextFrame.TextRange.Text = "BENCHMARK SPECIFICATION & EXECUTION (load.test.ts)`n`n* Operation Tested: Core Service Request Intake (POST /api/v1/requests).`n* Justification: Intake experiences sudden concurrent spikes during localized emergencies (e.g. pipe bursts or power failures); latency causes citizen drop-off and ticket duplication.`n`n* Workload & Parameters:`n  - 50 concurrent intake requests executed in parallel.`n  - Formal Target: NFR-001 specifies p95 <= 500ms under 50 users.`n`n* Measured Empirical Results:`n  - Total Requests: 50 | Success: 50 (100%) | Errors: 0 (0.0%)`n  - Minimum Latency: 18ms`n  - Median Latency (p50): 58ms`n  - 95th Percentile (p95): 142ms (Target: <= 500ms -> PASS)`n  - Process Memory Footprint: ~42MB RSS (Cap: <512MB -> PASS)"
$p10_1T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p10_1T.TextFrame.TextRange.Font.Size = 11.5; $p10_1T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

$p10_2 = $s10.Shapes.AddShape(1, 490, 85, 430, 380)
$p10_2.Fill.Solid(); $p10_2.Fill.ForeColor.RGB = $cCard; $p10_2.Line.ForeColor.RGB = $cCardBorder
$p10_2T = $s10.Shapes.AddTextbox(1, 505, 95, 400, 360)
$p10_2T.TextFrame.TextRange.Text = "HONEST LIMITATIONS: WHAT THIS TEST DOES NOT PROVE`n`n* What the Test Proves:`n  - Proves the asynchronous Node.js event loop, Express routing pipeline, and Clean Architecture validation handle concurrency bursts cleanly.`n  - Proves memory stability with zero resource exhaustion or deadlock under 50 parallel requests.`n`n* What the Test Does NOT Prove (M3 Brief §13):`n  - Does NOT prove city-wide municipal scale with tens of thousands of concurrent citizens.`n  - Does NOT simulate cellular packet loss on 3G/4G mobile networks.`n  - Does NOT measure multi-gigabyte database write lock contention across remote cloud availability zones.`n`n* Mitigation: Cloud soak testing with k6 scheduled for M4."
$p10_2T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p10_2T.TextFrame.TextRange.Font.Size = 11.5; $p10_2T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

Add-DemoCue $s10 "Terminal: Run `npx vitest run tests/performance/load.test.ts` and inspect latency numbers"
Set-Notes $s10 "TIMING: ~3:00 mins.`n`nSPEAKING POINTS:`n1. Explain why intake was chosen: 'We chose POST /api/v1/requests because intake is the most performance-sensitive endpoint during campus emergencies.'`n2. Present the numbers: 'Under 50 concurrent requests, our p95 latency was 142ms, well within the 500ms target in NFR-001, with 100% success.'`n3. State honest limitations (Critical for full marks in Area F): 'It is vital to state what this test does not prove: it proves single-node Node.js throughput on student hardware; it does not simulate 50,000 citizens on cellular networks or cloud database replication lag.'"

# -------------------------------------------------------------
# SLIDE 11: Stage 9: Release Readiness & Residual Risk
# -------------------------------------------------------------
$s11 = $pres.Slides.Add(11, 12)
Add-Header $s11 "Stage 9: Release Readiness & Residual Risk Statement" "Assessment Area G: Evidence Synthesis, Justified Classification & Risk Profile" "AREA G: 2 MARKS"

$p11_1 = $s11.Shapes.AddShape(1, 40, 85, 420, 380)
$p11_1.Fill.Solid(); $p11_1.Fill.ForeColor.RGB = $cCard; $p11_1.Line.ForeColor.RGB = $cCardBorder
$p11_1T = $s11.Shapes.AddTextbox(1, 55, 95, 390, 360)
$p11_1T.TextFrame.TextRange.Text = "OFFICIAL CLASSIFICATION: CONDITIONALLY READY`n`n* Why CivicConnect is Ready for Release Candidate Baseline:`n  - Implemented core scope (FR-001 - FR-011) fully operational.`n  - 42/42 automated tests pass with 93.61% statement coverage.`n  - CI multi-gate pipeline passes green with 0 compiler errors.`n  - 0 high or critical dependency CVEs.`n  - 4/4 defects resolved with automated regression tests.`n  - Staging environment running with verified rollback scripts.`n`n* Explicit Conditions for Production Readiness (M3 Brief §15):`n  1. Staging evaluated on single host rather than cloud cluster.`n  2. Fast CI tests utilize in-memory doubles (ADR-010).`n  3. Notifications use in-memory observers rather than paid live telecom carrier contracts (DEBT-003)."
$p11_1T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p11_1T.TextFrame.TextRange.Font.Size = 11.5; $p11_1T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

$p11_2 = $s11.Shapes.AddShape(1, 490, 85, 430, 380)
$p11_2.Fill.Solid(); $p11_2.Fill.ForeColor.RGB = $cCard; $p11_2.Line.ForeColor.RGB = $cCardBorder
$p11_2T = $s11.Shapes.AddTextbox(1, 505, 95, 400, 360)
$p11_2T.TextFrame.TextRange.Text = "RESIDUAL RISK STATEMENT TABLE (M3 Brief §16)`n`n1. Municipal-Scale Concurrency Spike (RSK-012)`n   - Why: Student staging cannot simulate city-wide traffic.`n   - Mitigation: 50-concurrency benchmark + lightweight Node.js.`n   - Action: Cloud soak test before M4 rollout.`n`n2. Third-Party Telecom Gateway Outage (RSK-014)`n   - Why: Carrier sandbox behavior differs from local observers.`n   - Mitigation: Observer pattern & Transactional Outbox schema.`n   - Action: Bind production gateway adapter during M4.`n`n3. Solo SCM Dependency (RSK-010)`n   - Why: Total team attrition leaves single engineer.`n   - Mitigation: Ratified ADR-012, living PED v3.0, CI quality gates.`n   - Action: Maintain comprehensive self-audit checklist."
$p11_2T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p11_2T.TextFrame.TextRange.Font.Size = 11.5; $p11_2T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

Add-DemoCue $s11 "VS Code: Open docs/release/Release_Evidence_Summary_v1.0.md showing verdict and residual risk table"
Set-Notes $s11 "TIMING: ~2:30 mins.`n`nSPEAKING POINTS:`n1. State the classification with confidence: 'In Section 10 of PED v3.0, we classify CivicConnect as CONDITIONALLY READY. Calling a student product production-ready without qualification earns low marks; our conditions are transparent and evidence-backed.'`n2. Walk through the 3 conditions: 'Our conditions relate to single-node staging, in-memory CI doubles, and simulated notification sinks.'`n3. Defend residual risks: 'Testing does not prove the absence of defects. We explicitly manage 4 residual risks in our Risk Register with active mitigations and M4 actions.'"

# -------------------------------------------------------------
# SLIDE 12: Stage 10: Individual Defence & Summary
# -------------------------------------------------------------
$s12 = $pres.Slides.Add(12, 12)
Add-Header $s12 "Stage 10: Individual Engineering Defence & Conclusion" "Individual Examination: 5 Core Dimensions, Traceability & Final Sign-Off" "DEFENCE: 20 MARKS"

$p12_1 = $s12.Shapes.AddShape(1, 40, 85, 420, 380)
$p12_1.Fill.Solid(); $p12_1.Fill.ForeColor.RGB = $cCard; $p12_1.Line.ForeColor.RGB = $cCardBorder
$p12_1T = $s12.Shapes.AddTextbox(1, 55, 95, 390, 360)
$p12_1T.TextFrame.TextRange.Text = "FIVE INDIVIDUAL DEFENCE DIMENSIONS (20 MARKS)`n`n1. Requirement-to-Evidence Trace (4 Marks):`n   - Trace FR-001: Stakeholder need -> AC-001.1 -> CategoryFactories.ts -> InputBoundaryValidation.test.ts -> HTTP 201.`n   - Trace FR-009/FR-010: OCC claim -> ServiceRequest.ts -> OptimisticConcurrency.test.ts -> HTTP 409.`n`n2. Engineering Decision & M2 Conformance (4 Marks):`n   - ADR-006: OCC integer versioning vs pessimistic row locking (eliminated connection pool starvation).`n   - ADR-010: Dual persistence (sub-second CI vs Postgres staging).`n`n3. Quality Evidence Interpretation (4 Marks):`n   - 42 tests & 93.6% coverage prove invariant isolation; cannot prove third-party SMS carrier reliability."
$p12_1T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p12_1T.TextFrame.TextRange.Font.Size = 11.5; $p12_1T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

$p12_2 = $s12.Shapes.AddShape(1, 490, 85, 430, 380)
$p12_2.Fill.Solid(); $p12_2.Fill.ForeColor.RGB = $cCard; $p12_2.Line.ForeColor.RGB = $cCardBorder
$p12_2T = $s12.Shapes.AddTextbox(1, 505, 95, 400, 360)
$p12_2T.TextFrame.TextRange.Text = "FAILURE REASONING & CONCLUSION`n`n4. Failure / Risk Reasoning (4 Marks):`n   - DEF-003: Unhandled OCC conflict returned 500; mapped to HTTP 409 Conflict with version payload.`n   - DEF-004: Missing role header allowed unauthorized citizen assignment; added RBAC guards returning HTTP 403.`n   - RSK-012: Mitigated solo delivery via multi-gate CI automation.`n`n5. Release-Readiness Defence (4 Marks):`n   - Grounded CONDITIONALLY READY verdict across tests, staging, zero open high defects, and documented debt.`n`nFINAL STATUS: Complete, verified, and ready for submission by Friday 16 October 2026, 23:59 SAST."
$p12_2T.TextFrame.TextRange.Font.Name = "Segoe UI"; $p12_2T.TextFrame.TextRange.Font.Size = 11.5; $p12_2T.TextFrame.TextRange.Font.Color.RGB = $cDarkText

Add-DemoCue $s12 "Camera: Return to full-screen webcam view for final individual defence statement and closing remarks"
Set-Notes $s12 "TIMING: ~4:00 mins.`n`nSPEAKING POINTS:`n1. Address each of the 5 individual criteria sequentially on camera:`n   - 'First, tracing FR-001 from citizen need through CategoryFactories.ts to our boundary value tests.'`n   - 'Second, our decision in ADR-006 to adopt Optimistic Concurrency Control instead of pessimistic row locking avoided blocking database connection pools.'`n   - 'Third, our test suite proves domain invariant correctness, but we understand green CI does not prove third-party carrier uptime.'`n   - 'Fourth, under DEF-003 and DEF-004 we caught and fixed race conditions and RBAC vulnerabilities before release.'`n   - 'Fifth, our CONDITIONALLY READY classification is fully supported by our 42 passing tests, containerized staging, and transparent residual risks.'`n2. Conclude: 'This concludes our Milestone 3 engineering review. CivicConnect is under full engineering control and ready for evaluation. Thank you.'"

# Save Presentation
$pres.SaveAs($outputPath)
$pres.SaveAs($outputRoot)
$pres.Close()
$ppt.Quit()

Write-Host "SUCCESS: Presentation generated at: $outputPath"
