import localFont from "next/font/local";

/* Self-hosted latin subsets (from Google Fonts, SIL Open Font License; see src/fonts/README.md).
   No requests to Google at runtime or build time, which mainland China hosting needs.
   Lato is static (300/400/700/900): Figma SemiBold/ExtraBold resolve to the nearest weight.
   Montserrat stands in for Gotham (commercial). */

const lato = localFont({
  src: [
    { path: "../fonts/lato-normal-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/lato-normal-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/lato-normal-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/lato-normal-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--nf-lato",
  display: "swap",
});

const lexend = localFont({
  src: [
    {
      path: "../fonts/lexend-normal-100-900.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--nf-lexend",
  display: "swap",
});

const lexendDeca = localFont({
  src: [
    {
      path: "../fonts/lexend-deca-normal-100-900.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--nf-lexend-deca",
  display: "swap",
});

const lexendGiga = localFont({
  src: [
    {
      path: "../fonts/lexend-giga-normal-100-900.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--nf-lexend-giga",
  display: "swap",
});

const lexendExa = localFont({
  src: [
    {
      path: "../fonts/lexend-exa-normal-100-900.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--nf-lexend-exa",
  display: "swap",
});

const inter = localFont({
  src: [
    {
      path: "../fonts/inter-normal-100-900.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--nf-inter",
  display: "swap",
});

const archivo = localFont({
  src: [
    {
      path: "../fonts/archivo-normal-100-900.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--nf-archivo",
  display: "swap",
});

const audiowide = localFont({
  src: [
    {
      path: "../fonts/audiowide-normal-400.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--nf-audiowide",
  display: "swap",
});

const merriweather = localFont({
  src: [
    {
      path: "../fonts/merriweather-normal-400-700.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../fonts/merriweather-italic-400-700.woff2",
      weight: "400 700",
      style: "italic",
    },
  ],
  variable: "--nf-merriweather",
  display: "swap",
});

const dmSans = localFont({
  src: [
    {
      path: "../fonts/dm-sans-normal-100-1000.woff2",
      weight: "100 1000",
      style: "normal",
    },
  ],
  variable: "--nf-dm-sans",
  display: "swap",
});

const outfit = localFont({
  src: [
    {
      path: "../fonts/outfit-normal-100-900.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--nf-outfit",
  display: "swap",
});

const geist = localFont({
  src: [
    {
      path: "../fonts/geist-normal-100-900.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--nf-geist",
  display: "swap",
});

const jetbrains = localFont({
  src: [
    {
      path: "../fonts/jetbrains-mono-normal-100-800.woff2",
      weight: "100 800",
      style: "normal",
    },
  ],
  variable: "--nf-jetbrains",
  display: "swap",
});

const montserrat = localFont({
  src: [
    {
      path: "../fonts/montserrat-normal-100-900.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--nf-montserrat",
  display: "swap",
});

export const fontVariables = [
  lato,
  lexend,
  lexendDeca,
  lexendGiga,
  lexendExa,
  inter,
  archivo,
  audiowide,
  merriweather,
  dmSans,
  outfit,
  geist,
  jetbrains,
  montserrat,
]
  .map((f) => f.variable)
  .join(" ");
