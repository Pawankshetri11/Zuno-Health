# Zuno - Database Setup + Start Servers (runs in current terminal)
# Run: .\start.ps1

param([switch]$SkipDb)

$ErrorActionPreference = "Continue"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Zuno - Database Setup + Start Servers" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Find mysql and php binaries
$mysqlPath = $null
$phpPath = $null

$mysqlCandidates = @(
    "C:\XAMPP\mysql\bin\mysql.exe",
    "C:\lampp\mysql\bin\mysql.exe",
    "C:\Bitnami\lampstack-8\mysql\bin\mysql.exe",
    "C:\Bitnami\lampstack-7\mysql\bin\mysql.exe",
    "C:\Bitnami\lampstack-9\mysql\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
    "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
)

$phpCandidates = @(
    "C:\XAMPP\php\php.exe",
    "C:\lampp\php\php.exe",
    "C:\Bitnami\lampstack-8\php\php.exe",
    "C:\Bitnami\lampstack-7\php\php.exe",
    "C:\Bitnami\lampstack-9\php\php.exe",
    "C:\php\php.exe",
    "C:\Program Files\PHP\php.exe",
    "C:\Program Files (x86)\PHP\php.exe"
)

foreach ($c in $mysqlCandidates) {
    if (Test-Path $c) { $mysqlPath = $c; break }
}
foreach ($c in $phpCandidates) {
    if (Test-Path $c) { $phpPath = $c; break }
}

if (-not $mysqlPath) {
    Write-Host "ERROR: mysql binary not found. Install XAMPP or add mysql\bin to PATH." -ForegroundColor Red
    pause
    exit 1
}
if (-not $phpPath) {
    Write-Host "ERROR: PHP binary not found. Install XAMPP or add php to PATH." -ForegroundColor Red
    pause
    exit 1
}

$env:PATH = "$($mysqlPath.DirectoryName);$($phpPath.DirectoryName);$env:PATH"

# Verify mysql binary works
try {
    & $mysqlPath --version | Out-Null
} catch {
    Write-Host "ERROR: mysql binary not functional." -ForegroundColor Red
    pause
    exit 1
}

# Verify PHP binary works
try {
    & $phpPath -v | Out-Null
} catch {
    Write-Host "ERROR: PHP binary not functional." -ForegroundColor Red
    pause
    exit 1
}

$DB_NAME = "zunodb"
$SQL_FILE = Join-Path $PSScriptRoot "api\zuno.sql"

if (-not $SkipDb) {
# Create database
Write-Host "[$DB_NAME] Creating database..." -ForegroundColor Green
$createResult = & $mysqlPath -u root -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create database. Is MySQL server running?" -ForegroundColor Red
    Write-Host "Start MySQL in XAMPP Control Panel and try again." -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "Database '$DB_NAME' ready." -ForegroundColor Green
Write-Host ""

# Check if tables already exist - skip import if so
$tableCheck = & $mysqlPath -u root $DB_NAME -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME' AND table_name = 'users';" 2>$null
$tableCount = 0
if ($tableCheck -match '\d+') { $tableCount = [int]::Parse($tableCheck) }

if ($tableCount -eq 0) {
    Write-Host "[$DB_NAME] Importing schema + data..." -ForegroundColor Green
    $importResult = Get-Content $SQL_FILE -Raw | & $mysqlPath -u root $DB_NAME 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to import SQL file." -ForegroundColor Red
        Write-Host $importResult -ForegroundColor DarkRed
        pause
        exit 1
    }
    Write-Host "Import complete." -ForegroundColor Green
} else {
    Write-Host "[$DB_NAME] Database already has tables - skipping import." -ForegroundColor DarkGray
}
Write-Host ""
} else {
    Write-Host "Skipping database setup (SkipDb)." -ForegroundColor DarkGray
    Write-Host ""
}

# Start servers as background jobs in the same terminal
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Starting servers..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Start PHP backend as background job
Write-Host "[PHP] Backend starting on http://localhost:8000" -ForegroundColor Green
$phpRoot = $PSScriptRoot
$phpJob = Start-Job -ScriptBlock {
    param($phpPath, $root)
    & $phpPath -S localhost:8000 -t $root
} -ArgumentList $phpPath, $phpRoot

# Start Vite frontend as background job
$viteDir = Join-Path $PSScriptRoot "frontend"
Write-Host "[Vite] Frontend starting on http://localhost:8080" -ForegroundColor Yellow
$viteJob = Start-Job -ScriptBlock {
    param($viteDir)
    Set-Location $viteDir
    npm run dev
} -ArgumentList $viteDir

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:8080" -ForegroundColor White
Write-Host "  Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Output from both servers will appear below." -ForegroundColor DarkGray
Write-Host "Press Ctrl+C to stop both servers." -ForegroundColor DarkGray
Write-Host ""

# Monitor both jobs and relay output in the same terminal
try {
    while ($phpJob.State -eq "Running" -or $viteJob.State -eq "Running") {
        if ($phpJob.State -eq "Running") {
            $out = Receive-Job $phpJob -ErrorAction SilentlyContinue
            if ($out) {
                foreach ($line in $out) {
                    Write-Host "[PHP] $line" -ForegroundColor DarkGreen
                }
            }
        }
        if ($viteJob.State -eq "Running") {
            $out = Receive-Job $viteJob -ErrorAction SilentlyContinue
            if ($out) {
                foreach ($line in $out) {
                    Write-Host "[Vite] $line" -ForegroundColor DarkYellow
                }
            }
        }
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Red
    Stop-Job $phpJob -ErrorAction SilentlyContinue
    Stop-Job $viteJob -ErrorAction SilentlyContinue
    Remove-Job $phpJob -ErrorAction SilentlyContinue
    Remove-Job $viteJob -ErrorAction SilentlyContinue
}