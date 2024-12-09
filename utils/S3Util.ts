import mime from "mime-types";
import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { s3Config } from "@/config/s3";
import { ErrorRequest } from "./responseUtil";

export class S3Util {
  private static instance: S3Util;
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: s3Config.defaultRegion,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
      },
    });
  }

  public static getInstance(): S3Util {
    if (!S3Util.instance) {
      S3Util.instance = new S3Util();
    }
    return S3Util.instance;
  }

  private generateFileKey(file: File, timestamp: number): string {
    console.log(file);
    return `${file.name}-${timestamp}.${file.name.split(".").pop()}`;
  }

  async uploadFile(file: File, ACL?: ObjectCannedACL) {
    const filekey = this.generateFileKey(file, Date.now());
    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: filekey,
      Body: buffer,
      ContentType: mime.lookup(file.name) || "image/jpeg",
      ACL: ACL || s3Config.defaultFilesACL,
    });

    await this.client.send(command);
    const url = `https://${s3Config.bucketName}.s3.amazonaws.com/${filekey}`;
    console.log(`${file.name} uploaded ${url}`);
    return url;
  }

  async deleteFile(url: string) {
    const command = new DeleteObjectCommand({
      Bucket: s3Config.bucketName,
      Key: url.split("s3.amazonaws.com/").pop(),
    });
    console.log(`${url} deleted`);
    await this.client.send(command);
  }

  async uploadFiles(files: File | File[]) {
    try {
      if (Array.isArray(files)) {
        const paths = await Promise.all(
          files.map(async (file) => this.uploadFile(file))
        );
        return paths;
      }

      const path = await this.uploadFile(files);
      return path;
    } catch (err) {
      console.error(err);
      throw new ErrorRequest("Cannot delete the files", 543);
    }
  }

  async deleteFiles(urls: string | string[]) {
    try {
      if (Array.isArray(urls)) {
        const paths = await Promise.all(
          urls.map(async (url) => this.deleteFile(url))
        );
        return paths;
      }

      const path = await this.deleteFile(urls);
      return path;
    } catch (err) {
      console.error(err);
      throw new ErrorRequest("Cannot delete the files", 543);
    }
  }
}
