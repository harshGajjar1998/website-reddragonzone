"use client";

/**
 * Website forms → the CMS (POST /api/public/forms/{form}); messages land in the CMS Inbox.
 * Every form includes <Honeypot />: people never see or fill it, bots usually do, and the CMS
 * quietly drops anything that fills it. The CMS also rate-limits each visitor.
 */
import { useState, type FormEvent } from "react";

export type FeedbackTone = "success" | "error";
export type Feedback = { tone: FeedbackTone; text: string };

export const FORM_SUCCESS = "Thanks, we'll be in touch";
export const FORM_ERROR = "Something went wrong, try again";
export const INVALID_EMAIL = "Please enter a valid email address.";
export const requiredMessage = (field: string) => `Please fill this in. Your ${field} is required.`;

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export type FormName = "contact" | "newsletter";

/** A failed send; `message` is safe to show the visitor. */
export class FormError extends Error {}

/** The form's fields (honeypot included) as plain strings. */
export const formValues = (form: HTMLFormElement) =>
  Object.fromEntries(new FormData(form)) as Record<string, string>;

/** Sends a form to the CMS and throws a FormError with a visitor-facing message if it wasn't accepted. */
export async function submitForm(form: FormName, data: Record<string, string>) {
  let res: Response;
  try {
    res = await fetch(`${process.env.CMS_FORMS_URL}/${form}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, page: window.location.pathname }),
    });
  } catch {
    throw new FormError("Couldn't send. Check your connection and try again.");
  }
  if (res.ok) return;
  if (res.status === 429) throw new FormError("Too many attempts. Please try again in a few minutes.");
  const body = await res.json().catch(() => null);
  const first = body?.errors ? (Object.values(body.errors)[0] as string[])[0] : null;
  throw new FormError(first ?? FORM_ERROR);
}

/** The visitor-facing text for an error thrown by submitForm. */
export const errorText = (err: unknown) => (err instanceof FormError ? err.message : FORM_ERROR);

/** Validation, sending and feedback shared by every newsletter sign-up box. */
export function useNewsletterForm() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const values = formValues(form);
    const email = (values.email ?? "").trim();
    if (!email) return setFeedback({ tone: "error", text: requiredMessage("email") });
    if (!isEmail(email)) return setFeedback({ tone: "error", text: INVALID_EMAIL });

    setSending(true);
    try {
      await submitForm("newsletter", { ...values, email });
      setFeedback({ tone: "success", text: FORM_SUCCESS });
      form.reset();
    } catch (err) {
      setFeedback({ tone: "error", text: errorText(err) });
    } finally {
      setSending(false);
    }
  }

  return {
    feedback,
    sending,
    onSubmit,
    /** Clears a message once the visitor starts correcting it */
    onChange: () => setFeedback(null),
    invalid: feedback?.tone === "error",
  };
}
