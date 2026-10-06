import { ArrowUp, Gamepad2 } from "lucide-react";
import { useI18n } from "../../lib/i18n";

type Props = {
  /** Present on the front page only: opens the space game. */
  onPlayGame?: () => void;
};

export default function Footer({ onPlayGame }: Props) {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p className="copyright">
        {t("COPYRIGHT_TEXT").replace("{year}", String(year))}
      </p>

      {onPlayGame ? (
        <button type="button" className="footer-game-link" onClick={onPlayGame}>
          <Gamepad2 size={14} aria-hidden="true" />
          {t("GAME-OPEN")}
        </button>
      ) : null}

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
