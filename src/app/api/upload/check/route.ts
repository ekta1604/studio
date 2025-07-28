import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');
    
    if (!fileName) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 });
    }

    const uploadsDir = join(process.cwd(), 'uploads');
    const filePath = join(uploadsDir, fileName);
    const fileExists = existsSync(filePath);

    return NextResponse.json({ 
      exists: fileExists,
      fileName: fileName
    });

  } catch (error) {
    console.error('File check error:', error);
    return NextResponse.json({ 
      error: 'Failed to check file' 
    }, { status: 500 });
  }
} 