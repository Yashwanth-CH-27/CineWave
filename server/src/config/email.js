
const nodemailer = require('nodemailer');

const {
  getWelcomeEmail,
  getLoginNotificationEmail,
  getPaymentConfirmationEmail,
} = require('../utils/emailTemplates');

let transporter = null;
let resendClient = null;

// Initialize email provider
async function initEmailTransporter() {
  const provider = process.env.EMAIL_PROVIDER || 'smtp';

  // Production: Resend API
  if (provider === 'resend') {
    try {
      const apiKey = process.env.RESEND_API_KEY;

      if (!apiKey) {
        throw new Error('RESEND_API_KEY is not configured');
      }

      // Dynamic import keeps compatibility with CommonJS
      const { Resend } = await import('resend');

      resendClient = new Resend(apiKey);

      console.log('[Email Service] Resend API configured successfully.');
      return;
    } catch (error) {
      console.error('[Email Service] Resend initialization failed:', error.message);
      resendClient = null;
      return;
    }
  }

  // Local development: Gmail SMTP
  try {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true';

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      console.warn('[Email Service] SMTP credentials missing.');
      return;
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.verify();

    console.log(`[Email Service] SMTP connected: ${host}:${port}`);
  } catch (error) {
    console.error('[Email Service] SMTP connection failed:', error.message);
    transporter = null;
  }
}

// Common email sending function
async function safeSendMail(to, subject, html) {
  try {
    const provider = process.env.EMAIL_PROVIDER || 'smtp';

    // Send using Resend
    if (provider === 'resend') {
      if (!resendClient) {
        await initEmailTransporter();
      }

      if (!resendClient) {
        return { success: false, error: 'Resend not configured' };
      }

      const { data, error } = await resendClient.emails.send({
        from: process.env.RESEND_FROM || 'CineWave <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log(`[Email Service] Email sent via Resend to: ${to}`);

      return {
        success: true,
        messageId: data?.id,
      };
    }

    // Send using Gmail SMTP
    if (!transporter) {
      await initEmailTransporter();
    }

    if (!transporter) {
      console.warn(`[Email Service] SMTP unavailable for ${to}`);
      return { success: false, error: 'SMTP not configured' };
    }

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log(`[Email Service] Email sent via SMTP to: ${to}`);

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    console.error(`[Email Service] Failed to send email to ${to}:`, error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}

// Welcome email
async function sendWelcomeEmail(user) {
  const { subject, html } = getWelcomeEmail(user.name, user.role);
  return safeSendMail(user.email, subject, html);
}

// Login notification
async function sendLoginAlertEmail(user, clientIp) {
  const { subject, html } = getLoginNotificationEmail(
    user.name,
    user.email,
    clientIp,
    new Date()
  );

  return safeSendMail(user.email, subject, html);
}

// Payment receipt
async function sendPaymentReceiptEmail(user, paymentDetails) {
  const { subject, html } = getPaymentConfirmationEmail(
    user.name,
    paymentDetails
  );

  return safeSendMail(user.email, subject, html);
}

module.exports = {
  initEmailTransporter,
  sendWelcomeEmail,
  sendLoginAlertEmail,
  sendPaymentReceiptEmail,
};
