"use client";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import { getCurrencyFormet } from "@/utils/formetUtil";
import Image from "next/image";
import React, { useState } from "react";
import { ProdcutStatus } from "@/utils/Enums";
import { CashOnDelivery, DeliveryIcon, EasyExchange } from "../svg";
import ProductImageSlider from "./ProductImageSlider";
import { IProduct } from "@/model/Product";

const size = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductDetails = ({ product }: { product: IProduct }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [propIndex, setPropIndex] = useState(-1);
  const [cartCount, setCartCount] = useState(0);

  function getStatusStyle(status: ProdcutStatus) {
    switch (status) {
      case ProdcutStatus.ACTIVE:
        return "border-gray-300";
      case ProdcutStatus.DRAFT:
        return "border-violet-300 bg-violet-50";
      case ProdcutStatus.SOLD:
        return "bg-gray-300 text-secondary";
      case ProdcutStatus.ARCHIVED:
        return "border-red-300 bg-rose-100";
    }
  }

  async function addOrRemoveToCart() {
    await fetch("/api/products/", {
      method: "POST",
      body: JSON.stringify({
        userId: "sfkg",
        product: product._id,
        action: cartCount !== 0 ? "REMOVE" : "ADD",
      }),
    });
  }

  function getSizeDetails(availableSize: string[]) {
    const sizeDetails: {
      size: string;
      available: boolean;
      selected: boolean;
    }[] = [];
    size.map((s) => {
      const available = availableSize.includes(s);
      const sDetail = { size: s, available: available, selected: false };
      sizeDetails.push(sDetail);
    });
    return sizeDetails;
  }

  const prevSlide = () => {
    const isFirstSlide = currentImage === 0;
    const nextImage = isFirstSlide
      ? product.imageSrc.length - 1
      : currentImage - 1;
    setCurrentImage(nextImage);
  };

  return (
    <div className="flex justify-center">
      <div className="grid lg:mx-10">
        <div className="grid gap-2 lg:grid-flow-col justify-center lg:justify-center ">
          <div className="hidden lg:inline-flex ">
            <div className="w-fit flex justify-center">
              <div className="overflow-hidden lg:w-[370px]">
                <Image
                  width={"180"}
                  height={"220"}
                  alt={product.name}
                  className="rounded-3xl  w-full"
                  objectFit="contain"
                  src={product.imageSrc[0]}
                />
                <div className="mt-5 overflow-x-auto flex gap-5">
                  {product.imageSrc.map((img, index) => (
                    <Image
                      width={"180"}
                      height={"220"}
                      key={index}
                      alt={product.name}
                      className="rounded-md"
                      objectFit="contain"
                      src={img}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="inline-block lg:hidden relative mx-2 overflow-hidden">
            <div className="">
              <ProductImageSlider
                slides={product.imageSrc.map((img) => {
                  return { url: img };
                })}
              />
            </div>
          </div>

          <div className=" px-5 space-y-5">
            <div className="lg:text-4xl md:text-3xl text-xl font-bold mb-3">
              {product.name.toLocaleUpperCase()}
            </div>
            <div className="space-x-5 items-center">
              <span className="line-through opacity-50">
                {getCurrencyFormet(product.marketPrice)}
              </span>
              <span className="font-semibold">
                {getCurrencyFormet(product.sellingPrice)}
              </span>
              <span
                className={`border px-3 py-1 text-sm rounded-full ${getStatusStyle(
                  product.status
                )}`}
              >
                {product.status}
              </span>
            </div>
            {product.size && (
              <div className="my-5 font-mono">
                <p className="font-mono">Size</p>
                <div className="flex flex-wrap justify-between items-center gap-5">
                  {getSizeDetails(product.size).map((sD, i) => (
                    <div
                      key={i}
                      className={`border px-4 py-1 ${
                        sD.available ? "" : "opacity-50  line-through"
                      } ${
                        sD.selected
                          ? "text-secondary bg-secondary-foreground"
                          : ""
                      }`}
                    >
                      {sD.size}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <button
                className={`border bg-secondary-foreground text-secondary w-full px-4 py-2 rounded-full`}
                onClick={addOrRemoveToCart}
              >
                {cartCount === 0 ? "ADD TO CART" : "REMOVE FROM CART"}
              </button>
            </div>
            <div>
              <pre className="opacity-70">{product.description}</pre>
            </div>
            <div className="divide-y divide-gray-400 ">
              {product.properties.map((property, i) => (
                <div key={i} className="py-3 cursor-pointer">
                  <div className="flex justify-between ">
                    <div className="font-semibold">{property.name}</div>
                    <ChevronDownIcon
                      className="cursor-pointer"
                      onClick={() =>
                        setPropIndex((index) => (index == i ? -1 : i))
                      }
                    />
                  </div>
                  <div
                    className={`${
                      i == propIndex ? "" : "hidden"
                    } opacity-60 duration-1000`}
                  >
                    {property.value}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center  text-xs md:gap-10 gap-5  justify-center mx-2">
              <div>
                <CashOnDelivery className="md:text-7xl text-6xl" />
                <p>Cash On Delivery</p>
              </div>
              <div>
                <EasyExchange className="md:text-7xl text-6xl" />
                Easy exchange policy
              </div>
              <div>
                <DeliveryIcon className="md:text-7xl text-6xl" />
                Shipping policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
