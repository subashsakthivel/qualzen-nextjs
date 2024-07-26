"use client";
import React from "react";
import InfiniteScroll from "@/components/ui/infinitescroll";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/blocks/ProductCard";
import { IProduct } from "@/model/Product";

interface ProductListResponse {
  products: IProduct[];
  hasMore: boolean;
}

const InfiniteScrollDemo = () => {
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [products, setProducts] = React.useState<IProduct[]>([]);

  const next = async () => {
    if (hasMore) {
      setLoading(true);

      await fetch(`/api/products?pageIndex=${page}&pageLimit=20`)
        .then(async (res) => {
          if (res.status === 200) {
            const resJson = await res.json();
            const hasMore: boolean = resJson.data.hasMore;
            const products: IProduct[] = resJson.data.products;
            setProducts((prev) => [...prev, ...products]);
            setPage((prev) => prev + 1);
            setHasMore(hasMore);
          } else {
            console.log("Error while getting data ", res);
          }
        })
        .finally(() => setLoading(false));
    } else {
      console.log("nothing left to load");
    }
  };

  return (
    <div className="m-5">
      <div className="md:mx-12 mx-auto">
        <div></div>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      <InfiniteScroll
        hasMore={hasMore}
        isLoading={loading}
        next={next}
        threshold={1}
      >
        {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteScrollDemo;
