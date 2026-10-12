import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EliteClubNewsletter from "@/components/pages/EliteClubNewsletter";
import SectionIntro from "@/components/pages/SectionIntro";
import { aboutSections, aboutValues } from "@/data/pages";

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
      className="group flex items-center gap-4 font-lexend-deca text-[16px] font-medium uppercase leading-normal tracking-[1px] text-[#e60012]"
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
export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[700px] items-center justify-center overflow-hidden bg-[#0f1115]">
        <Image src={`${A}/hero.jpg`} alt="" fill sizes="100vw" preload className="object-cover" />
        <div className="absolute inset-0 bg-[#0f1115]/25" />
        <div className="relative flex flex-col items-center gap-8 text-center">
          <div className="flex w-[800px] flex-col items-center gap-4">
            <p className="font-lexend-giga text-[20px] font-semibold uppercase tracking-[2px] text-crimson">
              [ Brand Genesis ]
            </p>
            <h1 className="font-lexend-exa text-[64px] font-bold leading-[1.1] text-white">ABOUT REDRAGON</h1>
            <p className="font-lexend-deca text-[24px] font-light text-white">Powering Gamers Worldwide Since 2013</p>
          </div>
          <p className="w-[680px] font-lexend-deca text-[16px] leading-[1.6] text-[#9ba3af]">
            We build weaponry for the global elite. From click rates to sound profiles, every millisecond is tuned
            for raw competitive supremacy.
          </p>
          <Link
            href="/gaming"
            className="flex h-12 items-center rounded-[4px] bg-crimson px-8 font-lexend-deca text-[16px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:bg-[#c3151c]"
          >
            Enter the dragon zone
          </Link>
        </div>
      </section>

      {/* Brand story / philosophy / inspiration */}
      {aboutSections.map((s) => (
        <section key={s.title} className={s.tinted ? "bg-[#f6f6f6]" : "bg-white"}>
          <div className={`page-frame flex items-center gap-16 px-[120px] py-24 ${s.mediaLeft ? "flex-row-reverse" : ""}`}>
            <div className="flex w-[568px] shrink-0 flex-col gap-6">
              <SectionIntro eyebrow={s.eyebrow} title={s.title} />
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 20)} className="font-lexend-deca text-[16px] leading-[1.6] text-[#626466]">
                  {p}
                </p>
              ))}
            </div>
            <div className="relative w-[568px] shrink-0 overflow-hidden rounded-3xl" style={{ height: s.image.h }}>
              <Image src={s.image.src} alt={s.image.alt} fill sizes="568px" className="object-cover" />
            </div>
          </div>
        </section>
      ))}

      {/* Explore our product (Figma "Section 2", 800px) */}
      <section className="overflow-hidden bg-[#f6f6f6]">
        <div className="page-frame relative h-[800px]">
          <div className="absolute left-[120px] top-24 flex flex-col gap-2">
            <p className="font-lexend-giga text-[24px] font-semibold leading-[1.2] text-[#e60012]">EXPLORE OUR PRODUCT</p>
            <h2 className="font-lexend-exa text-[32px] font-medium leading-[1.2] text-ink">
              Which gear type are you looking for?
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

      {/* Values */}
      <section className="bg-white">
        <div className="page-frame flex flex-col gap-12 px-[120px] py-24">
          <SectionIntro eyebrow="WHY REDRAGON" title="Built Different" />
          <div className="flex gap-6">
            {aboutValues.map((v) => (
              <div
                key={v.title}
                className="flex w-[384px] flex-col gap-4 rounded-2xl bg-white p-8 shadow-[inset_0_0_0_1px_rgb(26_26_26/0.1)]"
              >
                <span className="flex size-12 items-center justify-center rounded-lg bg-crimson">
                  <Image src="/icons/pages/shield.svg" alt="" width={24} height={24} />
                </span>
                <h3 className="font-lexend-exa text-[20px] font-semibold text-ink">{v.title}</h3>
                <p className="font-lexend-deca text-[15px] leading-[1.5] text-[#626466]">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EliteClubNewsletter />
    </>
  );
}
