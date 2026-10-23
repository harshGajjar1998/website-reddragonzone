"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Lives in the draft-preview server only (CMS_PREVIEW=1) and connects the page to the CMS visual
 * editor, which shows it in an iframe:
 *   page → editor   ready · select {ids, key?, path?} · rect {id, rect}
 *   editor → page   refresh · select {id, scroll} · interactive {on}
 *                   fields {sections: [{key, label, fields: [{path, label, type, values}]}]}
 *                   highlight {key, path, scroll?}
 * Sections are the <CmsSection> markers (data-cms-section="id id…", display: contents). Inside a section,
 * page elements are matched to the editor's fields by their text or image file, so pointing at a heading
 * or picture names the field that changes it, and clicking it opens that field in the editor.
 */
type Rect = { top: number; left: number; width: number; height: number };
type PageField = { path: string; label: string; type: "text" | "image" | "link"; values: string[] };
type SectionFields = { key: string; label: string; fields: PageField[] };
type FromEditor =
  | { source: "rd-editor"; type: "refresh" }
  | { source: "rd-editor"; type: "select"; id: string | null; scroll?: boolean }
  | { source: "rd-editor"; type: "interactive"; on: boolean }
  | { source: "rd-editor"; type: "fields"; sections: SectionFields[] }
  | { source: "rd-editor"; type: "highlight"; key: string; path: string | null; scroll?: boolean };

type Mark = { rect: Rect; label?: string; tone: "hover" | "selected" | "field" };

const ATTR = "data-cms-section";

const bodyZoom = () =>
  (document.body as HTMLElement & { currentCSSZoom?: number }).currentCSSZoom ?? (parseFloat(getComputedStyle(document.body).zoom) || 1);

/** Shown to the visitor? (inactive tab panels and carousel slides are inert; decorative aria-hidden text still counts) */
const onScreen = (el: Element) =>
  !el.closest("[inert]") && el.checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) !== false;

/** "/gaming/", "/gaming" and "http://host/gaming" are the same link */
const linkKey = (href: string) => {
  try {
    const u = new URL(href, location.origin);
    return (u.origin === location.origin ? "" : u.origin) + (u.pathname.replace(/\/+$/, "") || "/") + u.search;
  } catch {
    return href;
  }
};

const toRect = (c: DOMRect): Rect => ({ top: c.top, left: c.left, width: c.width, height: c.height });
const visible = (c: DOMRect) => c.width > 1 && c.height > 1;

/** A marker renders no box of its own (display: contents) – measure its visible children. */
function boxOf(marker: Element): Rect | null {
  let t = Infinity, l = Infinity, r = -Infinity, b = -Infinity;
  for (const child of Array.from(marker.children)) {
    const c = child.getBoundingClientRect();
    if (!visible(c)) continue;
    t = Math.min(t, c.top);
    l = Math.min(l, c.left);
    r = Math.max(r, c.right);
    b = Math.max(b, c.bottom);
  }
  return t === Infinity ? null : { top: t, left: l, width: r - l, height: b - t };
}

/** Every marker showing this key – one block can appear in several places (e.g. the Gaming page content) */
const markersFor = (id: string) =>
  Array.from(document.querySelectorAll(`[${ATTR}]`)).filter((m) => m.getAttribute(ATTR)!.split(" ").includes(id));

function unionBox(markers: Element[]): Rect | null {
  const boxes = markers.map(boxOf).filter((b): b is Rect => !!b);
  if (!boxes.length) return null;
  const t = Math.min(...boxes.map((b) => b.top)), l = Math.min(...boxes.map((b) => b.left));
  const r = Math.max(...boxes.map((b) => b.left + b.width)), btm = Math.max(...boxes.map((b) => b.top + b.height));
  return { top: t, left: l, width: r - l, height: btm - t };
}

/** Keys of every block on the page, so the editor can list what this page is made of */
const pageKeys = () =>
  [...new Set(Array.from(document.querySelectorAll(`[${ATTR}]`)).flatMap((m) => m.getAttribute(ATTR)!.split(" ")))];

