import type { Metadata } from "next";
import FeaturedProductsGrid from "@/components/gaming/FeaturedProductsGrid";
import LatestGearSection from "@/components/gaming/LatestGearSection";
import NewsletterSection from "@/components/office/NewsletterSection";
import OfficeCategoryGrid from "@/components/office/OfficeCategoryGrid";
import OfficeHero from "@/components/office/OfficeHero";
import {
  officeFeaturedCards,
  officeLatestItems,
  officeLatestStage,
  officeNewsletter,
  officeTiles,
} from "@/data/office";

export const metadata: Metadata = {
  title: "Office Products | Redragon",
  // API: dynamic data – office page description
  description: officeNewsletter.description,
};

/** Figma "Office landing page" */
export default function OfficePage() {
  return (
    <>
      <OfficeHero />
      {/* API: dynamic data – office category tiles */}
      <OfficeCategoryGrid {...officeTiles} />
      {/* API: dynamic data – office "The Latest" products */}
      <LatestGearSection items={officeLatestItems} stage={officeLatestStage} light />
      {/* API: dynamic data – office featured products */}
      <FeaturedProductsGrid cards={officeFeaturedCards} light />
      {/* API: dynamic data – office newsletter content */}
      <NewsletterSection {...officeNewsletter} />
    </>
  );
}
