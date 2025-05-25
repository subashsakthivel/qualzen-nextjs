import { DataModel } from "@/model/DataModels";
import { getData, postData } from "@/util/dataAPI";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model: modelName } = await params;
    const searchParams = request.nextUrl.searchParams;
    const dataModel = DataModel[modelName];
    if (!dataModel) {
      throw new Error("Invalid request");
    }
    if (!dataModel.authorized()) {
      throw new Error("Access denied");
    }
    const responseData = await getData(dataModel, {
      limit: parseInt(searchParams.get("limit") || "1000"),
      sort: JSON.parse(searchParams.get("sort") || "{}"),
      page: parseInt(searchParams.get("page") || "1"),
      filter: searchParams.get("filter") ? JSON.parse(searchParams.get("filter")!) : undefined,
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model: modelName } = await params;
    const dataModel = DataModel[modelName];
    if (!dataModel) {
      throw new Error("Invalid request");
    }
    if (!dataModel.authorized()) {
      throw new Error("Access denied");
    }

    if (request.headers.get("Content-Type")?.includes("application/json")) {
      const { data } = await request.json();
      const responseData = await postData(dataModel, data);
      return NextResponse.json({ message: "success", data: responseData }, { status: 200 });
    } else if (request.headers.get("Content-Type")?.includes("multipart/form-data")) {
      const formData = await request.formData();
      const data = Object.fromEntries(formData);
      const responseData = await postData(dataModel, data);
      return NextResponse.json({ message: "success", data: responseData }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ error: "something went wrong", status: 500 });
  }
}
