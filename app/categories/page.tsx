import React from "react";
import { fetchAllCategories } from "../api/categories/util";
import SimpleCard from "@/components/simple-card";

const Categories = async () => {
  const categoryList = await fetchAllCategories();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 w-full xl:grid-cols-4 m-5">
      {categoryList.map((category, i) => (
        <SimpleCard
          key={i}
          {...category}
          name={category.name}
          redirectLink="/"
          image={category.image}
          className="w-full sm:h-[20vh] md:h-[50vh] h-[25vh]"
        />
      ))}
    </div>
  );
};

export default Categories;
