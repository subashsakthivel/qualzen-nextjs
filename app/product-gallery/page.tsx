import ClientComponent from "@/components/ClientComponent";
import ProductList from "@/components/productList";
import { IProduct } from "@/model/Product";
import { getData, getProducts } from "@/utils/fetchData";
import React from "react";

async function ProductGallery() {
  const products = await getProducts(0, 10);

  const data = await getData();
  return (
    <>
      <ProductList initialProducts={products} />
    </>
  );
}

export default ProductGallery;
