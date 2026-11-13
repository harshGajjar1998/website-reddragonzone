import type { Metadata } from "next";
import Image from "next/image";
import CommunitySection from "@/components/home/CommunitySection";
import PressCoverage from "@/components/pages/PressCoverage";
import StillNeedHelp from "@/components/pages/StillNeedHelp";
import { pressAwards, type PressAward } from "@/data/press";

export const metadata: Metadata = {
  title: "Press & Awards | Redragon",
  description: "Explore the latest news, reviews, awards, and media coverage on Redragon gaming gear.",
};

/** Figma "Award" card, 288×310 */
function AwardCard({ award }: { award: PressAward }) {
  return (
    <li className="relative h-[310px] rounded-[10px] border border-[#d8dee1] bg-white text-center">
      <span
        aria-hidden
        className="absolute top-[23px] left-1/2 flex size-20 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#d6a242] bg-[#fff0ce] font-lexend-deca text-[40px] leading-[54px] font-semibold text-[#b78325]"
      >
        ★
      </span>
      {/* API: dynamic data – award title, publication, date and description */}
      <h3 className="absolute inset-x-5 top-[137px] font-lexend-deca text-[18px] leading-6 font-semibold text-ink">
        {award.title}
      </h3>
      <p className="absolute inset-x-5 top-[187px] font-lexend-deca text-[13px] leading-[18px] font-medium text-ink">
        {award.publication}
      </p>
      <p className="absolute inset-x-5 top-[210px] font-lexend-deca text-[12px] leading-4 text-[#626466]">{award.date}</p>
      <p className="absolute inset-x-5 top-[237px] font-lexend-deca text-[12px] leading-4 text-[#626466]">
        {award.description}
      </p>
    </li>
  );
}

/** Figma "Press" */
export default function PressAndAwardsPage() {
  return (
    <>
      <section className="relative h-[420px] overflow-hidden bg-black lg:h-[584px]">
        <Image
          src="/images/pages/press/hero.png"
          alt=""
          fill
          sizes="100vw"
          preload
          className="object-cover object-[72%_center] lg:object-right"
        />
        <div aria-hidden className="absolute inset-0 bg-[#08090c]/20" />
        <div className="page-frame relative flex h-full flex-col items-center justify-center px-4 text-center lg:justify-start lg:pt-[209px]">
          <p className="font-lexend-deca text-[16px] leading-6 font-semibold text-dragon lg:text-[20px]">PRESS &amp; MEDIA</p>
          <h1 className="mt-3 font-lexend-exa text-[32px] leading-[40px] font-black tracking-[-2.56px] text-white lg:mt-4 lg:text-[64px] lg:leading-[80px] lg:tracking-[-5.12px] lg:whitespace-nowrap">
            Redragon in the Spotlight
          </h1>
          <p className="mt-3 font-lexend-deca text-[16px] leading-6 text-[#f6f6f6] lg:mt-4 lg:text-[19px] lg:leading-[30px]">
            Explore the latest news, reviews, awards, and media coverage on Redragon gaming gear.
          </p>
        </div>
      </section>

      <PressCoverage />

      <section className="bg-[#f0f1f3]">
        <div className="page-frame px-4 py-10 lg:h-[519px] lg:px-[120px] lg:pt-[54px] lg:pb-0">
          <h2 className="font-lexend-deca text-[28px] leading-9 font-semibold text-ink lg:text-[36px] lg:leading-[47px]">
            Awards &amp; Recognition
          </h2>
          <p className="mt-2 font-lexend-deca text-[15px] leading-[22px] text-[#626466] lg:mt-[7px]">
            A selection of recognitions celebrating quality, design and value in gaming accessories.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,288px)]">
            {pressAwards.map((award) => (
              <AwardCard key={award.title} award={award} />
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#fafafb] py-10 lg:h-[296px] lg:py-[60px]">
        <div className="page-frame">
          <StillNeedHelp
            enquiry="Press & media"
            className="mx-4 lg:mx-0 lg:ml-[81px]"
            title="Press Contact"
            text="For product review requests, media inquiries and interviews,please contact our team."
          />
        </div>
      </section>

      <CommunitySection />
    </>
  );
}
