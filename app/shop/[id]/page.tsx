"use client";
import ProductDetails from "@/components/blocks/ProductDetails";
import { ProdcutStatus } from "@/utils/Enums";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IProduct } from "@/model/Product";

const ProductSalePage = () => {
  const [product, setProduct] = useState<IProduct>();
  const router = useRouter();
  useEffect(() => {
    const id = router.query.id?.toString();
    if (id === undefined) {
      return;
    }
    const resData = async (id: string) => {
      await fetch("/api/products" + new URLSearchParams({ id }))
        .then(async (res) => {
          if (res.status == 200) {
            const data = await res.json();
            setProduct(data);
          }
        })
        .catch((err) => console.log(err));
    };
    resData(id);
  }, [router]);

  return (
    <>{product ? <ProductDetails product={product} /> : <div>Loding...</div>}</>
  );
};

export default ProductSalePage;
