import Image from "next/image";
import BrowseLink from "@/components/ui/BrowseLink";

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

/** Figma "Section 9" – Gaming / Office split (1440×800). */
export default function CategorySplitSection() {
  return (
    <section className="bg-silver overflow-hidden">
      <div className="page-frame h-[800px]">
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
