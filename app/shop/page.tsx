"use client";
import React from "react";
import InfiniteScroll from "@/components/ui/infinitescroll";
import { Loader2 } from "lucide-react";
import { ProductType } from "@/utils/VTypes";
import ProductCard from "@/components/blocks/ProductCard";
import { ProdcutStatus } from "@/utils/Enums";

interface ProductListResponse {
  products: ProductType[];
  hasMore: boolean;
}

const InfiniteScrollDemo = () => {
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [products, setProducts] = React.useState<ProductType[]>([]);

  const next = async () => {
    setLoading(true);

    /**
     * Intentionally delay the search by 800ms before execution so that you can see the loading spinner.
     * In your app, you can remove this setTimeout.
     **/
    setTimeout(async () => {
      console.log(products);
      const data: ProductListResponse = {
        hasMore: true,
        products: [
          {
            _id: "sdvsdvs",
            category: {
              name: "gooo",
              properties: [],
            },
            description: "csdfsd",
            imageUrls: [
              "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
              "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
            ],
            marketPrice: 100,
            sellingPrice: 900,
            name: "cksdv",
            status: ProdcutStatus.ACTIVE,
          },
          {
            _id: "sdvsdvs",
            category: {
              name: "gooo",
              properties: [],
            },
            description: "csdfsd",
            imageUrls: [
              "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
              "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
            ],
            marketPrice: 100,
            sellingPrice: 900,
            name: "cksdv",
            status: ProdcutStatus.ACTIVE,
          },
          {
            _id: "sdvsdvs",
            category: {
              name: "gooo",
              properties: [],
            },
            description: "csdfsd",
            imageUrls: [
              "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
              "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
            ],
            marketPrice: 100,
            sellingPrice: 900,
            name: "cksdv",
            status: ProdcutStatus.ACTIVE,
          },

          {
            _id: "sdvsdvs",
            category: {
              name: "gooo",
              properties: [],
            },
            description: "csdfsd",
            imageUrls: [
              "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
              "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
            ],
            marketPrice: 100,
            sellingPrice: 900,
            name: "cksdv",
            status: ProdcutStatus.ACTIVE,
          },
        ],
      };
      setProducts((prev) => [...prev, ...data.products]);
      setPage((prev) => prev + 1);
      console.log(products);
      // Usually your response will tell you if there is no more data.
      if (data.products.length < 3) {
        setHasMore(false);
      }
      setLoading(false);
    }, 800);
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
