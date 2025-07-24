"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Star,
  Truck,
  Shield,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Calendar,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = [
    {
      id: 1,
      name: "Crimson Elite Jacket",
      price: 299,
      image: "/placeholder.svg",
      badge: "Bestseller",
    },
    {
      id: 2,
      name: "Golden Hour Hoodie",
      price: 189,
      image: "/placeholder.svg",
      badge: "New",
    },
    {
      id: 3,
      name: "Purple Storm Tee",
      price: 89,
      image: "/placeholder.svg",
      badge: "Limited",
    },
    {
      id: 4,
      name: "Midnight Combat Boots",
      price: 349,
      image: "/placeholder.svg",
      badge: "Trending",
    },
    {
      id: 5,
      name: "Shadow Denim",
      price: 199,
      image: "/placeholder.svg",
      badge: "Hot",
    },
    {
      id: 6,
      name: "Phoenix Sneakers",
      price: 259,
      image: "/placeholder.svg",
      badge: "Exclusive",
    },
  ];

  const popularCollections = [
    {
      id: 1,
      name: "Street Elite",
      description: "Urban meets luxury",
      image: "/placeholder.svg",
      itemCount: 24,
    },
    {
      id: 2,
      name: "Crimson Series",
      description: "Bold and beautiful",
      image: "/placeholder.svg",
      itemCount: 18,
    },
    {
      id: 3,
      name: "Gold Rush",
      description: "Shine bright",
      image: "/placeholder.svg",
      itemCount: 32,
    },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Fashion Trends 2024: What to Expect",
      excerpt: "Discover the upcoming trends that will define fashion in 2024",
      date: "2024-01-15",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Styling Tips for the Modern Wardrobe",
      excerpt: "How to create versatile looks with VARFEO pieces",
      date: "2024-01-10",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Behind the Brand: VARFEO Story",
      excerpt: "Learn about our journey and commitment to quality",
      date: "2024-01-05",
      image: "/placeholder.svg",
    },
  ];

  const newsItems = [
    "🔥 FLASH SALE: 50% off all winter collections ending today!",
    "🎉 100K+ customers joined VARFEO family this month!",
    "✨ New arrivals: Premium leather collection now available",
    "🚀 Free shipping worldwide on orders over $200",
    "💎 VIP members get early access to exclusive drops",
  ];

  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Free Shipping",
      description: "Free shipping on orders over $150",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Quality Guarantee",
      description: "30-day money back guarantee",
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Round the clock customer support",
    },
  ];

  // Auto-slide featured products
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredProducts.length / 3));
    }, 4000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredProducts.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(featuredProducts.length / 3)) % Math.ceil(featuredProducts.length / 3)
    );
  };

  return (
    <div className="overflow-hidden">
      {/* Full Screen Hero Section */}
      <section className="hero-gradient text-white h-screen flex items-center justify-center relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 animate-fade-in">
            Unleash Your <br />
            <span className="text-secondary">Bold Style</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Premium fashion with VARFEO signature blend of elegance and edge. Express your unique
            personality with our exclusive collection.
          </p>
          <div className="space-x-4">
            <Link href="/products">
              <Button
                size="lg"
                variant="glitter"
                className="font-semibold text-white text-lg px-8 py-4"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/offers">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
              >
                View Offers
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      <div className="space-y-16">
        {/* News Ticker */}
        <section className="bg-primary text-white py-4 overflow-hidden">
          <div className="whitespace-nowrap">
            <div className="news-ticker inline-block">
              {newsItems.map((news, index) => (
                <span key={index} className="inline-block mx-8 text-lg font-semibold">
                  {news}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Carousel */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Collection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Discover VARFEO most coveted pieces that blend sophisticated design with contemporary
              edge
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(featuredProducts.length / 3) }).map(
                  (_, slideIndex) => (
                    <div
                      key={slideIndex}
                      className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                      {featuredProducts.slice(slideIndex * 3, slideIndex * 3 + 3).map((product) => (
                        <Card key={product.id} className="product-card group">
                          <CardContent className="p-0">
                            <div className="relative">
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={25}
                                height={25}
                                className="w-full h-64 object-cover rounded-t-lg"
                              />
                              <Badge className="absolute top-3 left-3" variant="secondary">
                                {product.badge}
                              </Badge>
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold mb-2">{product.name}</h3>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-primary">
                                  ${product.price}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 fill-current text-secondary" />
                                  <span className="text-sm text-muted-foreground">4.9</span>
                                </div>
                              </div>
                              <Button className="w-full mt-3" variant="outline">
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </section>

        {/* Popular Collections */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Collections</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Explore our curated collections that define contemporary fashion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularCollections.map((collection) => (
                <Card key={collection.id} className="group cursor-pointer hover-scale">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        width={25}
                        height={25}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1">{collection.name}</h3>
                        <p className="text-sm opacity-90">{collection.itemCount} items</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-muted-foreground mb-3">{collection.description}</p>
                      <Button variant="outline" className="w-full">
                        Explore Collection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Links */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest from Our Blog</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Stay updated with fashion insights, styling tips, and brand stories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group cursor-pointer hover-scale">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={25}
                      height={25}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <Button variant="ghost" className="p-0 h-auto font-semibold text-primary">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="hero-gradient w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="hero-gradient text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
              <p className="text-xl mb-8 opacity-90">
                Join our VIP list for exclusive offers, early access to new collections, and style
                inspiration delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-black"
                />
                <Button variant="secondary" size="lg" className="font-semibold">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto px-4 text-center py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join VARFEO?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Create your account and unlock a world of premium fashion, exclusive deals, and
              personalized styling.
            </p>
            <Link href="/signin">
              <Button size="lg" variant="glitter" className="font-semibold text-white px-8 py-4">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
