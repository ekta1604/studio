import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // Validate file name
    if (!file.name || file.name.trim() === '') {
      return NextResponse.json({ 
        error: 'Invalid file name.' 
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileName = `resume_${timestamp}.${fileExtension}`;

    // Convert file to buffer and store
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Store file using storage service
    await StorageService.storeFile(fileName, {
      buffer,
      originalName: file.name,
      fileSize: file.size,
      mimeType: file.type
    });

    return NextResponse.json({ 
      success: true, 
      fileName: fileName,
      originalName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file' 
    }, { status: 500 });
  }
}

// Export storage service for use in other API routes
export { StorageService }; 