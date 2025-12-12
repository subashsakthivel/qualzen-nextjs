import { DataModelMap } from "@/model/server/data-model-mappings";
import DataAPI from "@/data/data-api";
import { tDataModels, zFilter } from "@/util/util-type";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { zModels } from "@/data/model-config";

const zGet = z.object({
  operation: z.enum(["GET_DATA", "GET_DATA_MANY", "GET_DATA_BY_ID"], {
    message: "Invalid Operation",
  }),
  request: z.object(
    {
      id: z.string().max(100),
      options: z
        .object({
          filter: z.union([zFilter, z.record(z.string().max(100), z.any())]),
          limit: z.number().min(10).max(50),
          page: z.number().min(1).max(1000),
          select: z.array(z.string().max(100)).max(10),
        })
        .partial(),
    },
    { message: "Not a valid request" }
  ),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model: modelName } = await params;
    const searchParams = request.nextUrl.searchParams;
    const operation = searchParams.get("operation") as string;
    const data = await auth.api.getSession();
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
    console.log(err);
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
    } else if (req.headers.get("Content-Type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      dataReq.operation = formData.get("operation") as string;
      dataReq.request = formData;
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
    } else if (req.headers.get("Content-Type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      const operation = formData.get("operation") as string;
      dataReq.operation = operation;
      dataReq.request = formData;
      dataReq.id = formData.get("id") as string;
      dataReq.updateQuery = JSON.parse(formData.get("updateQuery") as string);
      dataReq.queryFilter = JSON.parse(formData.get("queryFilter") as string);
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
