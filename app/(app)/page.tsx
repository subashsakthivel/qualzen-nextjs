import { CategorySection } from "@/components/category-section";
import HeroCarousel from "@/components/hero-section";
import CategoriesCatelog from "@/components/CategoriesCatelog";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./error";
import { FeaturedProducts } from "@/components/featured-products";

export default function Home() {
  return (
    <>
      <ErrorBoundary fallback={<ErrorPage />}>
        <HeroCarousel />
        <HeroCarousel />

        <div className="">
          <CategorySection />
          <FeaturedProducts />
          <CategoriesCatelog />
        </div>
      </ErrorBoundary>
      <div>comback 3</div>
    </>
  );
}
