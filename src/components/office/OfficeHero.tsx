import Image from "next/image";

const H = "/images/office/hero";

/**
 * Keyboard fan, pre-rendered from Figma with rotation + shadows. Positions are the
 * layers' render bounds in the 688px hero; listed back-to-front as in the design.
 */
const keyboards = [
  { src: `${H}/keyboard-5.png`, left: 844, top: 357, w: 366, h: 331 },
  { src: `${H}/keyboard-1.png`, left: 200, top: 357, w: 366, h: 331 },
  { src: `${H}/keyboard-2.png`, left: 318, top: 273, w: 412, h: 415 },
  { src: `${H}/keyboard-4.png`, left: 672, top: 273, w: 412, h: 415 },
  { src: `${H}/keyboard-3.png`, left: 481, top: 214, w: 448, h: 474 },
];

/** Figma "Frame 105" (Office landing page) – "Office Products" over a keyboard fan (688px). */
export default function OfficeHero() {
  return (
    <section className="overflow-hidden bg-[#f6f6f6]">
      <div className="page-frame relative h-[688px]">
        <Image
          src={`${H}/backdrop.png`}
          alt=""
          width={2000}
          height={910}
          preload
          className="absolute left-[-158px] top-[-111px] h-[799px] w-[1756px] max-w-none"
        />
        {keyboards.map((k, i) => (
          <Image
            key={k.src}
            src={k.src}
            alt={i === keyboards.length - 1 ? "Redragon office keyboards" : ""}
            width={k.w * 2}
            height={k.h * 2}
            preload
            className="absolute max-w-none"
            style={{ left: k.left, top: k.top, width: k.w, height: k.h }}
          />
        ))}
        <h1 className="absolute left-[229px] top-24 font-audiowide text-[112px] leading-[1.2] whitespace-nowrap">
          <span className="text-ink/80">Office</span> <span className="text-[#e60012]">Products</span>
        </h1>
      </div>
    </section>
  );
}
