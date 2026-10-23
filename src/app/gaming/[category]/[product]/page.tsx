import type { Metadata } from "next";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import { notFound } from "next/navigation";
import CommunitySection from "@/components/home/CommunitySection";
import ExplodedBlueprint from "@/components/gaming/ExplodedBlueprint";
import FeaturedHero from "@/components/gaming/FeaturedHero";
import FeaturedShowcase from "@/components/gaming/FeaturedShowcase";
import KeyFeatures from "@/components/gaming/KeyFeatures";
import ProductOverview from "@/components/gaming/ProductOverview";
import { findCategory, findProduct, getContent } from "@/lib/cms";

export async function generateStaticParams() {
  // API: dynamic data – gaming product slugs
  return (await getContent()).gaming.products.map((p) => ({ category: p.category, product: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gaming/[category]/[product]">): Promise<Metadata> {
  const { category, product: slug } = await params;
  // API: dynamic data – gaming product (page metadata)
  const product = findProduct((await getContent()).gaming.products, category, slug);
  if (!product) return {};
  return { title: `${product.name} | Redragon`, description: product.description ?? product.tagline };
}

/**
 * Gaming product detail. Featured products get the "SPECIAL PAGE" layout,
 * everything else the standard "KEWBOARD DETAIL PAGE" layout.
 */
export default async function GamingProductPage({ params }: PageProps<"/gaming/[category]/[product]">) {
  const { category: categorySlug, product: slug } = await params;
  const { gaming } = await getContent();
  // API: dynamic data – gaming category + product
  const category = findCategory(gaming.categories, categorySlug);
  const product = findProduct(gaming.products, categorySlug, slug);
  if (!category || !product) notFound();

  if (product.featured) {
    const { featured } = product;
    return (
      <CmsSection ids={entryIds([product], "product")}>
        {/* Mobile opens with the product overview (Figma "Spice detal"), desktop with the hero */}
        <ProductOverview product={product} category={category} special={{ ghost: featured.hero.model }} />
        <FeaturedHero hero={featured.hero} name={product.name} />
        <FeaturedShowcase showcase={featured.showcase} />
        {featured.exploded && (
          <ExplodedBlueprint
            productName={product.name}
            parts={featured.explodedParts ?? []}
            mobileImage={featured.mobileExploded}
          />
        )}
        <CmsSection ids={["shared:community"]}>
          <CmsSection ids={["shared:community"]}>
        <CommunitySection />
      </CmsSection>
        </CmsSection>
      </CmsSection>
    );
  }

  return (
    <CmsSection ids={entryIds([product], "product")}>
      <ProductOverview product={product} category={category} />
      {product.keyFeatures && <KeyFeatures data={product.keyFeatures} productName={product.name} />}
      <CmsSection ids={["shared:community"]}>
        <CommunitySection />
      </CmsSection>
    </CmsSection>
  );
}
