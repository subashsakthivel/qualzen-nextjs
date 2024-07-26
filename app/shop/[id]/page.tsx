"use client";
import ProductDetails from "@/components/blocks/ProductDetails";
import { ProdcutStatus } from "@/utils/Enums";
import React, { useEffect } from "react";

const ProductSalePage = () => {
  useEffect(() => {}, []);

  return (
    <ProductDetails
      product={{
        name: "ss",
        description: "dsd",
        category: {
          name: "dsfs",
          description: "sdf",
          imageSrc: "",
          properties: [],
        },
        imageSrc: [],
        properties: [],
        marketPrice: 32,
        sellingPrice: 21,
        status: ProdcutStatus.ACTIVE,
      }}
    />
  );
};

export default ProductSalePage;
