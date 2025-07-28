// Storage configuration for different deployment environments
export interface FileData {
  buffer: Buffer;
  originalName: string;
  fileSize: number;
  mimeType: string;
}

// In-memory storage (temporary solution for deployment)
const fileStorage = new Map<string, FileData>();

export class StorageService {
  // Store file in memory
  static async storeFile(fileName: string, fileData: FileData): Promise<void> {
    fileStorage.set(fileName, fileData);
  }

  // Retrieve file from memory
  static async getFile(fileName: string): Promise<FileData | null> {
    return fileStorage.get(fileName) || null;
  }

  // Delete file from memory
  static async deleteFile(fileName: string): Promise<void> {
    fileStorage.delete(fileName);
  }

  // Check if file exists
  static async fileExists(fileName: string): Promise<boolean> {
    return fileStorage.has(fileName);
  }

  // Get all stored files (for debugging)
  static async getAllFiles(): Promise<string[]> {
    return Array.from(fileStorage.keys());
  }
}

// For production, you can implement cloud storage here
// Example with AWS S3, Google Cloud Storage, or similar:

/*
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export class CloudStorageService {
  private static s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  private static bucketName = process.env.AWS_S3_BUCKET!;

  static async storeFile(fileName: string, fileData: FileData): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileData.buffer,
      ContentType: fileData.mimeType,
      Metadata: {
        originalName: fileData.originalName,
        fileSize: fileData.fileSize.toString(),
      },
    });

    await this.s3Client.send(command);
  }

  static async getFile(fileName: string): Promise<FileData | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
      });

      const response = await this.s3Client.send(command);
      
      if (!response.Body) return null;

      const buffer = await response.Body.transformToByteArray();
      
      return {
        buffer: Buffer.from(buffer),
        originalName: response.Metadata?.originalName || fileName,
        fileSize: parseInt(response.Metadata?.fileSize || '0'),
        mimeType: response.ContentType || 'application/octet-stream',
      };
    } catch (error) {
      console.error('Error retrieving file from cloud storage:', error);
      return null;
    }
  }

  static async deleteFile(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    await this.s3Client.send(command);
  }

  static async fileExists(fileName: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }
}
*/ 