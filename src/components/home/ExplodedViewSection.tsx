import Image from "next/image";
import type { CSSProperties } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Blueprint } from "@/data/home";
import { ExplodedParts, ExplodedStage } from "./ExplodedMouse";
import MobileExplodedView from "./MobileExplodedView";

type Callout = {
  /** label position */
  x: number;
  y: number;
  width?: number;
  /** connector SVG (exported from Figma, includes arrowhead) */
  connector: { src: string; x: number; y: number; w: number; h: number };
};

/** Callout positions, in the order of the CMS part labels */
const callouts: Callout[] = [
  {
    x: 120,
    y: 197,
    connector: { src: "/images/home/connectors/magnesium.svg", x: 311.5, y: 214, w: 237, h: 42 },
  },
  {
    x: 1238,
    y: 510,
    connector: { src: "/images/home/connectors/iceflow.svg", x: 973.8, y: 521.1, w: 262, h: 15 },
  },
  {
    x: 1038,
    y: 644,
    width: 282,
    connector: { src: "/images/home/connectors/sensor.svg", x: 746.9, y: 654.9, w: 289, h: 15 },
  },
  {
    x: 120,
    y: 617,
    connector: { src: "/images/home/connectors/f-switch.svg", x: 218, y: 655.5, w: 205, h: 129 },
  },
  {
    x: 165,
    y: 904,
    connector: { src: "/images/home/connectors/foot-pad.svg", x: 213.5, y: 871.2, w: 155, h: 31 },
  },
  {
    x: 1075,
    y: 825,
    connector: { src: "/images/home/connectors/battery.svg", x: 1044.4, y: 750.2, w: 155, h: 73 },
  },
];

/** Figma "Section 3" – exploded architectural blueprint (1440×1000). The mouse comes apart as it scrolls in. */
// API: dynamic data – eyebrow, product name and part labels (CMS homepage "Exploded blueprint" section)
export default function ExplodedViewSection({ blueprint }: { blueprint: Blueprint }) {
  const { eyebrow, product, parts } = blueprint;
  // One callout per label; the artwork has six positions.
  const labelled = callouts.slice(0, parts.length).map((c, i) => ({ ...c, label: parts[i] }));
  return (
    <section className="bg-silver-mobile overflow-hidden lg:bg-silver-tall">
      <MobileExplodedView eyebrow={eyebrow} productName={product} parts={parts} />

      <ExplodedStage className="page-frame hidden h-[1000px] lg:block">
        <SectionHeading
          eyebrow={eyebrow}
          title={`Unrivaled Internal Assembly of ${product}`}
          className="absolute left-[120px] top-[80px] gap-2"
        />

        <ExplodedParts
          alt={`Exploded view of the ${product.toUpperCase()} internal components`}
          className="absolute left-[317px] top-[215px] h-[776px] w-[742px]"
        />

        {labelled.map(({ label, x, y, width, connector: c }, i) => (
          <div key={label} className="exploded-callout" style={{ "--i": i } as CSSProperties}>
            <Image
              src={c.src}
              alt=""
              width={c.w}
              height={c.h}
              className="absolute max-w-none"
              style={{ left: c.x, top: c.y }}
            />
            <p
              className={`absolute font-inter text-[24px] font-medium leading-[1.5] tracking-[-0.264px] text-graphite ${width ? "" : "whitespace-nowrap"}`}
              style={{ left: x, top: y, width }}
            >
              {label}
            </p>
          </div>
        ))}
      </ExplodedStage>
    </section>
  );
}
