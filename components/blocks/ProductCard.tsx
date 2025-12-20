import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { TProduct } from "@/schema/Product";

export default function ProductCard({ product }: { product: Partial<TProduct> }) {
  const productInfo = {
    image: product.images ? product.images[0] : "#",
    name: product.name,
    id: product._id,
    price: product.variants?.reduce((p, v) => Math.min(v.sellingPrice, p), 10 ^ 8) ?? undefined,
  };

  return (
    <Card className="overflow-hidden group">
      <Link href={`/products/${productInfo.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={productInfo.image || "/placeholder.svg"}
            alt={productInfo.name ?? "#"}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      {(product.name || productInfo.price) && (
        <CardContent className="p-4">
          {product.name && <h3 className="font-medium">{productInfo.name}</h3>}
          {productInfo.price && <p className="font-bold mt-1">${productInfo.price}</p>}
        </CardContent>
      )}
    </Card>
  );
}
