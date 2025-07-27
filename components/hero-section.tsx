"use client"; // can make this server componetn without autoplay
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
export function HeroSection() {
  return (
    <>
      <Carousel
        className="absolute h-full w-full top-0 "
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 7000,
            stopOnInteraction: true,
          }),
        ]}
      >
        <CarouselContent className="relative">
          <CarouselItem>
            <Card>
              <CardContent className="p-0">
                <div className="relative w-screen h-screen">
                  <Image
                    src={"https://i.pinimg.com/1200x/78/93/4f/78934fc7f30fc1e3a3ea54cd14f46041.jpg"}
                    alt="tss"
                    fill
                    className="object-cover"
                  />
                  <div className="w-full gap-10 absolute bottom-20 flex justify-center">
                    <CarouselPrevious className="left-1/3" />

                    <Button className="shadow-lg px-10 bg-gradient-to-r from-red-900 via-yellow-500  text-white font-bold relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 hover:shadow-lg hover:shadow-primary/25">
                      Shop Now
                    </Button>
                    <Button className="shadow-lg px-10 bg-gradient-to-r from-red-900 via-yellow-500  text-white font-bold relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 hover:shadow-lg hover:shadow-primary/25">
                      Explore
                    </Button>
                    <CarouselNext className="right-1/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card>
              <CardContent className="p-0">
                <div className="relative w-screen h-screen">
                  <Image
                    src={"https://i.pinimg.com/1200x/c4/12/5b/c4125b07e10568a098c937705337a544.jpg"}
                    alt="tss"
                    fill
                    className="object-cover"
                  />
                  <div className="w-full gap-10 absolute bottom-20 flex justify-center">
                    <CarouselPrevious className=" bg-black  left-10" />

                    <Button className="shadow-lg px-10 bg-gradient-to-r from-red-900 via-yellow-500  text-white font-bold relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 hover:shadow-lg hover:shadow-primary/25">
                      Shop Now
                    </Button>
                    <Button className="shadow-lg px-10 bg-gradient-to-r from-red-900 via-yellow-500  text-white font-bold relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 hover:shadow-lg hover:shadow-primary/25">
                      Explore
                    </Button>
                    <CarouselNext className=" bg-black  right-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card>
              <CardContent className="p-0">
                <div className="relative w-screen h-screen">
                  <Image
                    src={"https://i.pinimg.com/1200x/8b/29/6c/8b296c7735232fa1cbc69e415ac7c25b.jpg"}
                    alt="tss"
                    fill
                    className="object-cover "
                  />
                  <div className="w-full gap-10 absolute bottom-20 flex justify-center">
                    <CarouselPrevious className=" bg-black  left-10" />

                    <Button className="shadow-lg px-10 bg-gradient-to-r from-red-900 via-yellow-500  text-white font-bold relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 hover:shadow-lg hover:shadow-primary/25">
                      Shop Now
                    </Button>
                    <Button className="shadow-lg px-10 bg-gradient-to-r from-red-900 via-yellow-500  text-white font-bold relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 hover:shadow-lg hover:shadow-primary/25">
                      Explore
                    </Button>
                    <CarouselNext className=" bg-black  right-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div className="min-h-screen"></div>
    </>
  );
}
