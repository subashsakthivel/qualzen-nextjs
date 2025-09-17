"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TProductVariant } from "@/schema/ProductVarient";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { TProductInfo, useCart } from "./cart-provider";
type tAttribute = {
  name: string;
  value: string;
};
const ProductShowcase = ({ product }: { product: TProductInfo }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<Map<string, tAttribute>>(new Map());
  const [filterdVaraints, setFilterdVaraints] = useState<TProductVariant[]>(
    product.selectedVaraint ? [product.selectedVaraint] : product.variants
  );
  const [images, setImages] = useState<string[]>([]);

  const { cartItems, addToCart, updateQuantity } = useCart();

  // useEffect(() => {
  //   async function loadProduct() {
  //     const fetchProduct = async (): Promise<TProduct | undefined> => {
  //       // const resultData = await getDataFromServer(DataSourceMap["product"], "GET_DATA", {
  //       //   filter: {
  //       //     logicalOperator: "AND",
  //       //     rules: [{ field: "_id", operator: "equals", value: productId }],
  //       //   },
  //       //   populate: [{ path: "variants" }],
  //       // });
  //       const resultData = productsTest;
  //       if (resultData && resultData.docs && resultData.docs.length == 1) {
  //         return resultData.docs[0] as TProduct;
  //       }
  //       return undefined;
  //     };
  //     const product = await fetchProduct();
  //     const productInfo = {} as TProductInfo;
  //     if (product) {
  //       product.attributes = product.attributes.sort((a, b) => a.sortOrder - b.sortOrder);

  //       const varaintAttributes: TAtttributes[] = [];
  //       product.variants.map((variant) => {
  //         variant.attributes.map((attr) => {
  //           const existing = varaintAttributes.find((v) => v.name === v.name);
  //           if (existing) {
  //             existing.values.push({
  //               variantId: variant._id ?? "-",
  //               value: attr.value,
  //               stockQuantity: variant.stockQuantity,
  //             });
  //             existing.quantity += variant.stockQuantity;
  //           } else {
  //             varaintAttributes.push({
  //               name: attr.name,
  //               values: [
  //                 {
  //                   variantId: variant._id ?? "-",
  //                   value: attr.value,
  //                   stockQuantity: variant.stockQuantity,
  //                 },
  //               ],
  //               quantity: variant.stockQuantity,
  //               sortOrder: attr.sortOrder,
  //             });
  //           }
  //         });
  //       });

  //       const productAttributes = product.attributes.filter((attr) =>
  //         varaintAttributes.find((a) => a.name === attr.name)
  //       );
  //       product.attributes = product.attributes.filter((attr) =>
  //         varaintAttributes.find((a) => a.name === attr.name)
  //       );
  //       productInfo.product = product;
  //       productInfo.attributes = varaintAttributes.sort((a, b) => a.sortOrder - b.sortOrder);
  //       productInfo.sellingPrice = product.sellingPrice;
  //       debugger;
  //       const images: string[] = product.images;
  //       product.variants.map((v) => v.images.map((i) => images.push(i)));
  //       debugger;
  //       setImages(images);
  //       setAttributes(productInfo.attributes);
  //       setProductInfo(productInfo);
  //     }
  //   }
  //   loadProduct();
  // }, [productId]);

  function getMatchedVaraints(): TProductVariant[] {
    return product.variants.filter((varaint) =>
      varaint.attributes.reduce(
        (acc, attr) => acc && selectedAttributes.get(attr.name)?.value === attr.value,
        true
      )
    );
  }

  function onSelectAttribute(attributeName: string, attributeValue: string) {
    debugger;
    if (
      !selectedAttributes?.has(attributeName) ||
      selectedAttributes.get(attributeName)?.value !== attributeValue
    ) {
      selectedAttributes.clear();
      selectedAttributes.set(attributeName, { name: attributeName, value: attributeValue });
      const variants = getMatchedVaraints();
      setFilterdVaraints(variants);
      setImages([
        ...variants[0].images,
        ...images.filter((img) => variants[0].images.includes(img)),
      ]);
      setSelectedAttributes(selectedAttributes);
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
    if (product.variants.length > 0 && filterdVaraints.length > 1) return;

    addToCart(product, filterdVaraints[0]);
  };

  //   if (action === "increase") {
  //     setQuantity((prev) => prev + 1);
  //   } else if (action === "decrease" && quantity > 1) {
  //     setQuantity((prev) => prev - 1);
  //   }
  // };
  const item = cartItems.find(
    (item) =>
      item.product._id === product._id &&
      (product.variants.length == 0 ||
        (filterdVaraints.length == 1 && item.variant?._id == filterdVaraints[0]._id))
  );
  const varaint = filterdVaraints.length === 1 ? filterdVaraints[0] : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4 hidden md:block">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              width={200}
              height={400}
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
                  width={200}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        <Carousel className="md:hidden">
          <CarouselContent className="aspect-square">
            {product.images.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="w-full h-full object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            {product.brand !== "varfeo" && (
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-muted-foreground">{product.brand}</span>
              </div>
            )}
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-primary">
                ₹ {varaint ? varaint.sellingPrice : product.sellingPrice}
              </span>
              <Badge variant="destructive">
                Save ₹{" "}
                {varaint
                  ? product.price - varaint.sellingPrice
                  : product.price - product.sellingPrice}
              </Badge>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {product.varaintAttributes &&
            Array.from(product.varaintAttributes)
              .sort(([, a], [, b]) => a.sortOrder - b.sortOrder)
              .map(([key, vAtt], attrIndex) => (
                <div key={vAtt.name ?? attrIndex}>
                  <h3 className="font-semibold mb-3">{vAtt.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(vAtt.values).map((val, index) => (
                      <Button
                        key={index}
                        variant={selectedAttributes.get(key)?.value !== val ? "outline" : "default"}
                        size="sm"
                        onClick={() => onSelectAttribute(key, val)}
                        className="min-w-[3rem]"
                        style={{
                          backgroundColor: val === "color" ? val : "",
                        }}
                      >
                        {val}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

          {/* Actions */}
          <div className="space-y-3">
            {item ? (
              <>
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex space-x-3 border p-2 items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item!.product, item!.quantity - 1, item?.variant)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold text-lg min-w-[3rem] text-center">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item!.product, item!.quantity + 1, item?.variant)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={filterdVaraints.length > 1}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>

          {/* Shipping & Returns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold text-sm">Free Shipping</div>
                <div className="text-xs text-muted-foreground">Orders over ₹ 870</div>
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
      {product.attributes.length > 0 && (
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.attributes.map((attr, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">{attr.name}:</span>
                    <span className="text-muted-foreground">{attr.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
export default ProductShowcase;
