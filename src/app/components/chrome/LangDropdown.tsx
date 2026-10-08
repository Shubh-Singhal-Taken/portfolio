import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { LOCALES, useI18n, type LocaleId } from "../../lib/i18n";

export default function LangDropdown() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = LOCALES.find((l) => l.id === locale) ?? LOCALES[0];

  const choose = (id: LocaleId) => {
    setLocale(id);
    setOpen(false);
  };

  return (
    <div className="dropdown" ref={rootRef}>
      <button
        type="button"
        className="dropdown__button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("LANG-LABEL")}
      >
        {active.label}
        <ChevronDown size={13} />
      </button>

      <div
        className={`dropdown__items${open ? "" : " dropdown--hide"}`}
        role="listbox"
        aria-label={t("LANG-LABEL")}
      >
        {LOCALES.map((l) => (
          <button
            key={l.id}
            type="button"
            id={l.id}
            className="dropdown__item"
            role="option"
            aria-selected={l.id === locale}
            onClick={() => choose(l.id)}
          >
            {l.name}
          </button>
        ))}
      </div>
    </div>
  );
}
