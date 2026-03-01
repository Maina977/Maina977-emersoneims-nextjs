/**
 * CONTACT FORM API ENDPOINT
 * Handles lead capture from CTAForm and other contact forms
 * Sends notifications to sales team via email and SMS
 *
 * @copyright 2026 EmersonEIMS
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPostgresPool } from '@/lib/db';

// Sales team notification settings
const SALES_EMAIL = process.env.SALES_EMAIL || 'sales@emersoneims.com';
const SALES_PHONE = process.env.SALES_PHONE || '+254720000000';

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

    // Send email notification to sales team
    await sendEmailNotification(body, leadId);

    // Send SMS notification for urgent leads (if phone provided)
    if (body.phone) {
      await sendSMSNotification(body);
    }

    // Send WhatsApp notification
    await sendWhatsAppNotification(body);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Our team will contact you within 2 hours.',
      leadId,
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

// Send email notification to sales team
async function sendEmailNotification(data: ContactFormData, leadId: number): Promise<void> {
  try {
    const serviceLabels: Record<string, string> = {
      'general': 'General Inquiry',
      'generators': 'Generators',
      'solar': 'Solar Energy',
      'ups': 'UPS Systems',
      'automation': 'Automation',
      'pumps': 'Pumps',
      'incinerators': 'Incinerators',
      'motors': 'Motors',
    };

    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log('📧 Email notification (Resend not configured):', {
        to: SALES_EMAIL,
        subject: `NEW LEAD: ${data.name} - ${serviceLabels[data.service || 'general']}`,
        leadId,
      });
      return;
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
        subject: `🔥 NEW LEAD: ${data.name} - ${serviceLabels[data.service || 'general']}`,
        html: `
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
                      ${serviceLabels[data.service || 'general']}
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
        `,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send email via Resend:', await response.text());
    }
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
}

// Send SMS notification (using Africa's Talking or similar)
async function sendSMSNotification(data: ContactFormData): Promise<void> {
  try {
    // Use Africa's Talking API for SMS
    const africastalkingApiKey = process.env.AFRICASTALKING_API_KEY;
    const africastalkingUsername = process.env.AFRICASTALKING_USERNAME;

    if (!africastalkingApiKey || !africastalkingUsername) {
      console.log('SMS credentials not configured, skipping SMS notification');
      return;
    }

    const message = `🔥 NEW LEAD!\nName: ${data.name}\nPhone: ${data.phone}\nService: ${data.service || 'General'}\n\nCall them NOW!`;

    await fetch('https://api.africastalking.com/version1/messaging', {
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
  } catch (error) {
    console.error('Failed to send SMS notification:', error);
  }
}

// Send WhatsApp notification via WhatsApp Business API
async function sendWhatsAppNotification(data: ContactFormData): Promise<void> {
  try {
    const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!whatsappToken || !whatsappPhoneId) {
      console.log('WhatsApp credentials not configured, skipping WhatsApp notification');
      return;
    }

    await fetch(`https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`, {
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
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error);
  }
}

// GET endpoint to check lead status (for admin)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const leadId = searchParams.get('id');

  if (!leadId) {
    return NextResponse.json(
      { success: false, error: 'Lead ID required' },
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
