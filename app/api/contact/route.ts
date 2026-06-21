/**
 * CONTACT FORM API ENDPOINT
 * Handles lead capture from CTAForm and other contact forms
 * Sends notifications to sales team via email and SMS
 *
 * @copyright 2026 EmersonEIMS
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPostgresPool } from '@/lib/db';
import { timingSafeEqual } from 'crypto';
import nodemailer from 'nodemailer';

// Sales team notification settings
const SALES_EMAIL = process.env.SALES_EMAIL || 'emersoneimservices@gmail.com';
// Team mailboxes that receive lead alerts sent from EmersonEIMS's OWN mail
// server (mail.emersoneims.com). Override with LEAD_RECIPIENTS (comma-separated).
const LEAD_RECIPIENTS = (process.env.LEAD_RECIPIENTS || 'info@emersoneims.com,sally@emersoneims.com')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Friendly labels for the service field, shared by every email channel.
const SERVICE_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  generators: 'Generators',
  solar: 'Solar Energy',
  ups: 'UPS Systems',
  automation: 'Controls & Automation',
  pumps: 'Borehole & Water Systems',
  incinerators: 'Incinerators',
  motors: 'Motor Rewinding & Repair',
  hvac: 'HVAC & Air Conditioning',
  highvoltage: 'High Voltage Infrastructure',
  fabrication: 'Steel Fabrication',
};

// Friendly label for a service key — falls back to the raw value (Title-cased)
// so an unmapped key never renders as "undefined" in a lead alert.
function serviceLabel(service?: string): string {
  const key = service || 'general';
  return SERVICE_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);
}
// Real EmersonEIMS business line — used for SMS/WhatsApp sales alerts AND as the
// public WhatsApp fallback returned to the browser. Was previously a placeholder
// (+254768860665) that delivered alerts nowhere.
const SALES_PHONE = process.env.SALES_PHONE || '+254768860665';
// Digits-only WhatsApp number a visitor can message directly if server-side
// delivery is not configured — guarantees a lead is never silently lost.
const BUSINESS_WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254768860665').replace(/[^0-9]/g, '');

/**
 * Build a wa.me deep link with the enquiry pre-filled, so the front-end can
 * always offer a one-tap WhatsApp path to the business regardless of whether
 * email/SMS/WhatsApp-API channels are configured on the server.
 */
