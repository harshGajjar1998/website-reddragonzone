import Image from "next/image";
import ArtImage, { type Art } from "@/components/gaming/ArtImage";

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

/** Mobile fan (Figma "Office Produce" screen 1, 394px frame): three keyboards stood on end. */
const SIDE_CROP = { w: 100, h: 247, left: 0, top: -73.49 };
const mobileKeyboards: Art[] = [
  // Transposed layer (Figma matrix(0 1 1 0)) = rotate 90° + vertical flip
  {
    src: `${H}/keyboard-side.png`,
    width: 800,
    height: 800,
    box: { left: 30, top: 422.5, w: 368, h: 149 },
    outer: { w: 149, h: 368 },
    rotate: 90,
    flipY: true,
    crop: SIDE_CROP,
    shadow: "drop-card",
  },
  {
    src: `${H}/keyboard-side.png`,
    width: 800,
    height: 800,
    box: { left: 209, top: 422.5, w: 368, h: 149 },
    outer: { w: 149, h: 368 },
    rotate: 90,
    crop: SIDE_CROP,
    shadow: "drop-card",
  },
  {
    src: "/images/office/products/bk-7111wg-alt.png",
    alt: "Redragon office keyboards",
    width: 482,
    height: 320,
    box: { left: 112.5, top: 393, w: 413, h: 167 },
    outer: { w: 167, h: 413 },
    rotate: 90,
    crop: { w: 112.09, h: 183.91, left: -6.05, top: -41.95 },
    shadow: "drop-card",
  },
];

/** Figma "Frame 105" (Office landing page) – "Office Products" over a keyboard fan (688px). */
export default function OfficeHero() {
  return (
    <section className="overflow-hidden bg-[linear-gradient(90deg,#454344_0%,#727071_78.646%)] lg:bg-[#f6f6f6]">
      {/* Mobile – 704px below the header */}
      <div className="mobile-frame h-[704px] lg:hidden">
        <Image
          src={`${H}/backdrop.png`}
          alt=""
          width={2000}
          height={910}
          preload
          className="absolute left-1/2 top-[-96px] h-[800px] w-[1776px] max-w-none -translate-x-1/2"
        />
        <div className="absolute left-1/2 top-0 h-full w-[394px] -translate-x-1/2">
          {mobileKeyboards.map((art, i) => (
            <ArtImage key={i} art={{ ...art, sizes: "200px", preload: true }} />
          ))}
        </div>
        <h1 className="relative pt-40 text-center font-audiowide text-[min(72px,17cqw)] leading-[1.1]">
          <span className="text-ink">Office</span>
          <br />
          <span className="text-[#e60012]">Products</span>
        </h1>
      </div>

      <div className="page-frame relative hidden h-[688px] lg:block">
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
