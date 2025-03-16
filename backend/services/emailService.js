// services/emailService.js
const nodemailer = require('nodemailer');

// Configure transporter using environment variables for security
const transporter = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.EMAIL, // your email from .env
    pass: process.env.EMAILAPPPASSWORD // your email app password from .env
  }
});

/**
 * Send an email.
 * @param {string} to Recipient email address.
 * @param {string} subject Email subject.
 * @param {string} html HTML content of the email.
 * @param {Array} attachments Optional attachments array.
 * @returns {Promise}
 */
function sendMail(to, subject, html, attachments = []) {
  return transporter.sendMail({
    to,
    subject,
    html,
    attachments
  });
}

module.exports = { sendMail };
