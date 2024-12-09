import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  return Response.json({ message: "test" });
}
