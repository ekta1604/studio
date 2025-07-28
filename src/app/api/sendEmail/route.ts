import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { readFile } from 'fs/promises';
import { join } from 'path';

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
      const uploadsDir = join(process.cwd(), 'uploads');
      const filePath = join(uploadsDir, resumeFileName);
      
      // Check if file exists before trying to read it
      const { existsSync } = await import('fs');
      if (!existsSync(filePath)) {
        console.warn(`Resume file not found: ${filePath}`);
        // Continue without attachment if file doesn't exist
      } else {
        const fileContent = await readFile(filePath);
        
        mailOptions.attachments = [{
          filename: resumeFileName,
          content: fileContent
        }];
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
