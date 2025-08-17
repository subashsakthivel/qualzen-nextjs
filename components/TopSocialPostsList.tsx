import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaReddit,
  FaRedditAlien,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

const socialPosts = [
  {
    id: 1,
    title: "Fashion Trends 2024: What to Expect",
    excerpt: "Discover the upcoming trends that will define fashion in 2024",
    date: "2024-01-15",
    image: "https://i.pinimg.com/originals/1a/6a/7b/1a6a7bbaaacaf2bd18cf02752d67b9f2.png",
  },
  {
    id: 2,
    title: "Styling Tips for the Modern Wardrobe",
    excerpt: "How to create versatile looks with VARFEO pieces",
    date: "2024-01-10",
    image: "https://i.pinimg.com/1200x/cd/c5/43/cdc543966169bf5326843412ac415ee8.jpg",
  },
  {
    id: 3,
    title: "Behind the Brand: VARFEO Story",
    excerpt: "Learn about our journey and commitment to quality",
    date: "2024-01-05",
    image: "https://i.pinimg.com/736x/d5/c4/36/d5c43652a60befd07051f11e04fa899f.jpg",
  },
  {
    id: 4,
    title: "Fashion Trends 2024: What to Expect",
    excerpt: "Discover the upcoming trends that will define fashion in 2024",
    date: "2024-01-15",
    image: "https://i.pinimg.com/736x/f6/3b/f5/f63bf51ec6af0ffd6fe04c26fed80658.jpg",
  },
  {
    id: 5,
    title: "Styling Tips for the Modern Wardrobe",
    excerpt: "How to create versatile looks with VARFEO pieces",
    date: "2024-01-10",
    image: "https://i.pinimg.com/736x/bf/39/d7/bf39d79d43753d1a3ad4f53d64650f7a.jpg",
  },
  {
    id: 6,
    title: "Behind the Brand: VARFEO Story",
    excerpt: "Learn about our journey and commitment to quality",
    date: "2024-01-05",
    image: "https://i.pinimg.com/736x/95/63/4f/95634f62e93141184bbf2f19927b20a2.jpg",
  },
  {
    id: 7,
    title: "Fashion Trends 2024: What to Expect",
    excerpt: "Discover the upcoming trends that will define fashion in 2024",
    date: "2024-01-15",
    image: "https://i.pinimg.com/1200x/a8/33/db/a833db1d4c3759fade22b4b68c53b635.jpg",
  },
  {
    id: 8,
    title: "Styling Tips for the Modern Wardrobe",
    excerpt: "How to create versatile looks with VARFEO pieces",
    date: "2024-01-10",
    image: "https://i.pinimg.com/736x/69/bc/e4/69bce4f9e488bf4538f7dcd309260b55.jpg",
  },
];

const TopSocialPostsList = () => {
  return (
    <div className="w-full border p-10 shadow-2xl">
      <div className="w-full flex flex-wrap-reverse justify-between items-center font-thin text-3xl my-2">
        <div>@varfeo</div>
        <div className="flex gap-2 items-center justify-start">
          <FaInstagram /> <FaFacebook /> <FaLinkedinIn /> <FaYoutube /> <FaReddit />
        </div>
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {socialPosts.map((post, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-1/4 aspect-square relative  group overflow-hidden mx-2"
            >
              <Image src={post.image} alt={post.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center transition-opacity opacity-0 duration-300 group-hover:opacity-100">
                <h3 className="text-white text-3xl font-semibold">
                  <Link href={"/"}>
                    <FaInstagram />
                  </Link>
                </h3>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-sm bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:bg-white hover:border-gray-300 transition-all duration-200 group">
          <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
        </CarouselPrevious>

        {/* Custom Next Arrow */}
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-sm bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:bg-white hover:border-gray-300 transition-all duration-200 group">
          <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
        </CarouselNext>
      </Carousel>
    </div>
  );
};

export default TopSocialPostsList;
