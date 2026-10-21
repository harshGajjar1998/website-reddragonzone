"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Source canvas of the M997 exploded render that the parts were cut from (public/images/home/exploded). */
const CANVAS_W = 1226;
const CANVAS_H = 1283;
/** Rendered width on the 1440px desktop canvas, for `sizes` */
const DESKTOP_W = 742;

/**
 * Parts in paint order (base first, covers last, so they close over the internals when assembled).
 * x/y/w/h: placement in the exploded render; dx/dy: offset that pulls the part into the assembled
 * mouse; depth: cursor-parallax strength in px. All in source-canvas pixels.
 */
const parts = [
  { name: "base", x: 55, y: 887, w: 935, h: 384, dx: 40, dy: -310, depth: 4 },
  { name: "side-buttons", x: 733, y: 908, w: 400, h: 264, dx: -80, dy: -360, depth: 6 },
  { name: "battery", x: 824, y: 811, w: 366, h: 107, dx: -260, dy: -230, depth: 7 },
  { name: "switches", x: 385, y: 814, w: 424, h: 218, dx: 20, dy: -260, depth: 7 },
  { name: "wheel", x: 174, y: 639, w: 248, h: 250, dx: 200, dy: -140, depth: 9 },
  { name: "encoder", x: 499, y: 677, w: 183, h: 93, dx: 0, dy: -70, depth: 9 },
  { name: "shell", x: 121, y: 257, w: 1005, h: 451, dx: -20, dy: 140, depth: 11 },
  { name: "top-shell", x: 164, y: 32, w: 688, h: 183, dx: 20, dy: 360, depth: 15 },
];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
/** Canvas px → width of the render box (it is a size container) */
const cqw = (v: number) => `${(v / CANVAS_W) * 100}cqw`;

/**
 * Layered M997 render. Each part is its own image so it can glide into place; the motion itself
 * is CSS (`.exploded-part`) driven by the --explode/--mx/--my variables set by `ExplodedStage`.
 */
export function ExplodedParts({ alt, className = "" }: { alt: string; className?: string }) {
  return (
    <div role="img" aria-label={alt} className={`@container ${className}`}>
      {parts.map((p) => (
        <div
          key={p.name}
          className="exploded-part absolute"
          style={
            {
              left: pct(p.x, CANVAS_W),
              top: pct(p.y, CANVAS_H),
              width: pct(p.w, CANVAS_W),
              height: pct(p.h, CANVAS_H),
              "--dx": cqw(p.dx),
              "--dy": cqw(p.dy),
              "--depth": `${p.depth}px`,
            } as CSSProperties
          }
        >
          <Image
            src={`/images/home/exploded/${p.name}.png`}
            alt=""
            fill
            draggable={false}
            sizes={`(min-width: 1024px) ${Math.ceil((p.w / CANVAS_W) * DESKTOP_W)}px, (min-width: 640px) ${Math.ceil(
              (p.w / CANVAS_W) * 640,
            )}px, ${Math.ceil((p.w / CANVAS_W) * 100)}vw`}
          />
        </div>
      ))}
    </div>
  );
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Scroll + cursor driver for the exploded view. As the stage scrolls up into view the mouse
 * comes apart (--explode 0 → 1, reversing when scrolled back); once spread out `data-exploded`
 * reveals the `.exploded-callout` labels. Moving the cursor over it tilts the parts by depth.
 */
export function ExplodedStage({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--explode", "1");
      el.dataset.exploded = "";
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 while the stage's centre is below the fold, 1 once it reaches 60% of the viewport height
      const t = clamp01((vh * 1.05 - (r.top + r.height / 2)) / (vh * 0.45));
      const eased = 1 - (1 - t) ** 3;
      el.style.setProperty("--explode", eased.toFixed(3));
      // The ease-out has visually settled (~98%) by t = 0.75, so labels appear from there
      el.toggleAttribute("data-exploded", t > 0.75);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    e.currentTarget.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--mx", "0");
    e.currentTarget.style.setProperty("--my", "0");
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ "--explode": 0 } as CSSProperties}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
}
