# Build Verifier APK (production-ssi-api) on Windows.
# Requires: Git for Windows, eas-cli, ikabott Expo login.

$ErrorActionPreference = "Stop"

$gitBin = "C:\Program Files\Git\bin"
if (Test-Path $gitBin) {
  $env:PATH = "$gitBin;$env:PATH"
} else {
  Write-Warning "Git not found at $gitBin — install Git or set EAS_NO_VCS=1"
  $env:EAS_NO_VCS = "1"
}

Set-Location $PSScriptRoot

Write-Host "Git: $(git --version 2>&1)"
Write-Host "Building @ikabott/ssi-verifier-app (production-ssi-api)..."
Write-Host "When prompted: Generate a new Android Keystore? -> Yes"
Write-Host ""

eas build --profile production-ssi-api --platform android
