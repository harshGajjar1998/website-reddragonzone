import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CategoryListing, { CategoryListingFromUrl } from "@/components/gaming/CategoryListing";
import NewsletterSection from "@/components/office/NewsletterSection";
import OfficeCategoryHero from "@/components/office/OfficeCategoryHero";
import { getOfficeCategory, officeCategories, officeNewsletter, officeProductsInCategory } from "@/data/office";

export const dynamicParams = false;

export function generateStaticParams() {
  // API: dynamic data – office category slugs
  return officeCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/office/[category]">): Promise<Metadata> {
  // API: dynamic data – office category (page metadata)
  const category = getOfficeCategory((await params).category);
  if (!category) return {};
  return { title: `${category.listing.title} | Redragon`, description: category.listing.description };
}

/** Figma "Mice PAGE" – shared by every office category. `?page=2` shows the next grid. */
export default async function OfficeCategoryPage({ params }: PageProps<"/office/[category]">) {
  // API: dynamic data – office category
  const category = getOfficeCategory((await params).category);
  if (!category) notFound();

  // API: dynamic data – products in this category
  const products = officeProductsInCategory(category.slug);

  return (
    <>
      <OfficeCategoryHero slides={category.spotlights} />
      {/* Page 1 is pre-rendered; ?page=N is applied in the browser */}
      <Suspense fallback={<CategoryListing category={category} products={products} page={1} />}>
        <CategoryListingFromUrl category={category} products={products} />
      </Suspense>
      {/* API: dynamic data – office newsletter content */}
      <NewsletterSection {...officeNewsletter} />
    </>
  );
}
