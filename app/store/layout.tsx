"use client";
import CoverFeatureSlides from "@/components/blocks/CoverFeatureSlides";
import SocialConnect from "@/components/blocks/SocialConnect";
import { IFeatureProduct } from "@/model/FeatureProduct";
import { ProdcutStatus } from "@/utils/Enums";
import Link from "next/link";
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
    <div className="relative flex flex-col  justify-between">
      <p className="sr-only">Feature Banner </p>
      <div className="mx-y">{children}</div>
    </div>
  );
};

export default StoreLayout;
