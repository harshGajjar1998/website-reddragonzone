import { useEffect, useState } from "react";

/**
 * Keeps an overlay mounted for `ms` after `open` turns false, so it can play its exit
 * transition before unmounting. Entry is handled in CSS with `starting:` styles.
 */
export function usePresence(open: boolean, ms = 300) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open || !mounted) return;
    const t = window.setTimeout(() => setMounted(false), ms);
    return () => window.clearTimeout(t);
  }, [open, mounted, ms]);

  return mounted;
}
