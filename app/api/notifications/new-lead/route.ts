/**
 * NEW LEAD NOTIFICATION API
 * Sends notifications when a new lead is detected
 */

import { NextRequest, NextResponse } from 'next/server';

type LeadNotificationData = {
  engagementScore?: number;
  [key: string]: unknown;
};

type NewLeadRequestBody = {
  visitorId?: string;
  conversionType?: string;
  data?: unknown;
  type?: string;
};

type LeadNotification = {
  type: string;
  visitorId?: string;
  conversionType: string;
  timestamp: string;
  data?: LeadNotificationData;
  priority: 'low' | 'medium' | 'high';
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as NewLeadRequestBody;
    const visitorId = typeof body.visitorId === 'string' ? body.visitorId : undefined;
    const conversionType = typeof body.conversionType === 'string' ? body.conversionType : '';
    const type = typeof body.type === 'string' ? body.type : undefined;
    const data: LeadNotificationData | undefined = isRecord(body.data)
      ? (body.data as LeadNotificationData)
      : undefined;

    // Prepare notification data
    const notification: LeadNotification = {
      type: type || 'new_lead',
      visitorId,
      conversionType,
      timestamp: new Date().toISOString(),
      data,
      priority: determinePriority(conversionType, data),
    };

    // Send notification via multiple channels
    const notifications = await Promise.allSettled([
      sendEmailNotification(notification),
      sendSlackNotification(notification),
      sendSMSNotification(notification), // For high-priority leads
      updateDashboard(notification),
    ]);

    // Log results
    console.log('Notifications sent:', {
      email: notifications[0].status,
      slack: notifications[1].status,
      sms: notifications[2].status,
      dashboard: notifications[3].status,
    });

    return NextResponse.json({ 
      success: true,
      notifications: {
        email: notifications[0].status === 'fulfilled',
        slack: notifications[1].status === 'fulfilled',
        sms: notifications[2].status === 'fulfilled',
        dashboard: notifications[3].status === 'fulfilled',
      },
    });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

function determinePriority(
  conversionType: string,
  data?: LeadNotificationData
): 'low' | 'medium' | 'high' {
  if (conversionType === 'form_submit' || conversionType === 'cta_click') {
    return 'high';
  }
  if (typeof data?.engagementScore === 'number' && data.engagementScore > 70) {
    return 'high';
  }
  if (conversionType === 'offer_chat' || conversionType === 'offer_consultation') {
    return 'medium';
  }
  return 'low';
}

async function sendEmailNotification(notification: LeadNotification) {
  // TODO: Implement email notification (SendGrid, Mailgun, etc.)
  const emailService = process.env.EMAIL_SERVICE_URL;
  
  if (!emailService) {
    console.log('Email notification (mock):', notification);
    return;
  }

  try {
    await fetch(emailService, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: process.env.NOTIFICATION_EMAIL || 'admin@emersoneims.com',
        subject: `New Lead: ${notification.conversionType}`,
        html: generateEmailHTML(notification),
      }),
    });
  } catch (error) {
    console.warn('Email notification failed:', error);
    throw error;
  }
}

async function sendSlackNotification(notification: LeadNotification) {
  const slackWebhook = process.env.SLACK_WEBHOOK_URL;
  
  if (!slackWebhook) {
    console.log('Slack notification (mock):', notification);
    return;
  }

  try {
    await fetch(slackWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🔥 New Lead Detected!`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🔥 New Lead Detected!',
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Type:* ${notification.conversionType}`,
              },
              {
                type: 'mrkdwn',
                text: `*Priority:* ${notification.priority}`,
              },
              {
                type: 'mrkdwn',
                text: `*Visitor ID:* ${notification.visitorId}`,
              },
              {
                type: 'mrkdwn',
                text: `*Time:* ${new Date(notification.timestamp).toLocaleString()}`,
              },
            ],
          },
        ],
      }),
    });
  } catch (error) {
    console.warn('Slack notification failed:', error);
    throw error;
  }
}

async function sendSMSNotification(notification: LeadNotification) {
  // Only send SMS for high-priority leads
  if (notification.priority !== 'high') {
    return;
  }

  const smsService = process.env.SMS_SERVICE_URL;
  
  if (!smsService) {
    console.log('SMS notification (mock):', notification);
    return;
  }

  try {
    await fetch(smsService, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: process.env.NOTIFICATION_PHONE || '',
        message: `🔥 Hot Lead Alert: ${notification.conversionType} - Visitor ${notification.visitorId}`,
      }),
    });
  } catch (error) {
    console.warn('SMS notification failed:', error);
    throw error;
  }
}

async function updateDashboard(notification: LeadNotification) {
  // TODO: Update real-time dashboard via WebSocket or Server-Sent Events
  // For now, we'll just log it
  console.log('Dashboard update:', notification);
}

function generateEmailHTML(notification: LeadNotification): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .header { background: #0066cc; color: white; padding: 20px; }
        .content { padding: 20px; }
        .footer { background: #f5f5f5; padding: 10px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>🔥 New Lead Detected!</h2>
      </div>
      <div class="content">
        <p><strong>Type:</strong> ${notification.conversionType}</p>
        <p><strong>Priority:</strong> ${notification.priority}</p>
        <p><strong>Visitor ID:</strong> ${notification.visitorId}</p>
        <p><strong>Time:</strong> ${new Date(notification.timestamp).toLocaleString()}</p>
        <p><strong>Details:</strong></p>
        <pre>${JSON.stringify(notification.data, null, 2)}</pre>
      </div>
      <div class="footer">
        <p>This is an automated notification from Emerson EIMS Analytics System.</p>
      </div>
    </body>
    </html>
  `;
}

