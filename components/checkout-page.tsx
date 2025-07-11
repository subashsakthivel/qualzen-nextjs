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
import { signIn, useSession } from "next-auth/react";
import OrderSummary from "./order-summary";
import { TAddress } from "@/schema/Address";
import { TUserInfo } from "@/schema/UserInfo";
import { getDataFromServer, postDataToServer } from "@/util/dataAPI";
import { DataSourceMap } from "@/model/DataSourceMap";

export default function Checkout() {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn(undefined, { callbackUrl: "/checkout" }); // Redirect to login if not authenticated
    },
  });
  const { cartItems, subtotal, clearCart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(undefined);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState<TAddress[]>([]);
  const [contactNumber, setContactNumber] = useState<TUserInfo["phoneNumber"]>("");

  const [formData, setFormData] = useState<TAddress>({
    contactName: "",
    addressLine1: "",
    city: "",
    country: "India",
    postalCode: "",
    state: "",
    addressLine2: "",
    userId: session?.user.userId ?? "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAddress = async () => {
    // Handle saving the new address
    console.log("Saving address:", formData);
    console.log("session", session?.user);
    if (session && session?.user.userId) {
      formData.userId = session?.user.userId;
      debugger;
      const { message, data } = await postDataToServer<TAddress>(DataSourceMap["address"], {
        data: formData,
      });
      setShowAddressForm(false);
      setAddresses([data, ...addresses]);
      setSelectedAddress(data._id);
      setFormData({
        contactName: "",
        addressLine1: "",
        city: "",
        country: "India",
        postalCode: "",
        state: "",
        addressLine2: "",
        userId: session?.user.userId ?? "",
      });
    }
  };

  useEffect(() => {
    const fetchInitData = async () => {
      const result = await getDataFromServer<TAddress>(DataSourceMap["address"], "GET_DATA", {});
      setAddresses(result.docs);
      if (result.docs.length > 0) {
        setSelectedAddress(result.docs[0]._id);
      } else {
        setShowAddressForm(true);
      }

      const userInfoData = await getDataFromServer<TUserInfo>(
        DataSourceMap["userinfo"],
        "GET_DATA",
        {}
      );
      setContactNumber(userInfoData.docs[0].phoneNumber ?? "");
    };
    fetchInitData();
  }, []);

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
  } else if (status === "loading") {
    return <div>Loding...</div>;
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
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange("contactName", e.target.value)}
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
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="addressLine1"
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                        placeholder="Enter street address"
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
                          placeholder="Enter city"
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
                      {/* <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) => handleInputChange("country", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Mexico">Mexico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div> */}
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

        <OrderSummary cartItems={cartItems} subtotal={100} />
      </div>
    </div>
  );
}
