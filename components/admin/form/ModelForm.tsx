import CategoryForm from "@/components/admin/form/CategoryForm";
import ProductForm from "@/components/admin/form/ProductForm";
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
    request: { options: { populate: [{ path: "attributes" }], select: {_id : 1 , name: 1 , category: 1 } } },
  }).then((res) => {
    const docs = JSON.parse(JSON.stringify(res.docs));
    docs.map((doc : any) => {
      doc.link = `/product/${doc._id}`;
    })
    return docs
  });

  return <ProductForm categories={categories} />;
};

const ModelForm: Record<string, () => Promise<JSX.Element>> = {
  category,
  product,
};

export default ModelForm;
