"use client";

import { useEffect, type RefObject } from "react";

/**
 * Locks the page behind an open dialog: stops it scrolling, makes it inert so focus stays
 * in the dialog, and hands focus back to the opener on close. The dialog must be portalled to <body>.
 */
export function useModalLock(dialogRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const { body } = document;
    const trigger = document.activeElement as HTMLElement | null;
    const { overflow, paddingRight } = body.style;
    // The padding stops the page shifting when the scrollbar goes
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    body.style.paddingRight = `${scrollbar}px`;
    const background = [...body.children].filter((el) => !el.contains(dialogRef.current)) as HTMLElement[];
    background.forEach((el) => (el.inert = true));
    dialogRef.current?.focus();
    return () => {
      body.style.overflow = overflow;
      body.style.paddingRight = paddingRight;
      background.forEach((el) => (el.inert = false));
      trigger?.focus();
    };
  }, [dialogRef]);
}
