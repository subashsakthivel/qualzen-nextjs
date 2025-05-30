"use server";
import SelectValueFromList from "@/components/admin/SelectValueFromList";
import CategoryForm from "@/components/admin/form/CategoryForm";
import { DataModel } from "@/model/DataModels";
import { TCategory } from "@/schema/Category";
import { getData } from "@/util/dataAPI";
import React from "react";

const CategoryFormPage = async () => {
  const categorySelectComponent = await getData(DataModel.category, "GET_DATA", {}).then((data) => (
    <SelectValueFromList
      name="parentCategory"
      list={[
        { name: "None", _id: "none" },
        ...data.docs.map((cat: TCategory) => ({ name: cat.name, _id: cat._id.toString() })),
      ]}
    />
  ));
  return <CategoryForm categorySelectComponent={categorySelectComponent} />;
};

export default CategoryFormPage;
