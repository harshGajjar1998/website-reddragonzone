"use client";

import Image from "next/image";
import { useState } from "react";
import { helloBar } from "@/data/navigation";

export default function HelloBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="bg-crimson text-white">
      <div className="page-frame flex h-10 items-center justify-between px-10">
        <p className="flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap">
          <span className="font-jetbrains text-[11px] font-bold uppercase leading-normal">
            {helloBar.tag}
          </span>
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
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => setOpen(false)}
          className="size-4 shrink-0 cursor-pointer"
        >
          <Image src="/icons/x-circle.svg" alt="" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
