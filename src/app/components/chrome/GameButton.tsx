import { Gamepad2 } from "lucide-react";
import { useI18n } from "../../lib/i18n";

type Props = { onLaunch: () => void };

export default function GameButton({ onLaunch }: Props) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      className="game-button"
      onClick={onLaunch}
      aria-label={t("GAME-OPEN")}
      title={t("GAME-OPEN")}
    >
      <Gamepad2 size={30} />
    </button>
  );
}
