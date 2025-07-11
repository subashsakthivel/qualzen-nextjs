import { TProductRes } from "@/schema/Product";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "@/components/ui/separator";
import Razorpay from "razorpay";

function OrderSummary({ cartItems, subtotal }: { cartItems: TProductRes[]; subtotal: number }) {
  const total = Math.round(
    cartItems.reduce((acc, item) => {
      if (item.selectedVariant) {
        return acc + item.selectedVariant.variantSpecificPrice;
      } else {
        return acc + item.price;
      }
    }, 0)
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {cartItems.map((item: any, index: number) => (
            <div key={index} className="flex justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.quantity || 1} ×</span>
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-medium">
                ${(item.price * (item.quantity || 1)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex justify-between">
          <span>Tax inclusive</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total}</span>
        </div>
        <div className="flex justify-between font-bold">{/* //pay */}</div>
      </CardContent>
    </Card>
  );
}

export default OrderSummary;
