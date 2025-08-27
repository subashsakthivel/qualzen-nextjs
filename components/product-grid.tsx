import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { TProduct } from "@/schema/Product";
import { TProductVariant } from "@/schema/ProductVarient";

export function ProductGrid({ products }: { products: TProduct[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) =>
        product.variants && product.variants.filter((v) => v.images.length > 0).length > 0 ? (
          product.variants.map((variant) => (
            <ProductCard key={product._id} product={product} variant={variant} />
          ))
        ) : (
          <ProductCard key={product._id} product={product} />
        )
      )}
    </div>
  );
}

function ProductCard({ product, variant }: { product: TProduct; variant?: TProductVariant }) {
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
        <h3 className="font-medium">{productInfo.name}</h3>
        <p className="font-bold mt-1">${productInfo.price}</p>
      </CardContent>
    </Card>
  );
}
