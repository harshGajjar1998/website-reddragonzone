import type { Metadata } from "next";
import { Suspense } from "react";
import CommunitySection from "@/components/home/CommunitySection";
import ProductDownloads from "@/components/pages/ProductDownloads";

export const metadata: Metadata = {
  title: "Product downloads – Support | Redragon",
  description: "Find drivers, firmware, software and manuals for your Redragon product.",
};

/**
 * Figma "Support — Product Search Results", "No Downloads Available" and "Product Not Found".
 * One static route read on the client (?q=), so any search term works in the static export.
 */
export default function SupportSearchPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-[600px]" />}>
        <ProductDownloads />
      </Suspense>
      <CommunitySection />
    </>
  );
}