function buildWhatsAppFallback(data: ContactFormData): string {
  const lines = [
    `Hello EmersonEIMS, I'm ${data.name}.`,
    data.company ? `Company: ${data.company}` : '',
    data.service && data.service !== 'general' ? `Service: ${data.service}` : '',
    data.location ? `Location: ${data.location}` : '',
    '',
    data.message,
  ].filter(Boolean);
  return `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Verify admin authorization for protected endpoints
 * Uses timing-safe comparison to prevent timing attacks
 */
function verifyAdminAuth(request: NextRequest): { authorized: boolean; error?: string } {
  const adminKey = process.env.ADMIN_API_KEY;

  // If no admin key configured, deny all admin access in production
  if (!adminKey) {
    if (process.env.NODE_ENV === 'production') {
      return { authorized: false, error: 'Admin access not configured' };
    }
    // Allow in development without key
    return { authorized: true };
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, error: 'Authorization header required' };
  }

  const providedKey = authHeader.slice(7).trim();
  if (!providedKey) {
    return { authorized: false, error: 'API key required' };
  }

  // Timing-safe comparison
  const providedBuf = Buffer.from(providedKey, 'utf8');
  const adminBuf = Buffer.from(adminKey, 'utf8');

  if (providedBuf.length !== adminBuf.length) {
    return { authorized: false, error: 'Invalid API key' };
  }

  if (!timingSafeEqual(providedBuf, adminBuf)) {
    return { authorized: false, error: 'Invalid API key' };
  }

  return { authorized: true };
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service?: string;
  source?: string; // Which page the form was submitted from
  location?: string; // For location-specific pages
}

/**
 * Geolocation derived server-side from edge headers — never trusted from the
 * client. Vercel populates these on every request at no cost. We also accept the
 * generic Cloudflare / common-proxy header names so this keeps working if the
 * site ever moves off Vercel. `region` is the first-level subdivision, which for
 * Kenya is the county. Mirrors the helper in /api/analytics/collect.
 */
function clientGeoFromHeaders(request: NextRequest): {
  country: string;
  region: string;
  city: string;
} {
  const h = request.headers;
  const country = (
    h.get('x-vercel-ip-country') || h.get('cf-ipcountry') || h.get('x-geo-country') || ''
  ).trim();
  const region = (
    h.get('x-vercel-ip-country-region') ||
    h.get('x-geo-region') ||
    h.get('cf-region') ||
    ''
  ).trim();
  const city = (
    h.get('x-vercel-ip-city') || h.get('cf-ipcity') || h.get('x-geo-city') || ''
  ).trim();
  return { country, region, city };
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Length caps to prevent abuse / log flooding / DB bloat. These are well
    // above any normal contact-form input but block payloads designed to
    // exhaust storage or downstream notification services.
    const tooLong =
      (body.name && body.name.length > 200) ||
      (body.email && body.email.length > 320) ||
      (body.phone && body.phone.length > 40) ||
      (body.company && body.company.length > 200) ||
      (body.message && body.message.length > 5000) ||
      (body.service && body.service.length > 80) ||
      (body.source && body.source.length > 200) ||
      (body.location && body.location.length > 200);
    if (tooLong) {
      return NextResponse.json(
        { success: false, error: 'One or more fields exceed the maximum length' },
        { status: 413 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get user's IP and location info from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const userAgent = request.headers.get('user-agent');
    const referer = request.headers.get('referer');

    // Store lead in database
    const leadId = await storeLead({
      ...body,
      ip: forwardedFor || 'unknown',
      userAgent: userAgent || 'unknown',
      referer: referer || 'direct',
    });

    // Server-side geo from edge headers — attached to the durable Sheet lead.
    const geo = clientGeoFromHeaders(request);

    // Fire every configured delivery channel and record which actually worked.
    // We run them in parallel so a slow provider can't delay the response.
    const [smtpOk, emailOk, smsOk, whatsappOk, webhookOk, formSubmitOk, erpOk, sheetOk] = await Promise.all([
      sendSmtpNotification(body, leadId),
      sendEmailNotification(body, leadId),
      body.phone ? sendSMSNotification(body) : Promise.resolve(false),
      sendWhatsAppNotification(body),
      sendWebhookNotification(body, leadId),
      sendFormSubmitNotification(body, leadId),
      sendErpQuoteRequest(body),
      sendSheetLead(body, geo, leadId),
    ]);

    const dbStored = leadId > 0;
    const delivered = dbStored || smtpOk || emailOk || smsOk || whatsappOk || webhookOk || formSubmitOk || erpOk || sheetOk;

    // The browser ALWAYS gets a working WhatsApp deep link so a visitor can
    // reach us directly even if no server channel is configured.
    const whatsappFallback = buildWhatsAppFallback(body);

    if (!delivered) {
      // Nothing durable happened — log loudly so this surfaces in monitoring,
      // and tell the client to push the visitor to the WhatsApp fallback.
      console.error(
        '🚨 LEAD NOT DELIVERED — no DB and no channel succeeded. The free FormSubmit ' +
        'channel needs a ONE-TIME "Activate Form" click in the ' + SALES_EMAIL + ' inbox. ' +
        'Or set RESEND_API_KEY, LEAD_WEBHOOK_URL, AFRICASTALKING_* or WHATSAPP_* in the environment. Lead:',
        { name: body.name, email: body.email, phone: body.phone, service: body.service }
      );
    }

    return NextResponse.json({
      success: true,
      delivered,
      message: delivered
        ? 'Thank you! Our team will contact you within 2 hours.'
        : 'Thank you! For the fastest response, message us directly on WhatsApp.',
      leadId,
      whatsappFallback,
      phone: SALES_PHONE,
      email: SALES_EMAIL,
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}

// Store lead in database
async function storeLead(data: ContactFormData & { ip: string; userAgent: string; referer: string }): Promise<number> {
  try {
    const pool = await getPostgresPool();
    if (!pool) {
      console.log('📝 Lead (logged only - no DB):', data);
      return 0;
    }

    // Create leads table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        message TEXT NOT NULL,
        service VARCHAR(50) DEFAULT 'general',
        source VARCHAR(100) DEFAULT 'contact_form',
        location VARCHAR(255),
        ip_address VARCHAR(45),
        user_agent TEXT,
        referer TEXT,
        status VARCHAR(20) DEFAULT 'new',
        assigned_to VARCHAR(255),
        notes TEXT,
        first_contacted_at TIMESTAMP WITH TIME ZONE,
        last_contacted_at TIMESTAMP WITH TIME ZONE,
        converted_at TIMESTAMP WITH TIME ZONE,
        estimated_value DECIMAL(12, 2),
        actual_value DECIMAL(12, 2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const result = await pool.query(`
      INSERT INTO leads (
        name, email, phone, company, message, service,
        source, location, ip_address, user_agent, referer,
        status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'new', NOW())
      RETURNING id
    `, [
      data.name,
      data.email,
      data.phone || null,
      data.company || null,
      data.message,
      data.service || 'general',
      data.source || 'contact_form',
      data.location || null,
      data.ip,
      data.userAgent,
      data.referer
    ]);

    const id = result.rows[0]?.id;
    return id ? Number(id) : 0;
  } catch (error) {
    console.error('Failed to store lead:', error);
    // Continue even if DB fails - we still want to send notifications
    return 0;
  }
}

// Shared branded HTML for lead-alert emails (used by both the SMTP own-server
// channel and the Resend channel).
function buildLeadEmailHtml(data: ContactFormData, leadId: number): string {
  return `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">🎯 New Lead Alert!</h1>
            </div>

            <div style="padding: 20px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-top: 0;">Contact Details</h2>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                    <a href="mailto:${data.email}">${data.email}</a>
                  </td>
                </tr>
                ${data.phone ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                    <a href="tel:${data.phone}">${data.phone}</a>
                  </td>
                </tr>
                ` : ''}
                ${data.company ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Company:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.company}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Service:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                    <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
                      ${serviceLabel(data.service)}
                    </span>
                  </td>
                </tr>
                ${data.location ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Location:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${data.location}</td>
                </tr>
                ` : ''}
              </table>

              <h3 style="color: #1f2937; margin-top: 20px;">Message:</h3>
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div style="padding: 20px; background: #1f2937; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                Lead ID: #${leadId} | Received: ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
              </p>
              <div style="margin-top: 15px;">
                ${data.phone ? `
                <a href="tel:${data.phone}" style="display: inline-block; background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 5px;">
                  📞 Call Now
                </a>
                <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 5px;">
                  💬 WhatsApp
                </a>
                ` : ''}
                <a href="mailto:${data.email}" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 5px;">
                  ✉️ Reply
                </a>
              </div>
            </div>
          </div>
        `;
}

// PRIMARY CHANNEL — send the lead alert from EmersonEIMS's OWN mail server
// (mail.emersoneims.com) via SMTP, e.g. from info@emersoneims.com to the team
// mailboxes (info@ + sally@). Requires SMTP_HOST/SMTP_USER/SMTP_PASSWORD set in
// Vercel. Returns true only if the server accepted the message.
async function sendSmtpNotification(data: ContactFormData, leadId: number): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    console.log('📧 SMTP (own mail server) not configured — set SMTP_HOST/SMTP_USER/SMTP_PASSWORD');
    return false;
  }

  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const fromEmail = process.env.SMTP_FROM_EMAIL || user;
  const fromName = process.env.SMTP_FROM_NAME || 'EmersonEIMS Website Leads';

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // SSL for 465, STARTTLS for 587
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: LEAD_RECIPIENTS.join(', '),
      replyTo: data.email, // team can reply straight to the customer
      subject: `🔥 NEW WEBSITE LEAD: ${data.name} — ${serviceLabel(data.service)}`,
      html: buildLeadEmailHtml(data, leadId),
      text:
        `NEW WEBSITE LEAD #${leadId || '-'}\n` +
        `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || '—'}\n` +
        `Company: ${data.company || '—'}\nService: ${data.service || 'general'}\n` +
        `Location: ${data.location || '—'}\nSource: ${data.source || 'contact_form'}\n\n${data.message}`,
    });
    return true;
  } catch (error) {
    console.error('Failed to send lead email via own SMTP server:', error);
    return false;
  }
}

