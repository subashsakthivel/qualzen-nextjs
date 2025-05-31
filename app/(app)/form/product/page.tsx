"use server";
import SelectValueFromList from "@/components/admin/SelectValueFromList";
import ProductForm from "@/components/admin/form/ProductForm";
import { DataModel } from "@/model/DataModels";
import { TCategory } from "@/schema/Category";
import { getData } from "@/util/dataAPI";
import React from "react";

const ProductFormPage = async () => {
  return <ProductForm />;
};

export default ProductFormPage;
