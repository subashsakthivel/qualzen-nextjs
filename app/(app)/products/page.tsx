import ProductGallery from "@/components/product-gallery";
import DataAPI from "@/util/server/data-util";

export default async function ProductsPage() {
  const result = await DataAPI.getData({
    modelName: "product",
    operation: "GET_DATA",
    request: { options: { limit: 20, page: 1 } },
  }).then((res) => JSON.parse(JSON.stringify(res)));
  return (
    <div className="container px-4 py-12 mx-auto">
      <ProductGallery initialProducts={result} />
    </div>
  );
}
