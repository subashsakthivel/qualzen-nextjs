"use client";
import InfiniteScroll from "@/components/ui/infinitescroll";
import { TProduct } from "@/schema/Product";
import { Loader2 } from "lucide-react";
import { PaginateResult } from "mongoose";
import React, { useState } from "react";
import { ProductGrid } from "./product-grid";
import DataClientAPI from "@/util/client/data-client-api";

function ProductGallery({ initialProducts }: { initialProducts: PaginateResult<TProduct> }) {
  const [products, setProducts] = useState<TProduct[]>(initialProducts.docs);
  const [hasMoreData, setHasMoreData] = useState(initialProducts.hasNextPage);
  const [page, setPage] = useState<number>(initialProducts.page ?? 1);

  const loadMoreProducts = async () => {
    if (hasMoreData) {
      debugger;
      console.log("load more products");
      const result = await DataClientAPI.getData({
        modelName: "product",
        operation: "GET_DATA",
        request: { options: { limit: 20, page } },
      });
      if (result) {
        setProducts(result.docs);
        setPage(result.page);
      }
      setHasMoreData(result?.hasNextPage ?? false);
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
