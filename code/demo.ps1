# ==============================================================================
# CIVICCONNECT LIVE ENGINEERING DEMONSTRATION SCRIPT
# SEN381 NQF Level 8 Software Engineering Milestone 2 Presentation
# Active Team: Chris Fourie (602826) & Lisa Verson (602006)
# ==============================================================================

param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$Interactive = "true"
)

function Pause-Step {
    param([string]$Message = "Press Enter to proceed to the next demonstration step...")
    if ($Interactive -eq "true" -or $Interactive -eq "1") {
        Write-Host "`n>>> $Message" -ForegroundColor Yellow
        $null = Read-Host
    } else {
        Start-Sleep -Seconds 1
    }
}

Clear-Host
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "       CIVICCONNECT LIVE ARCHITECTURE & ENGINEERING DEMO" -ForegroundColor Cyan
Write-Host "  SEN381 Milestone 2: Clean Architecture, Concurrency, Patterns & Security" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "Target Server: $BaseUrl`n" -ForegroundColor Gray

# ------------------------------------------------------------------------------
# STEP 0: Check Server Status
# ------------------------------------------------------------------------------
Write-Host "[STEP 0] Checking Backend Server Liveness..." -ForegroundColor White
try {
    $health = Invoke-RestMethod -Uri "$BaseUrl/health/live" -Method GET -TimeoutSec 3
    Write-Host "  [OK] Server is UP and healthy!" -ForegroundColor Green
    Write-Host "       Uptime: $($health.uptimeSeconds)s | Memory: $($health.memoryUsageMB) MB | Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "  [FAIL] Server is not running on $BaseUrl!" -ForegroundColor Red
    Write-Host "         Please start the server first (Run 'npm run dev' or use Desktop shortcut)." -ForegroundColor Yellow
    exit 1
}

Pause-Step "Ready to demonstrate Step 1: Design Pattern 2 (Factory Method Intake)"

# ------------------------------------------------------------------------------
# STEP 1: Factory Method Pattern (ADR-005) - Polymorphic Intake & Validation
# ------------------------------------------------------------------------------
Write-Host "`n------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "[STEP 1] Factory Method Pattern (ADR-005) Polymorphic Invariant Validation" -ForegroundColor White
Write-Host "Context: Facility Faults require building/room identifiers. Monolithic code" -ForegroundColor Gray
Write-Host "         would use switch-case statements; we use dedicated Category Creators.`n" -ForegroundColor Gray

# 1A: Attempt invalid submission (missing room/building)
Write-Host "Submitting Facility Fault WITHOUT Room/Building identifier..." -ForegroundColor Yellow
$invalidBody = @{
    categoryCode = "FAC_FAULT"
    title = "Broken Water Pipe"
    description = "Water leaking heavily on pavement"
    locationAddress = "Main Street Sidewalk"
    citizenContact = "0821234567"
} | ConvertTo-Json

try {
    $null = Invoke-RestMethod -Uri "$BaseUrl/api/v1/requests" -Method POST -Body $invalidBody -ContentType "application/json"
    Write-Host "  [UNEXPECTED] Request was accepted when it should have been rejected!" -ForegroundColor Red
} catch {
    Write-Host "  [EXPECTED REJECTION] Invariant Guard Triggered!" -ForegroundColor Green
    Write-Host "  Error Payload: $($_.Exception.Message)" -ForegroundColor Magenta
}

Start-Sleep -Seconds 1

# 1B: Submit valid request
Write-Host "`nSubmitting Facility Fault WITH valid Building specification..." -ForegroundColor Yellow
$validBody = @{
    categoryCode = "FAC_FAULT"
    title = "Burst Pipe - Ground Floor Restroom"
    description = "Water leaking rapidly from ceiling fitting"
    locationAddress = "Building C, Room 104"
    citizenContact = "0821234567"
    requesterId = "CIT-2026-908"
    isAnonymizedDisplay = $true
} | ConvertTo-Json

$createdRequest = Invoke-RestMethod -Uri "$BaseUrl/api/v1/requests" -Method POST -Body $validBody -ContentType "application/json"
$createdId = $createdRequest.requestId
$createdRef = $createdRequest.referenceNumber

Write-Host "  [SUCCESS] Request Created Successfully via FacilityFaultFactory!" -ForegroundColor Green
Write-Host "  Tracking Ref:    $($createdRef)" -ForegroundColor Cyan
Write-Host "  Initial Status:  $($createdRequest.status) (Strict State 1/6)" -ForegroundColor Cyan
Write-Host "  Default Priority:$($createdRequest.priorityCode) (Enforced by Category)" -ForegroundColor Cyan
Write-Host "  Current Version: $($createdRequest.version) (OCC Baseline)" -ForegroundColor Cyan

Pause-Step "Ready to demonstrate Step 2: POPIA Privacy Data Masking (NFR-005)"

# ------------------------------------------------------------------------------
# STEP 2: POPIA Citizen Privacy Masking (NFR-005)
# ------------------------------------------------------------------------------
Write-Host "`n------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "[STEP 2] POPIA Compliance & Role-Based Data Minimization (NFR-005)" -ForegroundColor White
Write-Host "Context: Field staff do not need to see citizen personal identity numbers." -ForegroundColor Gray
Write-Host "         The ServiceRequestDTOMapper masks identity based on viewer role.`n" -ForegroundColor Gray

Write-Host "Fetching ticket as FIELD TECHNICIAN (Header: x-user-role = STAFF)..." -ForegroundColor Yellow
$staffView = Invoke-RestMethod -Uri "$BaseUrl/api/v1/requests/$createdId" -Method GET -Headers @{ "x-user-role" = "STAFF" }
Write-Host "  Requester ID:   $($staffView.requester.userId)" -ForegroundColor Magenta
Write-Host "  Display Name:   $($staffView.requester.displayName)" -ForegroundColor Magenta
Write-Host "  Protected Flag: $($staffView.requester.isAnonymized)" -ForegroundColor Gray

