// utils/sendEmail.ts
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';

// Email sending function
export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  // Configure SendGrid transport
  const transporter = nodemailer.createTransport(
    sgTransport({
      auth: {
        api_key: process.env.SENDGRID_API_KEY
      }
    })
  );

  // Email configuration
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  try {
    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}