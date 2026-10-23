import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import BrowseLink from "@/components/ui/BrowseLink";
import RevealOnView from "@/components/ui/RevealOnView";
import type { HomeSplit } from "@/data/home";
import { cq } from "@/lib/mobile";

/** Entrance stagger for `.enter-*` pieces (globals.css) */
const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

type PanelCopyProps = {
  title: string;
  description: string;
  href: string;
  /** x offset of the copy column inside the 720px panel */
  left: number;
  /** y of the red rule (description and browse link follow at 16px gaps) */
  ruleTop: number;
};

function PanelCopy({ title, description, href, left, ruleTop }: PanelCopyProps) {
  return (
    <>
      <h2
        className="absolute top-[180px] font-lexend-deca text-[40px] font-medium leading-[1.2] whitespace-nowrap text-ink"
        style={{ left }}
      >
        {title}
      </h2>
      <div className="absolute flex w-[230px] flex-col items-start" style={{ left: left - 1, top: ruleTop - 1 }}>
        <Image src="/icons/red-line.svg" alt="" width={87} height={2} />
        <p className="mt-[16px] pl-px font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-ink/90">
          {description}
        </p>
        <BrowseLink href={href} className="mt-4 pl-px" />
      </div>
    </>
  );
}

/** Mobile panel copy (Figma screen 2: title y79, rule y198, text y210, browse y288). */
function MobilePanelCopy({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <div className="absolute left-4 top-[79px] flex w-[188px] flex-col items-start">
      <h2 className="ml-2 font-lexend-deca text-[32px] font-medium leading-[1.2] text-ink">{title}</h2>
      <Image src="/icons/red-line.svg" alt="" width={87} height={2} className="mt-[80px] ml-px" />
      <p className="mt-[10px] font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-ink/90">
        {description}
      </p>
      <Link
        href={href}
        className="group mt-3 inline-flex items-center gap-4 font-lexend-deca text-[20px] font-semibold uppercase leading-[1.25] text-dragon"
      >
        Browse
        <Image
          src="/icons/arrow-circle-right.svg"
          alt=""
          width={32}
          height={32}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

const mobileGhost = "absolute font-gotham font-bold leading-[1.2] tracking-[0.03em] whitespace-nowrap";

/** Mobile – the two panels stacked (Figma "Home Mobile version" screen 2, 390×800). */
function MobileSplit({ gaming, office }: HomeSplit) {
  return (
    <div className="overflow-hidden bg-silver-mobile lg:hidden">
      {/* ---------- Gaming ---------- */}
      <div className="mobile-frame">
        <RevealOnView className="relative min-h-[330px]" style={{ height: cq(400) }}>
          {/* Wrapped: the image's opacity utility would override the entrance's hidden state */}
          <div className="enter-bottom absolute" style={{ left: cq(1), top: cq(277), width: cq(186), height: cq(123) }}>
            <Image
              src="/images/home/dragon-head-logo.png"
              alt=""
              width={1024}
              height={676}
              className="size-full object-cover opacity-40 mix-blend-screen"
            />
          </div>
          <p
            aria-hidden
            className={`${mobileGhost} enter-left text-white/50`}
            style={{ left: cq(8), top: cq(40), fontSize: cq(96), ...delay(100) }}
          >
            {gaming.ghost}
          </p>
          <Image
            src={gaming.image.src}
            alt={gaming.image.alt}
            width={1600}
            height={1600}
            className="enter-right absolute max-w-none drop-gaming-mouse"
            style={{ left: cq(195), top: cq(34), width: cq(341), height: cq(341), ...delay(250) }}
          />
          <MobilePanelCopy title={gaming.title} description={gaming.description} href={gaming.href} />
        </RevealOnView>
      </div>

      {/* ---------- Office (its backdrop spans the full width on tablets) ---------- */}
      <div className="overflow-hidden bg-[linear-gradient(202.93deg,#f0f0f0_4.6171%,#ffffff_86.213%)]">
        <div className="mobile-frame">
          <RevealOnView className="relative min-h-[330px]" style={{ height: cq(400) }}>
            <Image
              src="/images/home/office-pattern-bg.png"
              alt=""
              width={3000}
              height={2000}
              className="absolute top-0 h-full max-w-none -scale-y-100 object-cover opacity-40"
              style={{ left: cq(-105), width: cq(600) }}
            />
            <Image
              src="/images/home/r-logo-office.png"
              alt=""
              width={927}
              height={1024}
              className="enter-bottom absolute bottom-0 left-0 object-cover"
              style={{ width: cq(112), height: cq(124) }}
            />
            <p
              aria-hidden
              className={`${mobileGhost} enter-left text-[rgba(182,182,182,0.5)]`}
              style={{ left: cq(8), top: cq(40), fontSize: cq(96), ...delay(100) }}
            >
              {office.ghost}
            </p>
            <Image
              src={office.image.src}
              alt={office.image.alt}
              width={1600}
              height={1600}
              className="enter-right absolute max-w-none drop-office-mouse"
              style={{ left: cq(153), top: cq(29), width: cq(341), height: cq(341), ...delay(250) }}
            />
            <MobilePanelCopy title={office.title} description={office.description} href={office.href} />
          </RevealOnView>
        </div>
      </div>
    </div>
  );
}

// API: dynamic data – Gaming / Office panels – titles, descriptions, links, images (CMS homepage "Gaming / Office" section)
/**
 * Figma "Section 9" – Gaming / Office split (1440×800). On first view the ghost words slide in
 * from the left, the mice from the right and the watermark logos rise from the bottom.
 */
export default function CategorySplitSection({ split }: { split: HomeSplit }) {
  const { gaming, office } = split;
  return (
    <section className="overflow-hidden lg:bg-silver">
      <MobileSplit {...split} />
      <RevealOnView className="page-frame hidden h-[800px] lg:block">
        {/* Dragon watermark behind the gaming panel (wrapped: its opacity utility would override the entrance) */}
        <div className="enter-bottom absolute left-[5px] top-[455px] h-[345px] w-[524px]">
          <Image
            src="/images/home/dragon-head-logo.png"
            alt=""
            width={524}
            height={345}
            className="size-full object-cover opacity-35 mix-blend-screen"
          />
        </div>

        {/* ---------- Office (right) ---------- */}
        <div className="absolute left-1/2 right-[min(0px,calc(720px-50vw))] top-0 h-[800px] overflow-clip bg-[linear-gradient(202.93deg,#f0f0f0_4.6171%,#ffffff_86.213%)]">
          <Image
            src="/images/home/office-pattern-bg.png"
            alt=""
            width={1522.5}
            height={1015}
            className="absolute bottom-0 left-0 h-[1015px] w-[1522.5px] max-w-none -scale-y-100 object-cover opacity-40"
          />
          <p
            aria-hidden
            className="enter-left absolute left-[24px] top-[104px] font-gotham text-[153px] font-bold leading-[1.2] tracking-[4.59px] whitespace-nowrap text-[rgba(182,182,182,0.5)]"
            style={delay(250)}
          >
            {office.ghost}
          </p>
          <Image
            src={office.image.src}
            alt={office.image.alt}
            width={608}
            height={608}
            className="enter-right absolute left-[317px] top-[96px] size-[608px] drop-office-mouse"
            style={delay(400)}
          />
          {/* R watermark – the PNG already carries the 5% tint in its alpha, so no extra opacity */}
          <Image
            src="/images/home/r-logo-office.png"
            alt=""
            width={294}
            height={325}
            className="enter-bottom absolute bottom-0 left-0 h-[325px] w-[294px] object-cover"
            style={delay(150)}
          />
          <PanelCopy
            title={office.title}
            description={office.description}
            href={office.href}
            left={88}
            ruleTop={456}
          />
        </div>

        {/* ---------- Gaming (left) ---------- */}
        <div className="absolute left-0 top-0 h-[800px] w-[720px] overflow-clip">
          <p
            aria-hidden
            className="enter-left absolute left-[24px] top-[104px] font-gotham text-[153px] font-bold leading-[1.2] tracking-[4.59px] whitespace-nowrap text-white/50"
            style={delay(100)}
          >
            {gaming.ghost}
          </p>
          <Image
            src={gaming.image.src}
            alt={gaming.image.alt}
            width={554}
            height={554}
            className="enter-right absolute left-[386px] top-[123px] size-[554px] drop-gaming-mouse"
            style={delay(250)}
          />
          <PanelCopy
            title={gaming.title}
            description={gaming.description}
            href={gaming.href}
            left={120}
            ruleTop={452}
          />
        </div>

        {/* Center divider – 800px line asset rotated to vertical */}
        <div className="absolute left-1/2 top-0 flex h-[800px] w-0 -translate-x-1/2 items-center justify-center">
          <div className="relative h-0 w-[800px] flex-none rotate-90">
            <Image
              src="/icons/divider-vertical.svg"
              alt=""
              width={800}
              height={2}
              className="absolute -top-[2px] left-0 block h-[2px] w-[800px] max-w-none"
            />
          </div>
        </div>
      </RevealOnView>
    </section>
  );
}
