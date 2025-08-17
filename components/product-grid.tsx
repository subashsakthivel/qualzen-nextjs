"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Variable } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { TProduct, TProductRes } from "@/schema/Product";
import { TProductVariant } from "@/schema/ProductVarient";

export function ProductGrid({ products }: { products: TProductRes[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) =>
        product.variants && product.variants.filter((v) => v.images.length > 0) ? (
          product.variants
            .filter((v) => v.images.length > 0)
            .map((variant) => <ProductCard key={product._id} product={product} variant={variant} />)
        ) : (
          <ProductCard key={product._id} product={product} />
        )
      )}
    </div>
  );
}

function ProductCard({ product, variant }: { product: TProduct; variant?: TProductVariant }) {
  const { addToCart } = useCart();
  debugger;
  const productInfo = {
    image: variant ? variant.images[0] : product.images[0],
    name: product.name,
    id: variant ? product._id + "_" + variant._id : product._id,
    price: variant ? variant.sellingPrice : product.sellingPrice,
  };

  return (
    <Card className="overflow-hidden group">
      <Link href={`/products/${productInfo.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={productInfo.image || "/placeholder.svg"}
            alt={productInfo.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${productInfo.id}`} className="hover:underline">
          <h3 className="font-medium">{productInfo.name}</h3>
        </Link>
        <p className="font-bold mt-1">${productInfo.price}</p>
      </CardContent>
      {/* {product.variants.length==0 && <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm" onClick={() => addToCart(product, variant)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>} */}
    </Card>
  );
}
