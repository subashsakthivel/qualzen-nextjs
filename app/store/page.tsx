import CoverFeatureSlides from "@/components/blocks/CoverFeatureSlides";
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
  function getOfferPercentage(marketPrice: number, sellingPrice: number) {
    const offer = ((marketPrice - sellingPrice) / marketPrice) * 100;
    return Math.ceil(offer);
  }
  return (
    <div className="">
      <CoverFeatureSlides features={data} />
      <div className="grid gap-3 grid-cols-2 place-items-center items-center justify-center  ">
        <div className="lg:text-4xl  min-w-full text-2xl text-wrap  relative col-span-2 text-center bg-gradient-to-r from-slate-300 to-slate-500">
          Trend with QualZen
        </div>
        <div>
          <Image
            src={
              "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg"
            }
            width={180}
            height={180}
            alt="ckd"
            className=" lg:w-[400px] w-[160px] md:w-[300px] rounded-md shadow-2xl border-2 border-primary border-r-8 border-b-8 "
          />
        </div>

        <div className="relative">
          <div className="border m-5 min-h-20 md:min-h-40 rounded-lg relative text-xs md:text-base">
            <div className="bg-primary text-secondary font-semibold p-1 rounded-t-lg">
              QualZen
            </div>
            <div className=" m-3 mb-8">
              Thanks for spreding positivity with us
            </div>
            <div className="bottom-0 right-0 m-2 absolute text-xs opacity-50">
              {getDateFormet(Date.now())}
            </div>
          </div>
          <div className="lg:text-6xl text-2xl  font-thin hidden md:block min-w-96 left-0">
            <span>Use</span>
            <div className=" bg-primary text-secondary skew-x-12 ml-1 underline px-1 transform-gpu">
              #LoveToQualZen
            </div>
          </div>
        </div>
        <div className="sm:hidden lg:text-6xl text-2xl relative font-thin">
          <span>Use</span>
          <span className=" bg-primary text-secondary  skew-x-12  absolute ml-1 underline px-1 ">
            #LoveToQualZen
          </span>
        </div>
      </div>
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
      <div className="m-5">
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
                  {getOfferPercentage(
                    product.marketPrice,
                    product.sellingPrice
                  )}
                  %
                </span>
              </div>

              <div className="text-lg ">
                <span>{product.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;
