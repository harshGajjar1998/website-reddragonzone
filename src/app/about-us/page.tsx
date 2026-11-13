import type { Metadata } from "next";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import Image from "next/image";
import Link from "next/link";
import EliteClubNewsletter from "@/components/pages/EliteClubNewsletter";
import SectionIntro from "@/components/pages/SectionIntro";
import { getContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About Us | Redragon",
  description:
    "Redragon builds high-quality, cost-effective gaming peripherals for gamers worldwide since 2013. Learn about our brand, philosophy and the spirit of the dragon.",
};

const A = "/images/pages/about";

function ExploreLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 font-lexend-deca text-[13px] font-medium uppercase lg:text-[16px] leading-normal tracking-[1px] text-[#e60012]"
    >
      {label}
      <Image
        src="/icons/pages/explore-arrow.svg"
        alt=""
        width={26}
        height={20}
        className="-m-[1.6px] transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}

/** Figma "redragon-about-us" */
export default async function AboutPage() {
  const { aboutSections, aboutValues, copy } = (await getContent()).pages;
  const c = copy.about;
  return (
    <>
      {/* Hero */}
      <CmsSection ids={["singleton:about_page"]}>
      <section className="relative flex h-[544px] items-center justify-center overflow-hidden bg-[#0f1115] lg:h-[700px]">
        <Image src={c.heroImage} alt="" fill sizes="100vw" preload className="object-cover" />
        <div className="absolute inset-0 bg-[#0f1115]/45 lg:bg-[#0f1115]/25" />
        <div className="relative flex w-full flex-col items-center gap-6 px-6 text-center lg:w-auto lg:gap-8 lg:px-4">
          <div className="flex w-full flex-col items-center gap-4 lg:w-[800px]">
            <p className="font-lexend-giga text-[12px] font-semibold uppercase tracking-[2px] text-crimson lg:text-[20px]">
              {c.heroEyebrow}
            </p>
            <h1 className="font-lexend-exa text-[34px] font-bold leading-[1.1] tracking-[-1.36px] text-white lg:text-[64px] lg:tracking-normal">{c.heroTitle}</h1>
            <p className="font-lexend-deca text-[19px] font-light leading-[1.4] text-white lg:text-[24px] lg:leading-normal">{c.heroSubtitle}</p>
          </div>
          <p className="w-full font-lexend-deca text-[15px] leading-[1.6] text-[#bac0ca] lg:w-[680px] lg:text-[16px] lg:text-[#9ba3af]">
            {c.heroText}
          </p>
          <Link
            href={c.heroButtonUrl || "/gaming"}
            className="flex h-[50px] w-full items-center justify-center rounded-[4px] bg-crimson px-8 font-lexend-deca text-[14px] lg:h-12 lg:w-auto font-semibold uppercase tracking-[1px] text-white transition-colors hover:bg-[#c3151c] lg:text-[16px]"
          >
            {c.heroButton}
          </Link>
        </div>
      </section>
      </CmsSection>

      {/* Brand story / philosophy / inspiration */}
      {/* API: dynamic data – About Us sections */}
      {aboutSections.map((s) => (
        <CmsSection key={s.title} ids={entryIds([s])}>
        <section className={s.tinted ? "bg-[#f6f6f6]" : "bg-white"}>
          <div
            className={`page-frame flex flex-col gap-6 px-6 py-12 lg:flex-row lg:items-center lg:gap-16 lg:px-[120px] lg:py-24 ${
              s.mediaLeft ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div className="flex w-full flex-col gap-6 lg:w-[568px] lg:shrink-0">
              <SectionIntro eyebrow={s.eyebrow} title={s.title} />
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 20)} className="font-lexend-deca text-[15px] leading-[1.65] text-[#626466] lg:text-[16px] lg:leading-[1.6]">
                  {p}
                </p>
              ))}
            </div>
            <div
              className="relative h-[260px] w-full overflow-hidden rounded-3xl lg:h-[var(--h)] lg:w-[568px] lg:shrink-0"
              style={{ "--h": `${s.image.h}px` } as React.CSSProperties}
            >
              <Image src={s.image.src} alt={s.image.alt} fill sizes="(max-width: 1023px) 100vw, 568px" className="object-cover" />
            </div>
          </div>
        </section>
        </CmsSection>
      ))}

      {/* Explore our product (Figma "Section 2", 800px) */}
      <CmsSection ids={["singleton:about_page"]}>
      <section className="overflow-hidden bg-[#f6f6f6]">
        {/* Mobile: the two cards stacked */}
        <div className="mobile-frame flex flex-col gap-6 px-6 py-14 lg:hidden">
          <div className="flex flex-col gap-2">
            <p className="font-lexend-giga text-[14px] font-semibold leading-[1.4] text-[#e01a22]">{c.exploreEyebrow}</p>
            <h2 className="font-lexend-exa text-[26px] font-semibold leading-[1.25] tracking-[-0.78px] text-ink">{c.exploreTitle}</h2>
          </div>
          <div className="flex flex-col gap-4 rounded-[32px] bg-graphite px-6 pt-4 pb-8">
            <Image src={`${A}/gaming-mouse.png`} alt="Redragon gaming mouse" width={700} height={700} className="mx-auto size-[220px]" />
            <h3 className="font-lexend-deca text-[22px] font-medium leading-[1.25] text-white">GAMING</h3>
            <span className="h-0.5 w-[85px] bg-[#e60012]" />
            <p className="font-lexend-deca text-[15px] font-light leading-[1.5] text-white/70">
              Highperformance gaming gear built for pro-level precision
            </p>
            <ExploreLink href="/gaming" label="Explore gaming" />
          </div>
          <div className="flex flex-col gap-4 rounded-[32px] bg-white px-6 pt-4 pb-8">
            <Image src={`${A}/office-mouse.png`} alt="Redragon office mouse" width={756} height={756} className="mx-auto size-[220px]" />
            <h3 className="font-lexend-deca text-[22px] font-medium leading-[1.25] text-ink">Office</h3>
            <span className="h-0.5 w-[85px] bg-[#e60012]" />
            <p className="font-lexend-deca text-[15px] font-light leading-[1.5] text-ink/70">
              Reliable and comfortable gear for work and everyday use.
            </p>
            <ExploreLink href="/office" label="Explore Office" />
          </div>
        </div>

        <div className="page-frame relative hidden h-[800px] lg:block">
          <div className="absolute left-[120px] top-24 flex flex-col gap-2">
            <p className="font-lexend-giga text-[24px] font-semibold leading-[1.2] text-[#e60012]">{c.exploreEyebrow}</p>
            <h2 className="font-lexend-exa text-[32px] font-medium leading-[1.2] text-ink">
              {c.exploreTitle}
            </h2>
          </div>

          <div className="absolute left-[116px] top-[373px] h-[352px] w-[592px] rounded-[40px] bg-graphite" />
          <div className="absolute left-[732px] top-[373px] h-[352px] w-[592px] rounded-[40px] bg-white" />

          <Image src={`${A}/gaming-shadow.png`} alt="" width={595} height={191} className="absolute left-[263.4px] top-[497.4px] h-[95.2px] w-[297.2px] max-w-none" />
          <Image src={`${A}/office-shadow.png`} alt="" width={761} height={277} className="absolute left-[835.9px] top-[492.9px] h-[138.2px] w-[380.2px] max-w-none" />
          <Image src={`${A}/gaming-mouse.png`} alt="Redragon gaming mouse" width={700} height={700} className="absolute left-60 top-[194px] size-[350px] max-w-none" />

          <div className="absolute left-[156px] top-[565px] flex w-[467px] flex-col gap-[15px]">
            <h3 className="font-lexend-deca text-[24px] font-medium leading-[1.2] text-white">GAMING</h3>
            <span className="h-0.5 w-[85px] bg-[#e60012]" />
            <p className="font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-white/70">
              Highperformance gaming gear built for pro-level precision
            </p>
          </div>
          <div className="absolute left-[772px] top-[565px] flex w-[467px] flex-col gap-[15px]">
            <h3 className="font-lexend-deca text-[24px] font-medium leading-[1.2] text-ink">Office</h3>
            <span className="h-0.5 w-[85px] bg-[#e60012]" />
            <p className="font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-ink/70">
              Reliable and comfortable gear for work and everyday use.
            </p>
          </div>
          <div className="absolute left-[156px] top-[673px]">
            <ExploreLink href="/gaming" label="Explore gaming" />
          </div>
          <div className="absolute left-[772px] top-[673px]">
            <ExploreLink href="/office" label="Explore Office" />
          </div>
          <Image src={`${A}/office-mouse.png`} alt="Redragon office mouse" width={756} height={756} className="absolute left-[837px] top-[194px] size-[378px] max-w-none" />
        </div>
      </section>
      </CmsSection>

      {/* Values */}
      <CmsSection ids={["singleton:about_page", ...entryIds(aboutValues)]}>
      <section className="bg-white">
        <div className="page-frame flex flex-col gap-8 px-6 py-14 lg:gap-12 lg:px-[120px] lg:py-24">
          <SectionIntro eyebrow={c.valuesEyebrow} title={c.valuesTitle} />
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
            {/* API: dynamic data – About Us values */}
            {aboutValues.map((v) => (
              <div
                key={v.title}
                className="flex w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-[inset_0_0_0_1px_rgb(26_26_26/0.1)] lg:w-[384px] lg:p-8"
              >
                <span className="flex size-12 items-center justify-center rounded-lg bg-crimson">
                  <Image src="/icons/pages/shield.svg" alt="" width={24} height={24} />
                </span>
                <h3 className="font-lexend-exa text-[19px] font-semibold leading-[1.3] text-ink lg:text-[20px] lg:leading-normal">{v.title}</h3>
                <p className="font-lexend-deca text-[15px] leading-[1.5] text-[#626466]">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </CmsSection>

      <EliteClubNewsletter />
    </>
  );
}
