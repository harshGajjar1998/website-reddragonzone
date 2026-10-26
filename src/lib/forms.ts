/**
 * Website forms → the CMS (POST /api/public/forms/{form}); messages land in the CMS Inbox.
 * Every form includes <Honeypot />: people never see or fill it, bots usually do, and the CMS
 * quietly drops anything that fills it. The CMS also rate-limits each visitor.
 */
import { useState, type FormEvent } from "react";

export type FormName = "contact" | "newsletter";

export type SubmitResult = { ok: true } | { ok: false; message: string };

export async function submitForm(form: FormName, el: HTMLFormElement): Promise<SubmitResult> {
  const data = Object.fromEntries(new FormData(el).entries());
  try {
    const res = await fetch(`${process.env.CMS_FORMS_URL}/${form}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, page: window.location.pathname }),
    });
    if (res.ok) return { ok: true };
    if (res.status === 429) return { ok: false, message: "Too many attempts. Please try again in a few minutes." };
    const body = await res.json().catch(() => null);
    const first = body?.errors ? (Object.values(body.errors)[0] as string[])[0] : null;
    return { ok: false, message: first ?? "Something went wrong. Please try again." };
  } catch {
    return { ok: false, message: "Couldn't send. Check your connection and try again." };
  }
}

/**
 * onSubmit for a form, plus its state. Newsletter errors show as the browser's own message on the
 * email field (the sign-up designs have no room for an error line); the contact form shows `error`.
 */
export function useFormSubmit(form: FormName) {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const el = e.currentTarget;
    setStatus("sending");
    setError(null);
    const r = await submitForm(form, el);
    if (r.ok) {
      setStatus("done");
      el.reset();
      return;
    }
    setStatus("idle");
    setError(r.message);
    const email = el.querySelector<HTMLInputElement>('input[type="email"]');
    if (form === "newsletter" && email) {
      email.setCustomValidity(r.message);
      email.reportValidity();
      email.addEventListener("input", () => email.setCustomValidity(""), { once: true });
    }
  }

  return { onSubmit, done: status === "done", sending: status === "sending", error };
}
