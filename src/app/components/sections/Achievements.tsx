import type { CSSProperties } from "react";
import { Award, ArrowUpRight, Medal as MedalIcon, Trophy } from "lucide-react";
import { achievements, medalColors, type Medal } from "../../data/portfolio";
import { useI18n } from "../../lib/i18n";
import SectionTitle from "../primitives/SectionTitle";

const medalIcon = (medal: Medal) => {
  if (medal === "gold") return Trophy;
  if (medal === "select") return Award;
  return MedalIcon;
};

type Props = { onOpenProject: (slug: string) => void };

export default function Achievements({ onOpenProject }: Props) {
  const { t } = useI18n();

  return (
    <section className="section" id="achievements" data-nav>
      <SectionTitle title={t("AWARDS-TITLE")} lead={t("AWARDS-TEXT")} />

      <div className="award-grid">
        {achievements.map((item) => {
          const Icon = medalIcon(item.medal);

          return (
            <article
              className="award-card"
              key={item.title}
              data-reveal
              style={{ "--medal": medalColors[item.medal] } as CSSProperties}
            >
              <div className="award-card__top">
                <Icon size={22} />
                <span className="award-card__date">{item.date}</span>
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
