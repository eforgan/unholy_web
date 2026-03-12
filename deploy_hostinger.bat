@echo off
setlocal

:: --- FTP CONFIGURATION ---
set "FTP_HOST=88.223.85.137"
set /p "FTP_USER=Introduzca usuario FTP: "
set /p "FTP_PASS=Introduzca password FTP: "
set "REMOTE_DIR=/public_html"

:: --- FILE LIST ---
set "FILES=index.html bio.html media.html sets.html tour.html releases.html merch.html about.html press.html contact.html blog.html comments.html global.css global.js robots.txt sitemap.xml 404.html vercel.json"

:: --- FOLDERS TO UPLOAD ---
set "FOLDERS=COMPLETO TRACKS merch_assets ARTWORKS VIDEOS blog scripts"

echo.
echo [1/4] Preparando script de carga para %FTP_HOST%...

set "FTPSCRIPT=%temp%\unholy_ftp.txt"
echo open %FTP_HOST% > "%FTPSCRIPT%"
echo %FTP_USER% >> "%FTPSCRIPT%"
echo %FTP_PASS% >> "%FTPSCRIPT%"
echo binary >> "%FTPSCRIPT%"
echo cd %REMOTE_DIR% >> "%FTPSCRIPT%"

:: Upload individual files
for %%f in (%FILES%) do (
    if exist "%%f" (
        echo put "%%f" >> "%FTPSCRIPT%"
    ) else (
        echo [!] Archivo no encontrado: %%f
    )
)

:: Upload folders
for %%d in (%FOLDERS%) do (
    if exist "%%d" (
        echo mkdir %%d >> "%FTPSCRIPT%"
        echo cd %%d >> "%FTPSCRIPT%"
        echo lcd %%d >> "%FTPSCRIPT%"
        echo mput * >> "%FTPSCRIPT%"
        echo cd .. >> "%FTPSCRIPT%"
        echo lcd .. >> "%FTPSCRIPT%"
    ) else (
        echo [!] Carpeta no encontrada: %%d
    )
)

echo quit >> "%FTPSCRIPT%"

echo [2/4] Iniciando transferencia de archivos...
ftp -s:"%FTPSCRIPT%"

echo.
echo [3/4] Subiendo carpetas (COMPLETO, TRACKS, etc.)...

:: Upload COMPLETO folder
if exist "COMPLETO" (
    echo Subiendo COMPLETO...
    echo open %FTP_HOST% > "%FTPSCRIPT%"
    echo %FTP_USER% >> "%FTPSCRIPT%"
    echo %FTP_PASS% >> "%FTPSCRIPT%"
    echo binary >> "%FTPSCRIPT%"
    echo cd %REMOTE_DIR% >> "%FTPSCRIPT%"
    echo mkdir COMPLETO >> "%FTPSCRIPT%"
    echo cd COMPLETO >> "%FTPSCRIPT%"
    echo lcd COMPLETO >> "%FTPSCRIPT%"
    echo mput * >> "%FTPSCRIPT%"
    echo cd .. >> "%FTPSCRIPT%"
    echo lcd .. >> "%FTPSCRIPT%"
    echo quit >> "%FTPSCRIPT%"
    ftp -s:"%FTPSCRIPT%"
)

:: Upload TRACKS folder
if exist "TRACKS" (
    echo Subiendo TRACKS...
    echo open %FTP_HOST% > "%FTPSCRIPT%"
    echo %FTP_USER% >> "%FTPSCRIPT%"
    echo %FTP_PASS% >> "%FTPSCRIPT%"
    echo binary >> "%FTPSCRIPT%"
    echo cd %REMOTE_DIR% >> "%FTPSCRIPT%"
    echo mkdir TRACKS >> "%FTPSCRIPT%"
    echo cd TRACKS >> "%FTPSCRIPT%"
    echo lcd TRACKS >> "%FTPSCRIPT%"
    echo mput * >> "%FTPSCRIPT%"
    echo cd .. >> "%FTPSCRIPT%"
    echo lcd .. >> "%FTPSCRIPT%"
    echo quit >> "%FTPSCRIPT%"
    ftp -s:"%FTPSCRIPT%"
)

:: Upload merch_assets folder
if exist "merch_assets" (
    echo Subiendo merch_assets...
    echo open %FTP_HOST% > "%FTPSCRIPT%"
    echo %FTP_USER% >> "%FTPSCRIPT%"
    echo %FTP_PASS% >> "%FTPSCRIPT%"
    echo binary >> "%FTPSCRIPT%"
    echo cd %REMOTE_DIR% >> "%FTPSCRIPT%"
    echo mkdir merch_assets >> "%FTPSCRIPT%"
    echo cd merch_assets >> "%FTPSCRIPT%"
    echo lcd merch_assets >> "%FTPSCRIPT%"
    echo mput * >> "%FTPSCRIPT%"
    echo cd .. >> "%FTPSCRIPT%"
    echo lcd .. >> "%FTPSCRIPT%"
    echo quit >> "%FTPSCRIPT%"
    ftp -s:"%FTPSCRIPT%"
)

:: Upload VIDEOS folder
if exist "VIDEOS" (
    echo Subiendo VIDEOS...
    echo open %FTP_HOST% > "%FTPSCRIPT%"
    echo %FTP_USER% >> "%FTPSCRIPT%"
    echo %FTP_PASS% >> "%FTPSCRIPT%"
    echo binary >> "%FTPSCRIPT%"
    echo cd %REMOTE_DIR% >> "%FTPSCRIPT%"
    echo mkdir VIDEOS >> "%FTPSCRIPT%"
    echo cd VIDEOS >> "%FTPSCRIPT%"
    echo lcd VIDEOS >> "%FTPSCRIPT%"
    echo mput * >> "%FTPSCRIPT%"
    echo cd .. >> "%FTPSCRIPT%"
    echo lcd .. >> "%FTPSCRIPT%"
    echo quit >> "%FTPSCRIPT%"
    ftp -s:"%FTPSCRIPT%"
)

:: Upload blog folder
if exist "blog" (
    echo Subiendo blog...
    echo open %FTP_HOST% > "%FTPSCRIPT%"
    echo %FTP_USER% >> "%FTPSCRIPT%"
    echo %FTP_PASS% >> "%FTPSCRIPT%"
    echo binary >> "%FTPSCRIPT%"
    echo cd %REMOTE_DIR% >> "%FTPSCRIPT%"
    echo mkdir blog >> "%FTPSCRIPT%"
    echo cd blog >> "%FTPSCRIPT%"
    echo lcd blog >> "%FTPSCRIPT%"
    echo mput * >> "%FTPSCRIPT%"
    echo cd .. >> "%FTPSCRIPT%"
    echo lcd .. >> "%FTPSCRIPT%"
    echo quit >> "%FTPSCRIPT%"
    ftp -s:"%FTPSCRIPT%"
)

echo.
echo [4/4] Limpiando archivos temporales...
del "%FTPSCRIPT%"

echo.
echo [COMPLETADO] El sitio web de UNHOLY ha sido subido a Hostinger.
pause
