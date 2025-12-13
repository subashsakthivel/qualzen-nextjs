import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { TProduct } from "@/schema/Product";
import { TProductVariant } from "@/schema/ProductVarient";

export function ProductGrid({ products }: { products: TProduct[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: TProduct }) {
  const productInfo = {
    image: product.images[0],
    name: product.name,
    id: product._id,
    price: product.variants.reduce((p, v) => Math.min(v.sellingPrice, p), 10 ^ 8),
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
        <h3 className="font-medium">{productInfo.name}</h3>
        <p className="font-bold mt-1">${productInfo.price}</p>
      </CardContent>
    </Card>
  );
}
