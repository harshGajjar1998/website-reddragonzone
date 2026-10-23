"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

/**
 * Hotspots on the mobile exploded view: x/y are the "+" icon's top-left in the 390×408 image (Figma).
 * `part` is the index of the label in the CMS list (same order as the desktop callouts).
 */
const hotspots = [
  { part: 0, x: 154, y: 28 },
  { part: 1, x: 218, y: 148 },
  { part: 2, x: 183, y: 223 },
  { part: 5, x: 317, y: 267 },
  { part: 3, x: 62, y: 293 },
  { part: 4, x: 78, y: 342 },
];

/** Tappable "+" markers that reveal the part name (the desktop shows these as callout lines). */
// API: dynamic data – exploded view part labels (via props)
export default function ExplodedHotspots({ parts }: { parts: string[] }) {
  const [active, setActive] = useState<number | null>(null);
  const labelled = hotspots.filter((h) => parts[h.part]).map((h) => ({ ...h, label: parts[h.part] }));

  return (
    <ul>
      {labelled.map((h, i) => {
        const open = active === i;
        const right = h.x > 195;
        return (
          <li
            key={h.label}
            className="exploded-callout absolute"
            style={{ left: `${(h.x / 390) * 100}%`, top: `${(h.y / 408) * 100}%`, "--i": i } as CSSProperties}
          >
            <button
              type="button"
              aria-label={h.label}
              aria-expanded={open}
              onClick={() => setActive(open ? null : i)}
              className="relative flex size-4 cursor-pointer items-center justify-center before:absolute before:-inset-3 before:content-['']"
            >
              <Image src="/icons/mobile/hotspot-plus.svg" alt="" width={16} height={16} className={open ? "rotate-45" : ""} />
            </button>
            {open && (
              <span
                role="status"
                className={`absolute top-1/2 -translate-y-1/2 rounded-[4px] bg-graphite px-2 py-1 font-inter text-[12px] font-medium whitespace-nowrap text-white ${
                  right ? "right-6" : "left-6"
                }`}
              >
                {h.label}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
