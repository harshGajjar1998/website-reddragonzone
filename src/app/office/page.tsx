import type { Metadata } from "next";
import CmsSection from "@/components/cms/CmsSection";
import FeaturedProductsGrid from "@/components/gaming/FeaturedProductsGrid";
import LatestGearSection from "@/components/gaming/LatestGearSection";
import NewsletterSection from "@/components/office/NewsletterSection";
import OfficeCategoryGrid from "@/components/office/OfficeCategoryGrid";
import OfficeHero from "@/components/office/OfficeHero";
import { officeLatestStage } from "@/data/office";
import { getContent } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const { office } = await getContent();
  // API: dynamic data – office page description
  return { title: "Office Products | Redragon", description: office.description };
}

/** Figma "Office landing page" */
export default async function OfficePage() {
  const { tiles, latest, featuredCards, newsletter } = (await getContent()).office;
  return (
    <>
      <OfficeHero />
      {/* API: dynamic data – office category tiles */}
      <CmsSection ids={["singleton:office_page"]}>
        <OfficeCategoryGrid {...tiles} />
      </CmsSection>
      {/* API: dynamic data – office "The Latest" products */}
      <CmsSection ids={["singleton:office_page"]}>
        <LatestGearSection items={latest} stage={officeLatestStage} light />
      </CmsSection>
      {/* API: dynamic data – office featured products */}
      <CmsSection ids={["singleton:office_page"]}>
        <FeaturedProductsGrid cards={featuredCards} light />
      </CmsSection>
      {/* API: dynamic data – office newsletter content */}
      <CmsSection ids={["singleton:office_page"]}>
        <NewsletterSection {...newsletter} />
      </CmsSection>
    </>
  );
}
