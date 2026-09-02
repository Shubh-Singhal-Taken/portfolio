import { Award, Medal as MedalIcon, Trophy, type LucideIcon } from "lucide-react";
import type { Medal } from "../../data/portfolio";

const MAP = {
  gold: { Icon: Trophy, label: "Gold" },
  silver: { Icon: MedalIcon, label: "Silver" },
  bronze: { Icon: MedalIcon, label: "Bronze" },
  select: { Icon: Award, label: "Selected" }
} as const;

export const medalIcon = (medal: Medal): LucideIcon => MAP[medal].Icon;

/** Award badge rendered with a lucide glyph + metallic tint (no emoji).
 *  `data-medal` drives the color in CSS so tints stay consistent. */
export default function MedalBadge({
  medal,
  label,
  size = 14
}: {
  medal: Medal;
  label?: string;
  size?: number;
}) {
  const { Icon, label: fallback } = MAP[medal];
  return (
    <span className="medal" data-medal={medal}>
      <Icon size={size} aria-hidden="true" />
      {label ?? fallback}
    </span>
  );
}
