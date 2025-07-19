import { authOptions } from "@/lib/authOptions";
import { DataUtil, fetchFromDB } from "@/util/server/data-util";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { DataModelMap, TDataModels } from "@/model/server/data-model-mappings";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model: modelName } = await params;
    const searchParams = request.nextUrl.searchParams;
    const operation = searchParams.get("operation");
    if (!operation) {
      return NextResponse.json({ message: "Invalid operation" }, { status: 400 });
    }
    const requestObj = JSON.parse(searchParams.get("request") || "{}");
    const session = await getServerSession(authOptions);
    if (modelName === "address" || modelName === "userinfo") {
      if (!session || !session.user.role) {
        return NextResponse.json({ error: "Access Denied", status: 401 }, { status: 401 });
      }
    }
    const userId = session?.user.userId;
    const filter = session?.user.role === "admin" ? {} : { userId };
    if (modelName in DataModelMap) {
      const typedModelName = modelName as TDataModels;
      const resData = await DataUtil.fetchFromDB(userId, "getData", {
        modelName: typedModelName,
        operation,
        options: { ...requestObj, ...filter },
      });
      return NextResponse.json({ message: "success", data: resData }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Invalid model name", status: 400, message: "Model not found" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      error: "something went wrong",
      status: 500,
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
