import type { Metadata } from "next";
import CommunitySection from "@/components/home/CommunitySection";
import CategorySlider from "@/components/gaming/CategorySlider";
import FeaturedProductsGrid from "@/components/gaming/FeaturedProductsGrid";
import GamingHero from "@/components/gaming/GamingHero";
import LatestGearSection from "@/components/gaming/LatestGearSection";
import { featuredCards, featuredGrid, gamingCategories, gamingHero, latestItems } from "@/data/gaming";

export const metadata: Metadata = {
  title: "Gaming Products | Redragon",
  // API: dynamic data – gaming page description
  description: gamingHero.description,
};

/** Figma "Gaming Landing page" */
export default function GamingPage() {
  return (
    <>
      {/* API: dynamic data – gaming banner */}
      <GamingHero {...gamingHero} />
      {/* API: dynamic data – gaming categories */}
      <CategorySlider categories={gamingCategories} />
      {/* API: dynamic data – gaming "The Latest" products */}
      <LatestGearSection items={latestItems} />
      {/* API: dynamic data – gaming featured products */}
      <FeaturedProductsGrid cards={featuredCards} mobileCards={featuredGrid} />
      <CommunitySection />
    </>
  );
}
