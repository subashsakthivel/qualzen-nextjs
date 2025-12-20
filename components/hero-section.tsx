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
      <div className="w-full">
        <div>
          <InfiniteCarousel
            items={featuredProduct.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
            className=""
          />
        </div>
        {heroSlides.map((slide, index) => (
          <Card key={index} className="border-0 rounded-none mb-2">
            <CardContent className="relative p-0 h-screen overflow-hidden">
              {slide.bg_img?.img &&
                (slide.bg_img?.img_link ? (
                  <Link href={slide.bg_img.img_link}>
                    <Image
                      src={slide.bg_img.img}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </Link>
                ) : (
                  <Image
                    src={slide.bg_img.img}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                ))}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-delay">
                    {slide.description}
                  </p>
                  {slide.click_action?.text && slide.click_action?.action && (
                    <Link href={slide.click_action.action}>
                      <Button
                        size="lg"
                        className="bg-white text-black hover:bg-gray-100 animate-fade-in-delay-2"
                      >
                        {slide.click_action?.text}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
