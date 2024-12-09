import { NextRequest, NextResponse } from "next/server";
import {
  deleteCatogory,
  handleGetOperation,
  handlePostOperation,
  handlePutOperation,
} from "./util";
import { ErrorRequest } from "@/utils/responseUtil";

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

export async function PUT(request: Request) {
  try {
    const form = await request.formData();
    await handlePutOperation(form.get("operation") as string, form);
    return NextResponse.json({ message: "Category updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error updating category:", err);
    if (err instanceof ErrorRequest) {
      return NextResponse.json(
        { message: err.message, STATUS_CODE: err.statusCode },
        { status: err.statusCode }
      );
    }
    return NextResponse.json({ message: "Failed to update category" }, { status: 400 });
  }
}

export async function DELET(request: Request) {
  try {
    const { operation, id } = await request.json();
    if (operation === "delete" && id) {
      await deleteCatogory(id);
      return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
    }
    throw new ErrorRequest("Bad Request", 400);
  } catch (err) {
    if (err instanceof ErrorRequest) {
      return NextResponse.json({ message: err.message, STATUS_CODE: err.statusCode });
    }
    return NextResponse.json({ message: "Failed to delete category" }, { status: 400 });
  }
}
