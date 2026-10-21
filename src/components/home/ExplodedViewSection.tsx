import Image from "next/image";
import type { CSSProperties } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { ExplodedParts, ExplodedStage } from "./ExplodedMouse";
import MobileExplodedView from "./MobileExplodedView";

type Callout = {
  label: string;
  /** label position */
  x: number;
  y: number;
  width?: number;
  /** connector SVG (exported from Figma, includes arrowhead) */
  connector: { src: string; x: number; y: number; w: number; h: number };
};

// API: dynamic data – exploded view part labels (hard-coded here for now)
const callouts: Callout[] = [
  {
    label: "Magnesium alloy",
    x: 120,
    y: 197,
    connector: { src: "/images/home/connectors/magnesium.svg", x: 311.5, y: 214, w: 237, h: 42 },
  },
  {
    label: "Iceflow",
    x: 1238,
    y: 510,
    connector: { src: "/images/home/connectors/iceflow.svg", x: 973.8, y: 521.1, w: 262, h: 15 },
  },
  {
    label: "PAW 3395 optical sensor",
    x: 1038,
    y: 644,
    width: 282,
    connector: { src: "/images/home/connectors/sensor.svg", x: 746.9, y: 654.9, w: 289, h: 15 },
  },
  {
    label: "F-switch encoder",
    x: 120,
    y: 617,
    connector: { src: "/images/home/connectors/f-switch.svg", x: 218, y: 655.5, w: 205, h: 129 },
  },
  {
    label: "Foot pad",
    x: 165,
    y: 904,
    connector: { src: "/images/home/connectors/foot-pad.svg", x: 213.5, y: 871.2, w: 155, h: 31 },
  },
  {
    label: "More efficient battery",
    x: 1075,
    y: 825,
    connector: { src: "/images/home/connectors/battery.svg", x: 1044.4, y: 750.2, w: 155, h: 73 },
  },
];

/** Figma "Section 3" – exploded architectural blueprint (1440×1000). The mouse comes apart as it scrolls in. */
export default function ExplodedViewSection() {
  return (
    <section className="bg-silver-mobile overflow-hidden lg:bg-silver-tall">
      {/* API: dynamic data – featured product name (hard-coded here for now) */}
      <MobileExplodedView productName="Prism Pro M997" />

      <ExplodedStage className="page-frame hidden h-[1000px] lg:block">
        <SectionHeading
          eyebrow="Exploded Architectural Blueprint"
          // API: dynamic data – featured product name (hard-coded here for now)
          title="Unrivaled Internal Assembly of Prism Pro M997"
          className="absolute left-[120px] top-[80px] gap-2"
        />

        <ExplodedParts
          alt="Exploded view of the PRISM PRO M997 internal components"
          className="absolute left-[317px] top-[215px] h-[776px] w-[742px]"
        />

        {callouts.map(({ label, x, y, width, connector: c }, i) => (
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
