import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Award, Heart } from "lucide-react";
import Image from "next/image";

const About = () => {
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Quality First",
      description:
        "We never compromise on quality. Every piece is crafted with premium materials and attention to detail.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Driven",
      description:
        "Our designs are inspired by our community of heroes who dare to be different and stand out.",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from design to customer service.",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Passion",
      description:
        "Fashion is our passion, and we pour our hearts into creating pieces that inspire confidence.",
    },
  ];

  const team = [
    {
      name: "Logan Steel",
      position: "Founder & CEO",
      image: "/placeholder.svg",
      description: "Former fashion designer with 15 years of experience in premium clothing.",
    },
    {
      name: "Wade Wilson",
      position: "Creative Director",
      image: "/placeholder.svg",
      description: "Visionary designer known for bold, unconventional fashion statements.",
    },
    {
      name: "Ororo Monroe",
      position: "Head of Operations",
      image: "/placeholder.svg",
      description: "Operations expert ensuring quality and timely delivery of every order.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About VARFEO</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-left">
          We’re a team from Tirupur, Coimbatore, and Erode, passionate about creating things people
          truly need and love. Our journey began with textiles, but along the way, we’ve also grown
          into software, machinery, and even handmade crafts—blending tradition with technology and
          creativity.
          <br></br>
          Right now, our focus is on fashion—designs that don’t just look good but also make you
          feel confident. We’re rooted in South India, and while we’re growing step by step, we’re
          also gearing up to take our wholesale collections to a bigger audience.
          <br></br>
          Special occasions are our favorite—we love crafting outfits that make every celebration
          memorable. At the core of everything we do is a simple promise: quality, trust, and the
          joy of bringing together art, fashion, and technology to create something special for
          tomorrow.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">UnKnown</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Varfeo emerged from a simple idea: For us, it all began with something as simple as
              choosing clothes online. No matter how much we searched, we couldn’t always find what
              truly matched our style or how we felt. Most of the time, we don’t even realize what
              we really like until we wear something that makes us feel right.
            </p>
            <p>
              I still remember the happiness I felt every time someone appreciated my outfit.
              Sometimes, it wasn’t just about looks—it was about how fresh, confident, and relaxed I
              felt. One night, after changing into a new set of nightwear, I slept so peacefully
              that I literally felt like a baby. That moment made me realize something powerful:
              clothes don’t just cover us—they shape how we feel.
            </p>
            <p>
              That is where our journey began. We wanted to create fashion that gives people that
              same joy, confidence, and comfort. Clothes that don’t just look good but make you feel
              good. Because at the end of the day, fashion is not just about style—it’s about the
              experience it brings into your life.
            </p>
            <p className="italic ">
              - We bring <span className="text-lg">VAR</span>iety,{" "}
              <span className="text-lg">F</span>
              or <span className="text-lg">E</span>very<span className="text-lg">O</span>ne.
            </p>
          </div>
        </div>
        <div className="relative">
          <Image
            src="https://i.pinimg.com/1200x/c2/3a/65/c23a656dec8e60c8da24831c2cc3739c.jpg"
            fill
            alt="XFASHION Studio"
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="absolute inset-0 hero-gradient opacity-20 rounded-lg"></div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center p-6">
              <CardContent className="p-0">
                <div className="mb-4 flex justify-center">{value.icon}</div>
                <h3 className="font-semibold mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
