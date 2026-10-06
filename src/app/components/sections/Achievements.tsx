import type { CSSProperties } from "react";
import { Award, ArrowUpRight, Medal as MedalIcon, Trophy } from "lucide-react";
import { achievements, medalColors, type Achievement, type Medal } from "../../content";
import { useI18n } from "../../lib/i18n";
import SectionTitle from "../primitives/SectionTitle";

const medalIcon = (medal: Medal) => {
  if (medal === "gold") return Trophy;
  if (medal === "select") return Award;
  return MedalIcon;
};

/* Row sizes that fill a 6-column grid exactly, so there is never an
   empty cell: up to three cards share a row, a lone card never sits on
   its own, and the first row is a pair so the top wins lead. */
function rowSizes(n: number): number[] {
  if (n <= 3) return [n];
  const rest = (m: number): number[] =>
    m <= 3 ? [m] : m === 4 ? [2, 2] : [3, ...rest(m - 3)];
  return n % 3 === 0 ? rest(n) : [2, ...rest(n - 2)];
}

function spans(n: number): number[] {
  return rowSizes(n).flatMap((size) => Array<number>(size).fill(6 / size));
}

type Props = {
  onOpenProject: (slug: string) => void;
  /** Defaults to everything; lens pages pass their own ordered list. */
  items?: Achievement[];
};

export default function Achievements({ onOpenProject, items = achievements }: Props) {
  const { t } = useI18n();
  const span = spans(items.length);

  return (
    <section className="section" id="achievements" data-nav>
      <SectionTitle title={t("AWARDS-TITLE")} lead={t("AWARDS-TEXT")} />

      <div className="award-grid">
        {items.map((item, i) => {
          const Icon = medalIcon(item.medal);

          return (
            <article
              className="award-card"
              key={item.title}
              data-reveal
              style={
                {
                  "--medal": medalColors[item.medal],
                  "--span": span[i],
                } as CSSProperties
              }
            >
              <div className="award-card__top">
                <Icon size={22} />
                {item.date ? <span className="award-card__date">{item.date}</span> : null}
              </div>

              <h3>{item.title}</h3>
              <p className="award-card__event">{item.event}</p>
              <p>{item.description}</p>

              {item.projectSlug ? (
                <button
                  type="button"
                  className="award-card__link"
                  onClick={() => onOpenProject(item.projectSlug as string)}
                >
                  {t("AWARDS-LINK")}
                  <ArrowUpRight size={13} />
                </button>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
