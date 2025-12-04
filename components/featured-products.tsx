import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataAPI from "@/data/data-api";
import { TProduct } from "@/schema/Product";

// const products = [
//   {
//     id: 1,
//     name: "Classic White T-Shirt",
//     price: 29.99,
//     image: "https://i.pinimg.com/736x/4b/d9/72/4bd97237173fa8d01f13860b4c7e9ea4.jpg",
//     category: "men",
//     isNew: true,
//   },
//   {
//     id: 2,
//     name: "Slim Fit Jeans",
//     price: 59.99,
//     image: "https://i.pinimg.com/736x/9f/81/d8/9f81d80e40266483299a2ce62b6a51a1.jpg",
//     category: "men",
//     isNew: false,
//   },
//   {
//     id: 3,
//     name: "Summer Floral Dress",
//     price: 79.99,
//     image: "https://i.pinimg.com/736x/5b/27/ab/5b27ab11d1a93fb70e3ae4e1714ebf9e.jpg",
//     category: "women",
//     isNew: true,
//   },
//   {
//     id: 4,
//     name: "Casual Hoodie",
//     price: 49.99,
//     image: "https://i.pinimg.com/1200x/d6/66/02/d6660255305ac378c7b630a07c4bfd0c.jpg",
//     category: "men",
//     isNew: false,
//   },
//   {
//     id: 5,
//     name: "Casual Hoodie",
//     price: 49.99,
//     image: "https://i.pinimg.com/1200x/9d/eb/e9/9debe987a8930bf3d6e09256832f980f.jpg",
//     category: "men",
//     isNew: false,
//   },
//   {
//     id: 6,
//     name: "Casual Hoodie",
//     price: 49.99,
//     image: "https://i.pinimg.com/736x/d7/5e/0a/d75e0ac362630bf1e167f09d5ae54995.jpg",
//     category: "men",
//     isNew: false,
//   },
//   {
//     id: 7,
//     name: "Casual Hoodie",
//     price: 49.99,
//     image: "https://i.pinimg.com/736x/ed/76/f9/ed76f9a8897a2b14c9db2f8ef9cdaa7d.jpg",
//     category: "men",
//     isNew: false,
//   },
//   {
//     id: 8,
//     name: "Casual Hoodie",
//     price: 49.99,
//     image: "https://i.pinimg.com/1200x/80/2e/9e/802e9e7055ac646c6f909959a6e1c225.jpg",
//     category: "men",
//     isNew: false,
//   },
// ];

const products = (await DataAPI.getData({
  modelName: "product",
  operation: "GET_DATA",
  request: {
    select: { _id: 1, images: 1, name: 1, price: 1, sellingPrice: 1, createdAt: 1 },
    sort: { createdAt: "asec" },
    limit: 8,
  },
}).then((res) => res.docs)) as TProduct[];

export function FeaturedProducts() {
  return (
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
  );
}

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
        <p className="font-bold mt-1">${product.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}
