import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import CommunitySection from "@/components/home/CommunitySection";
import SupportCenter from "@/components/pages/SupportCenter";
import SupportFaqs from "@/components/pages/SupportFaqs";
import { getContent } from "@/lib/cms";
import JsonLd from "@/components/JsonLd";
import { faqPage } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/support/", { title: "Support – Manuals & Software | Redragon", description: "Get the latest software, drivers and manuals for your Redragon products." });
}

/** Figma "Support" */
export default async function SupportPage() {
  const { supportTiles, downloads, faqs } = (await getContent()).pages;
  return (
    <>
      {/* API: dynamic data – support topics + downloads */}
      <CmsSection ids={[...entryIds(supportTiles.flat()), ...entryIds(downloads)]}>
        <SupportCenter supportTiles={supportTiles} downloads={downloads} />
      </CmsSection>
      {faqs.length > 0 && <JsonLd data={faqPage(faqs)} />}
      <CmsSection ids={entryIds(faqs)}>
        <SupportFaqs faqs={faqs} />
      </CmsSection>
      <CmsSection ids={["shared:community"]}>
        <CommunitySection />
      </CmsSection>
    </>
  );
}
