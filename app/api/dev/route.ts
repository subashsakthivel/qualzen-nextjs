import { Category } from "@/model/Category";
import { NextRequest } from "next/server";

async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const collectionName = params.get("collectionName");

  Category.deleteMany();
}
