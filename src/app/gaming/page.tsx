import type { Metadata } from "next";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import CommunitySection from "@/components/home/CommunitySection";
import CategorySlider from "@/components/gaming/CategorySlider";
import FeaturedProductsGrid from "@/components/gaming/FeaturedProductsGrid";
import GamingHero from "@/components/gaming/GamingHero";
import LatestGearSection from "@/components/gaming/LatestGearSection";
import { getContent } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const { gaming } = await getContent();
  // API: dynamic data – gaming page description
  return { title: "Gaming Products | Redragon", description: gaming.hero.description };
}

/** Figma "Gaming Landing page" */
export default async function GamingPage() {
  const { hero, categories, latest, featuredCards, featuredGrid } = (await getContent()).gaming;
  return (
    <>
      {/* API: dynamic data – gaming banner */}
      <CmsSection ids={["singleton:gaming_page"]}>
        <GamingHero {...hero} />
      </CmsSection>
      {/* API: dynamic data – gaming categories */}
      <CmsSection ids={entryIds(categories)}>
        <CategorySlider categories={categories} />
      </CmsSection>
      {/* API: dynamic data – gaming "The Latest" products */}
      <CmsSection ids={["singleton:gaming_page"]}>
        <LatestGearSection items={latest} />
      </CmsSection>
      {/* API: dynamic data – gaming featured products */}
      <CmsSection ids={["singleton:gaming_page"]}>
        <FeaturedProductsGrid cards={featuredCards} mobileCards={featuredGrid} />
      </CmsSection>
      <CmsSection ids={["shared:community"]}>
        <CommunitySection />
      </CmsSection>
    </>
  );
}
