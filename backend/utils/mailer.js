const nodemailer = require('nodemailer');
require('dotenv').config(); // For accessing environment variables

// Create reusable transporter using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      // Your Gmail address
    pass: process.env.EMAIL_PASS,      // App-specific password or Gmail password
  },
});

// Send Mail Function
const sendMail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Contest Notifier" <${process.env.EMAIL_USER}>`,
      to,                      // email(s): string or array
      subject,
      html,                    // HTML body content
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

module.exports = sendMail;
