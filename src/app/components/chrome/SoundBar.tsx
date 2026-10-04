import { useEffect, type CSSProperties } from "react";
import {
  BAR_COUNT,
  audioAvailable,
  audioLevels,
  audioPlaying,
  bindAudioVisibility,
  probeAudio,
  toggleAudio,
} from "../../lib/audio";
import { useSignal } from "../../lib/signal";
import { useI18n } from "../../lib/i18n";

export default function SoundBar() {
  const { t } = useI18n();
  const levels = useSignal(audioLevels);
  const playing = useSignal(audioPlaying);
  const available = useSignal(audioAvailable);

  useEffect(() => {
    void probeAudio();
    return bindAudioVisibility();
  }, []);

  // No track supplied — say nothing rather than offer a dead control.
  if (!available) return null;

  return (
    <button
      type="button"
      className={`speaker${playing ? " is-playing" : " is-muted"}`}
      onClick={() => void toggleAudio()}
      aria-pressed={playing}
      aria-label={playing ? t("SOUND-OFF") : t("SOUND-ON")}
      title={playing ? t("SOUND-OFF") : t("SOUND-ON")}
    >
      <span className="bar-c" aria-hidden="true">
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <span
            key={i}
            id={`bar-${i + 1}`}
            className="bar"
            style={{ "--level": levels[i] ?? 0.16 } as CSSProperties}
          />
        ))}
      </span>
    </button>
  );
}
