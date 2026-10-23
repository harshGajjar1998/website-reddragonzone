import type { ReactNode } from "react";

/**
 * Accordion body that eases open and shut instead of popping in. The grid row animates
 * between 0fr and 1fr, so the panel always tracks its content's natural height.
 * Spacing that should only exist while open (e.g. a negative top margin) goes in
 * `className`, toggled by the caller – margins animate along with the height.
 */
export default function Collapse({
  open,
  id,
  className = "",
  children,
}: {
  open: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      inert={!open}
      className={`grid transition-[grid-template-rows,opacity,margin] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      } ${className}`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
