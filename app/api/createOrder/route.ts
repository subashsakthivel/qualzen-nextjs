import { authOptions } from "@/lib/authOptions";
import { PaymentService } from "@/lib/payment";
import { DataModel } from "@/model/DataModels";
import { ProductModel } from "@/model/Product";
import { TOrder } from "@/schema/Order";
import { TUserInfo } from "@/schema/UserInfo";
import { getData } from "@/util/dataAPI";
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
  if (!userInfo) {
    return NextResponse.json({ message: "Invalid User" }, { status: 403 });
  }
  const {
    orders,
    notes,
    contactNumber,
    shippingAddressId,
    billingAddressId,
    shippingMethod,
    amount,
  } = await request.json();
  const totalAmount = Math.round(await getTotalAmount(orders));
  if (Math.abs(amount - totalAmount) >= 1) {
    return NextResponse.json({ message: "Item may be not found" }, { status: 400 }); // return the item which is not availble
  }
  const orderData: TOrder = {
    user: userInfo,
    status: "created",
    amount,
    shippingAddress: shippingAddressId,
    billingAddress: billingAddressId ?? shippingAddressId,
    shippingMethod,
    shippingCost: 0, // todo need calculation
    products: orders.map((order: any) => ({
      product: order.productId,
      variant: order.variantId,
      quantity: order.quantity,
    })),
    notes,
    trackingNumber: 0,
    currency: "",
    orderDate: new Date(),
    transactionId: "",
    receipt: `${userInfo.firstName} ${userInfo.lastName ?? ""} ${Date.now()}`,
  };
  console.log("Order data", orderData);
  const paymentService = PaymentService.getInstance();
  const order = await paymentService.createOrder(
    {
      amount: amount,
      currency: orderData.currency,

      receipt: orderData.receipt,
      customer_details: {
        name: userInfo.firstName ?? userInfo.email,
        contact: contactNumber ?? userInfo.phoneNumber,
        email: userInfo.email,
        billing_address: {
          name: billingAddressId ?? shippingAddressId,
        },
        shipping_address: {
          name: shippingAddressId,
        },
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

export async function getTotalAmount(
  orders: { productId: string; variantId?: string; quantity: number }[]
): Promise<number> {
  const products = await ProductModel.find({
    _id: { $in: orders.map((order) => order.productId) },
  }).populate({
    path: "variants",
    match: { _id: { $in: orders.map((order) => order.variantId) } },
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
      if (!variant || variant.stockQuantity < 1) {
        throw new Error("product sold out", { cause: order });
      }

      total += variant.variantSpecificPrice;
    } else {
      if (product.stockQuantity < 1) {
        throw new Error("product sold out", { cause: order });
      }
      total += product.price;
    }
    return total;
  }, 0);
}
