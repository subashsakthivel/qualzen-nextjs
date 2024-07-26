"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import React from "react";

const ProductImageSlider = ({ slides }: { slides: { url: string }[] }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div>
      <Carousel
        setApi={setApi}
        className="flex justify-center items-center relative"
      >
        <CarouselContent className="">
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className="w-[120px] md:w-[180px] md:h-full"
            >
              <Image
                src={slide.url}
                alt="image"
                key={index}
                className="rounded-sm"
                objectFit="contain"
                height={1320}
                width={1200}
                style={{
                  width: "800",
                  height: "450px",
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute inline-block bottom-1 ">
          <CarouselNext />
          {current} / {count}
          <CarouselPrevious />
        </div>
      </Carousel>
    </div>
  );
};

export default ProductImageSlider;