/** Live preview while typing: swap a field's old text / image on the page for the new one (the next refresh shows the saved page). */
function patchChanges(before: SectionFields[], after: SectionFields[]) {
  for (const sec of after) {
    const old = before.find((s) => s.key === sec.key);
    if (!old) continue;
    for (const f of sec.fields) {
      const prev = old.fields.find((x) => x.path === f.path);
      if (!prev || prev.values[0] === f.values[0] || prev.type !== f.type || f.type === "link") continue;
      for (const marker of markersFor(sec.key)) {
        for (const el of elementsFor(marker, prev)) {
          if (f.type === "image" && el instanceof HTMLImageElement) {
            el.removeAttribute("srcset");
            el.src = f.values[0];
          } else if (f.type === "text" && el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE) {
            el.firstChild.nodeValue = f.values[0];
          }
        }
      }
    }
  }
}

/* ---------------- matching page elements to fields ---------------- */

const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
/** "/_img/images/home/m997-main-1920.webp" (optimised copy) or "/images/home/m997-main.png" → "/images/home/m997-main" */
const imageKey = (src: string) =>
  src
    .replace(/^https?:\/\/[^/]+(?=\/(_img|images|brand)\/)/, "")
    .replace(/^\/_img(?=\/)/, "")
    .replace(/-\d+\.webp$/, "")
    .replace(/\.[a-z0-9]+(\?.*)?$/i, "");

type Hit = { section: SectionFields; field: PageField; el: Element };

/** Which field shows this text element? Exact text first, then the shortest value containing it. */
function textHit(target: Element, marker: Element, sections: SectionFields[]): Hit | null {
  const texts = sections.flatMap((section) =>
    section.fields.filter((f) => f.type === "text").map((field) => ({ section, field, values: field.values.map(norm) })),
  );
  if (!onScreen(target)) return null;
  for (let el: Element | null = target, depth = 0; el && el !== marker && depth < 4; el = el.parentElement, depth++) {
    const t = norm(el.textContent ?? "");
    if (!t) continue;
    const exact = texts.find((x) => x.values.includes(t));
    if (exact) return { section: exact.section, field: exact.field, el };
  }
  const own = norm(target.textContent ?? "");
  if (own.length < 4) return null;
  const partial = texts
    .filter((x) => x.values.some((v) => v.includes(own)))
    .sort((a, b) => Math.min(...a.values.map((v) => v.length)) - Math.min(...b.values.map((v) => v.length)))[0];
  if (!partial) return null;
  // Outline the largest element that still only shows this value
  let el: Element = target;
  while (el.parentElement && el.parentElement !== marker && partial.values.some((v) => v.includes(norm(el.parentElement!.textContent ?? "")))) {
    el = el.parentElement;
  }
  return { section: partial.section, field: partial.field, el };
}

/** Which image field is under the pointer? (Product art often ignores the pointer, so test by position.) */
function imageHit(x: number, y: number, marker: Element, sections: SectionFields[]): Hit | null {
  const imgs = Array.from(marker.querySelectorAll("img")).filter((img) => {
    const r = img.getBoundingClientRect();
    return visible(r) && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom && onScreen(img);
  });
  for (const img of imgs.reverse()) {
    const key = imageKey(img.getAttribute("src") ?? "");
    for (const section of sections) {
      const field = section.fields.find((f) => f.type === "image" && f.values.some((v) => imageKey(v) === key));
      if (field) return { section, field, el: img };
    }
  }
  return null;
}

/** Every visible element on the page that shows this field (desktop and mobile copies, carousel slides…). */
function elementsFor(marker: Element, field: PageField): Element[] {
  if (field.type === "link") {
    const keys = field.values.map(linkKey);
    return Array.from(marker.querySelectorAll("a[href]")).filter((a) => onScreen(a) && keys.includes(linkKey(a.getAttribute("href")!)));
  }
  if (field.type === "image") {
    const keys = field.values.map(imageKey);
    return Array.from(marker.querySelectorAll("img")).filter((img) => onScreen(img) && keys.includes(imageKey(img.getAttribute("src") ?? "")));
  }
  const values = field.values.map(norm);
  const all = Array.from(marker.querySelectorAll("*")).filter((el) => onScreen(el) && values.includes(norm(el.textContent ?? "")));
  // Deepest matches only (a heading, not every wrapper around it)
  return all.filter((el) => !all.some((other) => other !== el && el.contains(other)));
}

