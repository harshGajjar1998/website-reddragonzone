import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Redragon | Gaming & Office Gear",
  description:
    "Engineering mechanical excellence for the global elite. High-performance gaming and office peripherals from Redragon.",
};

/** Scale factor for the 1440px desktop canvas (used by the `zoom` rule in globals.css). Runs before first paint. */
const desktopZoom = `(function(){var d=document.documentElement;function f(){d.style.setProperty("--desktop-zoom",Math.min(1,d.clientWidth/1440))}f();new ResizeObserver(f).observe(d)})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: desktopZoom }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
