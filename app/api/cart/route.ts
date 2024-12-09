import dbConnect from "@/lib/mongoose";
import { Cart } from "@/model/Cart";
import { NextRequest, NextResponse } from "next/server";

interface getRequest {
  userId: string;
  product: string;
  action: string;
  _id: string;
}
export async function POST(request: NextRequest) {
  await dbConnect();

  const req = await request.json();
  const { action }: getRequest = req;
  switch (action) {
    case "ADD":
      const { userId, product }: getRequest = req;
      await Cart.create({ userId, product, count: 1 }).then((res) => {
        console.log("Product Added To Cart Response : ", res);
        NextResponse.json(
          { message: "Product  Added To Cart", response: res },
          { status: 200 }
        );
      });
      break;
    case "REMOVE":
      const { _id }: getRequest = req;
      await Cart.deleteOne({ _id }).then((res) => {
        console.log("Product Removed To Cart Response : ", res);
        NextResponse.json(
          { message: "Product Removed To Cart", response: res },
          { status: 200 }
        );
      });
      break;
    case "INCREASE":
      break;
    case "DECREASE":
      break;
  }
}
