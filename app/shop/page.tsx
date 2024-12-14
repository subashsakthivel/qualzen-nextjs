"use client";
import React from "react";
import InfiniteScroll from "@/components/ui/infinitescroll";
import { Loader2 } from "lucide-react";
import { IProduct } from "@/model/Product";
import { getProducts } from "@/utils/fetchData";
import ProductList from "@/components/productList";

const InfiniteScrollDemo = () => {
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [products, setProducts] = React.useState<IProduct[]>([]);

  const next = async () => {
    if (hasMore) {
      console.log("data");
      const productsList = await fetch("http://localhost:3000/api/products").then((res) =>
        res.json()
      );
      console.log(productsList);
      setHasMore(false);
      setProducts(productsList.data);
      setPage((prev) => prev + 1);
    } else {
      console.log("nothing left to load");
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
        {<Loader2 className="my-4 h-8 w-8 animate-spin" />}
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteScrollDemo;
