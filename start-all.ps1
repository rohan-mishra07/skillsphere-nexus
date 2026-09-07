# ==============================================================================
# SkillSphere Unified Architecture Startup Orchestrator
# ==============================================================================
# Automates environment validation and launches the unified Spring Boot 3
# backend (Port 8080) and Frontend (Port 4200) into dedicated execution windows.
# ==============================================================================

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $PSScriptRoot

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "   SKILLSPHERE UNIFIED ARCHITECTURE STARTUP ORCHESTRATOR" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. PostgreSQL Service Health Check (Port 5432)
Write-Host "[1/3] Checking PostgreSQL database connectivity on port 5432..." -ForegroundColor Yellow
$pgOnline = $false
try {
    $client = New-Object System.Net.Sockets.TcpClient
    $asyncResult = $client.BeginConnect("localhost", 5432, $null, $null)
    $success = $asyncResult.AsyncWaitHandle.WaitOne(1500, $false)
    if ($success -and $client.Connected) {
        $pgOnline = $true
        $client.Close()
    }
} catch {
    $pgOnline = $false
}

if ($pgOnline) {
    Write-Host "  -> [SUCCESS] PostgreSQL is ONLINE and listening on port 5432." -ForegroundColor Green
} else {
    Write-Host "  -> [WARNING] PostgreSQL NOT detected on port 5432." -ForegroundColor Red
    Write-Host "     Make sure PostgreSQL database (skillsphere_db) is running.`n" -ForegroundColor DarkYellow
}

Start-Sleep -Milliseconds 500

# 2. Spawn Unified Backend (Port 8080)
Write-Host "[2/3] Spawning Unified Spring Boot Backend (Port 8080)..." -ForegroundColor Yellow
$backendCmd = "Set-Location '$PSScriptRoot\backend'; Write-Host '=== UNIFIED BACKEND (PORT 8080) ===' -ForegroundColor Cyan; mvn spring-boot:run"
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $backendCmd

Start-Sleep -Milliseconds 500

# 3. Spawn Frontend (Port 4200)
Write-Host "[3/3] Spawning Frontend Dashboard (Port 4200)..." -ForegroundColor Yellow
$frontendCmd = "Set-Location '$PSScriptRoot\frontend'; Write-Host '=== FRONTEND DASHBOARD (PORT 4200) ===' -ForegroundColor Cyan; npm run dev"
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $frontendCmd

Start-Sleep -Seconds 1

# Output Service URLs Summary
Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "   ALL UNIFIED SERVICES LAUNCHED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Keycloak IAM:       http://localhost:8081" -ForegroundColor Cyan
Write-Host "  Unified Backend:    http://localhost:8080" -ForegroundColor Cyan
Write-Host "  Frontend Dashboard: http://localhost:4200" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Green
