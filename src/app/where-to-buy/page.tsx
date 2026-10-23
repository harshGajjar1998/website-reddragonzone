import type { Metadata } from "next";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import Image from "next/image";
import CenteredHeading from "@/components/gaming/CenteredHeading";
import CommunitySection from "@/components/home/CommunitySection";
import StoreFinder from "@/components/pages/StoreFinder";
import { getContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Where to Buy | Redragon",
  description: "Locate authorized Redragon stores and online retailers for individual purchases.",
};

/** Figma "Where to buy" */
export default async function WhereToBuyPage() {
  const { storesByCountry, copy } = (await getContent()).pages;
  const c = copy.whereToBuy;
  const stores = Object.values(storesByCountry).flat();
  return (
    <>
      <CmsSection ids={["singleton:where_to_buy_page"]}>
      <section className="relative h-[320px] overflow-hidden bg-gradient-to-r from-[#454344] to-[#727071] lg:h-[544px]">
        <Image src={c.heroImage} alt="" fill sizes="100vw" preload className="object-cover" />
        <div className="absolute inset-0 bg-black/28" />
        <h1 className="absolute left-1/2 top-1/2 -translate-1/2 whitespace-nowrap font-lexend-exa text-[40px] font-black tracking-[-3px] text-white lg:top-[212px] lg:translate-y-0 lg:text-[96px] lg:tracking-[-7.68px]">
          {c.title}
        </h1>
      </section>
      </CmsSection>

      <CmsSection ids={["singleton:where_to_buy_page", ...entryIds(stores)]}>
      <section className="bg-white">
        <div className="page-frame flex min-h-[350px] flex-col items-center px-4 pt-14 pb-14 lg:px-20 lg:pt-[88px] lg:pb-[88px]">
          <CenteredHeading title={c.heading} subtitle={c.subtitle} />
          {/* API: dynamic data – Where to Buy store list */}
          <StoreFinder storesByCountry={storesByCountry} />
        </div>
      </section>
      </CmsSection>

      <CmsSection ids={["shared:community"]}>
        <CommunitySection />
      </CmsSection>
    </>
  );
}
