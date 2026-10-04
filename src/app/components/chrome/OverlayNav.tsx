import { useEffect, useRef } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { navItems } from "../../lib/navigation";
import { useI18n } from "../../lib/i18n";
import { scrollToSection } from "../../lib/scroll";
import { lockScroll } from "../../lib/scrollLock";
import { identity } from "../../data/portfolio";

type Props = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  activeId: string;
};

export default function OverlayNav({ open, onToggle, onClose, activeId }: Props) {
  const { t } = useI18n();
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Lock the page behind the overlay and restore focus on close.
  useEffect(() => {
    if (!open) return;
    return lockScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      onClose();
      burgerRef.current?.focus();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (href: string) => {
    onClose();
    // Let the panel start sliding out before the scroll begins.
    window.setTimeout(() => scrollToSection(href), 220);
  };

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        className={`mobile-menu${open ? " is-open" : ""}`}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="overlay-nav"
        aria-label={open ? t("MENU-CLOSE") : t("MENU-OPEN")}
      >
        <div className="line1" />
        <div className="line2" />
        <div className="line3" />
      </button>

      {/* Hidden from AT and removed from the tab order while closed —
          the panel stays mounted so its slide-out transition can run. */}
      <ul
        id="overlay-nav"
        className={`nav-list${open ? " is-active is-visible" : ""}`}
        aria-hidden={!open}
      >
        {navItems.map((item, i) => (
          <li
            key={item.id}
            style={{ animationDelay: open ? `${i * 0.07 + 0.15}s` : undefined }}
          >
            <a
              href={item.href}
              tabIndex={open ? 0 : -1}
              className={activeId === item.id ? "is-current" : undefined}
              onClick={(e) => {
                e.preventDefault();
                go(item.href);
              }}
            >
              {t(item.key)}
            </a>
          </li>
        ))}

        <li className="nav-social-item">
          <div className="nav-social">
            <a
              href={identity.github}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              aria-label="GitHub"
            >
              <Github size={22} />
            </a>
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              aria-label="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
            <a
              href={`mailto:${identity.email}`}
              tabIndex={open ? 0 : -1}
              aria-label="Email"
            >
              <Mail size={22} />
            </a>
          </div>
        </li>
      </ul>
    </>
  );
}
