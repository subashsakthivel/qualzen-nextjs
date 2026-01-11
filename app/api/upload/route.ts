import DataAPI from "@/data/data-api";
import { TProduct } from "@/schema/Product";
import R2API from "@/util/server/file/S3Util";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const requestJson = await request.json();
    const modelName = requestJson.modelName;
    const uploadUrls = await handleRequest(modelName, requestJson);
    return NextResponse.json({ message: "success", data: uploadUrls }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

async function handleRequest(modelName: string, request: any) {
  if (modelName === "product") {
    const data = (await DataAPI.getData({
      modelName: "product",
      operation: "GET_DATA_BY_ID_RAW",
      request: {
        options: {
          select: "images",
        },
        id: request.id!,
      },
    })) as TProduct;

    if (data && data.images) {
      const uploadUrls = await Promise.all(
        data.images.map((imageName) =>
          R2API.getUploadUrl(
            modelName,
            imageName,
            (request.fileType && request.contentType.startsWith("image")) ||
              request.fileType.startsWith("img")
              ? request.fileType
              : "img/jpg/jpeg/png/gif/image/jpeg"
          )
        )
      );

      return uploadUrls;
    }
  } else if (modelName === "category") {
    const data = await DataAPI.getData({
      modelName: "category",
      operation: "GET_DATA_BY_ID_RAW",
      request: {
        id: request.id!,
        options: {
          select: "image",
        },
      },
    });

    if (data && data.image) {
      return await R2API.getUploadUrl(
        modelName,
        data.image,
        request.fileType &&
          (request.fileType.startsWith("image") || request.fileType.startsWith("img"))
          ? request.fileType
          : "img/jpg/jpeg/png/gif/image/jpeg"
      );
    }
  }
  return [];
}
