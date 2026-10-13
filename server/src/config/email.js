const nodemailer = require('nodemailer');
const {
  getWelcomeEmail,
  getLoginNotificationEmail,
  getPaymentConfirmationEmail,
} = require('../utils/emailTemplates');

let transporter = null;

// Initialize Nodemailer Transporter (async — calls verify() to test connection)
async function initEmailTransporter() {
  try {
    const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true'; // false for port 587 STARTTLS, true for port 465 SSL
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      console.warn('[Email Service] ⚠️  SMTP_USER or SMTP_PASS not set — emails will be skipped.');
      return;
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify the connection so we get an error immediately if credentials are wrong
    await transporter.verify();
    console.log(`[Email Service] ✅ SMTP connected — ${host}:${port} (secure=${secure})`);
  } catch (error) {
    console.error('[Email Service] ❌ SMTP connection FAILED:', error.message);
    console.error('[Email Service] 🔧 Fix: Make sure Gmail 2-Step Verification is ON, then generate a fresh App Password at https://myaccount.google.com/apppasswords');
    transporter = null; // safeSendMail will skip gracefully when transporter is null
  }
}

// Send email non-blockingly — never crashes the user's login/signup flow
async function safeSendMail(to, subject, html) {
  try {
    if (!transporter) {
      await initEmailTransporter();
    }

    if (!transporter) {
      console.warn(`[Email Service] Skipping email to ${to} — transporter not available.`);
      return { success: false, error: 'SMTP not configured' };
    }

    const from = process.env.SMTP_FROM || '"CineWave OTT" <no-reply@cinewave.tv>';

    const info = await transporter.sendMail({ from, to, subject, html });

    console.log(`[Email Service] ✅ Email sent to: ${to} (ID: ${info.messageId})`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`[Email Service] 🔗 Ethereal preview: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`[Email Service] ⚠️  Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function sendWelcomeEmail(user) {
  const { subject, html } = getWelcomeEmail(user.name, user.role);
  return safeSendMail(user.email, subject, html);
}

async function sendLoginAlertEmail(user, clientIp) {
  const { subject, html } = getLoginNotificationEmail(user.name, user.email, clientIp, new Date());
  return safeSendMail(user.email, subject, html);
}

async function sendPaymentReceiptEmail(user, paymentDetails) {
  const { subject, html } = getPaymentConfirmationEmail(user.name, paymentDetails);
  return safeSendMail(user.email, subject, html);
}

module.exports = {
  initEmailTransporter,
  sendWelcomeEmail,
  sendLoginAlertEmail,
  sendPaymentReceiptEmail,
};
