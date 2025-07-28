import { NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';

export async function GET() {
  try {
    const files = await StorageService.getAllFiles();
    
    return NextResponse.json({
      success: true,
      fileCount: files.length,
      files: files.map(fileName => ({
        fileName,
        // Don't include file content for security
      }))
    });
  } catch (error) {
    console.error('Storage status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get storage status'
    }, { status: 500 });
  }
} 