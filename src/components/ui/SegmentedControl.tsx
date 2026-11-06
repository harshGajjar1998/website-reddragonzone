"use client";

type Option<T extends string> = { value: T; label: string };

/** Figma "Support / Operating system" switch; `pill` is the rounded FAQ topic variant. */
export default function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  pill,
  className = "",
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  pill?: boolean;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      // inset ring = Figma "inside" stroke, so the options keep their 42px height
      className={`flex h-[50px] gap-1 bg-white p-1 shadow-[inset_0_0_0_1px_#d6d6d6] ${pill ? "rounded-[24px]" : "rounded-[4px]"} ${className}`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`h-[42px] min-w-0 flex-1 cursor-pointer px-3 font-lexend-deca text-[16px] leading-5 whitespace-nowrap transition-colors ${
              pill ? "rounded-[24px]" : "rounded-[2px]"
            } ${selected ? "bg-crimson font-semibold text-white" : "text-ink"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
