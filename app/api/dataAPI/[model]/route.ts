import { DataModelMap } from "@/model/server/data-model-mappings";
import DataAPI from "@/data/data-api";
import { tDataModels, zFilter } from "@/util/util-type";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { tModels } from "@/data/model-config";
import { zGet } from "@/types/api-type";
import ObjectUtil from "@/util/ObjectUtil";
import { v4 as uuidv4 } from "uuid";
import { ClientError } from "@/lib/error-codes";
import { FileStoreModel } from "@/model/FileStore";
import R2API from "@/util/server/file/S3Util";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> },
) {
  try {
    const { model: modelName } = await params;
    const searchParams = request.nextUrl.searchParams;
    const operation = searchParams.get("operation") as string;
    const data = await auth.api.getSession(request);
    console.log("user", data?.user.username);
    const requestObj = {
      operation,
      request: JSON.parse(decodeURIComponent(searchParams.get("request") || "") || "{}"),
    };
    const safeObject = zGet.parse(requestObj);

    const responseData = await DataAPI.getData({
      modelName: modelName as tDataModels,
      ...safeObject,
    });
    return NextResponse.json({ message: "success", data: responseData }, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({
        message: err.message,
        staus: 400,
        error: err.issues.map((issue) => ({
          message: issue.message,
          path: issue.path.reduce((pre, curr) => String(pre) + "." + String(curr), ""),
        })),
        zodError: err,
      });
    }
    return NextResponse.json({
      error: "something went wrong",
      status: 500,
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
  try {
    const { model: modelName } = await params;
    const dataModel = DataModelMap[modelName as tDataModels];
    if (!dataModel) {
      throw new Error("Invalid request");
    }
    const dataReq = {
      modelName: modelName as tDataModels,
      operation: "",
      request: {},
    };

    if (!req.headers.get("Content-Type")?.includes("application/json")) {
      throw new Error("Unsupported content type");
    }
    const { data, operation } = await req.json();
    dataReq.operation = operation;
    dataReq.request = data;
    //todo : check if request and operation and modelName are valid with zod
    //tranformers
    if (dataModel.fileObjects?.length) {
      dataModel.fileObjects.forEach(async ({ path }) => {
        const currentValue = ObjectUtil.getValue({ obj: data, path });
        if (Array.isArray(currentValue)) {
          for (const fileKey of currentValue) {
            if (await R2API.isFileExists(fileKey)) {
              throw new ClientError("DUPLICATE_ENTRY", 400, `"${fileKey}" file already exists`);
            }
          }
        } else {
          if (await R2API.isFileExists(currentValue)) {
            throw new ClientError("DUPLICATE_ENTRY", 400, `"${currentValue}" file already exists`);
          }
        }
      });
    }

    const responseData = await DataAPI.saveData(dataReq);
    return NextResponse.json({ message: "success", data: responseData }, { status: 200 });
  } catch (err: any) {
    console.error("Post request Error :", err);
    if (err instanceof ClientError) {
      return NextResponse.json({ ...err.toJSon() }, { status: err.clientCode });
    }
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage, status: 500 }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
  try {
    const { model: modelName } = await params;
    const dataModel = DataModelMap[modelName as tDataModels];
    if (!dataModel) {
      throw new Error("Invalid request");
    }
    const dataReq = {
      modelName: modelName as tDataModels,
      operation: "",
      request: {},
      id: "",
      updateQuery: "",
      queryFilter: "",
    };

    if (req.headers.get("Content-Type")?.includes("application/json")) {
      const { data, operation } = await req.json();
      dataReq.operation = operation;
      dataReq.request = data;
    } else {
      throw new Error("Unsupported content type");
    }
    //todo : check if request and operation and modelName are valid
    const responseData = await DataAPI.updateData(dataReq);
    return NextResponse.json({ message: "success", data: responseData }, { status: 200 });
  } catch (err) {
    console.error("Patch request Error :", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage, status: 500 }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
  try {
    const { model: modelName } = await params;
    const dataModel = DataModelMap[modelName as tDataModels];
    if (!dataModel) {
      throw new Error("Invalid request");
    }
    const { operation, request } = await req.json();
    const responseData = await DataAPI.deleteData({
      modelName: modelName as tDataModels,
      operation,
      request,
    });
    return NextResponse.json({ message: "success", data: responseData }, { status: 200 });
  } catch (err) {
    console.error("Delete request Error :", err);
    const errorMessage =
      err instanceof ZodError ? err.issues : err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage, status: 500 }, { status: 500 });
  }
}
