import ProductGallery from "@/components/product-gallery";
import { ProductGrid } from "@/components/product-grid";
import { DataModel } from "@/model/DataModels";
import { DataSourceMap } from "@/model/DataSourceMap";
import { TProductRes } from "@/schema/Product";
import { getData } from "@/util/dataAPI";

export default async function ProductsPage() {
  const initResponse = await getData<TProductRes>(DataModel.product, "GET_DATA", {
    populate: [{ path: "variants" }],
    limit: 20,
  });
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 mb-12">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground max-w-[600px]">
          Browse our complete collection of premium clothing
        </p>
      </div>
      <ProductGallery initialProducts={initResponse} />
    </div>
  );
}
