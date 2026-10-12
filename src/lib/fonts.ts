import {
  Archivo,
  Audiowide,
  DM_Sans,
  Geist,
  Inter,
  JetBrains_Mono,
  Lato,
  Lexend,
  Lexend_Deca,
  Lexend_Exa,
  Lexend_Giga,
  Merriweather,
  Montserrat,
  Outfit,
} from "next/font/google";

/* Lato is a static family – Google ships 100/300/400/700/900 only,
   so Figma's SemiBold/ExtraBold resolve to the nearest weight. */
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--nf-lato",
});

const lexend = Lexend({ subsets: ["latin"], variable: "--nf-lexend" });
const lexendDeca = Lexend_Deca({ subsets: ["latin"], variable: "--nf-lexend-deca" });
const lexendGiga = Lexend_Giga({ subsets: ["latin"], variable: "--nf-lexend-giga" });
const lexendExa = Lexend_Exa({ subsets: ["latin"], variable: "--nf-lexend-exa" });
const inter = Inter({ subsets: ["latin"], variable: "--nf-inter" });
const archivo = Archivo({ subsets: ["latin"], variable: "--nf-archivo" });
/* Gaming landing hero display face */
const audiowide = Audiowide({ subsets: ["latin"], weight: "400", variable: "--nf-audiowide" });
/* Blog article body + quote */
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--nf-merriweather",
});
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--nf-dm-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--nf-outfit" });
const geist = Geist({ subsets: ["latin"], variable: "--nf-geist" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--nf-jetbrains" });
/* Stand-in for Gotham (commercial) */
const montserrat = Montserrat({ subsets: ["latin"], variable: "--nf-montserrat" });

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
