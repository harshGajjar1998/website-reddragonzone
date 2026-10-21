"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Plays its descendants' entrance once, the first time the block scrolls into view:
 * `.enter-left/right/bottom` (via `data-inview`) and `.piece` (via `data-active`), see globals.css.
 */
export default function RevealOnView({
  className = "",
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      data-inview={inView ? "" : undefined}
      data-active={inView}
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}
