"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

type Panel = { key: string; content: ReactNode };

/**
 * Keeps every tab panel mounted in the same grid cell and swaps them like the home hero:
 * the leaving panel's `.piece`s slip out while the incoming panel's pieces assemble with a
 * stagger (globals.css). The first panel only assembles once the block scrolls into view.
 * The wrapper height eases to the active panel's height so content below doesn't jump.
 */
export default function TabSlider({
  active,
  panels,
  id,
  role = "tabpanel",
  className = "",
}: {
  active: string;
  panels: Panel[];
  id?: string;
  /** "tabpanel" under a tablist; carousels pass their own (e.g. "group") */
  role?: string;
  className?: string;
}) {
  const activeIndex = panels.findIndex((p) => p.key === active);
  const rootRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const [height, setHeight] = useState<number>();
  const [inView, setInView] = useState(false);
  // The panel that was active before the latest switch (it plays the exit)
  const [{ current, leaving }, setSwap] = useState({ current: active, leaving: "" });
  if (current !== active) setSwap({ current: active, leaving: current });

  useLayoutEffect(() => {
    const el = refs.current[active];
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      id={id}
      role={role}
      className={`grid transition-[height] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${className}`}
      style={{ height }}
    >
      {panels.map((panel, i) => {
        const shown = i === activeIndex;
        return (
          <div
            key={panel.key}
            ref={(el) => {
              refs.current[panel.key] = el;
            }}
            inert={!shown}
            aria-hidden={!shown}
            data-active={shown && inView}
            data-leaving={!shown && panel.key === leaving ? "" : undefined}
            // The leaving panel stays visible while its pieces animate out, then hides
            className={`col-start-1 row-start-1 self-start transition-opacity duration-200 ${
              shown ? "z-10" : "pointer-events-none opacity-0 delay-300"
            }`}
          >
            {panel.content}
          </div>
        );
      })}
    </div>
  );
}