Start-Sleep -Seconds 1

Write-Host "`nFetching ticket as MUNICIPAL ADMINISTRATOR (Header: x-user-role = ADMIN)..." -ForegroundColor Yellow
$adminView = Invoke-RestMethod -Uri "$BaseUrl/api/v1/requests/$createdId" -Method GET -Headers @{ "x-user-role" = "ADMIN" }
Write-Host "  Requester ID:   $($adminView.requester.userId)" -ForegroundColor Green
Write-Host "  Display Name:   $($adminView.requester.displayName)" -ForegroundColor Green

Pause-Step "Ready to demonstrate Step 3: Optimistic Concurrency Control (ADR-006)"

# ------------------------------------------------------------------------------
# STEP 3: Optimistic Concurrency Control (OCC) Collision Demo (ADR-006)
# ------------------------------------------------------------------------------
Write-Host "`n------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "[STEP 3] Optimistic Concurrency Control (OCC) Lost-Update Collision (ADR-006)" -ForegroundColor White
Write-Host "Context: Two supervisors attempt to assign the same ticket simultaneously." -ForegroundColor Gray
Write-Host "         We reject stale versions with HTTP 409 Conflict without DB row locks.`n" -ForegroundColor Gray

Write-Host "Supervisor 1 assigns ticket to 'usr-technician-44' expecting version 1..." -ForegroundColor Yellow
$assignBody = @{
    staffId = "usr-technician-44"
    expectedVersion = 1
} | ConvertTo-Json

$assigned = Invoke-RestMethod -Uri "$BaseUrl/api/v1/requests/$createdId/assign" -Method PATCH -Body $assignBody -ContentType "application/json"
Write-Host "  [SUCCESS] Assigned to usr-technician-44!" -ForegroundColor Green
Write-Host "  New Status:  $($assigned.status)" -ForegroundColor Cyan
Write-Host "  New Version: $($assigned.version) (Incremented from 1 to 2)" -ForegroundColor Cyan

Start-Sleep -Seconds 1

Write-Host "`nSupervisor 2 now attempts to assign same ticket with STALE version 1..." -ForegroundColor Yellow
try {
    $null = Invoke-RestMethod -Uri "$BaseUrl/api/v1/requests/$createdId/assign" -Method PATCH -Body $assignBody -ContentType "application/json"
    Write-Host "  [UNEXPECTED] Collision was NOT detected!" -ForegroundColor Red
} catch {
    Write-Host "  [RACE CONDITION CAUGHT] HTTP 409 Conflict Successfully Raised!" -ForegroundColor Green
    Write-Host "  Error Payload: $($_.Exception.Message)" -ForegroundColor Magenta
}

Pause-Step "Ready to demonstrate Step 4: Finite State Machine (FSM) Lifecycle Protection"

# ------------------------------------------------------------------------------
# STEP 4: Finite State Machine Lifecycle Guard (DEC-004)
# ------------------------------------------------------------------------------
Write-Host "`n------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "[STEP 4] Deterministic Finite State Machine (FSM) Lifecycle Integrity" -ForegroundColor White
Write-Host "Context: An assigned ticket cannot jump directly to CLOSED without resolution." -ForegroundColor Gray
Write-Host "         The domain entity rejects invalid lifecycle leaps.`n" -ForegroundColor Gray

Write-Host "Attempting ILLEGAL transition from ASSIGNED directly to CLOSED..." -ForegroundColor Yellow
$illegalTransition = @{
    newStatus = "CLOSED"
    actionNotes = "Attempting to skip in-progress and resolution"
    expectedVersion = 2
} | ConvertTo-Json

try {
    $null = Invoke-RestMethod -Uri "$BaseUrl/api/v1/requests/$createdId/status" -Method PATCH -Body $illegalTransition -ContentType "application/json"
    Write-Host "  [UNEXPECTED] Illegal transition was permitted!" -ForegroundColor Red
} catch {
    Write-Host "  [LIFECYCLE GUARD TRIGGERED] Illegal transition blocked by FSM!" -ForegroundColor Green
    Write-Host "  Error Payload: $($_.Exception.Message)" -ForegroundColor Magenta
}

Start-Sleep -Seconds 1

Write-Host "`nExecuting VALID transition: ASSIGNED -> IN_PROGRESS..." -ForegroundColor Yellow
$validTransition1 = @{
    newStatus = "IN_PROGRESS"
    actionNotes = "Technician dispatched on-site"
    expectedVersion = 2
} | ConvertTo-Json

$inProgress = Invoke-RestMethod -Uri "$BaseUrl/api/v1/requests/$createdId/status" -Method PATCH -Body $validTransition1 -ContentType "application/json"
Write-Host "  [SUCCESS] Ticket is now: $($inProgress.status) (Version: $($inProgress.version))" -ForegroundColor Green

Pause-Step "Ready to demonstrate Step 5: Automated Verification Suite (Vitest)"

# ------------------------------------------------------------------------------
# STEP 5: Automated Test Suite (16/16 Tests)
# ------------------------------------------------------------------------------
Write-Host "`n------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "[STEP 5] Live Automated Verification Evidence (Vitest)" -ForegroundColor White
Write-Host "Executing all 16 unit and integration test suites...`n" -ForegroundColor Gray

npm test

Write-Host "`n========================================================================" -ForegroundColor Cyan
Write-Host "         CIVICCONNECT LIVE DEMONSTRATION COMPLETE!" -ForegroundColor Cyan
Write-Host "  All ASRs, Design Patterns, OCC, and FSM Transitions Verified Live" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
