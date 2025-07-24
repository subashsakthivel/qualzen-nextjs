import { ContentModel } from "@/model/Content";
import { heroSectionContent } from "@/scripts/content-model";
import { populateData } from "@/scripts/populate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const res = await populateData(heroSectionContent, ContentModel);
    return NextResponse.json({ message: res }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "something went wrong", status: 500 });
  }
}
