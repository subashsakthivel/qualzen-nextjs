import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const ProductShowcase = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Red");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app this would come from API
  const product = {
    id: 1,
    name: "Hero Red Jacket",
    price: 199,
    originalPrice: 249,
    description:
      "Premium quality hero-inspired jacket with modern styling. Made from durable materials with attention to detail that embodies the spirit of adventure.",
    category: "Jackets",
    brand: "VARFEO",
    rating: 4.9,
    reviewCount: 127,
    badge: "Bestseller",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Red", "Black", "Navy", "Gray"],
    features: [
      "Premium quality materials",
      "Water-resistant coating",
      "Multiple pockets",
      "Adjustable fit",
      "Machine washable",
    ],
    specifications: {
      Material: "85% Cotton, 15% Polyester",
      Weight: "680g",
      Care: "Machine wash cold",
      Origin: "Made in USA",
    },
  };

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary">{product.badge}</Badge>
              <span className="text-sm text-muted-foreground">{product.brand}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-current text-secondary" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-primary">${product.price}</span>
              <span className="text-xl text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
              <Badge variant="destructive">Save ${product.originalPrice - product.price}</Badge>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Size Selection */}
          <div>
            <h3 className="font-semibold mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                  className="min-w-[3rem]"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-semibold mb-3">Color: {selectedColor}</h3>
            <div className="flex space-x-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color ? "border-primary scale-110" : "border-muted"
                  }`}
                  style={{
                    backgroundColor:
                      color.toLowerCase() === "red"
                        ? "hsl(0 70% 30%)"
                        : color.toLowerCase() === "black"
                        ? "hsl(0 0% 0%)"
                        : color.toLowerCase() === "navy"
                        ? "hsl(220 60% 20%)"
                        : "hsl(0 0% 50%)",
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange("decrease")}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-lg min-w-[3rem] text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange("increase")}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button size="lg" className="w-full">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" size="lg" className="flex-1">
                <Heart className="h-5 w-5 mr-2" />
                Wishlist
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Features */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Product Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Shipping & Returns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold text-sm">Free Shipping</div>
                <div className="text-xs text-muted-foreground">Orders over $150</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold text-sm">Easy Returns</div>
                <div className="text-xs text-muted-foreground">30-day policy</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold text-sm">Quality Guarantee</div>
                <div className="text-xs text-muted-foreground">Premium materials</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="mt-12">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-border">
                  <span className="font-medium">{key}:</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
