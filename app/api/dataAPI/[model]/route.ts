import { DataModelMap } from "@/model/server/data-model-mappings";
import DataAPI from "@/data/data-api";
import { tDataModels, zFilter } from "@/util/util-type";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { tModels } from "@/data/model-config";
import { zGet } from "@/types/api-type";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
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
          path: issue.path.reduce((pre, curr) => pre + "." + curr, ""),
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

    if (req.headers.get("Content-Type")?.includes("application/json")) {
      const { data, operation } = await req.json();
      dataReq.operation = operation;
      dataReq.request = data;
    } else {
      throw new Error("Unsupported content type");
    }
    //todo : check if request and operation and modelName are valid with zod
    const responseData = await DataAPI.saveData(dataReq);
    return NextResponse.json({ message: "success", data: responseData }, { status: 200 });
  } catch (err) {
    console.error("Post request Error :", err);
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
      err instanceof ZodError ? err.errors : err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage, status: 500 }, { status: 500 });
  }
}
