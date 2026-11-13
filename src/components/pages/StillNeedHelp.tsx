import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { contactHref, type EnquiryType } from "@/data/pages";

/**
 * "Still need help?" contact banner (Figma "Frame 158" on Where to buy, 1279×176).
 * Desktop is a fixed-height row; below lg it stacks and centres.
 */
export default function StillNeedHelp({
  enquiry,
  className = "",
  title = "Still need help?",
  text = "Can't find the answer you're looking for? Our dedicated support team is ready to assist you.",
}: {
  /** Pre-selected on the contact form */
  enquiry: EnquiryType;
  className?: string;
  title?: string;
  text?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[12px] bg-[linear-gradient(97.84deg,#ffdbdb_0%,#f5dcdc_100%)] px-6 py-8 lg:ml-[81px] lg:h-[176px] lg:w-[1279px] lg:p-0 ${className}`}
    >
      {/* Mail icon in its ring (Ellipse 19 + Frame) */}
      <div className="relative mx-auto size-[96px] lg:absolute lg:top-1/2 lg:left-[56px] lg:size-[128px] lg:-translate-y-1/2">
        <Image src="/images/pages/where-to-buy/help-ring.svg" alt="" width={131} height={131} className="absolute inset-[-1.17%] size-[102.34%] max-w-none" />
        <Image
          src="/images/pages/where-to-buy/icon-mail.svg"
          alt=""
          width={72}
          height={72}
          className="absolute top-1/2 left-1/2 size-[54px] -translate-1/2 lg:size-[72px]"
        />
      </div>

      <div className="relative z-10 mt-5 flex flex-col items-center gap-3 text-center lg:absolute lg:top-[calc(50%+0.5px)] lg:left-[224px] lg:mt-0 lg:w-[622px] lg:-translate-y-1/2 lg:items-start lg:gap-[12px] lg:text-left">
        <h2 className="font-lexend-deca text-[24px] leading-[1.2] font-medium text-black lg:w-full lg:text-[32px]">{title}</h2>
        <p className="font-lexend text-[14px] leading-[1.2] text-[#6f7279] lg:whitespace-nowrap">
          {text}
        </p>
        <ButtonLink href={contactHref(enquiry)} chevron className="gap-[12px] px-[28px] py-[14px] font-outfit text-[14px] leading-[normal] font-bold">
          Contact us
        </ButtonLink>
      </div>

      {/* 龙头 LOGO – screened dragon head watermark */}
      <Image
        src="/images/pages/where-to-buy/dragon-head.png"
        alt=""
        width={267}
        height={176}
        className="pointer-events-none absolute top-0 right-[-60px] h-[176px] w-[267px] object-cover opacity-40 mix-blend-screen lg:right-[40px]"
      />
    </div>
  );
}
