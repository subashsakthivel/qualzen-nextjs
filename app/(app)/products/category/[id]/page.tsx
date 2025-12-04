import ProductGallery from "@/components/product-gallery";
import DataAPI from "@/data/data-api";
import React from "react";

export default async function ProductsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: categoryId } = await params;
  const result = await DataAPI.getData({
    modelName: "product",
    operation: "GET_DATA",
    request: {
      options: {
        limit: 20,
        page: 1,
        filter: { field: "category", operator: "equals", value: categoryId },
      },
    },
  }).then((res) => JSON.parse(JSON.stringify(res)));
  return (
    <div className="container px-4 py-12 mx-auto">
      <ProductGallery initialProducts={result} />
    </div>
  );
}
