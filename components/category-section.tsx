import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import DataAPI from "@/data/data-api";
import { TCategory } from "@/schema/Category";

export async function CategorySection() {
  const categories = (await DataAPI.getData({
    modelName: "category",
    operation: "GET_DATA",
    request: { limit: 8 },
  }).then((res) => res.docs)) as TCategory[];

  return (
    <section className="space-y-6 flex flex-col items-center justify-center ">
      <div className="flex flex-col items-center text-center w-full">
        <h2 className="text-3xl font-bold tracking-tight">FIND MANY</h2>
      </div>
      <div className="grid grid-cols-3 gap-6 min-w-96 max-w-96">
        {categories.map((category) => (
          <Link key={category.name} href={`/category/${category._id}/products/`}>
            <Card className="overflow-hidden aspect-square transition-all hover:shadow-lg rounded-full">
              <CardContent className="p-0 h-full relative">
                <Image src={category.image} alt={category.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-50">
                  <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
