import type { Metadata } from "next";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CategoryListing, { CategoryListingFromUrl } from "@/components/gaming/CategoryListing";
import NewsletterSection from "@/components/office/NewsletterSection";
import OfficeCategoryHero from "@/components/office/OfficeCategoryHero";
import { findCategory, getContent, productsIn } from "@/lib/cms";

export const dynamicParams = false;

export async function generateStaticParams() {
  // API: dynamic data – office category slugs
  return (await getContent()).office.categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/office/[category]">): Promise<Metadata> {
  // API: dynamic data – office category (page metadata)
  const category = findCategory((await getContent()).office.categories, (await params).category);
  if (!category) return {};
  return { title: `${category.listing.title} | Redragon`, description: category.listing.description };
}

/** Figma "Mice PAGE" – shared by every office category. `?page=2` shows the next grid. */
export default async function OfficeCategoryPage({ params }: PageProps<"/office/[category]">) {
  const { office } = await getContent();
  // API: dynamic data – office category
  const category = findCategory(office.categories, (await params).category);
  if (!category) notFound();

  // API: dynamic data – products in this category
  const products = productsIn(office.products, category.slug);

  return (
    <>
      <CmsSection ids={entryIds([category])}>
        <OfficeCategoryHero slides={category.spotlights} />
      </CmsSection>
      {/* Page 1 is pre-rendered; ?page=N is applied in the browser */}
      <CmsSection ids={[...entryIds([category]), ...entryIds(products, "product")]}>
        <Suspense fallback={<CategoryListing category={category} products={products} page={1} />}>
          <CategoryListingFromUrl category={category} products={products} />
        </Suspense>
      </CmsSection>
      {/* API: dynamic data – office newsletter content */}
      <CmsSection ids={["singleton:office_page"]}>
        <NewsletterSection {...office.newsletter} />
      </CmsSection>
    </>
  );
}
