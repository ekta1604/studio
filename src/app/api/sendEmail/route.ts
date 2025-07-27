import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { fromEmail, emailPassword, toEmail, body, company_name } = await req.json();

  if (!fromEmail || !emailPassword || !toEmail || !body || !company_name) {
    return NextResponse.json({ 
      success: false, 
      error: "Missing required fields: fromEmail, emailPassword, toEmail, body, or company_name" 
    }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: fromEmail,
      pass: emailPassword,
    },
  });

  const mailOptions = {
    from: fromEmail,
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
