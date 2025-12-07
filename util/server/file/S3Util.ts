import mime from "mime-types";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ErrorRequest } from "../../responseUtil";
import crypto from "crypto";
import { FileStoreModel } from "@/model/FileStore";
import mongoose from "mongoose";

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const BUCKET_REGION = process.env.R2_BUCKET_REGION || "auto";
const ACCESS_KEY = process.env.R2_ACCESS_KEY!;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const ENDPOINT = process.env.R2_ENDPOINT!;
const DEFAULT_FILES_ACL = ObjectCannedACL.bucket_owner_full_control;

class S3Util {
  private client: S3Client;

  public constructor({
    endpoint: ENDPOINT,
    credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_ACCESS_KEY },
  }: {
    endpoint: string;
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
  }) {
    try {
      this.client = new S3Client({
        endpoint: ENDPOINT,
        region: BUCKET_REGION,
        credentials: {
          accessKeyId: ACCESS_KEY,
          secretAccessKey: SECRET_ACCESS_KEY,
        },
      });
    } catch (err) {
      console.error("Error initializing S3 client:", err);
      throw new ErrorRequest("Failed to initialize S3 client", 500);
    }
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

  // public async getObjectUrls(fileKey: string[]): Promise<string[]> {
  //   const url = Promise.all(fileKey.map((fileKey) => this.getObjectUrl(fileKey)));
  //   return url;
  // }

  public async uploadFile(
    fileKey: string,
    file: File,
    ACL?: ObjectCannedACL,
    mimeType?: string,
    session?: mongoose.ClientSession
  ): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    // use sharp to reize the image if needed
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: mimeType || mime.lookup(file.name) || "image/jpeg",
      ACL: ACL || DEFAULT_FILES_ACL,
    });
    await FileStoreModel.updateOne(
      { key: fileKey },
      { $inc: { refCount: 1 } },
      { upsert: true, session }
    ).exec();
    console.log("Going to upload a image ", fileKey);
    const response = await this.client.send(command);
    console.log("debugger : Uploaded : ", fileKey);

    return fileKey;
  }

  async deleteFile(fileKey: string, session?: mongoose.ClientSession) {
    const fileRecord = await FileStoreModel.findOneAndUpdate(
      { key: fileKey },
      { $inc: { refCount: -1 } },
      { session, new: true }
    ).exec();
    console.log("Going to delete a image ", fileKey);
    if (fileRecord && fileRecord.refCount <= 0) {
      await FileStoreModel.deleteOne({ key: fileKey }, { session }).exec();
      console.log(`FileStore record for ${fileKey} deleted`);
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
      });
      console.log(`${fileKey} deleted`);
      await this.client.send(command);
    }
  }

  // async uploadFiles(files: File | File[]): Promise<string[] | string> {
  //   try {
  //     if (Array.isArray(files)) {
  //       const fileKeys = await Promise.all(files.map(async (file) => this.uploadFile(file)));
  //       return fileKeys;
  //     }

  //     const fileKey = await this.uploadFile(files);
  //     return fileKey;
  //   } catch (err) {
  //     console.error(err);
  //     throw new ErrorRequest("Cannot delete the files", 543);
  //   }
  // }

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

const R2API = new S3Util({
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export default R2API;
