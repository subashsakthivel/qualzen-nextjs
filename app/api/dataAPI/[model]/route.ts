import { authOptions } from "@/lib/authOptions";
import { DataModelMap } from "@/model/server/data-model-mappings";
import DataAPI from "@/util/server/data-util";
import { tDataModels } from "@/util/util-type";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model: modelName } = await params;
    const searchParams = request.nextUrl.searchParams;
    const dataModel = DataModelMap[modelName as tDataModels];
    const operation = searchParams.get("operation");
    if (!operation || !dataModel) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
    const requestObj = JSON.parse(decodeURIComponent(searchParams.get("request") || "") || "{}");
    // if (modelName === "address" || modelName === "userinfo") {
    //   const session = await getServerSession({ req: request, ...authOptions });
    //   if (!session || !session.user.role) {
    //     return NextResponse.json({ error: "Access Denied", staus: 401 }, { status: 401 });
    //   }

    //   const filter = session.user.role === "admin" ? {} : { userId: session.user.userId };
    //   const resData = DataAPI.getData({
    //     modelName: modelName as tDataModels,
    //     operation,
    //     request: { ...requestObj, ...filter },
    //   });
    //   return NextResponse.json({ message: "success", data: resData }, { status: 200 });
    // }
    const responseData = await DataAPI.getData({
      modelName: modelName as tDataModels,
      operation,
      request: requestObj,
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
      const operation = formData.get("operation") as string;
      dataReq.operation = operation;
      dataReq.request = formData;
    } else {
      throw new Error("Unsupported content type");
    }
    //todo : check if request and operation and modelName are valid
    const responseData = await DataAPI.saveData(dataReq);
    return NextResponse.json({ message: "success", data: responseData }, { status: 200 });
  } catch (err) {
    console.error("Post request Error :", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage, status: 500 }, { status: 500 });
  }
}

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ model: string }> }
// ) {
//   try {
//     const { model: modelName } = await params;
//     const dataModel = DataModel[modelName];
//     if (!dataModel) {
//       throw new Error("Invalid request");
//     }
//     if (request.headers.get("Content-Type")?.includes("multipart/form-data")) {
//       const formData = await request.formData();
//       const id = formData.get("id") as string;
//       const responseData = await updateFormData(dataModel, id, formData);
//       return NextResponse.json({ message: "success", data: responseData }, { status: 200 });
//     } else {
//       const { id, data } = await request.json();
//       const responseData = await updateData(modelName, { updateQuery: data }, undefined, id);
//       return NextResponse.json({ message: "success", data: responseData }, { status: 200 });
//     }
//   } catch (err) {
//     console.error("Put request Error :", err);
//     const errorMessage =
//       err instanceof ZodError ? err.errors : err instanceof Error ? err.message : "Unknown error";
//     return NextResponse.json({ error: errorMessage, status: 500 }, { status: 500 });
//   }
// }



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
      query: "",
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
      dataReq.query = formData.get("query") as string;
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