// Send email notification to sales team via Resend. Returns true only if Resend accepted it.
async function sendEmailNotification(data: ContactFormData, leadId: number): Promise<boolean> {
  try {
    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log('📧 Email notification (Resend not configured):', {
        to: SALES_EMAIL,
        subject: `NEW LEAD: ${data.name} - ${serviceLabel(data.service)}`,
        leadId,
      });
      return false;
    }

    // Send via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EmersonEIMS Leads <leads@emersoneims.com>',
        to: SALES_EMAIL,
        subject: `🔥 NEW LEAD: ${data.name} - ${serviceLabel(data.service)}`,
        html: buildLeadEmailHtml(data, leadId),
      }),
    });

    if (!response.ok) {
      console.error('Failed to send email via Resend:', await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}

// Send SMS notification (using Africa's Talking or similar). Returns delivery status.
async function sendSMSNotification(data: ContactFormData): Promise<boolean> {
  try {
    // Use Africa's Talking API for SMS
    const africastalkingApiKey = process.env.AFRICASTALKING_API_KEY;
    const africastalkingUsername = process.env.AFRICASTALKING_USERNAME;

    if (!africastalkingApiKey || !africastalkingUsername) {
      console.log('SMS credentials not configured, skipping SMS notification');
      return false;
    }

    const message = `🔥 NEW LEAD!\nName: ${data.name}\nPhone: ${data.phone}\nService: ${data.service || 'General'}\n\nCall them NOW!`;

    const res = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'apiKey': africastalkingApiKey,
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        username: africastalkingUsername,
        to: SALES_PHONE,
        message: message,
      }),
    });
    return res.ok;
  } catch (error) {
    console.error('Failed to send SMS notification:', error);
    return false;
  }
}

