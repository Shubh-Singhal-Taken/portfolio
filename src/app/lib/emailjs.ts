/* Contact delivery.

   When the three VITE_EMAILJS_* variables are present the form posts a
   real message. When they are absent — a fresh clone, a preview build —
   it resolves successfully instead of throwing, so the form is never a
   dead control. `isConfigured` lets the UI say which mode it is in. */

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
  if (!isConfigured) {
    // Simulate the round trip so the success animation is honest about
    // taking a moment, then resolve.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return;
  }

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
