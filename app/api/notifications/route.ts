/**
 * Notifications API - Email & SMS
 *
 * Email: Uses nodemailer with any SMTP provider
 * SMS: Uses Africa's Talking (popular in Kenya) or Twilio
 */

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface NotificationRequest {
  type: 'email' | 'sms' | 'both';
  to: string | string[];
  subject?: string;         // For email
  message: string;
  template?: 'quote' | 'payment' | 'report' | 'alert' | 'welcome';
  data?: Record<string, any>;
}

interface NotificationResponse {
  success: boolean;
  data?: {
    emailSent?: boolean;
    smsSent?: boolean;
    messageIds?: string[];
  };
  error?: string;
  configRequired?: boolean;
}

// Email templates
const EMAIL_TEMPLATES = {
  quote: (data: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #1f2937; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SolarGenius Pro</h1>
          <p>Your Solar Quote is Ready</p>
        </div>
        <div class="content">
          <h2>Hello ${data.customerName || 'Valued Customer'},</h2>
          <p>Your solar system quote has been generated successfully!</p>

          <div class="highlight">
            <h3>System Details:</h3>
            <ul>
              <li><strong>System Size:</strong> ${data.systemSize || 'N/A'} kWp</li>
              <li><strong>Annual Production:</strong> ${data.annualProduction || 'N/A'} kWh</li>
              <li><strong>Estimated Cost:</strong> KES ${data.estimatedCost?.toLocaleString() || 'N/A'}</li>
              <li><strong>Payback Period:</strong> ${data.paybackPeriod || 'N/A'} years</li>
            </ul>
          </div>

          <p>Download your detailed report or view online:</p>
          <a href="${data.reportUrl || '#'}" class="button">View Full Report</a>

          <p>Our solar experts are ready to assist you with installation planning and financing options.</p>
        </div>
        <div class="footer">
          <p>EmersonEIMS - Kenya's Leading Solar Solutions Provider</p>
          <p>Phone: +254 700 000 000 | Email: info@emersoneims.co.ke</p>
        </div>
      </div>
    </body>
    </html>
  `,

  payment: (data: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .success { background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 6px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Confirmed</h1>
        </div>
        <div class="content">
          <div class="success">
            <h2>Thank You!</h2>
            <p>Your payment of <strong>KES ${data.amount?.toLocaleString()}</strong> has been received.</p>
          </div>
          <p><strong>Transaction Reference:</strong> ${data.reference}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p>Your full solar system report is now available for download.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  report: (data: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Solar Report is Ready</h1>
        </div>
        <div class="content">
          <p>Hello ${data.customerName},</p>
          <p>Your comprehensive solar analysis report is ready for download.</p>
          <p><a href="${data.downloadUrl}" class="button">Download Report (PDF)</a></p>
          <p>Report includes:</p>
          <ul>
            <li>Detailed site analysis</li>
            <li>Equipment specifications</li>
            <li>Financial projections</li>
            <li>ROI calculations</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `,

  alert: (data: any) => `
    <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>Alert: ${data.title}</h2>
      <p>${data.message}</p>
      <p>Time: ${new Date().toISOString()}</p>
    </body>
    </html>
  `,

  welcome: (data: any) => `
    <html>
    <body style="font-family: Arial, sans-serif;">
      <h1>Welcome to SolarGenius Pro!</h1>
      <p>Hello ${data.name},</p>
      <p>Thank you for choosing EmersonEIMS for your solar needs.</p>
      <p>Start designing your solar system today!</p>
    </body>
    </html>
  `,
};

// Create email transporter
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// Send SMS via Africa's Talking
async function sendAfricasTalkingSMS(to: string[], message: string): Promise<boolean> {
  const apiKey = process.env.AFRICASTALKING_API_KEY;
  const username = process.env.AFRICASTALKING_USERNAME || 'sandbox';

  if (!apiKey) {
    console.log('[SMS] Africa\'s Talking not configured');
    return false;
  }

  const url = username === 'sandbox'
    ? 'https://api.sandbox.africastalking.com/version1/messaging'
    : 'https://api.africastalking.com/version1/messaging';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apiKey': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        username,
        to: to.join(','),
        message,
        from: process.env.AFRICASTALKING_SENDER_ID || '',
      }),
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();
    console.log('[SMS] Africa\'s Talking response:', data);

    return data.SMSMessageData?.Recipients?.length > 0;
  } catch (error) {
    console.error('[SMS] Africa\'s Talking error:', error);
    return false;
  }
}

