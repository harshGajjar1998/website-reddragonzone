import type { Metadata } from "next";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import CommunitySection from "@/components/home/CommunitySection";
import SupportCenter from "@/components/pages/SupportCenter";
import { getContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Support – Manuals & Software | Redragon",
  description: "Get the latest software, drivers and manuals for your Redragon products.",
};

/** Figma "Support" */
export default async function SupportPage() {
  const { supportTiles, downloads } = (await getContent()).pages;
  return (
    <>
      {/* API: dynamic data – support topics + downloads */}
      <CmsSection ids={[...entryIds(supportTiles.flat()), ...entryIds(downloads)]}>
        <SupportCenter supportTiles={supportTiles} downloads={downloads} />
      </CmsSection>
      <CmsSection ids={["shared:community"]}>
        <CommunitySection />
      </CmsSection>
    </>
  );
}
