"use client";

import { useState, type FormEvent } from "react";

export type FeedbackTone = "success" | "error";
export type Feedback = { tone: FeedbackTone; text: string };

export const FORM_SUCCESS = "Thanks, we'll be in touch";
export const FORM_ERROR = "Something went wrong, try again";
export const INVALID_EMAIL = "Please enter a valid email address.";
export const requiredMessage = (field: string) => `Please fill this in. Your ${field} is required.`;

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// API: dynamic data – set these to the real form endpoints in the environment
const ENDPOINTS = {
  contact: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT,
  newsletter: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT,
};

/**
 * Sends a form as JSON and throws if it wasn't accepted. Without an endpoint, development
 * pretends it worked so the UI can be previewed; production fails so a visitor is never
 * thanked for a message that went nowhere.
 */
export async function submitForm(form: keyof typeof ENDPOINTS, data: Record<string, string>) {
  const endpoint = ENDPOINTS[form];
  if (!endpoint) {
    if (process.env.NODE_ENV === "production") throw new Error(`No endpoint configured for the ${form} form`);
    console.warn(`[forms] No endpoint for the ${form} form, so nothing was sent:`, data);
    return;
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`The ${form} form returned ${response.status}`);
}

/** Validation, sending and feedback shared by every newsletter sign-up box. */
export function useNewsletterForm() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!email) return setFeedback({ tone: "error", text: requiredMessage("email") });
    if (!isEmail(email)) return setFeedback({ tone: "error", text: INVALID_EMAIL });

    setSending(true);
    try {
      // API: dynamic data – newsletter sign-up
      await submitForm("newsletter", { email });
      setFeedback({ tone: "success", text: FORM_SUCCESS });
      form.reset();
    } catch {
      setFeedback({ tone: "error", text: FORM_ERROR });
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
