import type { CSSProperties } from "react";

const FROM = {
  left: ["-120px", "0px"],
  right: ["160px", "0px"],
  bottom: ["0px", "60px"],
} as const;

/**
 * Style for a `.piece` (globals.css): the side it glides in from and its start delay. Pieces play
 * inside a `[data-active]` panel – in when it turns active, back out the same way when it leaves.
 */
export const piece = (from: keyof typeof FROM, delay = 0) =>
  ({
    "--from-x": FROM[from][0],
    "--from-y": FROM[from][1],
    "--reveal-delay": `${delay}ms`,
  }) as CSSProperties;
