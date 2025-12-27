import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedProducts } from "@/components/featured-products";
import { CategorySection } from "@/components/category-section";
import HeroCarousel from "@/components/hero-section";
import CategoriesCatelog from "@/components/CategoriesCatelog";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./error";

export default function Home() {
  return (
    <>
      <ErrorBoundary fallback={<ErrorPage />}>
        <HeroCarousel />

        {/* <div className="">
          <CategorySection />
          <FeaturedProducts />
          <CategoriesCatelog />
        </div> */}
      </ErrorBoundary>
    </>
  );
}
