import { DataModel } from "@/model/DataModels";
import { TOrder, TOrderedProducts } from "@/schema/Order";
import { postData } from "@/util/dataAPI";
import Razorpay from "razorpay";
import { Orders } from "razorpay/dist/types/orders";

export class PaymentService {
  private razorpay: Razorpay;
  private constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  async createOrder(
    options: Orders.RazorpayOrderCreateRequestBody,
    orderData: TOrder
  ): Promise<TOrder> {
    const order = await this.razorpay.orders.create(options);
    if (!order) {
      throw new Error("Failed to create Razorpay order");
    }
    return await postData(DataModel["order"], orderData);
  }
}
