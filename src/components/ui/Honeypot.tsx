/** Bot trap for forms (see src/lib/forms.ts): off-screen, skipped by keyboard and screen readers. */
export default function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
