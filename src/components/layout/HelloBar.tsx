"use client";

import Image from "next/image";
import { useState } from "react";
import { helloBar } from "@/data/navigation";

function Announcement({ hidden }: { hidden?: boolean }) {
  return (
    <span aria-hidden={hidden} className="flex shrink-0 items-center gap-2 pr-8 whitespace-nowrap">
      {/* API: dynamic data – hello bar announcement */}
      <span className="font-jetbrains text-[11px] font-bold uppercase leading-normal">{helloBar.tag}</span>
      <span className="font-geist text-[12px] font-medium leading-normal">{helloBar.message}</span>
      <a
        href={helloBar.cta.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={hidden ? -1 : undefined}
        className="font-geist text-[12px] font-bold leading-normal underline"
      >
        {helloBar.cta.label}
      </a>
    </span>
  );
}

export default function HelloBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  const dismiss = (
    <button
      type="button"
      aria-label="Dismiss announcement"
      onClick={() => setOpen(false)}
      className="size-4 shrink-0 cursor-pointer"
    >
      <Image src="/icons/x-circle.svg" alt="" width={16} height={16} />
    </button>
  );

  return (
    <div className="bg-crimson text-white">
      {/* Mobile (Figma "hello-bar" 390×32): the line is wider than the screen, so it scrolls */}
      <div className="flex h-8 items-center gap-2 px-8 lg:hidden">
        <p className="min-w-0 flex-1 overflow-hidden">
          <span className="animate-marquee flex w-max">
            <Announcement />
            <Announcement hidden />
          </span>
        </p>
        {dismiss}
      </div>

      <div className="page-frame hidden h-10 items-center justify-between px-10 lg:flex">
        <p className="flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap">
          {/* API: dynamic data – hello bar announcement */}
          <span className="font-jetbrains text-[11px] font-bold uppercase leading-normal">{helloBar.tag}</span>
          <span className="font-geist text-[12px] font-medium leading-normal">{helloBar.message}</span>
          <a
            href={helloBar.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-geist text-[12px] font-bold leading-normal underline"
          >
            {helloBar.cta.label}
          </a>
        </p>
        {dismiss}
      </div>
    </div>
  );
}
