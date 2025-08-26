import CategoryForm from "@/components/admin/form/CategoryForm";
import DataAPI from "@/util/server/data-util";

const category = async (): Promise<JSX.Element> => {
  const categories = await DataAPI.getData({
    modelName: "category",
    operation: "GET_DATA",
    request: { options: { populate: [{ path: "attributes" }] } },
  }).then((res) => JSON.parse(JSON.stringify(res.docs)));

  return <CategoryForm categoryListStr={categories} />;
};

const FormVsModel: Record<string, () => Promise<JSX.Element>> = {
  category,
};
export default FormVsModel;
