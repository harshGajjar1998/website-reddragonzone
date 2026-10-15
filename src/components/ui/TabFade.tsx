"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type Panel = { key: string; content: ReactNode };

/**
 * Keeps every tab panel mounted in the same grid cell and cross-fades between them:
 * the outgoing panel drifts away, the incoming one slides in from the side it lives on.
 * The wrapper height eases to the active panel's height so content below doesn't jump.
 */
export default function TabFade({
  active,
  panels,
  id,
  className = "",
}: {
  active: string;
  panels: Panel[];
  id?: string;
  className?: string;
}) {
  const activeIndex = panels.findIndex((p) => p.key === active);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const el = refs.current[active];
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  return (
    <div
      id={id}
      role="tabpanel"
      className={`grid transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${className}`}
      style={{ height }}
    >
      {panels.map((panel, i) => {
        const shown = i === activeIndex;
        const offset = i < activeIndex ? -48 : 48;
        return (
          <div
            key={panel.key}
            ref={(el) => {
              refs.current[panel.key] = el;
            }}
            inert={!shown}
            aria-hidden={!shown}
            className={`col-start-1 row-start-1 self-start transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              shown ? "z-10 opacity-100 duration-700" : "pointer-events-none opacity-0 duration-300"
            }`}
            style={{ transform: shown ? "none" : `translateX(${offset}px) scale(0.98)` }}
          >
            {panel.content}
          </div>
        );
      })}
    </div>
  );
}
