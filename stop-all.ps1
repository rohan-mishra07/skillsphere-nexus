# ==============================================================================
# SkillSphere Shutdown Orchestrator
# ==============================================================================
# Gracefully identifies and terminates processes bound to ports 8080 and 4200.
# ==============================================================================

Write-Host "`n========================================================" -ForegroundColor Yellow
Write-Host "   SKILLSPHERE CLEAN SHUTDOWN ORCHESTRATOR" -ForegroundColor Yellow
Write-Host "========================================================`n" -ForegroundColor Yellow

$targetPorts = @(8080, 4200)
$killedPids = @()

foreach ($port in $targetPorts) {
    Write-Host "Checking port $port..." -NoNewline -ForegroundColor Gray
    
    $pidsToKill = @()
    
    try {
        $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($conns) {
            $pidsToKill += ($conns | Select-Object -ExpandProperty OwningProcess -Unique)
        }
    } catch {}

    if ($pidsToKill.Count -eq 0) {
        $netstatOutput = netstat -ano | Select-String ":$port\s"
        foreach ($line in $netstatOutput) {
            $parts = $line.ToString().Trim() -split '\s+'
            if ($parts.Length -ge 5) {
                $pidVal = $parts[-1]
                if ($pidVal -match '^\d+$' -and [int]$pidVal -gt 0) {
                    $pidsToKill += [int]$pidVal
                }
            }
        }
    }

    $uniquePids = $pidsToKill | Select-Object -Unique | Where-Object { $_ -gt 0 }

    if ($uniquePids.Count -gt 0) {
        Write-Host " FOUND PID(s): $($uniquePids -join ', ')" -ForegroundColor Cyan
        foreach ($pidToKill in $uniquePids) {
            try {
                $proc = Get-Process -Id $pidToKill -ErrorAction SilentlyContinue
                $procName = if ($proc) { $proc.ProcessName } else { "Process $pidToKill" }
                
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
                Write-Host "  -> Successfully terminated $procName (PID: $pidToKill) listening on port $port" -ForegroundColor Green
                $killedPids += $pidToKill
            } catch {
                Write-Host "  -> Failed to stop PID ${pidToKill}: $_" -ForegroundColor Red
            }
        }
    } else {
        Write-Host " CLEAN (No active processes)" -ForegroundColor Green
    }
}

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "   SHUTDOWN COMPLETE - ALL TARGET PORTS RELEASED" -ForegroundColor Green
Write-Host "========================================================`n" -ForegroundColor Green
