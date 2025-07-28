# HireUp Deployment Guide

## Pre-deployment Checklist

✅ **Security & Privacy**
- [x] Removed all hardcoded sensitive data (email addresses, API keys, passwords)
- [x] All user credentials are now blank by default
- [x] Email template is provided as a helpful example
- [x] Resume upload functionality is secure and validated

## Environment Variables Required

Set these environment variables in your deployment platform:

```bash
# MongoDB Connection (for user authentication)
MONGO_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=https://your-domain.com
```

## Deployment Platforms

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `.next`

### Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will auto-detect Next.js and deploy

## User Setup Instructions

After deployment, users need to:

1. **Create an account** using the signup page
2. **Configure their profile**:
   - Enter their full name
   - Add their portfolio URL
   - Upload their resume (PDF, DOC, DOCX)
   - Enter their Gmail address
   - Create and enter their Gmail App Password
   - Add their skills (comma-separated)
   - Optionally customize the email template

3. **Gmail App Password Setup**:
   - Go to Google Account settings
   - Enable 2-factor authentication
   - Generate an App Password for "Mail"
   - Use the 16-character password in the app

## Features Available

- ✅ **Resume Upload & Attachment**: Upload resumes and automatically attach to emails
- ✅ **AI-Powered Personalization**: Generate personalized sentences based on job descriptions
- ✅ **Email Template System**: Use placeholders like `{resume}`, `{custom_sentence}`, etc.
- ✅ **Secure Email Sending**: Uses Gmail App Passwords for security
- ✅ **User Authentication**: Secure signup/login system
- ✅ **Application Pipeline**: Track and manage job applications

## Security Notes

- All user data is stored securely in MongoDB
- Passwords are hashed using bcrypt
- Gmail credentials are never stored, only used for sending emails
- Resume files are stored locally and not in the database
- No sensitive data is logged or exposed

## Support

For deployment issues, check:
1. Environment variables are properly set
2. MongoDB connection is working
3. Gmail App Password is correctly configured
4. File upload permissions are set correctly 