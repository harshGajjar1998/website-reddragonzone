import type { Metadata } from "next";
import CommunitySection from "@/components/home/CommunitySection";
import CategorySlider from "@/components/gaming/CategorySlider";
import FeaturedProductsGrid from "@/components/gaming/FeaturedProductsGrid";
import GamingHero from "@/components/gaming/GamingHero";
import LatestGearSection from "@/components/gaming/LatestGearSection";
import { featuredCards, featuredGrid, gamingCategories, gamingHero, latestItems } from "@/data/gaming";

export const metadata: Metadata = {
  title: "Gaming Products | Redragon",
  description: gamingHero.description,
};

/** Figma "Gaming Landing page" */
export default function GamingPage() {
  return (
    <>
      <GamingHero {...gamingHero} />
      <CategorySlider categories={gamingCategories} />
      <LatestGearSection items={latestItems} />
      <FeaturedProductsGrid cards={featuredCards} mobileCards={featuredGrid} />
      <CommunitySection />
    </>
  );
}
