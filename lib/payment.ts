import DataAPI from "@/data/data-api";
import { DataModel } from "@/model/DataModels";
import { TOrder } from "@/schema/Order";
import Razorpay from "razorpay";
import { Orders } from "razorpay/dist/types/orders";

export class PaymentService {
  private razorpay: Razorpay;
  private constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  static getInstance() {
    return new PaymentService();
  }
  async createOrder(
    options: Orders.RazorpayOrderCreateRequestBody,
    orderData: TOrder
  ): Promise<TOrder> {
    const order = await this.razorpay.orders.create(options);
    Object.assign(order, orderData);

    if (!order) {
      throw new Error("Failed to create Razorpay order");
    }
    orderData.transactionId = order.id;
    return await DataAPI.saveData({
      modelName: "order",
      operation: "CREATE",
      request: orderData,
    });
  }
}
