/**
 * Email Notifications Service
 * Sends transactional emails via Resend
 */

type EmailTemplate = 'order_confirmation' | 'payment_success' | 'order_shipped' | 'order_delivered' | 'review_approved' | 'reset_password';

interface EmailData {
  to: string;
  template: EmailTemplate;
  data: Record<string, string | number | boolean>;
}

export async function sendEmail(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set. Email not sent.');
      return { success: false, error: 'Email service not configured' };
    }

    const html = generateEmailHTML(emailData.template, emailData.data);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'noreply@emersoneims.com',
        to: emailData.to,
        subject: getEmailSubject(emailData.template),
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (error: any) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

function getEmailSubject(template: EmailTemplate): string {
  const subjects: { [key in EmailTemplate]: string } = {
    order_confirmation: 'Order Confirmation - EMERSON EIMS',
    payment_success: 'Payment Received - EMERSON EIMS',
    order_shipped: 'Your Order Has Shipped - EMERSON EIMS',
    order_delivered: 'Order Delivered - EMERSON EIMS',
    review_approved: 'Your Review Has Been Approved - EMERSON EIMS',
    reset_password: 'Reset Your Password - EMERSON EIMS',
  };
  return subjects[template];
}

function generateEmailHTML(template: EmailTemplate, data: Record<string, string | number | boolean>): string {
  const baseStyle = `
    font-family: Arial, sans-serif;
    color: #333;
    line-height: 1.6;
    background-color: #f5f5f5;
    padding: 20px;
  `;

  const containerStyle = `
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  `;

  const headerStyle = `
    color: #D97706;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    border-bottom: 3px solid #D97706;
    padding-bottom: 15px;
  `;

  const buttonStyle = `
    background-color: #D97706;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
    display: inline-block;
    margin: 20px 0;
  `;

  switch (template) {
    case 'order_confirmation':
      return `
        <div style="${baseStyle}">
          <div style="${containerStyle}">
            <div style="${headerStyle}">Order Confirmed! ✅</div>
            <p>Hi ${data.customerName},</p>
            <p>Thank you for your order! We've received your order and it will be processed shortly.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #D97706; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Total Amount:</strong> KES ${data.total.toLocaleString()}</p>
              <p><strong>Shipping Location:</strong> ${data.shippingLocation}</p>
            </div>
            <p>You will receive a payment confirmation shortly. Your order will ship as soon as payment is confirmed.</p>
            <a href="${process.env.NEXTAUTH_URL || 'https://emersoneims.com'}/marketplace/orders" style="${buttonStyle}">
              Track Your Order
            </a>
            <p style="color: #999; font-size: 12px; margin-top: 40px;">
              Questions? Contact us at support@emersoneims.com
            </p>
          </div>
        </div>
      `;

    case 'payment_success':
      return `
        <div style="${baseStyle}">
          <div style="${containerStyle}">
            <div style="${headerStyle}">Payment Received! 💳</div>
            <p>Hi ${data.customerName},</p>
            <p>Your payment has been successfully processed.</p>
            <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #22c55e; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Amount Paid:</strong> KES ${data.amount}</p>
              <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            </div>
            <p>Your order is now being prepared for shipment. We'll notify you when it ships.</p>
            <a href="${process.env.NEXTAUTH_URL || 'https://emersoneims.com'}/marketplace/orders" style="${buttonStyle}">
              View Order Details
            </a>
          </div>
        </div>
      `;

    case 'order_shipped':
      return `
        <div style="${baseStyle}">
          <div style="${containerStyle}">
            <div style="${headerStyle}">Your Order Has Shipped! 🚚</div>
            <p>Hi ${data.customerName},</p>
            <p>Great news! Your order has been shipped.</p>
            <div style="background-color: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
              <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
            </div>
            <a href="${process.env.NEXTAUTH_URL || 'https://emersoneims.com'}/marketplace/orders" style="${buttonStyle}">
              Track Shipment
            </a>
          </div>
        </div>
      `;

    case 'order_delivered':
      return `
        <div style="${baseStyle}">
          <div style="${containerStyle}">
            <div style="${headerStyle}">Order Delivered! 📦</div>
            <p>Hi ${data.customerName},</p>
            <p>Your order has been delivered! We hope you enjoy your parts.</p>
            <p style="margin-top: 30px;">
              <strong>Share your experience:</strong> Your feedback helps us serve you better.
            </p>
            <a href="${process.env.NEXTAUTH_URL || 'https://emersoneims.com'}/marketplace/orders" style="${buttonStyle}">
              Leave a Review
            </a>
            <p style="color: #999; font-size: 12px; margin-top: 40px;">
              Questions? Contact us at support@emersoneims.com
            </p>
          </div>
        </div>
      `;

    case 'review_approved':
      return `
        <div style="${baseStyle}">
          <div style="${containerStyle}">
            <div style="${headerStyle}">Your Review Is Live! ⭐</div>
            <p>Hi ${data.customerName},</p>
            <p>Your review for <strong>${data.partName}</strong> has been approved and is now visible to other customers.</p>
            <p>Thank you for helping the community make informed decisions!</p>
            <a href="${process.env.NEXTAUTH_URL || 'https://emersoneims.com'}/marketplace/parts" style="${buttonStyle}">
              View Your Review
            </a>
          </div>
        </div>
      `;

    default:
      return `<div style="${containerStyle}"><p>Email template not found</p></div>`;
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  customerEmail: string,
  customerName: string,
  orderId: string,
  total: number,
  shippingLocation: string
) {
  return sendEmail({
    to: customerEmail,
    template: 'order_confirmation',
    data: { customerName, orderId, total, shippingLocation },
  });
}

/**
 * Send payment success email
 */
export async function sendPaymentSuccess(
  customerEmail: string,
  customerName: string,
  orderId: string,
  amount: number,
  transactionId: string
) {
  return sendEmail({
    to: customerEmail,
    template: 'payment_success',
    data: { customerName, orderId, amount, transactionId },
  });
}

/**
 * Send shipment notification
 */
export async function sendShipmentNotification(
  customerEmail: string,
  customerName: string,
  orderId: string,
  trackingNumber: string,
  estimatedDelivery: string
) {
  return sendEmail({
    to: customerEmail,
    template: 'order_shipped',
    data: { customerName, orderId, trackingNumber, estimatedDelivery },
  });
}

/**
 * Send delivery confirmation
 */
export async function sendDeliveryNotification(
  customerEmail: string,
  customerName: string,
  orderId: string
) {
  return sendEmail({
    to: customerEmail,
    template: 'order_delivered',
    data: { customerName, orderId },
  });
}

/**
 * Notify on review approval
 */
export async function sendReviewApprovalNotification(
  customerEmail: string,
  customerName: string,
  partName: string
) {
  return sendEmail({
    to: customerEmail,
    template: 'review_approved',
    data: { customerName, partName },
  });
}
