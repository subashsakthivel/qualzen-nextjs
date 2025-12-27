import React from "react";
import ProductShowcase from "@/components/productShowcase";
import DataAPI from "@/data/data-api";

export default async function ProductView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const response = await DataAPI.getData({
    modelName: "product",
    operation: "GET_DATA_BY_ID",
    request: { id },
  }).then((res) => JSON.parse(JSON.stringify(res)));

  if (!response) {
    return <>Not Available</>;
  }

  const product = response;

  return <ProductShowcase product={product} />;
}
