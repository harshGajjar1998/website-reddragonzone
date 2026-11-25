"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const FLAG = "rd_editor";

/** Applies ?rd_editor=1 / =0 from the address (idempotent), then reads the stored flag. */
function optedIn(): boolean {
  try {
    const q = new URLSearchParams(window.location.search).get(FLAG);
    if (q === "1") localStorage.setItem(FLAG, "1");
    if (q === "0") localStorage.removeItem(FLAG);
    return localStorage.getItem(FLAG) === "1";
  } catch {
    return false;
  }
}
const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};

/**
 * "Edit this page" for CMS users (like WordPress's admin bar). Visitors never see it: it renders nothing until
 * this browser has opted in by opening any page with ?rd_editor=1 (the CMS Dashboard's "View site" link does that);
 * ?rd_editor=0 turns it off. Only localStorage on this origin is used: no cookies, no server code, and the static
 * HTML served through the CDN is the same for everyone. The link opens <CMS>/edit?path=<this page>, which signs
 * the user in if needed and opens the right editor.
 */
export default function EditThisPage({ adminUrl }: { adminUrl: string }) {
  const pathname = usePathname();
  // false on the server and in the static HTML, so the page is identical for every visitor
  const on = useSyncExternalStore(subscribe, optedIn, () => false);

  if (!on) return null;
  const href = `${adminUrl.replace(/\/$/, "")}/edit?path=${encodeURIComponent(pathname || "/")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      style={{
        position: "fixed", left: 16, bottom: 16, zIndex: 2147483000, padding: "10px 14px", borderRadius: 999,
        background: "#111", color: "#fff", font: "600 14px/1 system-ui, sans-serif", textDecoration: "none",
        boxShadow: "0 4px 16px rgba(0,0,0,.3)", border: "1px solid rgba(255,255,255,.25)",
      }}
    >
      ✎ Edit this page
    </a>
  );
}
