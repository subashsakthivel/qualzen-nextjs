import DataAPI from "@/data/data-api";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/authOptions";
import { PaymentService } from "@/lib/payment";
import { DataModel } from "@/model/DataModels";
import { ProductModel } from "@/model/Product";
import { TOrder } from "@/schema/Order";
import { TProductVariant } from "@/schema/ProductVarient";
import { TUserInfo } from "@/schema/UserInfo";
import { optional } from "better-auth";
import { AsyncCallbackSet } from "next/dist/server/lib/async-callback-set";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //authenticate
  const data = await auth.api.getSession(request);
  if (!data || !data?.user.id) {
    return NextResponse.json({ message: "Need to login" }, { status: 403 });
  }
  const {
    data: { user_details, orders, location, amount, notes, shippingMethod },
  } = await request.json();
  const totalAmount = Math.round(await getTotalAmount(orders));
  if (Math.abs(amount - totalAmount) >= 1) {
    return NextResponse.json({ message: "Item not found" }, { status: 400 }); // return the item which is not availble
  }
  const orderData: TOrder = {
    user: data.user.id,
    status: "created",
    amount,
    shippingAddress: location.shippingAddress,
    billingAddress: location.billingAddress,
    shippingMethod,
    shippingCost: 0, // todo need calculation
    products: orders,
    notes,
    trackingNumber: 0,
    currency: "",
    orderDate: new Date(),
    transactionId: "",
    receipt: `${data.user.username}_${Date.now()}`,
  };
  console.log("Order data", orderData);
  const paymentService = PaymentService.getInstance();
  const order = await paymentService.createOrder(
    {
      amount: amount,
      currency: orderData.currency,

      receipt: orderData.receipt,
      customer_details: {
        name: user_details.name,
        contact: user_details.phone_number,
        email: user_details.email,
        billing_address: location.billingAddress,
        shipping_address: location.shippingAddress,
      },
    },
    orderData
  );

  if (order && order.transactionId && order.transactionId !== "") {
    return NextResponse.json({ orderId: order.transactionId }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }
}

async function getTotalAmount(
  orders: { productId: string; variantId: string; quantity: number }[]
): Promise<number> {
  const products = (await DataAPI.getData({
    modelName: "product",
    operation: "GET_DATA_MANY",
    request: {
      options: {
        filter: {
          "variants._id": {
            $in: orders.map((o) => o.variantId),
          },
        },
      },
    },
  })) as TProductVariant[];
  return products.reduce((sum, v) => sum + v.sellingPrice, 0);
}
