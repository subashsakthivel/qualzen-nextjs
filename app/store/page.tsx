"use client";
import CoverFeatureSlides from "@/components/blocks/CoverFeatureSlides";
import FastSellingProducts from "@/components/blocks/FastSellingProducts";
import FeatureTrends from "@/components/blocks/FeatureTrends";
import ProductCard from "@/components/blocks/ProductCard";
import SocialConnect from "@/components/blocks/SocialConnect";
import { IFeatureProduct } from "@/model/FeatureProduct";
import { IProduct } from "@/model/Product";
import { ProdcutStatus } from "@/utils/Enums";
import { getDateFormet } from "@/utils/formetUtil";
import { BadgePercent, BadgePercentIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
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

const products: IProduct[] = [
  {
    category: {
      description: "vkds",
      imageSrc: "vfdlv",
      name: "vkdfv",
      properties: [],
      _id: "vdsv",
    },
    description: "dsf",
    imageSrc: [
      "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
    ],
    marketPrice: 743352,
    name: "cdsfksg",
    properties: [],
    sellingPrice: 90332,
    status: ProdcutStatus.ACTIVE,
  },
  {
    category: {
      description: "vkds",
      imageSrc: "vfdlv",
      name: "vkdfv",
      properties: [],
      _id: "vdsv",
    },
    description: "dsf",
    imageSrc: [
      "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
    ],
    marketPrice: 44439982,
    name: "cdsfksg",
    properties: [],
    sellingPrice: 90332,
    status: ProdcutStatus.ACTIVE,
  },
  {
    category: {
      description: "vkds",
      imageSrc: "vfdlv",
      name: "vkdfv",
      properties: [],
      _id: "vdsv",
    },
    description: "dsf",
    imageSrc: [
      "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
    ],
    marketPrice: 4443982,
    name: "cdsfksg",
    properties: [],
    sellingPrice: 90332,
    status: ProdcutStatus.ACTIVE,
  },
  {
    category: {
      description: "vkds",
      imageSrc: "vfdlv",
      name: "vkdfv",
      properties: [],
      _id: "vdsv",
    },
    description: "dsf",
    imageSrc: [
      "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
    ],
    marketPrice: 4327789,
    name: "cdsfksg",
    properties: [],
    sellingPrice: 90332,
    status: ProdcutStatus.ACTIVE,
  },
];

const Store = () => {
  return (
    <div className="">
      <CoverFeatureSlides features={data} />
      <FeatureTrends />
      <div className="min-h-20 md:min-h-40 border shadow-lg text-start rounded-md m-5">
        <div className="text-2xl md:text-4xl m-10 underline">
          Journey of QualZen
        </div>
        <p className=" m-5 ">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate
          perspiciatis quas quis! Et at sequi debitis ipsum quos? Exercitationem
          asperiores impedit inventore consequatur fugit sequi, facere culpa ex
          placeat maiores.
        </p>
      </div>
      <FastSellingProducts className="m-5" products={products} />
    </div>
  );
};

export default Store;
