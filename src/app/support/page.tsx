import type { Metadata } from "next";
import CommunitySection from "@/components/home/CommunitySection";
import SupportCenter from "@/components/pages/SupportCenter";

export const metadata: Metadata = {
  title: "Support – Manuals & Software | Redragon",
  description: "Get the latest software, drivers and manuals for your Redragon products.",
};

/** Figma "Support" */
export default function SupportPage() {
  return (
    <>
      <SupportCenter />
      <CommunitySection />
    </>
  );
}
