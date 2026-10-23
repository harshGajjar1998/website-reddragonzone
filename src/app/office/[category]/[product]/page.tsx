import type { Metadata } from "next";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import { notFound } from "next/navigation";
import KeyFeatures from "@/components/gaming/KeyFeatures";
import ProductOverview from "@/components/gaming/ProductOverview";
import BlueprintSection from "@/components/office/BlueprintSection";
import NewsletterSection from "@/components/office/NewsletterSection";
import OfficeShowcase from "@/components/office/OfficeShowcase";
import OfficeSpecHero from "@/components/office/OfficeSpecHero";
import { findCategory, findProduct, getContent } from "@/lib/cms";

export async function generateStaticParams() {
  // API: dynamic data – office product slugs
  return (await getContent()).office.products.map((p) => ({ category: p.category, product: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/office/[category]/[product]">): Promise<Metadata> {
  const { category, product: slug } = await params;
  // API: dynamic data – office product (page metadata)
  const product = findProduct((await getContent()).office.products, category, slug);
  if (!product) return {};
  return { title: `${product.name} | Redragon`, description: product.description ?? product.tagline };
}

/**
 * Office product detail. Featured products get the "SPECIAL PAGE" layout,
 * everything else the standard "Product page" layout.
 */
export default async function OfficeProductPage({ params }: PageProps<"/office/[category]/[product]">) {
  const { category: categorySlug, product: slug } = await params;
  const { office } = await getContent();
  // API: dynamic data – office category + product
  const category = findCategory(office.categories, categorySlug);
  const product = findProduct(office.products, categorySlug, slug);
  if (!category || !product) notFound();

  if (product.featured) {
    return (
      <CmsSection ids={entryIds([product], "product")}>
        <OfficeSpecHero product={product} category={category} />
        <OfficeShowcase showcase={product.featured.showcase} />
        <BlueprintSection
          src="/images/office/products/bm4195/blueprint.png"
          alt={`${product.name} exploded view: 2.4GHz + Bluetooth, up to 3 devices, AA battery, 5-level DPI, 250Hz polling rate, silent click`}
          heading={{
            lead: "Built for your",
            accent: "Everyday workflow",
            subtitle: `Unrivaled Internal Assembly of ${product.name}`,
          }}
        />
        {/* API: dynamic data – office newsletter content */}
        <CmsSection ids={["singleton:office_page"]}>
          <NewsletterSection {...office.newsletter} />
        </CmsSection>
      </CmsSection>
    );
  }

  return (
    <CmsSection ids={entryIds([product], "product")}>
      <ProductOverview product={product} category={category} />
      {product.keyFeatures && <KeyFeatures data={product.keyFeatures} productName={product.name} light />}
      {/* API: dynamic data – office newsletter content */}
      <CmsSection ids={["singleton:office_page"]}>
          <NewsletterSection {...office.newsletter} />
        </CmsSection>
    </CmsSection>
  );
}
