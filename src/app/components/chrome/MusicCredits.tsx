import { MUSIC_CREDIT, audioAvailable } from "../../lib/audio";
import { useSignal } from "../../lib/signal";
import { useI18n } from "../../lib/i18n";

/** Credits the ambient track, the way the reference design does. */
export default function MusicCredits() {
  const { t } = useI18n();
  const available = useSignal(audioAvailable);

  if (!available || !MUSIC_CREDIT) return null;

  return (
    <p className="music-credits">
      {t("MUSIC-TEXT")}:{" "}
      {MUSIC_CREDIT.url ? (
        <a href={MUSIC_CREDIT.url} target="_blank" rel="noopener noreferrer">
          {MUSIC_CREDIT.title} — {MUSIC_CREDIT.artist}
        </a>
      ) : (
        <>
          {MUSIC_CREDIT.title} — {MUSIC_CREDIT.artist}
        </>
      )}
    </p>
  );
}
