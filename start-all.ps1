# ==============================================================================
# SkillSphere Microservices Startup Orchestrator
# ==============================================================================
# Automates environment validation and launches all backend microservices
# and Vite React frontend into dedicated PowerShell execution windows.
# ==============================================================================

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $PSScriptRoot

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "   SKILLSPHERE MICROSERVICES STARTUP ORCHESTRATOR" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. PostgreSQL Service Health Check (Port 5432)
Write-Host "[1/4] Checking PostgreSQL database connectivity on port 5432..." -ForegroundColor Yellow
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
    Write-Host "     Make sure PostgreSQL database is started if backend persistence is required.`n" -ForegroundColor DarkYellow
}

Start-Sleep -Milliseconds 500

# 2. Spawn Learning Service (Port 8082)
Write-Host "[2/4] Spawning Learning Service (Port 8082)..." -ForegroundColor Yellow
$learnCmd = "Set-Location '$PSScriptRoot\learningservice'; Write-Host '=== LEARNING SERVICE (PORT 8082) ===' -ForegroundColor Cyan; mvn spring-boot:run"
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $learnCmd

Start-Sleep -Milliseconds 500

# 3. Spawn Career & Analytics Service (Port 8083)
Write-Host "[3/4] Spawning Career & Analytics Service (Port 8083)..." -ForegroundColor Yellow
$careerCmd = "Set-Location '$PSScriptRoot\backend\career-service'; Write-Host '=== CAREER & ANALYTICS SERVICE (PORT 8083) ===' -ForegroundColor Cyan; mvn spring-boot:run"
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $careerCmd

Start-Sleep -Milliseconds 500

# 4. Spawn Vite React Frontend (Port 5173)
Write-Host "[4/4] Spawning Vite React Frontend (Port 5173)..." -ForegroundColor Yellow
$frontendCmd = "Set-Location '$PSScriptRoot\frontend'; Write-Host '=== VITE REACT FRONTEND (PORT 5173) ===' -ForegroundColor Cyan; npm run dev"
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $frontendCmd

Start-Sleep -Seconds 1

# Output Service URLs Summary
Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "   ALL SERVICES LAUNCHED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Learning Service:            http://localhost:8082" -ForegroundColor Cyan
Write-Host "  Career & Analytics Service:  http://localhost:8083" -ForegroundColor Cyan
Write-Host "  Frontend Dashboard:          http://localhost:5173" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Green
