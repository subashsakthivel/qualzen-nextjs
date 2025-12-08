"use server";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TContent } from "@/schema/Content";
import Link from "next/link";
import DataAPI from "@/data/data-api";

const homePageContent: TContent[] = [
  {
    identifier: "home_page_banner",
    title: "Discover Amazing Products",
    description: "Explore our latest collection of premium items",
    bg_img: {
      img: "https://i.pinimg.com/1200x/78/93/4f/78934fc7f30fc1e3a3ea54cd14f46041.jpg",
      img_link: "/",
    },
    is_active: true,
  },
  {
    identifier: "home_page_banner",
    title: "Innovation at Its Best",
    description: "Experience cutting-edge technology and design",
    bg_img: {
      img: "https://i.pinimg.com/1200x/c4/12/5b/c4125b07e10568a098c937705337a544.jpg",
      img_link: "/",
    },
    is_active: true,
  },
  {
    identifier: "home_page_banner",
    title: "Transform Your Lifestyle",
    description: "Join thousands of satisfied customers worldwide",
    bg_img: {
      img: "https://i.pinimg.com/1200x/8b/29/6c/8b296c7735232fa1cbc69e415ac7c25b.jpg",
      img_link: "/",
    },
    is_active: true,
  },
  {
    identifier: "home_page_banner",
    title: "Premium Quality Guaranteed",
    description: "Crafted with attention to detail and excellence",
    bg_img: {
      img: "https://i.pinimg.com/1200x/c4/12/5b/c4125b07e10568a098c937705337a544.jpg",
      img_link: "/",
    },
    is_active: true,
  },
];

export default async function HeroCarousel() {
  const response = await DataAPI.getData({
    modelName: "content",
    operation: "GET_DATA_MANY",
    request: {
      options: {
        filter: {
          identifier: "home-page_banner",
          is_active: true,
        },
      },
    },
  });

  const heroSlides = (response && Array.isArray(response) ? response : []) as TContent[];

  return (
    <>
      <div className="w-full">
        {heroSlides.map((slide, index) => (
          <Card key={index} className="border-0 rounded-none">
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
