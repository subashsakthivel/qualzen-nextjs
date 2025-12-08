import { TCategory } from "@/schema/Category";
import DataAPI from "@/data/data-api";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function CategoriesCatelog() {
  const response = (await DataAPI.getData({
    modelName: "category",
    operation: "GET_DATA_MANY",
    request: { limit: 8 },
  }).then((res) => res.docs)) as TCategory[];
  const categories = response && Array.isArray(response) ? response : [];
  const grid_col_range =
    categories.length % 2 == 0
      ? ` grid-cols-${Math.max(categories.length / 4, 2)} md:grid-cols-${Math.max(
          categories.length / 2,
          2
        )} `
      : ` grid-cols-${Math.max(categories.length / 2, 2)} `;
  const extra_card = categories.length % 2 != 0 && categories.length % 3 !== 0;
  return (
    <>
      {categories && (
        <div className={"grid gap-2 md:m-10 items-center " + grid_col_range}>
          {categories.map((category, index) => (
            <Link key={category.name} href={`/products/category/${category._id}`}>
              <div key={index} className="relative group overflow-hidden aspect-square">
                {category.image && (
                  <Image src={category.image} alt={category.name} fill className=" object-cover " />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-50">
                  <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
          {extra_card && (
            <div className="relative group overflow-hidden aspect-square">
              <div className="absolute inset-0 bg-black opacity-80  flex items-center justify-center transition-opacity duration-300 ">
                <h3 className="text-white text-xl font-semibold">The Next</h3>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