// Send WhatsApp notification via WhatsApp Business API. Returns delivery status.
async function sendWhatsAppNotification(data: ContactFormData): Promise<boolean> {
  try {
    const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!whatsappToken || !whatsappPhoneId) {
      console.log('WhatsApp credentials not configured, skipping WhatsApp notification');
      return false;
    }

    const res = await fetch(`https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: SALES_PHONE.replace(/[^0-9]/g, ''),
        type: 'text',
        text: {
          body: `🔥 *NEW LEAD ALERT!*\n\n👤 *Name:* ${data.name}\n📧 *Email:* ${data.email}\n📱 *Phone:* ${data.phone || 'Not provided'}\n🏢 *Company:* ${data.company || 'Not provided'}\n🔧 *Service:* ${data.service || 'General'}\n\n💬 *Message:*\n${data.message}\n\n⚡ Call them within 2 hours!`
        }
      }),
    });
    return res.ok;
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error);
    return false;
  }
}

// Send lead via FormSubmit.co — a FREE, no-account, no-API-key, no-env-var email
// relay. This is the DEFAULT always-on channel so leads reach the business inbox
// even when NOTHING is configured in Vercel. It works server-side as long as an
// Origin/Referer header is present (FormSubmit blocks raw file/script posts).
//
// ONE-TIME ACTIVATION: the first email FormSubmit ever sends to an address is an
// "Activate Form" link — click it once in that inbox and every future lead is
// delivered. Until activated, this returns false (success:"false") and the route
// falls back to the WhatsApp deep link, so no lead is ever lost.
async function sendFormSubmitNotification(data: ContactFormData, leadId: number): Promise<boolean> {
  try {
    const target = SALES_EMAIL; // defaults to emersoneimservices@gmail.com
    const serviceLabel = data.service || 'general';

    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(target)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Required: FormSubmit rejects posts without a referring web origin.
        'Origin': 'https://www.emersoneims.com',
        'Referer': 'https://www.emersoneims.com/contact',
      },
      body: JSON.stringify({
        _subject: `🔥 NEW WEBSITE LEAD #${leadId || '-'}: ${data.name} — ${serviceLabel}`,
        _template: 'table',
        // Setting the visitor's email as reply-to lets the team reply directly.
        _replyto: data.email,
        Name: data.name,
        Email: data.email,
        Phone: data.phone || '—',
        Company: data.company || '—',
        Service: serviceLabel,
        Location: data.location || '—',
        Source: data.source || 'contact_form',
        Message: data.message,
      }),
    });

    if (!res.ok) {
      console.error('FormSubmit relay HTTP error:', res.status, await res.text().catch(() => ''));
      return false;
    }

    const json = await res.json().catch(() => null) as { success?: string | boolean; message?: string } | null;
    const ok = !!json && (json.success === 'true' || json.success === true);
    if (!ok) {
      // Most common reason: the address hasn't been activated yet.
      console.warn(
        `FormSubmit not delivered for ${target} — click the "Activate Form" link emailed to that inbox once. Message:`,
        json?.message
      );
    }
    return ok;
  } catch (error) {
    console.error('Failed to send FormSubmit notification:', error);
    return false;
  }
}

