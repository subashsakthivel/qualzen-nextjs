import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { TProduct } from "@/schema/Product";

export default function ProductCard({
  product,
  className,
}: {
  product: Partial<TProduct>;
  className?: string;
}) {
  const productInfo = {
    image: product.images ? product.images[0] : "#",
    name: product.name,
    id: product._id,
    price: product.variants?.reduce((p, v) => Math.min(v.sellingPrice, p), 10 ^ 8) ?? undefined,
  };

  return (
    <Card className={"overflow-hidden group border-none " + className}>
      <Link href={`/products/${productInfo.id}`}>
        <div className="relative aspect-square overflow-hidden ">
          <Image
            src={productInfo.image || "/placeholder.svg"}
            alt={productInfo.name ?? "#"}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div
            className="absolute bottom-0 w-full h-10
                  bg-gradient-to-t from-black to-transparent"
          />
        </div>
      </Link>
      {(product.name || productInfo.price) && (
        <CardContent className="p-2 ">
          {product.name && <h3 className="font-medium">{productInfo.name}</h3>}
          {productInfo.price && <p className="font-extralight mt-1">{productInfo.price} rs</p>}
        </CardContent>
      )}
    </Card>
  );
}
