"use client";
import InfiniteScroll from "@/components/ui/infinitescroll";
import { DataSourceMap } from "@/model/DataSourceMap";
import { TProduct, TProductRes } from "@/schema/Product";
import { getDataFromServer } from "@/util/dataAPI";
import { Loader2 } from "lucide-react";
import { PaginateResult } from "mongoose";
import React, { useState } from "react";
import { ProductGrid } from "./product-grid";

function ProductGallery({ initialProducts }: { initialProducts: PaginateResult<TProductRes> }) {
  const [products, setProducts] = useState<TProductRes[]>(initialProducts.docs);
  const [hasMoreData, setHasMoreData] = useState(initialProducts.hasNextPage);
  const [page, setPage] = useState<number>(initialProducts.page ?? 1);

  const loadMoreProducts = async () => {
    if (hasMoreData) {
      debugger;
      console.log("load more products");
      // const resultData = await getDataFromServer(DataSourceMap.product, "GET_DATA", {
      //   limit: 20,
      //   page: page + 1,
      //   populate: [{ path: "variants" }],
      // });
      // console.log(resultData);
      // setHasMoreData(resultData.hasNextPage);
      // setProducts((prevProducts) => [...prevProducts, ...(resultData.docs as TProductRes[])]);
      // setPage(resultData.page ?? page + 1);
    }
  };

  return (
    <div className="m-5">
      <ProductGrid products={products} />
      <InfiniteScroll hasMore={hasMoreData} next={loadMoreProducts} threshold={1}>
        {hasMoreData && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
      </InfiniteScroll>
    </div>
  );
}

export default ProductGallery;
