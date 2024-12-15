"use client";
import React from "react";
import InfiniteScroll from "@/components/ui/infinitescroll";
import { Loader2 } from "lucide-react";
import { IProduct } from "@/model/Product";
import { getProducts, IProductRes } from "@/utils/fetchData";
import ProductList from "@/components/productList";

const InfiniteScrollDemo = () => {
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [products, setProducts] = React.useState<IProductRes[]>([]);

  const next = async () => {
    if (hasMore) {
      const productsList = await getProducts(page, 10);
      console.log(productsList);
      setHasMore(productsList.length !== 0);
      setProducts(productsList);
      setPage((prev) => prev + 10);
    }
  };

  return (
    <div className="m-5">
      <div className="md:mx-12 mx-auto">
        <div></div>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <ProductList initialProducts={products} />
        </div>
      </div>
      <InfiniteScroll hasMore={hasMore} next={next} threshold={1}>
        {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteScrollDemo;
