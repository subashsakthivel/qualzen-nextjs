import React from "react";
import SimpleCard from "./simple-card";
import { IProductRes } from "@/utils/fetchData";

const ProductList = ({ initialProducts }: { initialProducts: IProductRes[] }) => {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 w-full xl:grid-cols-4">
        {initialProducts.map((product) => (
          <SimpleCard
            {...product}
            image={product.images}
            key={product.name}
            redirectLink={`/${product.uid}/${product.name.replaceAll(" ", "-")}`}
            className="w-full sm:h-[25vh] md:h-[50vh] h-[30vh]"
          />
        ))}
      </div>
    </>
  );
};

export default ProductList;
