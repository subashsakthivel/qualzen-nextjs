"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";

import Image from "next/image";

type banners = {
  title: string;
  title_link: string;
  style: string;
  unique_key: string;
  type: string;
  customComponent: {
    style: string;
    component: string;
  };
  background_img: string;
  backgroud_link: string;
  data: object;
};

const heroSlides = [
  {
    id: 1,
    title: "Discover Amazing Products",
    subtitle: "Explore our latest collection of premium items",
    image: "https://i.pinimg.com/1200x/78/93/4f/78934fc7f30fc1e3a3ea54cd14f46041.jpg",
    cta: "Shop Now",
  },
  {
    id: 2,
    title: "Innovation at Its Best",
    subtitle: "Experience cutting-edge technology and design",
    image: "https://i.pinimg.com/1200x/c4/12/5b/c4125b07e10568a098c937705337a544.jpg",
    cta: "Learn More",
  },
  {
    id: 3,
    title: "Transform Your Lifestyle",
    subtitle: "Join thousands of satisfied customers worldwide",
    image: "https://i.pinimg.com/1200x/8b/29/6c/8b296c7735232fa1cbc69e415ac7c25b.jpg",
    cta: "Get Started",
  },
  {
    id: 4,
    title: "Premium Quality Guaranteed",
    subtitle: "Crafted with attention to detail and excellence",
    image: "https://i.pinimg.com/1200x/c4/12/5b/c4125b07e10568a098c937705337a544.jpg",
    cta: "View Collection",
  },
];

export default function HeroCarousel() {
  return (
    <>
      <div className="w-full">
        {heroSlides.map((slide, index) => (
          <Card key={slide.id} className="border-0 rounded-none">
            <CardContent className="relative p-0 h-screen overflow-hidden">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-delay">
                    {slide.subtitle}
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 animate-fade-in-delay-2"
                  >
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="min-h-screen"></div>
    </>
  );
}
