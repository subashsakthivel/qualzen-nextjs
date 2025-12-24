"use server";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TContent } from "@/schema/Content";
import Link from "next/link";
import DataAPI from "@/data/data-api";
import { TProduct } from "@/schema/Product";
import { InfiniteCarousel } from "./client-components/infinite-carousel";
import ProductCard from "./blocks/ProductCard";
import ScrollReveal from "./ScrollRevealElement";

const featuredProduct: Partial<TProduct>[] = [
  {
    _id: "1",
    images: ["https://i.pinimg.com/originals/e8/3c/2c/e83c2cbf27f7bdbceea191d320a1044c.png"],
    feature_location: "home_page_top",
    name: "",
    createdAt: Date.now(),
  },
  {
    _id: "2",
    images: ["https://i.pinimg.com/736x/9f/a4/b5/9fa4b579ad7629763c22f0f5c943a861.jpg"],
    feature_location: "home_page_top",
    name: "",
    createdAt: Date.now(),
  },
  {
    _id: "3",
    images: ["https://i.pinimg.com/1200x/ca/5e/63/ca5e6358aa03e051945892e4c463ca6a.jpg"],
    feature_location: "home_page_top",
    name: "",
    createdAt: Date.now(),
  },
  {
    _id: "4",
    images: ["https://i.pinimg.com/1200x/73/c9/6e/73c96e744d759cdb1ef5fc545a74ec27.jpg"],
    feature_location: "home_page_top",
    name: "",
    createdAt: Date.now(),
  },
  {
    _id: "8",
    images: ["https://i.pinimg.com/1200x/ca/5e/63/ca5e6358aa03e051945892e4c463ca6a.jpg"],
    feature_location: "home_page_top",
    name: "",
    createdAt: Date.now(),
  },
  {
    _id: "5",
    images: ["https://i.pinimg.com/736x/3c/9f/b1/3c9fb139af1ac23fc42892f4566bbd78.jpg"],
    feature_location: "home_page_top",
    name: "",
    createdAt: Date.now(),
  },
  {
    _id: "6",
    images: ["https://i.pinimg.com/1200x/73/c9/6e/73c96e744d759cdb1ef5fc545a74ec27.jpg"],
    feature_location: "home_page_top",
    name: "",
    createdAt: Date.now(),
  },
  {
    _id: "7",
    images: ["https://i.pinimg.com/736x/9f/a4/b5/9fa4b579ad7629763c22f0f5c943a861.jpg"],
    feature_location: "home_page_top",
    name: "",
    createdAt: Date.now(),
  },
];

const essense = [
  "https://i.pinimg.com/1200x/d0/1b/bd/d01bbd1e69133a1ba1cb9aa6d8b9f366.jpg",
  "https://i.pinimg.com/1200x/4c/1e/1b/4c1e1b3f3f5f4e2f4c8e4e5f6a7b8c9d.jpg",
];

export default async function HeroCarousel() {
  const featuredProductRes = await DataAPI.getData({
    modelName: "product",
    operation: "GET_DATA_MANY",
    request: {
      options: {
        filter: {
          feature_location: "home_page_top",
          select: "images feature_location createdAt",
        },
      },
    },
  });

  const response = await DataAPI.getData({
    modelName: "content",
    operation: "GET_DATA_MANY",
    request: {
      options: {
        filter: {
          identifier: "home_page_banner",
          is_active: true,
        },
      },
    },
  }).then((res) => JSON.parse(JSON.stringify(res)));

  const heroSlides = (response && Array.isArray(response) ? response : []) as TContent[];

  return (
    <>
      <div className="min-w-full min-h-screen text-wrap max-w-full">
        <div className="min-h-max  relative min-w-max">
          <div className=" text-center h-[75vh] sticky top-2">
            <InfiniteCarousel
              items={featuredProduct.map((p) => (
                <ProductCard key={p._id} product={p} className="min-h-48" />
              ))}
              className="overflow-hidden"
            />
          </div>
          <div className="bg-black min-w-full text-center min-h-[75vh] absolute ">
            <div className="md:text-8xl text-4xl">
              <div className="font-extrabold ">
                <h1>V A R F E O</h1>
              </div>
              <div className="font-iffcs border border-spacing-1 text-gray-400 ">
                <p>DIRECT FROM MANUFACTURES</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-10 font-mono text-sm ">
              <div className=" p-5 cursor-pointer">For Bulk Orders</div>
              <div className=" p-5 cursor-pointer">Upcomming Collections</div>
              <div className=" p-5 cursor-pointer">Our Best Collections</div>
              <div className="p-5 cursor-pointer">Our Pride</div>
            </div>
          </div>
          <div className="min-h-[50vh] opacity-0">Content</div>
        </div>

        <div className="min-h-screen  relative max-w-full text-wrap">
          <div className=" text-center h-[50vh] sticky top-1/2">
            <div className="text-lg md:text-7xl font-extrabold min-w-full text-wrap grid grid-cols-1">
              <blockquote>“ Dress better Today ”</blockquote>
              <blockquote>(1). Confidence, stiched in.</blockquote>
            </div>
          </div>
          <div className=" min-w-full text-center h-[90vh] absolute">
            <Image
              src={"/test-sticker.png"}
              alt="essense"
              fill
              className="min-w-full border-b-2 border-black object-contain"
            />
            <div
              className="
              absolute -bottom-2 left-0 right-0 h-48
              bg-gradient-to-t from-black to-transparent
            "
            />
          </div>
          <div className="bg-green-600 min-h-[70vh] opacity-0">Content</div>
        </div>
        <div className="relative overflow-hidden ">
          <div className="z-10 gap-4 md:text-4xl text-lg font-extrabold grid grid-cols-2 grid-rows-4 min-h-screen w-full place-items-stretch gap-y-20 ">
            <div className="">
              <ScrollReveal
                delay={0.3}
                from="opacity-100 blur-0 translate-x-0"
                to="opacity-0 blur-sm -translate-x-10"
              >
                Helping Top Brands <span className="md:text-4xl text-lg">→</span> Become a Brand
              </ScrollReveal>
            </div>
            <div className="row-span-2 relative overflow-hidden rounded-sm bg-none">
              <Image
                src={"https://i.pinimg.com/1200x/19/9f/37/199f378723df5cb7fbdc1815e7610157.jpg"}
                fill
                className="md:object-cover object-contain  hover:scale-125 transition-transform duration-500"
                alt="Tailor work"
              />
            </div>
            <div className="row-span-2 relative overflow-hidden rounded-sm ">
              <Image
                src="https://i.pinimg.com/1200x/96/aa/1e/96aa1ed3e43d8146031defa5956aff29.jpg"
                alt=""
                className="md:object-cover object-contain  hover:scale-125 transition-transform duration-500"
                fill
              />
            </div>
            <div className="">
              <ScrollReveal
                delay={0.3}
                from="opacity-100 blur-0 translate-y-0"
                to="opacity-0 blur-sm translate-y-3"
              >
                Day 2507+ of making Comfort for You
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
