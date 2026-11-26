import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import CategoryHero from "@/components/gaming/CategoryHero";
import CenteredHeading from "@/components/gaming/CenteredHeading";
import FeaturedHero from "@/components/gaming/FeaturedHero";
import FeaturedProductsGrid from "@/components/gaming/FeaturedProductsGrid";
import KeyFeatures from "@/components/gaming/KeyFeatures";
import ProductOverview from "@/components/gaming/ProductOverview";
import CategorySplitSection from "@/components/home/CategorySplitSection";
import ExplodedViewSection from "@/components/home/ExplodedViewSection";
import TextBlock from "@/components/home/TextBlock";
import NewsletterSection from "@/components/office/NewsletterSection";
import FaqList from "@/components/pages/FaqList";
import BrowseLink from "@/components/ui/BrowseLink";
import type { LandingPage as LandingPageData } from "@/lib/cms";

/**
 * CMS landing page (U7.5): two fixed templates assembled from existing sections, in a fixed order.
 * Editors fill the content and switch optional sections on or off; they can't reorder or style them.
 *
 * - Product launch: FeaturedHero, KeyFeatures, ExplodedViewSection?, FeaturedProductsGrid, NewsletterSection?
 * - Promotion: CategoryHero, TextBlock, FeaturedProductsGrid, CategorySplitSection?, store finder link, FaqList?
 */
export default function LandingPage({ page }: { page: LandingPageData }) {
  const grid = page.featuredCards.length > 0 && <FeaturedProductsGrid cards={page.featuredCards} />;

  if (page.template === "launch") {
    const { launch } = page;
    return (
      <CmsSection ids={entryIds([page])}>
        {launch && (
          <>
            {/* Mobile opens with the product overview, desktop with the hero (as on featured product pages) */}
            <ProductOverview product={launch.product} category={launch.category} special={{ ghost: launch.hero.model }} />
            <FeaturedHero hero={launch.hero} product={launch.product} category={launch.category} />
            {launch.product.keyFeatures && <KeyFeatures data={launch.product.keyFeatures} productName={launch.product.name} />}
          </>
        )}
        {page.exploded && <ExplodedViewSection blueprint={page.exploded} />}
        {grid}
        {/* The design has three photos */}
        {page.newsletter && page.newsletter.images.length === 3 && <NewsletterSection {...page.newsletter} />}
      </CmsSection>
    );
  }

  const { split } = page;
  return (
    <CmsSection ids={entryIds([page])}>
      <CategoryHero category={{ hero: page.hero }} parent={null} />
      {page.text && <TextBlock title={page.text.title} body={page.text.body} />}
      {grid}
      {split && split.gaming.image.src && split.office.image.src && <CategorySplitSection split={split} />}
      {/* Store finder link: the Text block's style with a link to Where to buy */}
      <section className="bg-white">
        <div className="page-frame flex flex-col items-center gap-6 px-4 py-14 text-center lg:px-[120px] lg:py-20">
          <h2 className="font-lexend-exa text-[28px] font-medium leading-[1.2] text-ink lg:text-[32px]">{page.store.title}</h2>
          {page.store.text && (
            <p className="max-w-[720px] whitespace-pre-line font-lexend-deca text-[16px] font-light leading-[1.6] tracking-[0.48px] text-ink/80">
              {page.store.text}
            </p>
          )}
          <BrowseLink href="/where-to-buy/" label={page.store.button} size="sm" />
        </div>
      </section>
      {page.faqs && (
        // The Contact page's FAQ block
        <section className="bg-[#f6f6f6]">
          <div className="page-frame flex flex-col items-center pt-14 pb-14 lg:pt-20 lg:pb-20">
            <CenteredHeading title="FAQS" subtitle="Questions about this offer" />
            <div className="mt-10 w-full px-4 lg:mt-14 lg:w-auto lg:px-0">
              <FaqList faqs={page.faqs} />
            </div>
          </div>
        </section>
      )}
    </CmsSection>
  );
}
