import mime from "mime-types";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ErrorRequest } from "./responseUtil";
import crypto from "crypto";

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const BUCKET_REGION = process.env.S3_BUCKET_REGION!;
const ACCESS_KEY = process.env.S3_ACCESS_KEY!;
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY!;
const DEFAULT_FILES_ACL = ObjectCannedACL.bucket_owner_full_control;

export class S3Util {
  private static instance: S3Util;
  private client: S3Client;

  private constructor() {
    this.client = new S3Client({
      region: BUCKET_REGION,
      credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    });
  }

  public static getInstance(): S3Util {
    if (!S3Util.instance) {
      S3Util.instance = new S3Util();
    }
    return S3Util.instance;
  }

  private generateFileKey(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  public async getObjectUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });
    return url;
  }

  public async uploadFile(file: File, ACL?: ObjectCannedACL, mimeType?: string): Promise<string> {
    const fileKey = this.generateFileKey();
    const buffer = Buffer.from(await file.arrayBuffer());
    // use sharp to reize the image if needed
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: mimeType || mime.lookup(file.name) || "image/jpeg",
      ACL: ACL || DEFAULT_FILES_ACL,
    });
    console.log("Going to upload a image ", fileKey);
    await this.client.send(command);
    const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
    console.log(`${file.name} uploaded ${url}`);
    return fileKey;
  }

  async deleteFile(fileKey: string) {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });
    console.log(`${fileKey} deleted`);
    await this.client.send(command);
  }

  async uploadFiles(files: File | File[]): Promise<string[] | string> {
    try {
      if (Array.isArray(files)) {
        const fileKeys = await Promise.all(files.map(async (file) => this.uploadFile(file)));
        return fileKeys;
      }

      const fileKey = await this.uploadFile(files);
      return fileKey;
    } catch (err) {
      console.error(err);
      throw new ErrorRequest("Cannot delete the files", 543);
    }
  }

  async deleteFiles(fileKeys: string | string[]) {
    try {
      if (Array.isArray(fileKeys)) {
        const paths = await Promise.all(fileKeys.map(async (fileKey) => this.deleteFile(fileKey)));
        return paths;
      }

      const path = await this.deleteFile(fileKeys);
      return path;
    } catch (err) {
      console.error(err);
      throw new ErrorRequest("Cannot delete the files", 543);
    }
  }
}
