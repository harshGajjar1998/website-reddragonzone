import type { ReactNode } from "react";
import { isCmsPreview } from "@/lib/cms/api";

/**
 * Marks a CMS section on the page for the visual editor's preview (CmsPreviewBridge).
 * Outside the draft-preview server it renders its children only, so the public HTML is unchanged.
 * `ids` – what the block shows, so the editor knows what to open:
 *   homepage section ids · "type:announce|header|footer" (site chrome) · "singleton:<key>" ·
 *   "entry:<id>" (collection entry) · "product:<id>" · "shared:community" (edited on the homepage)
 */
export default function CmsSection({ ids, children }: { ids: string[]; children: ReactNode }) {
  if (!isCmsPreview()) return children;
  return (
    <div data-cms-section={ids.join(" ")} style={{ display: "contents" }}>
      {children}
    </div>
  );
}

/** Marker ids for CMS entries/products shown in one block (e.g. every category tile in a slider) */
export const entryIds = (items: { cmsId?: number }[], kind: "entry" | "product" = "entry") =>
  items.flatMap((x) => (x.cmsId ? [`${kind}:${x.cmsId}`] : []));
