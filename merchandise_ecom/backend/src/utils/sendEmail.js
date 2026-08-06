import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '');

if (!emailUser || !emailPass) {
  console.error('Email configuration is invalid: EMAIL_USER and EMAIL_PASS must be set in backend/.env');
}

if (process.env.EMAIL_PASS && /\s/.test(process.env.EMAIL_PASS)) {
  console.warn('Email password contains whitespace. Whitespace is stripped automatically for Gmail app passwords.');
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : true,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

export const sendEmail = async (options) => {
  if (!emailUser || !emailPass) {
    console.error('Email configuration is invalid: EMAIL_USER and EMAIL_PASS must be set.');
    return null;
  }

  try {
    const mailOptions = {
      from: `"MerchStudio" <${emailUser}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.code === 'EAUTH') {
      console.error(
        'Email authentication failed. Verify EMAIL_USER and EMAIL_PASS, and if using Gmail ensure you have an app password enabled.'
      );
    }
  }
};
