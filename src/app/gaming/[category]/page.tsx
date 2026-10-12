import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CommunitySection from "@/components/home/CommunitySection";
import CategoryHero from "@/components/gaming/CategoryHero";
import CategoryListing, { CategoryListingFromUrl } from "@/components/gaming/CategoryListing";
import { gamingCategories, getCategory, productsInCategory } from "@/data/gaming";

export const dynamicParams = false;

export function generateStaticParams() {
  return gamingCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gaming/[category]">): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  return { title: `${category.listing.title} | Redragon`, description: category.hero.description };
}

/** Figma "kEYBOARD PAGE" – shared by every gaming category. `?page=2` shows the next grid. */
export default async function GamingCategoryPage({ params }: PageProps<"/gaming/[category]">) {
  const category = getCategory((await params).category);
  if (!category) notFound();

  const products = productsInCategory(category.slug);

  return (
    <>
      <CategoryHero category={category} />
      {/* Page 1 is pre-rendered; ?page=N is applied in the browser */}
      <Suspense fallback={<CategoryListing category={category} products={products} page={1} />}>
        <CategoryListingFromUrl category={category} products={products} />
      </Suspense>
      <CommunitySection />
    </>
  );
}
