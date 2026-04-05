#!/bin/bash
# ============================================================================
# EMERSONEIMS API SETUP SCRIPT
# Run this to add all required API keys to Vercel
# ============================================================================

echo "============================================"
echo "  EMERSONEIMS API SETUP"
echo "  This will add all required API keys"
echo "============================================"
echo ""

# Function to add env var
add_env() {
    local name=$1
    local description=$2
    local url=$3

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📌 $name"
    echo "   $description"
    if [ -n "$url" ]; then
        echo "   Get it: $url"
    fi
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    read -p "Enter value (or press Enter to skip): " value

    if [ -n "$value" ]; then
        echo "$value" | vercel env add "$name" production
        echo "✅ $name added!"
    else
        echo "⏭️  Skipped $name"
    fi
}

echo ""
echo "🌤️  WEATHER API"
echo "───────────────"
add_env "OPENWEATHERMAP_API_KEY" "Weather forecasts for solar/borehole analysis" "https://home.openweathermap.org/api_keys"

echo ""
echo "🤖 OPENAI API"
echo "─────────────"
add_env "OPENAI_API_KEY" "Image analysis, BOQ parsing, AI features" "https://platform.openai.com/api-keys"

echo ""
echo "💰 M-PESA DARAJA (Kenya Payments)"
echo "──────────────────────────────────"
add_env "MPESA_CONSUMER_KEY" "M-Pesa API Consumer Key" "https://developer.safaricom.co.ke/"
add_env "MPESA_CONSUMER_SECRET" "M-Pesa API Consumer Secret" ""
add_env "MPESA_PASSKEY" "Lipa Na M-Pesa Passkey" ""
add_env "MPESA_SHORTCODE" "Business shortcode (use 174379 for sandbox)" ""
add_env "MPESA_CALLBACK_URL" "Your callback URL (https://your-domain.com/api/payments/mpesa/callback)" ""

echo ""
echo "💳 FLUTTERWAVE (Cards, Mobile Money)"
echo "─────────────────────────────────────"
add_env "FLUTTERWAVE_PUBLIC_KEY" "Flutterwave Public Key" "https://dashboard.flutterwave.com/"
add_env "FLUTTERWAVE_SECRET_KEY" "Flutterwave Secret Key" ""

echo ""
echo "📧 EMAIL (SMTP)"
echo "───────────────"
add_env "SMTP_HOST" "SMTP server (smtp.gmail.com)" ""
add_env "SMTP_PORT" "SMTP port (587)" ""
add_env "SMTP_USER" "Email address" ""
add_env "SMTP_PASSWORD" "App password (not regular password)" "https://myaccount.google.com/apppasswords"

echo ""
echo "📱 SMS (Africa's Talking)"
echo "─────────────────────────"
add_env "AFRICASTALKING_API_KEY" "Africa's Talking API Key" "https://account.africastalking.com/"
add_env "AFRICASTALKING_USERNAME" "Username (sandbox for testing)" ""

echo ""
echo "============================================"
echo "  ✅ SETUP COMPLETE!"
echo "============================================"
echo ""
echo "To apply changes, redeploy your app:"
echo "  vercel --prod"
echo ""
echo "To view all environment variables:"
echo "  vercel env ls"
echo ""
