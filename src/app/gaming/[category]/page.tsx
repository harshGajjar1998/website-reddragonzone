import type { Metadata } from "next";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CommunitySection from "@/components/home/CommunitySection";
import CategoryHero from "@/components/gaming/CategoryHero";
import CategoryListing, { CategoryListingFromUrl } from "@/components/gaming/CategoryListing";
import { findCategory, getContent, productsIn } from "@/lib/cms";

export const dynamicParams = false;

export async function generateStaticParams() {
  // API: dynamic data – gaming category slugs
  return (await getContent()).gaming.categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gaming/[category]">): Promise<Metadata> {
  // API: dynamic data – gaming category (page metadata)
  const category = findCategory((await getContent()).gaming.categories, (await params).category);
  if (!category) return {};
  return { title: `${category.listing.title} | Redragon`, description: category.hero.description };
}

/** Figma "kEYBOARD PAGE" – shared by every gaming category. `?page=2` shows the next grid. */
export default async function GamingCategoryPage({ params }: PageProps<"/gaming/[category]">) {
  const { gaming } = await getContent();
  // API: dynamic data – gaming category
  const category = findCategory(gaming.categories, (await params).category);
  if (!category) notFound();

  // API: dynamic data – products in this category
  const products = productsIn(gaming.products, category.slug);

  return (
    <>
      <CmsSection ids={entryIds([category])}>
        <CategoryHero category={category} />
      </CmsSection>
      {/* Page 1 is pre-rendered; ?page=N is applied in the browser */}
      <CmsSection ids={[...entryIds([category]), ...entryIds(products, "product")]}>
        <Suspense fallback={<CategoryListing category={category} products={products} page={1} />}>
          <CategoryListingFromUrl category={category} products={products} />
        </Suspense>
      </CmsSection>
      <CmsSection ids={["shared:community"]}>
        <CommunitySection />
      </CmsSection>
    </>
  );
}
