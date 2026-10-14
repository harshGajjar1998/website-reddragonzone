import Image from "next/image";
import Link from "next/link";
import ArtImage, { type Art } from "@/components/gaming/ArtImage";
import CenteredHeading from "@/components/gaming/CenteredHeading";
import type { OfficeTile } from "@/data/office";

const TILE_BG = "/images/gaming/categories/tile-bg.png";

/**
 * Figma fills the short tiles with the pattern rotated 90° and cropped
 * (imageTransform). These CSS matrices map the 3000×2000 image onto the 632×248 tile.
 */
const SHORT_TILE_BG = [
  "matrix(0, -0.442876, 0.44288, 0, -0.108, 854.26)",
  "matrix(0, -0.315999, 0.3865, 0, 0, 598)",
];

function Browse({ href, label, className }: { href: string; label: string; className: string }) {
  return (
    <Link
      href={href}
      aria-label={`Browse ${label}`}
      className={`group absolute flex items-center gap-4 font-lexend-deca text-[24px] font-medium uppercase leading-normal tracking-[1px] text-dragon ${className}`}
    >
      Browse
      <Image
        src="/icons/arrow-circle-right.svg"
        alt=""
        width={48}
        height={48}
        className="transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}

function TileArt({ tile }: { tile: OfficeTile }) {
  const { art } = tile;
  return (
    <Image
      src={art.src}
      alt={`Redragon office ${tile.label.toLowerCase()}`}
      width={art.width}
      height={art.height}
      className="pointer-events-none absolute max-w-none"
      style={{ left: art.left, top: art.top, width: art.width / 2, height: art.height / 2 }}
    />
  );
}

/** One 632×248 tile (Keyboards / Combo) */
function ShortTile({ tile, bg }: { tile: OfficeTile; bg: string }) {
  return (
    <div className="relative h-[248px] w-[632px] overflow-clip border border-black">
      <Image
        src={TILE_BG}
        alt=""
        width={3000}
        height={2000}
        className="absolute left-0 top-0 h-[2000px] w-[3000px] max-w-none origin-top-left opacity-60"
        style={{ transform: bg }}
      />
      <p
        aria-hidden
        className="absolute left-[-10px] top-0 font-gotham text-[120px] font-black leading-[1.2] whitespace-nowrap text-[#b6b6b6]/50"
      >
        {tile.ghost}
      </p>
      <h3 className="absolute left-10 top-12 font-lexend-deca text-[40px] font-medium leading-[1.2] whitespace-nowrap text-ink">
        {tile.label}
      </h3>
      {!tile.artOnTop && <TileArt tile={tile} />}
      <Browse href={`/office/${tile.slug}`} label={tile.label} className="left-10 top-44" />
      {tile.artOnTop && <TileArt tile={tile} />}
    </div>
  );
}

/** Mobile tile art (Figma "Office Produce" screen 2), anchored to the tile's right edge. */
const MOBILE_ART: Record<string, Art> = {
  mice: {
    src: "/images/home/office/mouse.png",
    width: 1600,
    height: 1600,
    box: { right: 0, top: 1, w: 168, h: 207 },
    crop: { w: 130.88, h: 106.22, left: 0.18, top: -0.06 },
  },
  keyboards: {
    src: "/images/office/products/bk-7111wg-alt.png",
    width: 482,
    height: 320,
    box: { right: 21, top: 24, w: 355, h: 141 },
    outer: { w: 141, h: 355 },
    rotate: 90,
    crop: { w: 115.87, h: 192.77, left: -7.93, top: -46.39 },
  },
  combo: {
    src: "/images/office/products/combo-k-alt.png",
    width: 1600,
    height: 1600,
    box: { right: -73, top: 35, w: 303, h: 138 },
    crop: { w: 105.46, h: 231.25, left: -1.9, top: -65.63 },
  },
};

/** 394×208 mobile tile – the pattern is turned 180° on every tile after the first. */
function MobileTile({ tile, flip }: { tile: OfficeTile; flip: boolean }) {
  const art = MOBILE_ART[tile.slug];
  return (
    <li className="relative h-[208px] overflow-clip border border-[#696969]">
      <div className={`absolute inset-0 bg-white ${flip ? "-scale-100" : ""}`}>
        <Image
          src="/images/home/office-pattern-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_9.3%] opacity-40"
        />
      </div>
      <p
        aria-hidden
        className="absolute left-[-9px] top-[23px] font-gotham text-[88px] font-black leading-[1.2] tracking-[-0.88px] whitespace-nowrap text-[#bababa]"
      >
        {tile.ghost === "Mice" ? "MICE" : tile.ghost}
      </p>
      {art && <ArtImage art={{ ...art, alt: `Redragon office ${tile.label.toLowerCase()}`, sizes: "50vw" }} />}
      <h3 className="absolute left-4 top-16 font-lexend-deca text-[20px] font-medium leading-[1.2] text-ink">{tile.label}</h3>
      <Link
        href={`/office/${tile.slug}`}
        aria-label={`Browse ${tile.label}`}
        className="group absolute left-4 top-[144px] flex items-center gap-4 font-lexend-deca text-[20px] font-medium uppercase leading-[1.25] tracking-[1px] text-dragon"
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
    </li>
  );
}

/** Figma "Desktop - 8" (Office landing page) – one tall + two short category tiles (1440×800). */
export default function OfficeCategoryGrid({ tall, short }: { tall: OfficeTile; short: [OfficeTile, OfficeTile] }) {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mobile-frame pt-16 lg:hidden">
        <CenteredHeading compact title="Office Category" subtitle="Which gear type are you looking for?" />
        <ul className="mt-[29px]">
          {[tall, ...short].map((tile, i) => (
            <MobileTile key={tile.slug} tile={tile} flip={i > 0} />
          ))}
        </ul>
      </div>

      <div className="page-frame relative hidden h-[800px] lg:block">
        <CenteredHeading
          title="Office Category"
          subtitle="Which gear type are you looking for?"
          className="absolute left-1/2 top-20 -translate-x-1/2"
        />

        <div className="absolute left-20 top-[208px] flex gap-4">
          {/* Tall tile (632×512) */}
          <div className="relative h-[512px] w-[632px] overflow-clip border border-black">
            <Image src={TILE_BG} alt="" fill sizes="632px" className="object-cover opacity-60" />
            <p
              aria-hidden
              className="absolute left-[-18px] top-10 font-gotham text-[152px] font-black leading-[1.2] whitespace-nowrap text-[#b6b6b6]/50"
            >
              {tall.ghost}
            </p>
            <h3 className="absolute left-[38px] top-[107px] font-lexend-deca text-[40px] font-medium leading-[1.2] whitespace-nowrap text-ink">
              {tall.label}
            </h3>
            <TileArt tile={tall} />
            <Browse href={`/office/${tall.slug}`} label={tall.label} className="left-[38px] top-[408px]" />
          </div>

          <div className="flex flex-col gap-4">
            {short.map((tile, i) => (
              <ShortTile key={tile.slug} tile={tile} bg={SHORT_TILE_BG[i]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
