import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import CommunitySection from "@/components/home/CommunitySection";
import CategorySlider from "@/components/gaming/CategorySlider";
import FeaturedProductsGrid from "@/components/gaming/FeaturedProductsGrid";
import GamingHero from "@/components/gaming/GamingHero";
import LatestGearSection from "@/components/gaming/LatestGearSection";
import SocialWall from "@/components/social/SocialWall";
import { getContent } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const { gaming } = await getContent();
  // API: dynamic data – gaming page description
  return pageMetadata("/gaming/", { title: "Gaming Products | Redragon", description: gaming.hero.description });
}

/** Figma "Gaming Landing page" */
export default async function GamingPage() {
  const { gaming, social } = await getContent();
  const { hero, categories, latest, featuredCards, featuredGrid } = gaming;
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
      {/* API: dynamic data – community wall (CMS Community wall: "Show on the Gaming page") */}
      {social?.showOnGaming && (
        <CmsSection ids={["singleton:social_wall"]}>
          <SocialWall wall={social} />
        </CmsSection>
      )}
      <CmsSection ids={["shared:community"]}>
        <CommunitySection />
      </CmsSection>
    </>
  );
}
