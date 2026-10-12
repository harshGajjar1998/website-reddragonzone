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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
