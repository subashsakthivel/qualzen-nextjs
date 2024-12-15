"use client";
import ProductList from "@/components/productList";
import InfiniteScroll from "@/components/ui/infinitescroll";
import { getProducts, IProductRes } from "@/utils/fetchData";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

const LIMIT = 10;

function ProductGallery() {
  const [offset, setOffset] = useState(0);
  const [products, setProducts] = useState<IProductRes[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const loadMoreProducts = async () => {
    if (hasMoreData) {
      const productsList = await getProducts(offset, LIMIT);
      console.log(productsList);
      setHasMoreData(productsList.length !== 0);
      setProducts((prevProducts) => [...prevProducts, ...productsList]);
      setOffset((prevOffset) => prevOffset + LIMIT);
    }
  };

  return (
    <div className="m-5">
      <ProductList initialProducts={products} />
      <InfiniteScroll hasMore={hasMoreData} next={loadMoreProducts} threshold={1}>
        {hasMoreData && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
      </InfiniteScroll>
    </div>
  );
}

export default ProductGallery;
