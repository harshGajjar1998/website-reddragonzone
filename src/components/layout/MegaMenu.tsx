import Image from "next/image";
import Link from "next/link";
import type { MegaMenu as MegaMenuData, MegaMenuTile } from "@/data/navigation";

const label =
  "absolute font-lexend-deca text-[20px] font-light leading-[1.2] text-white/70 transition-colors group-hover:text-white";

function Tile({ tile, width, height }: { tile: MegaMenuTile; width: number; height: number }) {
  const centered = tile.labelAlign !== "left";

  return (
    <Link
      href={tile.href}
      className="group relative block shrink-0 rounded-[16px] bg-charcoal transition-colors hover:bg-[#2a2a2a]"
      style={{ width, height }}
    >
      {tile.images.map((img, i) => (
        <Image
          key={i}
          src={img.src}
          alt={i === 0 ? tile.label : ""}
          width={img.w}
          height={img.h}
          className={`pointer-events-none absolute max-w-none transition-transform duration-300 group-hover:scale-[1.03] ${
            img.fit === "contain" ? "object-contain" : "object-cover"
          } ${img.rounded ? "rounded-[16px]" : ""}`}
          style={{ left: img.x, top: img.y, width: img.w, height: img.h }}
        />
      ))}
      <span
        className={`${label} ${centered || tile.labelWidth ? "text-center" : ""} ${centered ? "-translate-x-1/2" : ""} ${
          tile.labelWidth ? "" : "whitespace-nowrap"
        }`}
        style={{ left: tile.labelX, top: tile.labelY, width: tile.labelWidth }}
      >
        {tile.lines ? (
          <>
            {tile.lines[0]}
            <br />
            {tile.lines[1]}
          </>
        ) : (
          tile.label
        )}
      </span>
    </Link>
  );
}

/** Dark "By category" panel shown under the header (Figma frames Gaming / Office / Support). */
export default function MegaMenu({ menu, id }: { menu: MegaMenuData; id: string }) {
  const widths = Array.isArray(menu.tileWidth) ? menu.tileWidth : [menu.tileWidth];

  return (
    <div
      id={id}
      className="absolute inset-x-0 top-full overflow-clip bg-graphite shadow-[0_20px_28px_rgba(0,0,0,0.25)]"
      style={{ height: menu.height }}
    >
      <div className="page-frame h-full">
        <p
          className="absolute left-[120px] font-lexend-giga text-[24px] leading-[1.2] whitespace-nowrap text-white"
          style={{ top: menu.headingTop }}
        >
          By category
        </p>
        <ul
          className="absolute left-[120px] grid gap-4"
          style={{ top: menu.gridTop, gridTemplateColumns: `repeat(${menu.columns}, max-content)` }}
        >
          {menu.tiles.map((tile, i) => (
            <li key={tile.label}>
              <Tile tile={tile} width={widths[(i % menu.columns) % widths.length]} height={menu.tileHeight} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
