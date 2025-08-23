import { TCategory } from "@/schema/Category";
import DataAPI from "@/util/server/data-util";
import Image from "next/image";
import React from "react";
// const categories = [
//   {
//     id: 1,
//     name: "Cargo Pant",
//     image: "https://i.pinimg.com/736x/60/fe/3f/60fe3f53c30c2a61f896b2e2b2b459a7.jpg",
//     description: "High Fashion New Designs",
//     originalWidth: 1200,
//     originalHeight: 800,
//   },
//   {
//     id: 2,
//     name: "Jacket",
//     image: "https://i.pinimg.com/736x/37/c5/d6/37c5d63581fd7d56d0a8b2ce0e7d3cda.jpg",
//     description: "High Fashion New Designs",
//     originalWidth: 1200,
//     originalHeight: 800,
//   },
//   {
//     id: 3,
//     name: "Shoue",
//     image: "https://i.pinimg.com/1200x/a8/a1/65/a8a165ad79c452f40ef9f1c99878b971.jpg",
//     description: "High Fashion New Designs",
//     originalWidth: 1200,
//     originalHeight: 800,
//   },
//   {
//     id: 4,
//     name: "Jean",
//     image: "https://i.pinimg.com/1200x/a4/68/65/a468657d1609557fccd03a89cc32b573.jpg",
//     description: "High Fashion New Designs",
//     originalWidth: 1200,
//     originalHeight: 800,
//   },
//   {
//     id: 5,
//     name: "Hoodie",
//     image: "https://i.pinimg.com/1200x/f7/20/7b/f7207b54aa261105271bd586668812df.jpg",
//     description: "High Fashion New Designs",
//     originalWidth: 1200,
//     originalHeight: 800,
//   },
// ];

// const getCategories = async (): Promise<TCategory[]> => {
//   const result = await fetch("/api/dataAPI/category?operation=GET_DATA")
//     .then(async (res) => {
//       const response = await res.json();
//       return response.docs;
//     })
//     .catch((err) => {
//       console.log(err);
//       return [];
//     });
//   return result;
// };

const getCategories = async (): Promise<TCategory[]> => {
  const response = await DataAPI.getData({
    modelName: "category",
    operation: "GET_DATA",
    request: { limit: 6 },
  });
  return response.docs;
};

const categories = await getCategories();

const CategoriesCatelog = async () => {
  const grid_col_range =
    categories.length % 2 == 0 ? " grid-cols-2 md:grid-cols-4 " : " grid-cols-3 ";
  const extra_card = categories.length % 2 != 0 && categories.length % 3 !== 0;
  return (
    <div className={"grid gap-2 md:m-10 items-center " + grid_col_range}>
      {categories.map((category, index) => (
        <div key={index} className="relative group overflow-hidden aspect-square">
          <Image src={category.image} alt={category.name} fill className=" object-cover " />
          <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-50">
            <h3 className="text-white text-xl font-semibold">{category.name}</h3>
          </div>
        </div>
      ))}
      {extra_card && (
        <div className="relative group overflow-hidden aspect-square">
          <div className="absolute inset-0 bg-black opacity-80  flex items-center justify-center transition-opacity duration-300 ">
            <h3 className="text-white text-xl font-semibold">The Next</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesCatelog;
