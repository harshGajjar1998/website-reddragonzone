import type { Metadata } from "next";
import CompareView from "@/components/compare/CompareView";

export const metadata: Metadata = {
  title: "Compare Products | Redragon",
  description: "Compare Redragon products side by side before choosing the right fit.",
};

export default function ComparePage() {
  return <CompareView />;
}
