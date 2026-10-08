import { ArrowUp } from "lucide-react";
import { useI18n } from "../../lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p className="copyright">
        {t("COPYRIGHT_TEXT").replace("{year}", String(year))}
      </p>

      <button
        type="button"
        className="footer-privacy-link"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
          })
        }
      >
        {t("FOOTER_PRIVACY_LINK")} <ArrowUp size={12} style={{ display: "inline" }} />
      </button>
    </footer>
  );
}
