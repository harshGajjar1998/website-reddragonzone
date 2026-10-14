import Image from "next/image";
import MobileExplodedView from "@/components/home/MobileExplodedView";

type Callout = {
  label: string;
  x: number;
  y: number;
  width?: number;
  /** Connector SVG (includes arrowhead) */
  connector: { src: string; x: number; y: number; w: number; h: number };
};

/** SPECIAL PAGE "Section 3" coordinates (centred heading variant, 1440×1000) */
const callouts: Callout[] = [
  {
    label: "Magnesium alloy",
    x: 120,
    y: 184,
    connector: { src: "/images/home/connectors/magnesium.svg", x: 311.5, y: 201, w: 237, h: 42 },
  },
  {
    label: "Iceflow",
    x: 1238,
    y: 497,
    connector: { src: "/images/home/connectors/iceflow.svg", x: 973.8, y: 508.1, w: 262, h: 15 },
  },
  {
    label: "PAW 3395 optical sensor",
    x: 1038,
    y: 631,
    width: 282,
    connector: { src: "/images/home/connectors/sensor.svg", x: 746.9, y: 641.9, w: 289, h: 15 },
  },
  {
    label: "F-switch encoder",
    x: 120,
    y: 604,
    connector: { src: "/images/home/connectors/f-switch.svg", x: 218, y: 642.5, w: 205, h: 129 },
  },
  {
    label: "Foot pad",
    x: 165,
    y: 891,
    connector: { src: "/images/home/connectors/foot-pad.svg", x: 213.5, y: 858.2, w: 155, h: 31 },
  },
  {
    label: "More efficient battery",
    x: 1075,
    y: 812,
    connector: { src: "/images/home/connectors/battery.svg", x: 1044.4, y: 737.2, w: 155, h: 73 },
  },
];

/** Exploded architectural blueprint of a featured product (SPECIAL PAGE "Section 3"). */
export default function ExplodedBlueprint({ productName }: { productName: string }) {
  return (
    <section className="bg-silver-mobile overflow-hidden lg:bg-silver-tall">
      <MobileExplodedView productName={productName} />
      <div className="page-frame relative hidden h-[1000px] lg:block">
        <div className="absolute left-1/2 top-16 flex -translate-x-1/2 flex-col items-center whitespace-nowrap">
          <h2 className="font-lexend-giga text-[40px] font-semibold leading-none tracking-[-3.2px] text-dragon">
            Exploded Architectural Blueprint
          </h2>
          <p className="-mt-[3px] font-lexend-exa text-[22px] font-semibold leading-[1.2] text-ink">
            Unrivaled Internal Assembly of {productName}
          </p>
        </div>

        <Image
          src="/images/home/m997-exploded.png"
          alt={`Exploded view of the ${productName} internal components`}
          width={742}
          height={776}
          className="absolute left-[317px] top-[202px] h-[776px] w-[742px] object-cover"
        />

        {callouts.map(({ label, x, y, width, connector: c }) => (
          <div key={label}>
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
      </div>
    </section>
  );
}
