@echo off
REM Send email with summary (mock mode: saves to file)

echo.
echo ==================================================
echo Email Sender
echo ==================================================
echo.

set SUMMARY_FILE=output\summary.txt
set OUTPUT_FILE=output\latest_summary.txt

REM Check if summary exists
if not exist "%SUMMARY_FILE%" (
    echo [ERROR] Summary file not found: %SUMMARY_FILE%
    echo    Run fetch_news.py and summarize.py first!
    exit /b 1
)

echo [OK] Found summary file: %SUMMARY_FILE%

REM Check for email configuration
if "%SMTP_HOST%"=="" (
    echo.
    echo [MOCK] Running in MOCK mode ^(no SMTP configured^)
    echo    Set SMTP_HOST and EMAIL_TO to send real emails
    echo.
    
    REM Mock mode: just copy the file
    copy "%SUMMARY_FILE%" "%OUTPUT_FILE%" >nul
    
    echo [OK] Summary copied to: %OUTPUT_FILE%
    echo.
    echo Content preview:
    echo --------------------------------------------------
    type "%SUMMARY_FILE%"
    echo --------------------------------------------------
    echo.
    echo [OK] Output saved successfully
    
) else (
    echo.
    echo [REAL] Running in REAL mode ^(sending email^)
    echo    To: %EMAIL_TO%
    echo    SMTP: %SMTP_HOST%
    echo.
    
    REM TODO: Implement real email sending
    REM Example using PowerShell:
    REM powershell -Command "Send-MailMessage -From '%EMAIL_FROM%' -To '%EMAIL_TO%' -Subject 'Daily News Summary' -Body (Get-Content '%SUMMARY_FILE%' -Raw) -SmtpServer '%SMTP_HOST%'"
    
    echo [WARN] Real email sending not implemented yet
    echo    Falling back to file copy
    copy "%SUMMARY_FILE%" "%OUTPUT_FILE%" >nul
    echo [OK] Summary saved to: %OUTPUT_FILE%
)

echo.
echo ==================================================
echo [OK] Email task completed
echo ==================================================
echo.

exit /b 0
