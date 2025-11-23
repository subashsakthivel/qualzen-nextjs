import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const res = await getServerSession();
  console.log("POST res session", res);
}

export async function GET(request: NextRequest) {
  const res = await getServerSession();
  console.log("GET res session", res);
}

// todo : delete this one later