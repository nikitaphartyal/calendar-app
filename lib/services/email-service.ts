// lib/services/email-service.ts
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid';

// Create transporter using SendGrid transport
const transporter = nodemailer.createTransport(
  sgTransport({
    apiKey: process.env.SENDGRID_API_KEY!
  })
);

export async function sendPasswordResetEmail(
  to: string, 
  resetUrl: string
): Promise<void> {
  const emailFrom = process.env.EMAIL_FROM || 'noreply@yourapp.com';
  
  const mailOptions = {
    from: emailFrom,
    to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>You have requested to reset your password. Click the link below to reset:</p>
        <p><a href="${resetUrl}" style="color: #3B82F6;">Reset Your Password</a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <small>This link will expire in 1 hour.</small>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed', error);
    throw new Error('Failed to send password reset email');
  }
}