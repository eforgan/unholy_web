# Upload to Hostinger via FTP
# Usage: Run this script and enter your FTP credentials

$FTP_HOST = "88.223.85.137"
$REMOTE_DIR = "/public_html"

Write-Host "=== SUBIDA A HOSTINGER ===" -ForegroundColor Cyan
Write-Host ""

$FTP_USER = Read-Host "Usuario FTP"
$FTP_PASS = Read-Host "Contraseña" -AsSecureString
$FTP_PASS = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($FTP_PASS))

function Upload-Folder {
    param($LocalFolder, $RemoteFolder)
    
    if (!(Test-Path $LocalFolder)) {
        Write-Host "[SKIP] Carpeta no encontrada: $LocalFolder" -ForegroundColor Yellow
        return
    }
    
    Write-Host "Subiendo $LocalFolder..." -ForegroundColor Cyan
    
    # Create FTP script
    $scriptContent = @"
open $FTP_HOST
$FTP_USER
$FTP_PASS
binary
cd $REMOTE_DIR
mkdir $RemoteFolder
cd $RemoteFolder
lcd "$LocalFolder"
prompt
mput *
bye
"@
    
    $scriptPath = "$env:TEMP\ftp_$([guid]::NewGuid().ToString('N')).txt"
    $scriptContent | Out-File -FilePath $scriptPath -Encoding ASCII
    
    ftp -s:$scriptPath 2>$null
    
    Remove-Item $scriptPath -ErrorAction SilentlyContinue
    Write-Host "Completado: $RemoteFolder" -ForegroundColor Green
}

# Upload folders
$folders = @(
    @{Local="COMPLETO"; Remote="COMPLETO"},
    @{Local="TRACKS"; Remote="TRACKS"},
    @{Local="merch_assets"; Remote="merch_assets"},
    @{Local="VIDEOS"; Remote="VIDEOS"},
    @{Local="blog"; Remote="blog"}
)

foreach ($folder in $folders) {
    Upload-Folder $folder.Local $folder.Remote
}

Write-Host ""
Write-Host "=== COMPLETADO ===" -ForegroundColor Green
Write-Host "Carpetas subidas a $FTP_HOST" -ForegroundColor Cyan

# Clean up password
$FTP_PASS = $null
