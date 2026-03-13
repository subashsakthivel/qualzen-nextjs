import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataAPI from "@/data/data-api";
import { TProduct } from "@/schema/Product";

export async function FeaturedProducts() {
  const response = (await DataAPI.getData({
    modelName: "product",
    operation: "GET_DATA_MANY",
    request: {
      options: {
        select: "id images name price sellingPrice createdAt",
        sort: { createdAt: "asc" },
        limit: 8,
      },
    },
  }).then((res) => res.docs)) as TProduct[];

  const products = response && Array.isArray(response) ? response : [];

  return (
    <>
      {products && products.length > 0 && (
        <section className="space-y-6 ">
          <div className="flex flex-col items-center text-center space-y-2 m-12">
            <h2 className="text-3xl font-bold tracking-tight ">Featured Products</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

//todo : move out
function ProductCard({ product }: { product: TProduct }) {
  function isOneWeekApartFromNow(timestamp: number): boolean {
    const now = Date.now(); // current time in ms
    const oneDayMs = 1000 * 60 * 60 * 24;
    const diffDays = Math.abs(now - timestamp) / oneDayMs;

    return diffDays === 7;
  }
  return (
    <Card className="overflow-hidden group">
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {isOneWeekApartFromNow(product.createdAt as number) && (
            <Badge className="absolute top-2 right-2">New</Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product._id}`} className="hover:underline">
          <h3 className="font-medium">{product.name}</h3>
        </Link>
        <p>{Math.min(...product.variants.map((v) => v.sellingPrice)).toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}
