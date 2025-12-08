import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASS,
    },
  });

  interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }

  export async function sendEmail({ to, subject, text, html }: EmailOptions){
    try {
        const info = await transporter.sendMail({
          from: `"StepUp App" <${process.env.MAIL_USER}>`,
          to,
          subject,
          text,
          html,
        });
        console.log("Email sent:", info.messageId);
        return info;
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
  } 