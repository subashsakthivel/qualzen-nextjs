import { IProduct } from "@/model/Product";
import Image from "next/image";
import React from "react";

interface FastSellingProductsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  products: IProduct[];
}

const FastSellingProducts = ({
  products,
  className,
}: FastSellingProductsProps) => {
  function getOfferPercentage(marketPrice: number, sellingPrice: number) {
    const offer = ((marketPrice - sellingPrice) / marketPrice) * 100;
    return Math.ceil(offer);
  }
  return (
    <div className={className}>
      <div className="text-2xl font-bold underline uppercase my-5">
        FAST SELLING PRODUCTS
      </div>
      <div className="grid grid-rows-2 grid-cols-2 lg:grid-rows-1 lg:grid-cols-4 gap-3 md:gap-5  ">
        {products.map((product, i) => (
          <div key={i} className=" flex flex-col items-center justify-center">
            <div className="relative">
              <Image
                src={product.imageSrc[0]}
                width={180}
                height={180}
                alt="ckd"
                key={i}
                className="lg:w-[400px] w-[160px] md:w-[300px] rounded-md"
              />
              <span className="absolute  top-0 right-0 px-4  -rotate-90 bg-primary text-secondary  text-sm text-center">
                {getOfferPercentage(product.marketPrice, product.sellingPrice)}%
              </span>
            </div>

            <div className="text-lg ">
              <span>{product.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FastSellingProducts;
