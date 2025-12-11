"use client";

import { useEffect, useState } from "react";
import { Link, MapPin, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "./cart-provider";
import OrderSummary from "./order-summary";
import { TAddress } from "@/schema/Address";
import { useSession } from "@/lib/auth-client";
import { signIn } from "next-auth/react";
import DataClientAPI from "@/util/client/data-client-api";

export default function Checkout() {
  const { data } = useSession();
  const { cartItems, total, clearCart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(undefined);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState<TAddress[]>([]);
  const [contactNumber, setContactNumber] = useState<string>("");

  const [formData, setFormData] = useState<Omit<TAddress, "userId">>({
    contactName: "",
    addressLine1: "",
    city: "",
    country: "India",
    postalCode: "",
    state: "",
    addressLine2: "",
  });

  useEffect(() => {
    const fetchInitData = async () => {
      const response = (await DataClientAPI.getData({
        modelName: "address",
        operation: "GET_DATA_MANY",
        request: {},
      })) as TAddress[];
      if (response && Array.isArray(response)) {
        setAddresses(response);
        if (response.length > 0) {
          const addresses = response.sort((a, b) =>
            b.updatedAt && a.updatedAt
              ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              : 0
          );
          const primaryAddressId = localStorage.getItem("primaryAddress");
          const primaryAddress = response.find((addr) => addr._id === primaryAddressId);
          if (!primaryAddress && addresses[0]._id) {
            localStorage.setItem("primaryAddress", addresses[0]._id);
            setSelectedAddress(addresses[0]._id);
          } else if (primaryAddress) {
            setSelectedAddress(primaryAddress?._id);
          }
        } else {
          setShowAddressForm(true);
        }
      }

      const userInfoData = await DataClientAPI.getData({
        modelName: "userinfo",
        operation: "GET_DATA_BY_ID",
        request: {},
      });
      setContactNumber(userInfoData.phoneNumber);
    };
    fetchInitData();
  }, [data]);

  if (!data) {
    signIn(undefined, { callbackUrl: "/checkout" });
  }

  console.log("session_checkout", data);
  debugger;
  if (data && !data.user) {
    return <>Unknown User</>;
  }

  const user = data?.user;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function createOrder(): Promise<string> {
    const data = {
      orders: cartItems.map((item) => ({
        productId: item.product._id,
        variantId: item.variant._id,
        quantity: item.quantity,
      })),
      amount: total,
      shippingAddressId: selectedAddress,
      contactNumber: contactNumber,
      shippingMethod: "standard", //todo : need to handle
      notes: "GOD bless you",
    };
    const response = await DataClientAPI.saveData({ modelName: "order", request: { data } });
    if (!response.success) {
      throw new Error("Network response was not ok");
    }

    return response.data._id;
  }

  async function handlePayment() {
    "use server";
    try {
      const orderId: string = await createOrder();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total,
        currency: "INR",
        name: data?.user.name,
        description: "description",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            OrderCreationId: orderId,
            PaymentId: response.razorpay_payment_id,
            OrderId: response.razorpay_order_id,
            ClientSignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          if (res.isOk) alert("payment succeed");
          else {
            alert(res.message);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      // (Moved useEffect above, see previous replacement)
    } catch (e) {
      console.log(e);
      debugger;
    }
  }

  async function handleSaveAddress() {
    // Handle saving the new address
    console.log("Saving address:", formData);
    console.log("session", user);
    if (user?.id) {
      debugger;
      const response = await DataClientAPI.saveData({
        modelName: "address",
        request: {
          data: formData,
        },
      });
      if (response && response.success) {
        setShowAddressForm(false);
        setAddresses([response.data, ...addresses]);
        setSelectedAddress(response.data._id);
        setFormData({
          contactName: "",
          addressLine1: "",
          city: "",
          country: "India",
          postalCode: "",
          state: "",
          addressLine2: "",
        });
      }
    }
  }

  const selectedAddressData = addresses.find((addr) => addr._id === selectedAddress);

  if (cartItems.length === 0) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-4">You need to add items to your cart before checking out.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Address Selection */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
          </div>

          {/* Delivery Address Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showAddressForm && addresses.length > 0 ? (
                <>
                  {/* Address Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="address-select">Select delivery address</Label>
                    <Select value={selectedAddress} onValueChange={setSelectedAddress}>
                      <SelectTrigger id="address-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.map((address) => (
                          <SelectItem key={address._id} value={address._id!}>
                            <div className="flex flex-col text-left">
                              <span className="font-medium">{address.addressLine1}</span>
                              <span className="text-sm text-muted-foreground">
                                {address.addressLine2}, {address.city}, {address.state}{" "}
                                {address.postalCode}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-lg border p-4 bg-muted/50">
                    <div className="space-y-1">
                      <Label htmlFor="contactNumber">Contact No</Label>
                      <Input
                        id="contactNumber"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Enter Contact Number"
                      />
                    </div>
                  </div>

                  {/* Selected Address Display */}
                  {selectedAddressData && (
                    <div className="rounded-lg border p-4 bg-muted/50">
                      <div className="space-y-1">
                        <p className="font-medium">{selectedAddressData.contactName}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedAddressData.addressLine1}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedAddressData.addressLine2}, {selectedAddressData.city},{" "}
                          {selectedAddressData.state} {selectedAddressData.postalCode}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Change Address Button */}
                  <Button
                    variant="outline"
                    onClick={() => setShowAddressForm(true)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Change Address
                  </Button>
                </>
              ) : (
                /* Address Form */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Add New Address</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddressForm(false)}>
                      Cancel
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="Name"
                        value={formData.contactName}
                        defaultValue={user?.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact No</Label>
                      <Input
                        id="contactNumber"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Enter Contact Number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street">Address</Label>
                      <Input
                        id="addressLine1"
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                        placeholder="Enter address"
                      />
                      <Input
                        id="addressLine1"
                        value={formData.addressLine2}
                        onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          placeholder="Enter state"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Pincode</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                          placeholder="Enter Pincode"
                        />
                      </div>
                    </div>

                    <Button onClick={handleSaveAddress} className="w-full">
                      Save Address
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <OrderSummary cartItems={cartItems} total={total} handlePayment={handlePayment} />
      </div>
    </div>
  );
}
