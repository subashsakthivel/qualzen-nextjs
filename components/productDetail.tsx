"use client";
import { IProperty } from "@/model/Product";
import { IProductRes } from "@/utils/fetchData";
import Link from "next/link";
import React from "react";

const specialFields = ["color", "size"];

export interface ProductDetailInterface extends IProductRes {
  specialFieldsValues: IProperty[];
}

const ProductDetail = ({ specialFieldsValues, ...productData }: ProductDetailInterface) => {
  return (
    <div className="grid grid-flow-row gap-5 ">
      <div>
        <div className="font-bold">{productData.name}</div>
        <div className="inline-flex gap-5 font-semibold">
          <div className="text-red-600">{productData.sellPrice}</div>
          <div className="line-through">{productData.marketPrice}</div>
        </div>
      </div>
      <div>Other products</div>

      <div className="my-5 ">
        {specialFieldsValues.map((property, i) => (
          <div key={i}>
            <div className="font-semibold m-2">{property.name.toUpperCase()}</div>
            <div className="flex gap-3">
              {property.value.map((v, i) => (
                <div
                  key={i}
                  className={`border p-3 min-w-10 text-center ${
                    property.name === "color" && !v.startsWith("bg-") ? "bg-" + v + "-500 " : ""
                  }`}
                >
                  {!(property.name === "color" && !v.startsWith("bg-")) ? v : ""}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-evenly items-center gap-5 w-full text-center font-bold">
        <div className="border bg-primary text-secondary w-full p-3">Add to Cart</div>
        <div className="border bg-primary text-secondary w-full p-3">Buy Now</div>
      </div>
      <div>
        {productData.properties.map((property, i) => (
          <div key={i} className="flex gap-3 flex-wrap">
            <div className="font-medium  min-w-16">{property.name}</div>
            <div>
              {
                <div className="inline-flex justify-start gap-3">
                  {property.value.map((val, i) => (
                    <div key={i}>{val}</div>
                  ))}
                </div>
              }
            </div>
          </div>
        ))}
      </div>
      <div>
        <Link href={`/chart/${productData.uid}`}>Size Chart Link</Link>
      </div>
      <div>{productData.description}</div>
      <div>{productData.tags}</div>
    </div>
  );
};

export default ProductDetail;
