import DataAPI from "@/data/data-api";
import { TProduct } from "@/schema/Product";
import R2API from "@/util/server/file/S3Util";
import { tDataModels } from "@/util/util-type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const requestJson = await request.json();
    const modelName = requestJson.modelName;
    const uploadUrls = await handleRequest(modelName, requestJson);
    return NextResponse.json({ message: "sucess", data: uploadUrls }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

async function handleRequest(modelName: string, request: any) {
  if (modelName === "prouct") {
    const imageNames = (await DataAPI.getData({
      modelName: modelName as tDataModels,
      operation: "GET_DATA_BY_ID",
      request: {
        options: {
          select: "_id images",
        },
        id: request.id!,
      },
    })) as TProduct["images"];
    if (imageNames) {
      const uploadUrls = imageNames.map(
        async (imageName) => await R2API.getUploadUrl(modelName, imageName, "img/jpg/jpeg/png/gif")
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
    console.log("upload : ", data, modelName);
    if (data && data.image) {
      return await R2API.getUploadUrl(modelName, data.image, "img/jpg/jpeg/png/gif");
    }
  }
  return [];
}
