import { useState, type FormEvent } from "react";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { identity } from "../../data/portfolio";
import { useI18n } from "../../lib/i18n";
import { isConfigured, mailtoFor, sendContactMessage } from "../../lib/emailjs";
import SectionTitle from "../primitives/SectionTitle";

type Status = "idle" | "sending" | "sent" | "handoff" | "failed";

function CheckIcon() {
  return (
    <div className="check-icon" aria-hidden="true">
      <span className="icon-line line-tip" />
      <span className="icon-line line-long" />
      <div className="icon-circle" />
      <div className="icon-fix" />
    </div>
  );
}

function BanIcon() {
  return (
    <div className="ban-icon" aria-hidden="true">
      <span className="icon-line line-long-invert" />
      <span className="icon-line line-long" />
      <div className="icon-circle" />
      <div className="icon-fix" />
    </div>
  );
}

export default function Contact() {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    // No delivery service configured: hand the message to the visitor's
    // own email app, already written, instead of claiming it was sent.
    if (!isConfigured) {
      window.location.href = mailtoFor(form);
      setStatus("handoff");
      return;
    }

    setStatus("sending");

    try {
      await sendContactMessage(form);
      setForm({ name: "", email: "", message: "" });
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <section className="section contact" id="contact" data-nav>
      <SectionTitle title={t("CONTACT-TITLE")} />

      <div className="contact-grid">
        <div data-reveal>
          <p className="contact-lead">{t("CONTACT-TEXT")}</p>

          <div className="social-contact">
            <a href={`mailto:${identity.email}`}>
              <Mail size={17} />
              {identity.email}
            </a>
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={17} />
              {identity.linkedinHandle}
            </a>
            <a href={identity.github} target="_blank" rel="noopener noreferrer">
              <Github size={17} />
              {identity.githubHandle}
            </a>
          </div>
        </div>

        <div data-reveal>
          {status === "sent" || status === "handoff" || status === "failed" ? (
            <div className="delivering" role="status" aria-live="polite">
              {status === "failed" ? <BanIcon /> : <CheckIcon />}
              <p className="message">
                {status === "sent"
                  ? t("SUCCESS")
                  : status === "handoff"
                    ? t("HANDOFF")
                    : t("FAILED")}
              </p>
              {status === "sent" ? null : (
                <a className="message-email" href={`mailto:${identity.email}`}>
                  {identity.email}
                </a>
              )}
              <button
                type="button"
                className="sendBtn"
                onClick={() => setStatus("idle")}
              >
                {status === "failed" ? t("SEND-SPAN") : t("PROJECT-CLOSE")}
              </button>
            </div>
          ) : (
            <form id="contact-form" onSubmit={onSubmit}>
              <label>
                {t("FORM-NAME")}
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </label>

              <label>
                {t("FORM-EMAIL")}
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </label>

              <label>
                {t("FORM-MESSAGE")}
                <textarea
                  name="message"
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                />
              </label>

              <div className="button-container">
                <button
                  className="sendBtn"
                  type="submit"
                  disabled={status === "sending"}
                >
                  <span className="sentSpan">
                    {status === "sending" ? t("SEND-SENDING") : t("SEND-SPAN")}
                  </span>
                  {status === "sending" ? (
                    <span className="spinner" />
                  ) : (
                    <Send size={13} />
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
