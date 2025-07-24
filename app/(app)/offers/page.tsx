import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Percent, Clock, Gift, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Offers = () => {
  const offers = [
    {
      id: 1,
      title: "Hero Bundle Deal",
      description: "Buy 2 jackets, get 1 hoodie FREE",
      discount: "Up to 50% OFF",
      image: "/placeholder.svg",
      validUntil: "2024-02-15",
      type: "bundle",
    },
    {
      id: 2,
      title: "New Customer Special",
      description: "Get 20% off your first order",
      discount: "20% OFF",
      image: "/placeholder.svg",
      validUntil: "2024-03-01",
      type: "first-time",
    },
    {
      id: 3,
      title: "Flash Sale",
      description: "Limited time offer on select items",
      discount: "30% OFF",
      image: "/placeholder.svg",
      validUntil: "2024-01-20",
      type: "flash",
    },
    {
      id: 4,
      title: "Free Shipping Weekend",
      description: "No minimum purchase required",
      discount: "FREE SHIPPING",
      image: "/placeholder.svg",
      validUntil: "2024-01-22",
      type: "shipping",
    },
  ];

  const getOfferIcon = (type: string) => {
    switch (type) {
      case "bundle":
        return <Gift className="h-5 w-5" />;
      case "flash":
        return <Zap className="h-5 w-5" />;
      case "first-time":
        return <Percent className="h-5 w-5" />;
      default:
        return <Percent className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Special Offers</h1>
        <p className="text-muted-foreground">
          Discover amazing deals and exclusive offers on our hero-inspired collection
        </p>
      </div>

      {/* Featured Offer */}
      <div className="hero-gradient rounded-lg p-8 text-white text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Mega Sale - Up to 70% OFF</h2>
        <p className="text-lg mb-6 opacity-90">
          Stock up on your favorite hero gear. Limited time only!
        </p>
        <Link href="/products">
          <Button size="lg" variant="secondary" className="font-semibold">
            Shop Now
          </Button>
        </Link>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {offers.map((offer) => (
          <Card key={offer.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative">
                <Image src={offer.image} alt={offer.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="flex items-center justify-center mb-2">
                      {getOfferIcon(offer.type)}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <Badge variant="secondary" className="mb-2">
                      {offer.discount}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-4">{offer.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    Valid until {new Date(offer.validUntil).toLocaleDateString()}
                  </div>
                  <Button>Claim Offer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter Signup */}
      <Card className="text-center p-8">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-4">Never Miss a Deal</h3>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter and be the first to know about exclusive offers and new
            arrivals.
          </p>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 border border-input rounded-md"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
