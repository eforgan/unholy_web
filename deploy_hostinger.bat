@echo off
setlocal

:: --- FTP CONFIGURATION ---
set "FTP_HOST=88.223.85.137"
:: Username and Password will be asked at runtime for security
set /p "FTP_USER=Introduzca usuario FTP: "
set /p "FTP_PASS=Introduzca password FTP: "
:: Use /public_html for Hostinger unless the domain points elsewhere
set "REMOTE_DIR=/public_html"

:: --- FILE LIST ---
:: List of files to upload (Add or remove as needed)
set "FILES=index.html bio.html media.html sets.html tour.html releases.html merch.html about.html press.html contact.html global.css global.js robots.txt sitemap.xml 404.html vercel.json"

echo.
echo [1/3] Preparando script de carga para %FTP_HOST%...

:: Create temporary FTP script
set "FTPSCRIPT=%temp%\unholy_ftp.txt"
echo open %FTP_HOST% > "%FTPSCRIPT%"
echo %FTP_USER% >> "%FTPSCRIPT%"
echo %FTP_PASS% >> "%FTPSCRIPT%"
echo binary >> "%FTPSCRIPT%"
echo cd %REMOTE_DIR% >> "%FTPSCRIPT%"

:: Add file uploads
for %%f in (%FILES%) do (
    if exist "%%f" (
        echo put "%%f" >> "%FTPSCRIPT%"
    ) else (
        echo [!] Archivo no encontrado: %%f
    )
)

echo quit >> "%FTPSCRIPT%"

echo [2/3] Iniciando transferencia vía FTP (Hostinger)...
ftp -s:"%FTPSCRIPT%"

echo.
echo [3/3] Limpieza de archivos temporales...
del "%FTPSCRIPT%"

echo.
echo [COMPLETADO] El sitio web de UNHOLY ha sido subido a Hostinger.
pause
