#!/bin/bash
# Send email with summary (mock mode: saves to file)

echo ""
echo "=================================================="
echo "📧 Email Sender"
echo "=================================================="
echo ""

SUMMARY_FILE="output/summary.txt"
OUTPUT_FILE="output/latest_summary.txt"

# Check if summary exists
if [ ! -f "$SUMMARY_FILE" ]; then
    echo "❌ Summary file not found: $SUMMARY_FILE"
    echo "   Run fetch_news.py and summarize.py first!"
    exit 1
fi

echo "📄 Found summary file: $SUMMARY_FILE"

# Check for email configuration
SMTP_HOST="${SMTP_HOST:-}"
EMAIL_TO="${EMAIL_TO:-}"

if [ -z "$SMTP_HOST" ] || [ -z "$EMAIL_TO" ]; then
    echo ""
    echo "🔄 Running in MOCK mode (no SMTP configured)"
    echo "   Set SMTP_HOST and EMAIL_TO to send real emails"
    echo ""
    
    # Mock mode: just copy the file
    cp "$SUMMARY_FILE" "$OUTPUT_FILE"
    
    echo "✓ Summary copied to: $OUTPUT_FILE"
    echo ""
    echo "📋 Content preview:"
    echo "--------------------------------------------------"
    head -n 10 "$SUMMARY_FILE"
    echo "--------------------------------------------------"
    echo ""
    echo "✓ Output saved successfully"
    
else
    echo ""
    echo "🌐 Running in REAL mode (sending email)"
    echo "   To: $EMAIL_TO"
    echo "   SMTP: $SMTP_HOST"
    echo ""
    
    # TODO: Implement real email sending
    # Example using sendmail or mail command:
    # 
    # SUBJECT="Daily News Summary - $(date +%Y-%m-%d)"
    # cat "$SUMMARY_FILE" | mail -s "$SUBJECT" "$EMAIL_TO"
    #
    # Or using Python with smtplib:
    # python3 -c "
    # import smtplib
    # from email.mime.text import MIMEText
    # 
    # with open('$SUMMARY_FILE', 'r') as f:
    #     content = f.read()
    # 
    # msg = MIMEText(content)
    # msg['Subject'] = 'Daily News Summary'
    # msg['From'] = '$SMTP_FROM'
    # msg['To'] = '$EMAIL_TO'
    # 
    # with smtplib.SMTP('$SMTP_HOST', $SMTP_PORT) as server:
    #     server.starttls()
    #     server.login('$SMTP_USER', '$SMTP_PASSWORD')
    #     server.send_message(msg)
    # "
    
    echo "⚠️  Real email sending not implemented yet"
    echo "   Falling back to file copy"
    cp "$SUMMARY_FILE" "$OUTPUT_FILE"
    echo "✓ Summary saved to: $OUTPUT_FILE"
fi

echo ""
echo "=================================================="
echo "✓ Email task completed"
echo "=================================================="
echo ""

exit 0
