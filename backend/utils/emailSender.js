const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, NODE_ENV } = require('../config/env');

// Sends an email. If no SMTP creds are configured, logs to console instead of failing,
// so the app remains fully runnable out of the box in development.
const sendEmail = async ({ to, subject, html }) => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log('--- EMAIL (dev mode, no SMTP configured) ---');
    console.log(`To: ${to}\nSubject: ${subject}\n${html}`);
    console.log('---------------------------------------------');
    return { simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    const info = await transporter.sendMail({ from: EMAIL_FROM, to, subject, html });
    return info;
  } catch (err) {
    console.error('Email send failed:', err.message);
    if (NODE_ENV !== 'production') return { simulated: true, error: err.message };
    throw err;
  }
};

module.exports = sendEmail;
