"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Play, Pause } from "lucide-react";
import Image from "next/image";

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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const AUTOPLAY_DELAY = 5000; // 5 seconds per slide

  const nextSlide = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  // Handle autoplay
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_DELAY);

    return () => clearInterval(interval);
  }, [api, nextSlide]);

  // Handle progress bar animation
  useEffect(() => {
    setProgress(0);
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [current]);

  // Set up carousel API
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <Card className="border-0 rounded-none">
                <CardContent className="relative p-0 h-[60vh] min-h-[500px] overflow-hidden">
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
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-4 bg-white/20 border-white/30 text-white hover:bg-white/30" />
        <CarouselNext className="right-4 bg-white/20 border-white/30 text-white hover:bg-white/30" />
      </Carousel>

      {/* Individual Progress Bars for Each Slide */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        {heroSlides.map((_, index) => (
          <div key={index} className="relative">
            {/* Background bar */}
            <div className="w-12 h-0.5 bg-white/30 rounded-full" />
            {/* Progress bar */}
            <div
              className={`absolute top-0 left-0 h-0.5 bg-white rounded-full transition-all duration-500 ease-linear ${
                index === current ? "" : "w-0"
              }`}
              style={{
                width: index === current ? `${progress}%` : index < current ? "100%" : "0%",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
