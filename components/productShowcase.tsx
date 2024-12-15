import { IProductRes } from "@/utils/fetchData";
import React from "react";
import ProductDetail from "./productDetail";
import Image from "next/image";

const ProductShowcase = (productData: IProductRes) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center items-center m-5">
      <div className="grid grid-cols-2 max-h-screen overflow-scroll">
        {productData.images.map((image, i) => (
          <div key={i} className={" relative w-full " + (i === 0 ? "h-screen col-span-2" : "h-96")}>
            <Image
              src={image}
              alt="image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        ))}
      </div>
      <div>
        <ProductDetail />
      </div>
    </div>
  );
};

export default ProductShowcase;
