"use server";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TContent } from "@/schema/Content";
import Link from "next/link";
import DataAPI from "@/data/data-api";

export default async function HeroCarousel() {
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
