"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { IFeatureProduct } from "@/model/FeatureProduct";
import React from "react";
import { Button } from "../ui/button";
import Autoplay from "embla-carousel-autoplay";
const CoverFeatureSlides = ({ features }: { features: IFeatureProduct[] }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  function jumpToSlide(index: number) {
    if (!api) {
      return;
    }

    api.scrollTo(index);
  }

  return (
    <div className="">
      <Carousel
        setApi={setApi}
        className="flex justify-center items-center relative"
        plugins={[Autoplay()]}
      >
        <CarouselContent className="">
          {features.map((feature, index) => (
            <CarouselItem key={index} className="flex h-svh w-svw">
              <div
                className={`m-0 p-0 flex items-end  rounded-lg h-full w-full max-h-screen max-w-screen border shadow-bottom bg-cover bg-no-repeat bg-center bg-[url(${
                  "'" + feature.banner_imgSrc.toString() + "'"
                })]`}
              >
                <div className=" m-20 space-x-5">
                  <Button className="bg-secondary text-primary hover:bg-secondary/90">
                    Shop Now
                  </Button>
                  <Button>Buy Now</Button>
                </div>
              </div>
              <div className="w-0"></div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className=" flex gap-2 justify-center m-2">
        {[...Array(features.length)].map((_, i) => (
          <div
            key={i}
            className={`p-1 rounded-full border ${
              current === i + 1 ? "bg-primary" : "bg-primary/60"
            }`}
            onClick={() => jumpToSlide(i)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CoverFeatureSlides;
