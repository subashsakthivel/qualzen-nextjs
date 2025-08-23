import CategoryForm from "@/components/admin/form/CategoryForm";

import { TCategory } from "@/schema/Category";
import DataAPI from "@/util/server/data-util";
import React from "react";

const CategoryFormPage = async () => {
  return <CategoryForm />;
};

export default CategoryFormPage;
