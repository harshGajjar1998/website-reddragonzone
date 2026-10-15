import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommunitySection from "@/components/home/CommunitySection";
import ExplodedBlueprint from "@/components/gaming/ExplodedBlueprint";
import FeaturedHero from "@/components/gaming/FeaturedHero";
import FeaturedShowcase from "@/components/gaming/FeaturedShowcase";
import KeyFeatures from "@/components/gaming/KeyFeatures";
import ProductOverview from "@/components/gaming/ProductOverview";
import { gamingProducts, getCategory, getProduct } from "@/data/gaming";

export const dynamicParams = false;

export function generateStaticParams() {
  return gamingProducts.map((p) => ({ category: p.category, product: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gaming/[category]/[product]">): Promise<Metadata> {
  const { category, product: slug } = await params;
  const product = getProduct(category, slug);
  if (!product) return {};
  return { title: `${product.name} | Redragon`, description: product.description ?? product.tagline };
}

/**
 * Gaming product detail. Featured products get the "SPECIAL PAGE" layout,
 * everything else the standard "KEWBOARD DETAIL PAGE" layout.
 */
export default async function GamingProductPage({ params }: PageProps<"/gaming/[category]/[product]">) {
  const { category: categorySlug, product: slug } = await params;
  const category = getCategory(categorySlug);
  const product = getProduct(categorySlug, slug);
  if (!category || !product) notFound();

  if (product.featured) {
    const { featured } = product;
    return (
      <>
        {/* Mobile opens with the product overview (Figma "Spice detal"), desktop with the hero */}
        <ProductOverview product={product} category={category} special={{ ghost: featured.hero.model }} />
        <FeaturedHero hero={featured.hero} name={product.name} />
        <FeaturedShowcase showcase={featured.showcase} />
        {featured.exploded && <ExplodedBlueprint productName={product.name} mobileImage={featured.mobileExploded} />}
        <CommunitySection />
      </>
    );
  }

  return (
    <>
      <ProductOverview product={product} category={category} />
      {product.keyFeatures && <KeyFeatures data={product.keyFeatures} productName={product.name} />}
      <CommunitySection />
    </>
  );
}
