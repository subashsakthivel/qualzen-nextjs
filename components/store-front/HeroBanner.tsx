import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroBanner = () => {
  return (
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
  );
};

export default HeroBanner;
