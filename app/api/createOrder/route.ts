import { DataModel } from "@/model/DataModels";
import { ProductModel } from "@/model/Product";
import { TProductVariant } from "@/schema/ProductVarient";
import { FilterState, getData } from "@/util/dataAPI";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  //authenticate
  const { orders, receipt, currency, notes } = await request.json();
  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return new Response("Invalid order data", { status: 400 });
  }
}

export async function getTotalAmount(
  orders: { productId: string; variantId?: string; quantity: number }[]
) {
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
      const variant = product.variants.find(
        (v) => v._id != undefined && v._id.toString() === order.variantId
      );
      if (!product.variants && !variant) {
        throw new Error(`Product Variant with ID ${order.variantId} does not found`);
      }

      total +=
        variant !== undefined ? variant.variantSpecificPrice ?? variant.variantSpecificPrice : 0;
    } else {
      total += product.discountedPrice;
    }
    return total;
  }, 0);
}
