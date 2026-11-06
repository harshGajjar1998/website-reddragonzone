import type { Feedback } from "@/lib/forms";

const TONES = {
  error: { box: "border-[#e9b4b8] bg-[#fff0f1] text-[#b81d29]", icon: "!" },
  success: { box: "border-[#b5dcc4] bg-[#eefaf2] text-[#1a7a44]", icon: "✓" },
};

/**
 * Figma "Form UX / Required feedback". Figma only has the error version, so success
 * reuses the same banner in green. `compact` is the slimmer one under newsletter fields.
 */
export default function FormFeedback({
  feedback,
  compact,
  className = "",
}: {
  feedback: Feedback;
  compact?: boolean;
  className?: string;
}) {
  const { box, icon } = TONES[feedback.tone];
  return (
    <p
      role={feedback.tone === "error" ? "alert" : "status"}
      className={`flex items-center rounded-[7px] border font-lexend-deca font-medium ${box} ${
        compact ? "gap-2 px-3 py-[7px] text-[13px] leading-[18px]" : "min-h-[57px] gap-[18px] px-[15px] py-3 text-[14px] leading-[19px]"
      } ${className}`}
    >
      <span aria-hidden className={`shrink-0 font-semibold ${compact ? "text-[15px] leading-5" : "text-[19px] leading-[26px]"}`}>
        {icon}
      </span>
      {feedback.text}
    </p>
  );
}
