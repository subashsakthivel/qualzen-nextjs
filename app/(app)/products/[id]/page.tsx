"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/components/cart-provider";
import { getDataFromServer } from "@/util/dataAPI";
import { DataSourceMap } from "@/model/DataSourceMap";
import { TProduct, TProductRes } from "@/schema/Product";

// Mock product data - in a real app, you would fetch this from an API
type TAtttributes = {
  name: string;
  values: {
    variantId: string;
    value: string;
  }[];
  quantity: number;
  sortOrder: number;
};
export default function ProductView({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id);
  const [product, setProduct] = useState<TProductRes | undefined>(undefined);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [attributes, setAttributes] = useState<TAtttributes[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [productAttributes, setProductAttributes] = useState<TProduct["attributes"]>([]);

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      const fetchProduct = async (): Promise<TProductRes | undefined> => {
        const resultData = await getDataFromServer(DataSourceMap["product"], "GET_DATA", {
          filter: {
            logicalOperator: "AND",
            rules: [{ field: "_id", operator: "equals", value: productId }],
          },
          populate: [{ path: "variants" }],
        });
        if (resultData && resultData.docs && resultData.docs.length == 1) {
          return resultData.docs[0] as TProductRes;
        }
        return undefined;
      };
      const product = await fetchProduct();
      if (product) {
        product.attributes = product.attributes.sort((a, b) => a.sortOrder - b.sortOrder);

        const varaintAttributes: TAtttributes[] = [];
        product.variants
          .filter((v) => typeof v !== "string")
          .map((variant) => {
            variant.attributes.map((attr) => {
              const existing = varaintAttributes.find((v) => v.name === v.name);
              if (existing) {
                existing.values.push({ variantId: variant._id ?? "-", value: attr.value });
                existing.quantity += variant.stockQuantity;
              } else {
                varaintAttributes.push({
                  name: attr.name,
                  values: [{ variantId: variant._id ?? "-", value: attr.value }],
                  quantity: variant.stockQuantity,
                  sortOrder: attr.sortOrder,
                });
              }
            });
          });
        const productAttributes = product.attributes.filter((attr) =>
          varaintAttributes.find((a) => a.name === attr.name)
        );
        setProduct(product);
        setProductAttributes(productAttributes);
        setAttributes(varaintAttributes.sort((a, b) => a.sortOrder - b.sortOrder));
      }
    }
    loadProduct();
  }, [productId]);

  function onSelectAttribute(attributeName: string, attributeValue: string) {
    selectedAttributes[attributeName] = attributeValue;
    if (Object.keys(selectedAttributes).length === attributes.length) {
      const selectedVariant = product?.variants
        .filter((v) => typeof v !== "string")
        .find((variant) => {
          return variant.attributes.every((attr) => selectedAttributes[attr.name] === attr.value);
        });
      if (selectedVariant && typeof selectedVariant !== "string") {
        setSelectedVariant(selectedVariant._id ?? null);
      } else {
        setSelectedVariant(null);
      }
    }
  }
  if (!product) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-4">The product you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;

    addToCart({
      ...product,
    });
  };

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.imageSrc[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {!product.isActive && <Badge className="absolute top-4 right-4">Not Avaialble</Badge>}
          </div>

          <div className="flex gap-4">
            {product.imageSrc.map((image, index) => (
              <button
                key={index}
                className={`relative aspect-square w-20 overflow-hidden rounded-md border ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-bold mt-2">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="space-y-4">
            {attributes.map((attribute, index) => (
              <div key={index}>
                <h3 className="font-medium mb-2">{attribute.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {attribute.values.map((attrValue) => (
                    <Button
                      key={attrValue.value}
                      variant={selectedSize === attrValue.value ? "default" : "outline"}
                      className={`min-w-[60px] ${
                        selectedAttributes[attribute.name] === attrValue.value
                          ? "bg-primary text-primary-foreground border-l-2"
                          : ""
                      }`}
                      onClick={() => onSelectAttribute(attribute.name, attrValue.value)}
                    >
                      {attrValue.value}
                    </Button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-sm text-muted-foreground mt-2">Please select a size</p>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={product.variants.length > 0 && !selectedVariant}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>

          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">
                Shipping & Returns
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                {product.attributes.map((attr) => (
                  <div key={attr.name}>
                    <h4 className="font-medium">{attr.name}</h4>
                    <p className="text-sm text-muted-foreground">{attr.value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="space-y-4 pt-4">
              <div>
                <h4 className="font-medium">Shipping</h4>
                <p className="text-sm text-muted-foreground">
                  Free standard shipping on all orders over $100. Delivery within 3-5 business days.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Returns</h4>
                <p className="text-sm text-muted-foreground">
                  We accept returns within 30 days of delivery. Items must be unworn, unwashed, and
                  with the original tags attached.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
