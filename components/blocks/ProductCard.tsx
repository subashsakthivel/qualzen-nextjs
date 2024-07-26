"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { IProduct } from "@/model/Product";

const priceFromater = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
});

const ProductCard = ({ product }: { product: IProduct }) => {
  const [imageIndex, setImageIndex] = useState(0);
  return (
    <div className="group relative mt-10  ">
      <div
        className="aspect-h-1 aspect-w-1  overflow-hidden lg:aspect-none"
        onMouseEnter={() => setImageIndex(1)}
        onMouseLeave={() => setImageIndex(0)}
      >
        <Image
          alt="Product Image"
          width={"196"}
          height={"150"}
          className="h-full w-full  lg:h-full lg:w-full rounded-t-lg  hover:scale-105 duration-1000 object-contain"
          src={product.imageSrc[imageIndex]}
          objectFit="contain"
        />
      </div>
      <div className="mx-2 mt-1 flex justify-between ">
        <div>
          <h3 className="text-xl font-semibold">
            <Link href={`/product/${product._id}`}>
              <span aria-hidden="true" className="inset-0 ml-5"></span>
              {product.name}
            </Link>
          </h3>
        </div>
        <div className="">
          <Badge variant={"outline"} className="line-through mr-3">
            {priceFromater.format(product.marketPrice)}
          </Badge>
          <Badge>{priceFromater.format(product.sellingPrice)}</Badge>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

{
  /* <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <img
          src="https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
          alt="Front of men&#039;s Basic Tee in black."
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href="#">
              <span aria-hidden="true" className="absolute inset-0"></span>
              Basic Tee
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500">Black</p>
        </div>
        <p className="text-sm font-medium text-gray-900">$35</p>
      </div>
    </div> */
}