// Send SMS via Twilio
async function sendTwilioSMS(to: string[], message: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.log('[SMS] Twilio not configured');
    return false;
  }

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  try {
    const results = await Promise.all(
      to.map(async (phone) => {
        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              To: phone,
              From: fromNumber,
              Body: message,
            }),
            signal: AbortSignal.timeout(10000),
          }
        );

        return response.ok;
      })
    );

    return results.every(r => r);
  } catch (error) {
    console.error('[SMS] Twilio error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: NotificationRequest = await request.json();
    const { type, to, subject, message, template, data } = body;

    // Validate input
    if (!type || !to || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, to, message' },
        { status: 400 }
      );
    }

    const recipients = Array.isArray(to) ? to : [to];
    const result: NotificationResponse = {
      success: true,
      data: {
        emailSent: false,
        smsSent: false,
        messageIds: [],
      },
    };

    // Send email
    if (type === 'email' || type === 'both') {
      const transporter = createTransporter();

      if (!transporter) {
        if (type === 'email') {
          return NextResponse.json(
            {
              success: false,
              error: 'Email not configured. Add SMTP_HOST, SMTP_USER, SMTP_PASSWORD to environment variables.',
              configRequired: true,
            },
            { status: 503 }
          );
        }
      } else {
        // Build email content
        let htmlContent = message;

        if (template && EMAIL_TEMPLATES[template]) {
          htmlContent = EMAIL_TEMPLATES[template](data || {});
        }

        try {
          const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'SolarGenius Pro'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
            to: recipients.join(', '),
            subject: subject || 'SolarGenius Pro Notification',
            html: htmlContent,
            text: message, // Plain text fallback
          });

          console.log(`[Email] Sent: ${info.messageId}`);
          result.data!.emailSent = true;
          result.data!.messageIds!.push(info.messageId);
        } catch (error) {
          console.error('[Email] Send error:', error);
          if (type === 'email') {
            return NextResponse.json(
              { success: false, error: 'Failed to send email' },
              { status: 500 }
            );
          }
        }
      }
    }

    // Send SMS
    if (type === 'sms' || type === 'both') {
      // Truncate SMS to 160 characters
      const smsMessage = message.length > 160 ? message.substring(0, 157) + '...' : message;

      // Try Africa's Talking first, then Twilio
      let smsSent = await sendAfricasTalkingSMS(recipients, smsMessage);

      if (!smsSent) {
        smsSent = await sendTwilioSMS(recipients, smsMessage);
      }

      result.data!.smsSent = smsSent;

      if (!smsSent && type === 'sms') {
        return NextResponse.json(
          {
            success: false,
            error: 'SMS not configured. Add AFRICASTALKING_API_KEY or TWILIO credentials to environment variables.',
            configRequired: true,
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Notifications] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Notification failed'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Health check / status endpoint
  const status = {
    email: {
      configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
      provider: process.env.SMTP_HOST?.includes('gmail') ? 'Gmail' :
                process.env.SMTP_HOST?.includes('sendgrid') ? 'SendGrid' :
                process.env.SMTP_HOST?.includes('mailgun') ? 'Mailgun' : 'Custom SMTP',
    },
    sms: {
      africasTalking: !!process.env.AFRICASTALKING_API_KEY,
      twilio: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    },
  };

  return NextResponse.json({
    success: true,
    data: status,
  });
}
