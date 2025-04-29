require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ADDRESS, 
    pass: process.env.GMAIL_PASSWORD, 
  },
});

async function sendWithGmail({ to, subject, text, html }) {
  await transporter.sendMail({
    from: process.env.GMAIL_ADDRESS,
    to,
    subject,
    text,
    html,
  });
}

module.exports = sendWithGmail;