export default function CmsPreviewBridge({ adminOrigin }: { adminOrigin: string }) {
  const router = useRouter();
  const [marks, setMarks] = useState<{ hover: Mark | null; selected: Mark | null; fields: Mark[] }>({ hover: null, selected: null, fields: [] });
  const selectedId = useRef<string | null>(null);
  const interactive = useRef(true);
  const sections = useRef<SectionFields[]>([]);
  const highlighted = useRef<{ key: string; path: string } | null>(null);

  useEffect(() => {
    if (window.parent === window) return; // opened directly, not inside the editor
    const post = (msg: object) => window.parent.postMessage({ source: "rd-preview", ...msg }, adminOrigin);
    const setHover = (hover: Mark | null) => setMarks((m) => ({ ...m, hover }));
    const sectionsIn = (marker: Element) => {
      const ids = marker.getAttribute(ATTR)!.split(" ");
      return sections.current.filter((s) => ids.includes(s.key));
    };
    const hitAt = (target: Element, x: number, y: number) => {
      const marker = target.closest(`[${ATTR}]`);
      if (!marker) return null;
      const secs = sectionsIn(marker);
      return { marker, secs, hit: textHit(target, marker, secs) ?? imageHit(x, y, marker, secs) };
    };

    const onMessage = (e: MessageEvent<FromEditor>) => {
      if (e.origin !== adminOrigin || e.data?.source !== "rd-editor") return;
      const msg = e.data;
      if (msg.type === "refresh") router.refresh();
      if (msg.type === "fields") {
        patchChanges(sections.current, msg.sections);
        sections.current = msg.sections;
      }
      if (msg.type === "interactive") {
        interactive.current = msg.on;
        if (!msg.on) setMarks({ hover: null, selected: null, fields: [] });
      }
      if (msg.type === "highlight") {
        highlighted.current = msg.path ? { key: msg.key, path: msg.path } : null;
        if (msg.scroll && msg.path) {
          const field = sections.current.find((s) => s.key === msg.key)?.fields.find((f) => f.path === msg.path || f.path.startsWith(`${msg.path}.`));
          const first = field ? markersFor(msg.key).flatMap((m) => elementsFor(m, field)).find((el) => visible(el.getBoundingClientRect())) : null;
          const r = first?.getBoundingClientRect();
          if (first && r && (r.bottom < 0 || r.top > innerHeight)) first.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      if (msg.type === "select") {
        selectedId.current = msg.id;
        // Lets a carousel show the selected slide (HeroSection)
        if (msg.id) window.dispatchEvent(new CustomEvent("cms:focus", { detail: { id: msg.id } }));
        const m = msg.id ? markersFor(msg.id)[0] : null;
        if (m && msg.scroll) {
          const first = Array.from(m.children).find((c) => c.getBoundingClientRect().height > 0);
          first?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    // Pointing at the page: outline the element under the pointer and name the field (or section) it edits.
    const onMove = (e: MouseEvent) => {
      if (!interactive.current) return;
      const found = hitAt(e.target as Element, e.clientX, e.clientY);
      if (!found) return setHover(null);
      const { marker, secs, hit } = found;
      if (hit) {
        setHover({ rect: toRect(hit.el.getBoundingClientRect()), label: `${hit.section.label} › ${hit.field.label}`, tone: "hover" });
      } else {
        const box = boxOf(marker);
        setHover(box ? { rect: box, label: secs[0]?.label, tone: "hover" } : null);
      }
    };

    // While editing, a click picks the field/section instead of following links (buttons, tabs and carousels still work).
    const onClick = (e: MouseEvent) => {
      if (!interactive.current) return;
      const target = e.target as Element;
      if (target.closest("a")) e.preventDefault();
      const found = hitAt(target, e.clientX, e.clientY);
      if (!found) return;
      const ids = found.marker.getAttribute(ATTR)!.split(" ");
      post({ type: "select", ids, key: found.hit?.section.key, path: found.hit?.field.path });
    };
    const onSubmit = (e: SubmitEvent) => interactive.current && e.preventDefault();
    const onLeave = () => setHover(null);

    // Every frame: keep the selected section's box and the highlighted field's boxes in place.
    let frame = 0;
    let lastSel = "";
    let lastFields = "";
    const track = () => {
      const box = selectedId.current ? unionBox(markersFor(selectedId.current)) : null;
      const selKey = JSON.stringify(box);
      if (selKey !== lastSel) {
        lastSel = selKey;
        setMarks((s) => ({ ...s, selected: box ? { rect: box, tone: "selected" } : null }));
        post({ type: "rect", id: selectedId.current, rect: box });
      }
      const h = highlighted.current;
      // A list or repeater (e.g. "thumbnails") highlights all of its items ("thumbnails.0.image"…)
      const fields = h ? (sections.current.find((s) => s.key === h.key)?.fields ?? []).filter((f) => f.path === h.path || f.path.startsWith(`${h.path}.`)) : [];
      const field = fields[0];
      const markers = h ? markersFor(h.key) : [];
      const rects = markers.flatMap((m) => fields.flatMap((f) => elementsFor(m, f))).map((el) => el.getBoundingClientRect()).filter(visible).map(toRect);
      const fieldKey = JSON.stringify(rects);
      if (fieldKey !== lastFields) {
        lastFields = fieldKey;
        const label = field && fields.length > 1 ? field.label.replace(/ 1( ›.*)?$/, "") : field?.label;
        setMarks((s) => ({ ...s, fields: rects.map((rect, i) => ({ rect, tone: "field", label: i === 0 ? label : undefined })) }));
      }
      frame = requestAnimationFrame(track);
    };

    window.addEventListener("message", onMessage);
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    document.documentElement.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(track);
    post({ type: "ready", path: location.pathname, keys: pageKeys() });

    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [adminOrigin, router]);

  // Rects are screen pixels, but these marks sit inside <body>, which the site zooms on narrow
  // desktops (globals.css) – undo that zoom so they line up.
  const draw = (m: Mark, i: number) => {
    const z = bodyZoom();
    const pad = m.tone === "selected" ? 0 : 3;
    const ring =
      m.tone === "selected"
        ? "inset 0 0 0 3px #e3262b"
        : m.tone === "field"
          ? "0 0 0 2px #e3262b, 0 0 0 6px rgba(227,38,43,.18)"
          : "0 0 0 2px rgba(227,38,43,.75)";
    return (
      <div
        key={`${m.tone}${i}`}
        aria-hidden
        style={{
          position: "fixed",
          top: (m.rect.top - pad) / z,
          left: (m.rect.left - pad) / z,
          width: (m.rect.width + pad * 2) / z,
          height: (m.rect.height + pad * 2) / z,
          boxShadow: ring,
          borderRadius: m.tone === "selected" ? 0 : 4,
          pointerEvents: "none",
          zIndex: 2147483646,
        }}
      >
        {m.label && (
          <span
            style={{
              position: "absolute",
              left: -2,
              bottom: "100%",
              marginBottom: 4,
              background: "#e3262b",
              color: "#fff",
              font: `600 ${12 / z}px/1.4 system-ui, sans-serif`,
              padding: `${2 / z}px ${7 / z}px`,
              borderRadius: 4 / z,
              whiteSpace: "nowrap",
            }}
          >
            {m.label}
          </span>
        )}
      </div>
    );
  };
  return (
    <>
      {marks.selected && draw(marks.selected, 0)}
      {marks.fields.map(draw)}
      {marks.hover && draw(marks.hover, 0)}
    </>
  );
}
