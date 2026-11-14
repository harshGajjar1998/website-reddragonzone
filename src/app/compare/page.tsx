import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CompareView from "@/components/compare/CompareView";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/compare/", { title: "Compare Products | Redragon", description: "Compare Redragon products side by side before choosing the right fit." });
}

export default function ComparePage() {
  return <CompareView />;
}
