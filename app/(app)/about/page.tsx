import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Award, Heart } from "lucide-react";
import Image from "next/image";

export const About = () => {
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
        <h1 className="text-4xl font-bold mb-6">About XFASHION</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Born from the belief that fashion should be as bold and unique as the heroes who inspire
          us, XFASHION creates premium clothing for those who dare to stand out and express their
          inner strength.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Founded in 2020, XFASHION emerged from a simple idea: clothing should empower the
              wearer. Inspired by the bold aesthetics of iconic heroes like Deadpool and Wolverine,
              we set out to create a fashion brand that celebrates individuality and strength.
            </p>
            <p>
              Our journey began in a small studio, where our founders combined their passion for
              premium materials, cutting-edge design, and pop culture. Today, we are proud to serve
              customers worldwide who share our vision of fashion as a form of self-expression.
            </p>
            <p>
              Every piece in our collection tells a story of courage, resilience, and the power to
              be authentically yourself. We believe that when you look good, you feel unstoppable.
            </p>
          </div>
        </div>
        <div className="relative">
          <Image
            src="/placeholder.svg"
            alt="XFASHION Studio"
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="absolute inset-0 hero-gradient opacity-20 rounded-lg"></div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
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

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.position}</p>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission Statement */}
      <div className="hero-gradient rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg max-w-3xl mx-auto">
          To create exceptional fashion that empowers individuals to express their unique identity,
          inspired by the courage and strength of iconic heroes. We are not just making clothes; we
          are crafting confidence, one piece at a time.
        </p>
      </div>
    </div>
  );
};
