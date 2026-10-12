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
  description: officeNewsletter.description,
};

/** Figma "Office landing page" */
export default function OfficePage() {
  return (
    <>
      <OfficeHero />
      <OfficeCategoryGrid {...officeTiles} />
      <LatestGearSection items={officeLatestItems} stage={officeLatestStage} light />
      <FeaturedProductsGrid cards={officeFeaturedCards} light />
      <NewsletterSection {...officeNewsletter} />
    </>
  );
}
