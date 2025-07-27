import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { toEmail, body, company_name } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ektapatel16042@gmail.com',
      pass: process.env.EMAIL_APP_PASSWORD, // 🔐 uses secure env var
    },
  });

  const mailOptions = {
    from: 'ektapatel16042@gmail.com',
    to: toEmail,
    subject: `Excited to Join ${company_name}'s Engineering Journey`,
    html: `<div>${body.replace(/\n/g, "<br>")}</div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Email sent!' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
