import { NextRequest, NextResponse } from "next/server";
import mime from "mime-types";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const bucketname = "qualzen-store";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest, res: NextResponse) {
  const form = await req.formData();
  const files = form.getAll("file") as File[];
  const client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  });
  const links: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop();
    const newFilename = Date.now() + "." + ext;
    const buffer = Buffer.from(await file.arrayBuffer());

    await client.send(
      new PutObjectCommand({
        Bucket: bucketname,
        Key: newFilename,
        Body: buffer,
        ACL: "public-read",
        ContentType: mime.lookup(file.name) || "image/jpeg",
      })
    );
    const link = `https://${bucketname}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }
  return NextResponse.json({ message: "fine", links }, { status: 200 });
}

export async function uploadImage(files: File[]) {
  const client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  });
  const links: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop();
    const newFilename = Date.now() + "." + ext;
    const buffer = Buffer.from(await file.arrayBuffer());

    await client.send(
      new PutObjectCommand({
        Bucket: bucketname,
        Key: newFilename,
        Body: buffer,
        ACL: "public-read",
        ContentType: mime.lookup(file.name) || "image/jpeg",
      })
    );
    const link = `https://${bucketname}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
    return links;
  }
}
