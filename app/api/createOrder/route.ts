import { authOptions } from "@/lib/authOptions";
import { PaymentService } from "@/lib/payment";
import { DataModel } from "@/model/DataModels";
import { ProductModel } from "@/model/Product";
import { TOrder } from "@/schema/Order";
import { TProductVariant } from "@/schema/ProductVarient";
import { TUserInfo } from "@/schema/UserInfo";
import { FilterState, getData } from "@/util/dataAPI";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user.userId) {
    return NextResponse.json({ message: "Need to login" }, { status: 403 });
  }
  const userInfoResData = await getData<TUserInfo>(DataModel["userinfo"], "GET_DATA", {
    filter: {
      rules: [
        {
          operator: "eq",
          field: "userId",
          value: session.user.userId,
        },
      ],
      logicalOperator: "AND",
    },
  });
  if (userInfoResData.docs.length !== 1) {
    return NextResponse.json({ message: "Invalid User" }, { status: 403 });
  }
  const userInfo = userInfoResData.docs[0];
  const { orders, receipt, currency, notes, shippingAddressId, shippingMethod } =
    await request.json();

  const orderData: TOrder = {
    user: userInfo,
    status: "created",
    amount: await getTotalAmount(orders),
    shippingAddress: shippingAddressId,
    shippingMethod,
    shippingCost: 0, // todo need calculation
    trackingNumber: Math.random() + "_",
    products: orders,
    notes,
    currency: "",
    orderDate: new Date(),
    transactionId: "",
  };
  const paymentService = PaymentService.getInstance();
  const order = paymentService.createOrder(
    {
      ...orderData,
      notes: notes ? { note: notes } : undefined,
    },
    orderData
  );
  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return new Response("Invalid order data", { status: 400 });
  }
}

export async function getTotalAmount(
  orders: { productId: string; variantId?: string; quantity: number }[]
): Promise<number> {
  const products = await ProductModel.find({
    _id: { $in: orders.map((order) => order.productId), stockQuantity: { $gte: 1 } },
  }).populate({
    path: "variants",
    match: { _id: { $in: orders.map((order) => order.variantId) }, stockQuantity: { $gte: 1 } },
  });
  return orders.reduce((total, order) => {
    const product = products.find((p) => p._id.toString() === order.productId);
    if (!product) {
      throw new Error(`Product with ID ${order.productId} not found`);
    }
    if (order.variantId) {
      const variant = product.variants
        .filter((v) => typeof v !== "string")
        .find((v) => v._id != undefined && v._id.toString() === order.variantId);
      if (!product.variants && !variant) {
        throw new Error(`Product Variant with ID ${order.variantId} does not found`);
      }

      total +=
        variant !== undefined ? variant.variantSpecificPrice ?? variant.variantSpecificPrice : 0;
    } else {
      total += product.discountPrice;
    }
    return total;
  }, 0);
}
