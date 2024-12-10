import React from "react";
import { fetchAllCategories } from "../api/categories/util";
import SimpleCard from "@/components/simple-card";

const Categories = async () => {
  const categoryList = await fetchAllCategories();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-2 m-2">
      {categoryList.map((category, i) => (
        <SimpleCard
          key={i}
          {...category}
          name={category.name}
          redirectLink="/"
          image={category.image}
        />
      ))}
    </div>
  );
};

export default Categories;
