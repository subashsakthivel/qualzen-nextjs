"use client";
import { IProduct } from "@/model/Product";
import React, { useState } from "react";
import SimpleCard from "./simple-card";
import { getProducts, IProductRes } from "@/utils/fetchData";

const LIMIT = 10;
const ProductList = ({ initialProducts }: { initialProducts: IProductRes[] }) => {
  const [offset, setOffset] = useState(LIMIT);
  const [products, setProducts] = useState<IProductRes[]>(initialProducts);
  const [hasMoreData, setHasMoreData] = useState(true);
  const loadMoreProducts = async () => {
    if (hasMoreData) {
      const productsList = await getProducts(0, LIMIT);
      console.log(productsList);
      if (productsList.length == 0) {
        setHasMoreData(false);
      }

      setProducts((prevProducts) => [...prevProducts, ...productsList]);
      setOffset((prevOffset) => prevOffset + LIMIT);
    }
  };
  return (
    <>
      <div>
        {products.map((product) => (
          <SimpleCard {...product} key={product.name} redirectLink="/" />
        ))}
      </div>
      <div className="...">
        {hasMoreData ? (
          <button className="..." onClick={loadMoreProducts}>
            Load More Products
          </button>
        ) : (
          <p className="...">No more products to load</p>
        )}
      </div>
    </>
  );
};

export default ProductList;
