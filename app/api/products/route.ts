import { NextRequest, NextResponse } from "next/server";
import { ErrorRequest } from "@/utils/responseUtil";
import { handleGetOperation, handlePostOperation } from "./util";

export async function GET(request: NextRequest) {
  try {
    const data = await handleGetOperation(
      request.nextUrl.searchParams.get("operation"),
      request.nextUrl.searchParams
    );
    return NextResponse.json({ message: "all good", data }, { status: 200 });
  } catch (err) {
    if (err instanceof ErrorRequest) {
      return NextResponse.json({ message: err.message, status: err.statusCode });
    }
    return NextResponse.json({ error: "something went wrong", status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    await handlePostOperation(form.get("operation") as string, form);
    return NextResponse.json({ message: "Category created successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error creating category:", err);
    if (err instanceof ErrorRequest) {
      return NextResponse.json(
        { message: err.message, STATUS_CODE: err.statusCode },
        { status: err.statusCode }
      );
    }
    return NextResponse.json({ message: "Failed to create category" }, { status: 400 });
  }
}
