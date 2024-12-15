import ProductShowcase from "@/components/productShowcase";
import { getProduct } from "@/utils/fetchData";
import React from "react";

const ProductDetails = async ({ params }: { params: Promise<{ id: string[] }> }) => {
  const queries = await params;
  const productData = await getProduct(queries.id[0] as string);

  return (
    <>
      <ProductShowcase {...productData} />
    </>
  );
};

export default ProductDetails;
