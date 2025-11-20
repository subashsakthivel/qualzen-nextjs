import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedProducts } from "@/components/featured-products";
import { CategorySection } from "@/components/category-section";
import HeroCarousel from "@/components/hero-section";
import CategoriesCatelog from "@/components/CategoriesCatelog";
import BlogPostsList from "@/components/BlogPostsList";
import TopSocialPostsList from "@/components/TopSocialPostsList";
import SubscribeNewsLetter from "@/components/subscribe-newletter";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./error";

export default function Home() {
  return (
    <>
      <ErrorBoundary fallback={<ErrorPage />}>
        <HeroCarousel />

        <div className="  container  space-y-32 my-10">
          <CategorySection />
          <FeaturedProducts />
          <CategoriesCatelog />
          <TopSocialPostsList />
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Ready to upgrade your style?</h2>
            <p className="max-w-[600px] text-muted-foreground">
              Discover our latest collections and find your perfect fit.
            </p>
            <Button asChild size="lg">
              <Link href="/products">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop Now
              </Link>
            </Button>
          </div>
          <BlogPostsList />
          <SubscribeNewsLetter />
        </div>
      </ErrorBoundary>
    </>
  );
}
