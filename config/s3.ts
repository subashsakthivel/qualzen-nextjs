import { ObjectCannedACL } from "@aws-sdk/client-s3";

export const s3Config = {
  bucketName: String(process.env.S3_BUCKET_NAME),
  defaultRegion: String(process.env.DEFAULT_REGION),
  defaultFilesACL: ObjectCannedACL.public_read,
};
