/* Contact delivery.

   With the three VITE_EMAILJS_* variables set, the form posts the message
   through EmailJS. Without them there is nowhere to post it, so the form
   hands the message to the visitor's own email app instead (a prefilled
   mailto:) rather than pretending it was sent. */

import { identity } from "../content";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as
  | string
  | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export const isConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactMessage(payload: ContactPayload) {
  if (!isConfigured) throw new Error("EmailJS is not configured");

  // Loaded on demand so the SDK stays out of the initial bundle.
  const { default: emailjs } = await import("@emailjs/browser");

  await emailjs.send(
    SERVICE_ID as string,
    TEMPLATE_ID as string,
    {
      from_name: payload.name,
      reply_to: payload.email,
      message: payload.message,
    },
    { publicKey: PUBLIC_KEY as string }
  );
}

/** A mailto: link carrying the message, for when EmailJS is not set up. */
export function mailtoFor(payload: ContactPayload): string {
  const subject = `Portfolio enquiry from ${payload.name}`;
  const body = `${payload.message}\n\n${payload.name}\n${payload.email}`;
  return `mailto:${identity.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
