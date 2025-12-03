import React from "react";
import CategoryForm from "./CategoryForm";
import ProductForm from "./ProductForm";
import { tDataModels } from "@/util/util-type";
import { Form } from "@/components/ui/form";

const FormVsModel = {
  category: CategoryForm,
  product: ProductForm,
};

const FormMap = ({ model, id }: { model: tDataModels; id?: string }) => {
  const FormComponent = FormVsModel["category"]!;
  return (
    <>
      <FormComponent id={"vnkf"} />
    </>
  );
};

export default FormMap;
