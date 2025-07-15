import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "@/components/ui/separator";
import { TCartItem } from "./cart-provider";
import Script from "next/script";
import { Button } from "./ui/button";

// Add Razorpay type to window
declare global {
  interface Window {
    Razorpay: any;
  }
}

function OrderSummary({
  cartItems,
  total,
  handlePayment,
}: {
  cartItems: TCartItem[];
  total: number;
  handlePayment: () => Promise<void>;
}) {
  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
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
          <Button type="button" className="w-full" onClick={handlePayment}>
            Pay
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default OrderSummary;
