import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updateData } from "@/util/dataAPI";
import { DataModel } from "@/model/DataModels";

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
  await updateData(DataModel["order"], "hfghfdgfdgf", {});
  return NextResponse.json(
    { message: "payment verified successfully", isOk: true },
    { status: 200 }
  );
}
