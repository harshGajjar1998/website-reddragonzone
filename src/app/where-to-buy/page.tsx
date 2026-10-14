import type { Metadata } from "next";
import Image from "next/image";
import CenteredHeading from "@/components/gaming/CenteredHeading";
import CommunitySection from "@/components/home/CommunitySection";
import StoreFinder from "@/components/pages/StoreFinder";

export const metadata: Metadata = {
  title: "Where to Buy | Redragon",
  description: "Locate authorized Redragon stores and online retailers for individual purchases.",
};

/** Figma "Where to buy" */
export default function WhereToBuyPage() {
  return (
    <>
      <section className="relative h-[320px] overflow-hidden bg-gradient-to-r from-[#454344] to-[#727071] lg:h-[544px]">
        <Image src="/images/pages/where-to-buy/hero.png" alt="" fill sizes="100vw" preload className="object-cover" />
        <div className="absolute inset-0 bg-black/28" />
        <h1 className="absolute left-1/2 top-1/2 -translate-1/2 whitespace-nowrap font-lexend-exa text-[40px] font-black tracking-[-3px] text-white lg:top-[212px] lg:translate-y-0 lg:text-[96px] lg:tracking-[-7.68px]">
          WHERE TO BUY
        </h1>
      </section>

      <section className="bg-white">
        <div className="page-frame flex min-h-[350px] flex-col items-center px-4 pt-14 pb-14 lg:px-20 lg:pt-[88px] lg:pb-[88px]">
          <CenteredHeading title="WHERE TO BUY" subtitle="Locate authorized stores for individual purchases" />
          <StoreFinder />
        </div>
      </section>

      <CommunitySection />
    </>
  );
}
