"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const FRAMES = ".page-frame, .mobile-frame";

/**
 * Fades each section's content up into view the first time it scrolls on screen.
 * Targets the outermost page/mobile frame of every section, so section backgrounds stay
 * put and only the content moves. Anything already on screen when the page loads is left
 * alone (no flash after hydration), and nothing is hidden without JS or with reduced motion.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const main = document.querySelector("main");
    if (!main) return;

    const show = (el: HTMLElement) => {
      el.dataset.reveal = "shown";
      // Drop the attribute once settled so the frame is left with no transform or transition
      const done = (e: TransitionEvent) => {
        if (e.target !== el) return;
        el.removeAttribute("data-reveal");
        el.removeEventListener("transitionend", done);
      };
      el.addEventListener("transitionend", done);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          show(entry.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    const frames = [...main.querySelectorAll<HTMLElement>(FRAMES)].filter(
      (el) => !el.parentElement?.closest(FRAMES),
    );
    for (const el of frames) {
      const rect = el.getBoundingClientRect();
      // Skip hidden frames (the other breakpoint's layout) and ones already in view
      if (rect.height === 0 || rect.top < window.innerHeight) continue;
      el.dataset.reveal = "hidden";
      io.observe(el);
    }

    return () => {
      io.disconnect();
      for (const el of frames) el.removeAttribute("data-reveal");
    };
  }, [pathname]);

  return null;
}
