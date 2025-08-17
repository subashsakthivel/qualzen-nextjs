import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function CategorySection() {
  const categories = [
    {
      name: "Men",
      image: "https://i.pinimg.com/736x/81/b5/19/81b5197015e02db28ba2b0945f9d3a7b.jpg",
      href: "/products/men",
    },
    {
      name: "Women",
      image: "https://i.pinimg.com/736x/df/e5/35/dfe53548110ece38f6e23dd8b5eee817.jpg",
      href: "/products/women",
    },
    {
      name: "Accessories",
      image: "https://i.pinimg.com/736x/8a/d5/a7/8ad5a72c1326284944f87918dcef8ba2.jpg",
      href: "/products/accessories",
    },
  ];

  return (
    <section className="space-y-6 flex flex-col items-center justify-center ">
      <div className="flex flex-col items-center text-center w-full">
        <h2 className="text-3xl font-bold tracking-tight">FIND MANY</h2>
      </div>
      <div className="grid grid-cols-3 gap-6 min-w-96 max-w-96">
        {categories.map((category) => (
          <Link key={category.name} href={category.href}>
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
