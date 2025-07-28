import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { StorageService } from '../upload/route';

export async function POST(req: Request) {
  const { fromEmail, emailPassword, toEmail, body, company_name, resumeFileName } = await req.json();

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

  const mailOptions: any = {
    from: fromEmail,
    to: toEmail,
    subject: `Excited to Join ${company_name}'s Engineering Journey`,
    html: `<div>${body.replace(/\n/g, "<br>")}</div>`,
  };

  // Add resume attachment if provided
  if (resumeFileName) {
    try {
      const fileData = await StorageService.getFile(resumeFileName);
      if (fileData) {
        mailOptions.attachments = [{
          filename: fileData.originalName,
          content: fileData.buffer
        }];
      } else {
        console.warn(`Resume file not found in storage: ${resumeFileName}`);
        // Continue without attachment if file doesn't exist
      }
    } catch (error) {
      console.error('Error reading resume file:', error);
      // Continue without attachment if file can't be read
    }
  }

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Email sent!' });
  } catch (err) {
    console.error('Email sending error:', err);
    
    // Handle nodemailer specific errors
    let errorMessage = 'Failed to send email';
    if (err && typeof err === 'object') {
      if ('response' in err && typeof err.response === 'string') {
        errorMessage = err.response;
      } else if ('message' in err && typeof err.message === 'string') {
        errorMessage = err.message;
      } else if ('code' in err && typeof err.code === 'string') {
        errorMessage = `Email error (${err.code}): Please check your Gmail credentials and app password.`;
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