// Send the enquiry to EmersonEIMS ERP PRO as a quote request. The ERP exposes
// POST /api/public/quote-request which registers the request and creates a DRAFT
// quotation held for authorization (CRM & Sales → Quote Requests). The ERP runs
// on the office LAN (port 8088), so the public site reaches it via a tunnel URL
// (e.g. cloudflared → https://…trycloudflare.com). Set the full public endpoint
// in ERP_QUOTE_ENDPOINT, e.g. https://eims-erp.trycloudflare.com/api/public/quote-request
// Returns true only if the ERP accepted the request.
async function sendErpQuoteRequest(data: ContactFormData): Promise<boolean> {
  const endpoint = process.env.ERP_QUOTE_ENDPOINT;
  if (!endpoint) {
    console.log('ERP_QUOTE_ENDPOINT not configured, skipping ERP quote-request');
    return false;
  }
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Matches the ERP contract: {name,email,phone,service,message,source}.
      // company/location are extra context the ERP can ignore safely.
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        company: data.company || '',
        service: data.service || 'general',
        message: data.message,
        location: data.location || '',
        source: data.source || 'website',
      }),
      // The tunnel can be slow/asleep — cap the wait so it never delays the reply.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error('ERP quote-request failed:', res.status, await res.text().catch(() => ''));
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to send ERP quote-request:', error);
    return false;
  }
}

// Send lead to a generic JSON webhook. This is the ZERO-COST, no-paid-API channel:
// point LEAD_WEBHOOK_URL at a Google Apps Script, Zapier/Make hook, or a
// Slack/Discord incoming webhook and leads arrive instantly with no provider
// account. Returns delivery status.
async function sendWebhookNotification(data: ContactFormData, leadId: number): Promise<boolean> {
  try {
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.log('LEAD_WEBHOOK_URL not configured, skipping webhook notification');
      return false;
    }

    const summary =
      `🔥 NEW LEAD #${leadId || '-'}\n` +
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || '—'}\n` +
      `Company: ${data.company || '—'}\nService: ${data.service || 'general'}\n` +
      `Location: ${data.location || '—'}\nSource: ${data.source || 'contact_form'}\n\n${data.message}`;

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // `text`/`content` cover Slack & Discord; the full object covers
      // Apps Script / Zapier / Make consumers.
      body: JSON.stringify({ text: summary, content: summary, lead: { leadId, ...data } }),
    });
    return res.ok;
  } catch (error) {
    console.error('Failed to send webhook notification:', error);
    return false;
  }
}

// DURABLE CHANNEL — append the lead as a row to a Google Sheet via the Apps Script
// web app. This is the free, laptop-independent datastore that records every
// enquiry even when no Postgres is configured. Set SHEET_WEBAPP_URL (the Apps
// Script /exec URL) and SHEET_TOKEN (shared secret) in Vercel. Payload matches the
// canonical contract section 2B. Never throws — returns res.ok or false.
async function sendSheetLead(
  data: ContactFormData,
  geo: { country: string; region: string; city: string },
  leadId: number
): Promise<boolean> {
  const url = process.env.SHEET_WEBAPP_URL;
  const token = process.env.SHEET_TOKEN;
  if (!url || !token) {
    console.log('📊 Google Sheet lead channel not configured — set SHEET_WEBAPP_URL/SHEET_TOKEN');
    return false;
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Apps Script /exec replies with a 302 to script.googleusercontent.com —
      // follow it so we read the real {"ok":true} response.
      redirect: 'follow',
      body: JSON.stringify({
        kind: 'lead',
        token,
        lead: {
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          company: data.company || '',
          service: data.service || 'general',
          message: data.message,
          source: data.source || 'contact_form',
          location: data.location || '',
          country: geo.country,
          region: geo.region,
          city: geo.city,
          received_at: new Date().toISOString(),
        },
      }),
      // Apps Script can be slow — cap the wait so it never delays the reply.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error('Google Sheet lead append failed:', res.status, await res.text().catch(() => ''));
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to append lead to Google Sheet:', error);
    return false;
  }
}

// GET endpoint to check lead status (for admin - requires authentication)
export async function GET(request: NextRequest) {
  // Verify admin authorization first
  const auth = verifyAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized' },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const leadId = searchParams.get('id');

  if (!leadId) {
    return NextResponse.json(
      { success: false, error: 'Lead ID required' },
      { status: 400 }
    );
  }

  // Validate leadId is a number to prevent injection
  if (!/^\d+$/.test(leadId)) {
    return NextResponse.json(
      { success: false, error: 'Invalid lead ID format' },
      { status: 400 }
    );
  }

  try {
    const pool = await getPostgresPool();
    if (!pool) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      );
    }

    const result = await pool.query(
      'SELECT * FROM leads WHERE id = $1',
      [leadId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lead: result.rows[0],
    });
  } catch (error) {
    console.error('Failed to fetch lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}
