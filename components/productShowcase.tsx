import { IProductRes } from "@/utils/fetchData";
import React from "react";
import ProductDetail, { ProductDetailInterface } from "./productDetail";
import Image from "next/image";
import { IProperty } from "@/model/Product";

const specialFields = ["color", "size"];

const ProductShowcase = (productData: IProductRes) => {
  const specialFieldsValues: IProperty[] = [];
  function processProductData(): ProductDetailInterface {
    productData.properties.forEach((property) => {
      // todo : include this before indexing
      if (specialFields.includes(property.name)) {
        if (property.name !== "color") {
          property.value.sort().forEach((val, index) => {
            property.value[index] = val.toUpperCase();
          });
        }
        specialFieldsValues.push(property);
      }
    });
    return { ...productData, specialFieldsValues };
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center m-5">
      <div className="grid grid-cols-2 max-h-screen overflow-scroll gap-1">
        {productData.images.map((image, i) => (
          <div key={i} className={" relative w-full " + (i === 0 ? "h-[85vh] col-span-2" : "h-96")}>
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
        <ProductDetail {...processProductData()} />
      </div>
    </div>
  );
};

export default ProductShowcase;
