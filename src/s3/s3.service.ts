import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:4566', 
      forcePathStyle: true, 
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });
    this.bucketName = 'mi-bucket-local'; 
  }

  async uploadFile(file: Express.Multer.File) {
    const filename = `${Date.now()}-${file.originalname}`;
    const uploadParams = {
      Bucket: this.bucketName,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));

    const fileUrl = `http://localhost:4566/${this.bucketName}/${filename}`; 
    const src = `${this.bucketName}/${filename}`; 
    return {
        fileUrl:fileUrl,
        src:src
    }

  }

  async listFiles() {
    const listParams = {
      Bucket: this.bucketName,
    };

    const data = await this.s3.send(new ListObjectsV2Command(listParams));
    if (data.Contents) {
      return data.Contents.map((file) => file.Key);
    } else {
      return [];
    }
  }
}
