import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { TFilter, updateData } from "@/util/dataAPI";
import { DataModel } from "@/model/DataModels";
import { TOrder } from "@/schema/Order";

const generatedSignature = (OrderId: string, PaymentId: string) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error("Razorpay key secret is not defined in environment variables.");
  }
  const sign = crypto
    .createHmac("sha256", keySecret)
    .update(OrderId + "|" + PaymentId)
    .digest("hex");
  return sign;
};

export async function POST(request: NextRequest) {
  const { OrderCreationId, OrderId, PayemntId, ClientSignature } = await request.json();

  const signature = generatedSignature(OrderId, PayemntId);
  if (signature !== ClientSignature) {
    return NextResponse.json(
      { message: "payment verification failed", isOk: false },
      { status: 400 }
    );
  }
  //update Order status
  const filter: TFilter<TOrder> = [{ field: "transactionId", value: OrderId, operator: "equals" }];
  const response = await updateData<TOrder>("order", { updateQuery: { status: "paid" } }, filter);
  return NextResponse.json(
    { message: "payment verified successfully", isOk: true, data: response },
    { status: 200 }
  );
}
