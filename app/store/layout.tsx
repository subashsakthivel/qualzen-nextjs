"use client";
import CoverFeatureSlides from "@/components/blocks/CoverFeatureSlides";
import { IFeatureProduct } from "@/model/FeatureProduct";
import { ProdcutStatus } from "@/utils/Enums";
import React, { ReactNode } from "react";

const data: IFeatureProduct[] = [
  {
    product: {
      category: {
        description: "vkds",
        imageSrc: "vfdlv",
        name: "vkdfv",
        properties: [],
        _id: "vdsv",
      },
      description: "dsf",
      imageSrc: [],
      marketPrice: 432,
      name: "cdsfksg",
      properties: [],
      sellingPrice: 90332,
      status: ProdcutStatus.ACTIVE,
    },
    banner_imgSrc:
      "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
    cover_imgSrc:
      "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
  },
  {
    product: {
      category: {
        description: "vkds",
        imageSrc: "vfdlv",
        name: "vkdfv",
        properties: [],
        _id: "vdsv",
      },
      description: "dsf",
      imageSrc: [],
      marketPrice: 432,
      name: "cdsfksg",
      properties: [],
      sellingPrice: 90332,
      status: ProdcutStatus.ACTIVE,
    },
    banner_imgSrc:
      "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
    cover_imgSrc:
      "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
  },
  {
    product: {
      category: {
        description: "vkds",
        imageSrc: "vfdlv",
        name: "vkdfv",
        properties: [],
        _id: "vdsv",
      },
      description: "dsf",
      imageSrc: [],
      marketPrice: 432,
      name: "cdsfksg",
      properties: [],
      sellingPrice: 90332,
      status: ProdcutStatus.ACTIVE,
    },
    banner_imgSrc:
      "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
    cover_imgSrc:
      "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
  },
];

const StoreLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="m-5 p-0 rounded-lg">
      <p className="sr-only">Feature Banner </p>
      <CoverFeatureSlides features={data} />
      {/* <div className="m-0 p-0 rounded-lg h-[600px] border shadow-bottom bg-cover bg-no-repeat bg-center bg-[url(https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg)]"></div> */}
      <div>{children}</div>
    </div>
  );
};

export default StoreLayout;
