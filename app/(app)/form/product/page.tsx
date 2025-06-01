"use server";
import ProductForm from "@/components/admin/form/ProductForm";
import { DataModel } from "@/model/DataModels";
import { TCategory } from "@/schema/Category";
import { FetchDataParams, getData } from "@/util/dataAPI";
import React from "react";
const item = [{ name: "chvsjvbsv" }];
const ProductFormPage = async () => {
  const options: FetchDataParams = { populate: [{ path: "attributes" }] };
  const categoryData = await getData(DataModel["category"], "GET_DATA", options);
  const categoryList = JSON.parse(JSON.stringify(categoryData.docs)) as TCategory[];

  return <ProductForm categoryList={categoryList} />;
};

export default ProductFormPage;
