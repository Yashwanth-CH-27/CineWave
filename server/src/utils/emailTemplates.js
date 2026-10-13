/**
 * CineWave HTML Email Templates
 */

const baseEmailWrapper = (contentTitle, bodyHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${contentTitle}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0b12;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #13131f;
      border: 1px solid #232338;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .header {
      background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
      padding: 30px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      letter-spacing: 1px;
      font-weight: 800;
    }
    .header p {
      margin: 6px 0 0;
      color: #f1f5f9;
      font-size: 14px;
      opacity: 0.9;
    }
    .body {
      padding: 32px 24px;
      line-height: 1.6;
      color: #cbd5e1;
    }
    .highlight-card {
      background-color: #1a1a2b;
      border-left: 4px solid #8b5cf6;
      padding: 16px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .btn {
      display: inline-block;
      padding: 12px 28px;
      background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      border-radius: 8px;
      margin: 20px 0;
    }
    .footer {
      padding: 20px 24px;
      background-color: #0d0d17;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #1e1e2f;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎬 CineWave</h1>
      <p>Next-Gen Entertainment & OTT Streaming</p>
    </div>
    <div class="body">
      ${bodyHtml}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} CineWave Platform. All rights reserved.</p>
      <p>This is an automated notification. For college demonstration purposes.</p>
    </div>
  </div>
</body>
</html>
`;

function getWelcomeEmail(userName, role) {
  return {
    subject: `🎬 Welcome to CineWave, ${userName}! Your stream begins now`,
    html: baseEmailWrapper(
      'Welcome to CineWave',
      `
      <h2 style="color: #ffffff; margin-top: 0;">Welcome aboard, ${userName}! 🍿</h2>
      <p>We're thrilled to have you join <strong>CineWave</strong>, the modern entertainment platform for movies, short films, and indie creator showcases.</p>
      
      <div class="highlight-card">
        <p style="margin: 0; color: #f8fafc;"><strong>Account Role:</strong> <span style="color: #a78bfa; text-transform: uppercase;">${role}</span></p>
        <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px;">
          ${
            role === 'CREATOR'
              ? '✨ As a Creator, you have access to the Creator Studio to upload, manage, edit, and track video views.'
              : '🎉 Explore trending movies, curate your personal Watchlist, and unlock VIP access with CineWave Premium.'
          }
        </p>
      </div>

      <p>Ready to discover breathtaking stories?</p>
      <center>
        <a href="http://localhost:5173" class="btn">Explore CineWave Now</a>
      </center>
      `
    ),
  };
}

function getLoginNotificationEmail(userName, userEmail, clientIp, timestamp) {
  const timeFormatted = new Date(timestamp || Date.now()).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return {
    subject: `Security Alert: Successful CineWave Sign-In`,
    html: baseEmailWrapper(
      'Security Alert - Sign In',
      `
      <h2 style="color: #ffffff; margin-top: 0;">Hello, ${userName} 👋</h2>
      <p>We noticed a successful sign-in to your CineWave account.</p>

      <div class="highlight-card">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Account:</td>
            <td style="color: #f1f5f9; font-weight: 600;">${userEmail}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Date & Time:</td>
            <td style="color: #f1f5f9; font-weight: 600;">${timeFormatted}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Origin:</td>
            <td style="color: #f1f5f9;">${clientIp || 'Web Client (Local)'}</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 13px; color: #94a3b8;">
        If this was you, you can safely ignore this notification. If you did not initiate this sign-in, please change your password immediately.
      </p>
      `
    ),
  };
}

function getPaymentConfirmationEmail(userName, paymentDetails) {
  const expiryFormatted = new Date(paymentDetails.subscriptionExpiry).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return {
    subject: `🎉 Payment Confirmed: Welcome to CineWave VIP Premium!`,
    html: baseEmailWrapper(
      'Payment Receipt - CineWave VIP',
      `
      <h2 style="color: #ffffff; margin-top: 0;">Payment Successful! 🌟</h2>
      <p>Congratulations <strong>${userName}</strong>, your payment has been processed and your CineWave <strong>VIP Premium Access</strong> is now activated!</p>

      <div class="highlight-card" style="border-left-color: #10b981;">
        <h3 style="margin-top: 0; color: #34d399; font-size: 16px;">Invoice & Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Plan:</td>
            <td style="color: #f1f5f9; font-weight: 600;">CineWave VIP Monthly (30 Days)</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Amount Paid:</td>
            <td style="color: #10b981; font-weight: 700; font-size: 16px;">₹${(
              paymentDetails.amount / 100
            ).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Payment ID:</td>
            <td style="color: #cbd5e1; font-family: monospace;">${paymentDetails.razorpayPaymentId}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Order ID:</td>
            <td style="color: #cbd5e1; font-family: monospace;">${paymentDetails.razorpayOrderId}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Active Until:</td>
            <td style="color: #f59e0b; font-weight: 600;">${expiryFormatted}</td>
          </tr>
        </table>
      </div>

      <p>You can now stream all exclusive Premium & VIP short films and movies with zero restrictions!</p>

      <center>
        <a href="http://localhost:5173" class="btn">Start Watching Premium Content</a>
      </center>
      `
    ),
  };
}

module.exports = {
  getWelcomeEmail,
  getLoginNotificationEmail,
  getPaymentConfirmationEmail,
};
