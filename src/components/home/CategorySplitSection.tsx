import Image from "next/image";
import Link from "next/link";
import BrowseLink from "@/components/ui/BrowseLink";
import { cq } from "@/lib/mobile";

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
function MobileSplit() {
  return (
    <div className="overflow-hidden bg-silver-mobile lg:hidden">
      {/* ---------- Gaming ---------- */}
      <div className="mobile-frame">
        <div className="relative min-h-[330px]" style={{ height: cq(400) }}>
          <Image
            src="/images/home/dragon-head-logo.png"
            alt=""
            width={1024}
            height={676}
            className="absolute object-cover opacity-40 mix-blend-screen"
            style={{ left: cq(1), top: cq(277), width: cq(186), height: cq(123) }}
          />
          <p aria-hidden className={`${mobileGhost} text-white/50`} style={{ left: cq(-23), top: cq(40), fontSize: cq(96) }}>
            Game
          </p>
          <Image
            src="/images/home/m997-main.png"
            alt="Redragon PRISM PRO M997 gaming mouse"
            width={1600}
            height={1600}
            className="absolute max-w-none drop-gaming-mouse"
            style={{ left: cq(195), top: cq(34), width: cq(341), height: cq(341) }}
          />
          <MobilePanelCopy
            title="Game"
            description="High performance gaming gear built for pro-level precision"
            href="/gaming"
          />
        </div>

      </div>

      {/* ---------- Office (its backdrop spans the full width on tablets) ---------- */}
      <div className="overflow-hidden bg-[linear-gradient(202.93deg,#f0f0f0_4.6171%,#ffffff_86.213%)]">
        <div className="mobile-frame">
          <div className="relative min-h-[330px]" style={{ height: cq(400) }}>
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
              className="absolute bottom-0 left-0 object-cover opacity-5"
              style={{ width: cq(112), height: cq(124) }}
            />
            <p
              aria-hidden
              className={`${mobileGhost} text-[rgba(182,182,182,0.5)]`}
              style={{ left: cq(-23), top: cq(40), fontSize: cq(96) }}
            >
              Office
            </p>
            <Image
              src="/images/home/office-mouse-bm4235.png"
              alt="Redragon BM-4235 ergonomic office mouse"
              width={1600}
              height={1600}
              className="absolute max-w-none drop-office-mouse"
              style={{ left: cq(153), top: cq(29), width: cq(341), height: cq(341) }}
            />
            <MobilePanelCopy
              title="Office"
              description="Reliable and comfortable gear for work and everyday use."
              href="/office"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Figma "Section 9" – Gaming / Office split (1440×800). */
export default function CategorySplitSection() {
  return (
    <section className="overflow-hidden lg:bg-silver">
      <MobileSplit />
      <div className="page-frame hidden h-[800px] lg:block">
        {/* Dragon watermark behind the gaming panel */}
        <Image
          src="/images/home/dragon-head-logo.png"
          alt=""
          width={524}
          height={345}
          className="absolute left-[5px] top-[455px] h-[345px] w-[524px] object-cover opacity-35 mix-blend-screen"
        />

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
            className="absolute left-[-39px] top-[104px] font-gotham text-[153px] font-bold leading-[1.2] tracking-[4.59px] whitespace-nowrap text-[rgba(182,182,182,0.5)]"
          >
            Office
          </p>
          <Image
            src="/images/home/office-mouse-bm4235.png"
            alt="Redragon BM-4235 ergonomic office mouse"
            width={608}
            height={608}
            className="absolute left-[317px] top-[96px] size-[608px] drop-office-mouse"
          />
          <Image
            src="/images/home/r-logo-office.png"
            alt=""
            width={294}
            height={325}
            className="absolute bottom-0 left-0 h-[325px] w-[294px] object-cover opacity-5"
          />
          <PanelCopy
            title="Office"
            description="Reliable and comfortable gear for work and everyday use."
            href="/office"
            left={88}
            ruleTop={456}
          />
        </div>

        {/* ---------- Gaming (left) ---------- */}
        <div className="absolute left-0 top-0 h-[800px] w-[720px] overflow-clip">
          <p
            aria-hidden
            className="absolute left-[-34px] top-[104px] font-gotham text-[153px] font-bold leading-[1.2] tracking-[4.59px] whitespace-nowrap text-white/50"
          >
            Game
          </p>
          <Image
            src="/images/home/m997-main.png"
            alt="Redragon PRISM PRO M997 gaming mouse"
            width={554}
            height={554}
            className="absolute left-[386px] top-[123px] size-[554px] drop-gaming-mouse"
          />
          <PanelCopy
            title="GAMING"
            description="Highperformance gaming gear built for pro-level precision"
            href="/gaming"
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
      </div>
    </section>
  );
}
