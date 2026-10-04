import { useI18n } from "../../lib/i18n";

type Props = {
  /** 0 → 1. */
  progress: number;
  done: boolean;
};

export default function LoadingScreen({ progress, done }: Props) {
  const { t } = useI18n();
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <section
      id="loading-screen"
      className={done ? "is-done" : undefined}
      aria-hidden={done}
      role="status"
      aria-live="polite"
      aria-busy={!done}
    >
      <div id="loader-text">{t("LOADER-TEXT")}</div>
      <div id="loader" />
      <div className="loader-counter">{percent}%</div>
    </section>
  );
}
