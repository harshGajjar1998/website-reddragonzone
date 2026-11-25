import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CommunitySection from "@/components/home/CommunitySection";
import CategoryHero from "@/components/gaming/CategoryHero";
import CategoryListing, { CategoryListingFromUrl } from "@/components/gaming/CategoryListing";
import { findCategory, getContent, listingFor } from "@/lib/cms";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

export async function generateStaticParams() {
  // API: dynamic data – gaming category slugs
  return (await getContent()).gaming.categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gaming/[category]">): Promise<Metadata> {
  // API: dynamic data – gaming category (page metadata)
  const category = findCategory((await getContent()).gaming.categories, (await params).category);
  if (!category) return {};
  return pageMetadata(`/gaming/${category.slug}/`, { title: `${category.listing.title} | Redragon`, description: category.hero.description });
}

/** Figma "kEYBOARD PAGE" – shared by every gaming category. `?page=2` shows the next grid. */
export default async function GamingCategoryPage({ params }: PageProps<"/gaming/[category]">) {
  const { gaming, siteUrl } = await getContent();
  // API: dynamic data – gaming category
  const category = findCategory(gaming.categories, (await params).category);
  if (!category) notFound();

  // API: dynamic data – products in this category
  const listing = listingFor(category, gaming.products);
  const products = listing.products;

  return (
    <>
      <JsonLd data={breadcrumbs(siteUrl, [{ name: "Gaming", path: "/gaming/" }, { name: category.listing.title, path: `/gaming/${category.slug}/` }])} />
      <CmsSection ids={entryIds([category])}>
        <CategoryHero category={category} />
      </CmsSection>
      {/* Page 1 is pre-rendered; ?page=N is applied in the browser */}
      <CmsSection ids={[...entryIds([category]), ...entryIds(products, "product")]}>
        <Suspense fallback={<CategoryListing category={listing.category} products={products} page={1} />}>
          <CategoryListingFromUrl category={listing.category} products={products} />
        </Suspense>
      </CmsSection>
      <CmsSection ids={["shared:community"]}>
        <CommunitySection />
      </CmsSection>
    </>
  );
}
