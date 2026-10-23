import HeroSection from "@/components/home/HeroSection";
import CategorySplitSection from "@/components/home/CategorySplitSection";
import ExplodedViewSection from "@/components/home/ExplodedViewSection";
import ProductCategoriesSection from "@/components/home/ProductCategoriesSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import CommunitySection from "@/components/home/CommunitySection";
import TextBlock from "@/components/home/TextBlock";
import CmsSection from "@/components/cms/CmsSection";
import type { HomeBlock } from "@/data/home";
import { getContent } from "@/lib/cms";

// API: dynamic data – one component per CMS homepage section
function Block({ block: b }: { block: HomeBlock }) {
  switch (b.type) {
    case "hero":
      return <HeroSection slides={b.slides} />;
    case "split":
      return <CategorySplitSection split={b.split} />;
    case "blueprint":
      return <ExplodedViewSection blueprint={b.blueprint} />;
    case "gears":
      return <ProductCategoriesSection gears={b.gears} />;
    case "featured":
      return <FeaturedProductsSection products={b.products} />;
    case "community":
      return <CommunitySection community={b.community} />;
    case "text":
      return <TextBlock title={b.title} body={b.body} />;
  }
}

/** Homepage – the sections of the CMS visual editor (Pages → Homepage), in its order. */
export default async function Home() {
  const { home } = await getContent();
  return (
    <>
      {home.blocks.map((b) => (
        <CmsSection key={b.ids[0]} ids={b.ids}>
          <Block block={b} />
        </CmsSection>
      ))}
    </>
  );
}
