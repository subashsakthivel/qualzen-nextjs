import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const blogPosts = [
  {
    id: 1,
    title: "Fashion Trends 2024: What to Expect",
    excerpt: "Discover the upcoming trends that will define fashion in 2024",
    date: "2024-01-15",
    image: "https://i.pinimg.com/736x/58/f6/7b/58f67bc0ca239dde416eae65a74eae40.jpg",
  },
  {
    id: 2,
    title: "Styling Tips for the Modern Wardrobe",
    excerpt: "How to create versatile looks with VARFEO pieces",
    date: "2024-01-10",
    image: "https://i.pinimg.com/1200x/4b/e3/ae/4be3aea8895232767d26c7720356861b.jpg",
  },
  {
    id: 3,
    title: "Behind the Brand: VARFEO Story",
    excerpt: "Learn about our journey and commitment to quality",
    date: "2024-01-05",
    image: "https://i.pinimg.com/736x/95/63/4f/95634f62e93141184bbf2f19927b20a2.jpg",
  },
];
const BlogPostsList = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight m-2">TOP BLOGS</h2>
        <div>
          <Button className="bg-black p-5 font-thin">ALL BLOGS</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.id} className="relative group cursor-pointer hover-scale aspect-square">
            <CardContent className="p-0">
              <div>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className=" object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </Badge>
                </div>
              </div>

              <div className="absolute bottom-0 bg-white p-6 ">
                <h3 className="text-xl font-bold text-red-700 mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className=" mb-4">{post.excerpt}</p>
                <Button className="p-2 h-auto font-semibold">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogPostsList;
