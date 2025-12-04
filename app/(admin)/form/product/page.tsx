"use server";
import ProductForm from "@/components/admin/form/ProductForm";
import { TCategory } from "@/schema/Category";
import DataAPI from "@/data/data-api";
import React from "react";
const ProductFormPage = async () => {
  const categoryList = await DataAPI.getData({
    modelName: "category",
    operation: "GET_DATA",
    request: { options: { populate: [{ path: "attributes" }] } },
  }).then((res) => JSON.stringify(res.docs));

  return <ProductForm categoryListStr={categoryList} />;
};

export default ProductFormPage;
