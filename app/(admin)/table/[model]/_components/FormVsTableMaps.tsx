import CategoryForm from "@/components/admin/form/CategoryForm";
import ProductForm from "@/components/admin/form/ProductForm";
import { TCategory } from "@/schema/Category";
import { TCategorySpecificAttributes } from "@/schema/CategorySpecificAttributes";
import DataAPI from "@/util/server/data-util";

const category = async (): Promise<JSX.Element> => {
  const categories = await DataAPI.getData({
    modelName: "category",
    operation: "GET_DATA",
    request: {},
  }).then((res) => JSON.parse(JSON.stringify(res.docs)));
  const categoryspecificAttributes = await DataAPI.getData({
    modelName: "categoryspecificattributes",
    operation: "GET_DATA_MANY",
    request: {},
  }).then((res) => JSON.parse(JSON.stringify(res)));
  return <CategoryForm categories={categories} existingAttributes={categoryspecificAttributes} />;
};

const product = async () => {
  const categories = await DataAPI.getData({
    modelName: "category",
    operation: "GET_DATA",
    request: { options: { populate: [{ path: "attributes" }], select: { image: 0 } } },
  }).then((res) => JSON.parse(JSON.stringify(res.docs)));

  return <ProductForm categories={categories} />;
};

const FormVsModel: Record<string, () => Promise<JSX.Element>> = {
  category,
  product,
};
export default FormVsModel;
