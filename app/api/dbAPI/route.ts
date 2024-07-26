import { fetchCollectionData, fetchStoreData } from "@/lib/dataFetchUtil";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const pageIndex: number = parseInt(params.get("pageIndex") ?? "1");
  const pageLimit: number = parseInt(params.get("pageLimit") ?? "10");
  const collectionName = params.get("tableName");

  try {
    if (collectionName === null) {
      throw "Table Name Not found";
    }
    const res = await fetchCollectionData(collectionName, pageIndex, pageLimit);
    return NextResponse.json(res, { status: 200 });
  } catch (e) {
    console.log("dbAPI: ", e);
    return NextResponse.json({ errorMessage: "something wrong" });
  }
}
