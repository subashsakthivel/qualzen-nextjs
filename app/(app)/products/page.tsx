import ProductGallery from "@/components/product-gallery";
import DataAPI from "@/data/data-api";

export default async function ProductsPage() {
  const result = await DataAPI.getData({
    modelName: "product",
    operation: "GET_DATA",
    request: { options: { limit: 20, page: 1 } },
  });
  if (!result) return <>Something went wrong !</>;
  const products = JSON.parse(JSON.stringify(result));
  return (
    <div className="container px-4 py-12 mx-auto">
      <ProductGallery initialProducts={products} />
    </div>
  );
}
