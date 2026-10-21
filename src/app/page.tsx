import HeroSection from "@/components/home/HeroSection";
import CategorySplitSection from "@/components/home/CategorySplitSection";
import ExplodedViewSection from "@/components/home/ExplodedViewSection";
import ProductCategoriesSection from "@/components/home/ProductCategoriesSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import CommunitySection from "@/components/home/CommunitySection";
import { featuredProducts } from "@/data/home";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySplitSection />
      <ExplodedViewSection />
      <ProductCategoriesSection />
      {/* API: dynamic data – "New Gears" featured products */}
      <FeaturedProductsSection products={featuredProducts} />
      <CommunitySection />
    </>
  );
}
