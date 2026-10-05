import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { medalColors, type Project } from "../../content";
import { useI18n } from "../../lib/i18n";
import SectionTitle from "../primitives/SectionTitle";

type Props = {
  /** Already ordered for the lens, strongest first. */
  projects: Project[];
  onOpen: (slug: string) => void;
};

/* Three tiers, so the strongest proof gets the most room: one lead case
   across the full width, a pair beneath it, and the rest as a compact
   list a recruiter can scan in a glance. */

function Award({ project }: { project: Project }) {
  if (!project.award) return null;
  return (
    <span
      className="work-award"
      style={{ "--medal": medalColors[project.award.medal] } as CSSProperties}
    >
      {project.award.label}
    </span>
  );
}

function Tags({ tags, limit }: { tags: string[]; limit: number }) {
  return (
    <ul className="work-tags" aria-label="Stack">
      {tags.slice(0, limit).map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

export default function SelectedWork({ projects, onOpen }: Props) {
  const { t } = useI18n();
  const [lead, ...others] = projects;
  const pair = others.slice(0, 2);
  const more = others.slice(2);

  if (!lead) return null;

  return (
    <section className="section lens-work" id="work">
      <SectionTitle title={t("WORK-TITLE")} lead={t("WORK-TEXT")} />

      <article className="work-lead" data-reveal>
        <div className="work-lead__copy">
          <Award project={lead} />
          <h3 className="work-lead__title">{lead.title}</h3>
          <p className="work-lead__tagline">{lead.tagline}</p>
          <p className="work-lead__summary">{lead.summary}</p>
          <Tags tags={lead.tags} limit={8} />
          <button type="button" className="work-open" onClick={() => onOpen(lead.slug)}>
            {t("WORK-CASE")}
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="work-lead__outcome">
          <span className="work-lead__outcome-label">{t("PROJECT-METRIC")}</span>
          <p className="work-lead__metric">{lead.metric}</p>
          <p className="work-lead__meta">
            {lead.date}
            <br />
            {lead.role}
          </p>
        </div>
      </article>

      {pair.length ? (
        <div className="work-pair">
          {pair.map((project) => (
            <article className="work-card" key={project.slug} data-reveal>
              <Award project={project} />
              <h3 className="work-card__title">{project.title}</h3>
              <p className="work-card__tagline">{project.tagline}</p>
              <p className="work-card__metric">{project.metric}</p>
              <Tags tags={project.tags} limit={5} />
              <button
                type="button"
                className="work-open"
                onClick={() => onOpen(project.slug)}
              >
                {t("WORK-CASE")}
                <ArrowUpRight size={14} />
              </button>
            </article>
          ))}
        </div>
      ) : null}

      {more.length ? (
        <div className="work-more" data-reveal>
          <h3 className="work-more__title">{t("WORK-MORE")}</h3>
          <ul>
            {more.map((project) => (
              <li key={project.slug}>
                <button
                  type="button"
                  className="work-more__row"
                  onClick={() => onOpen(project.slug)}
                >
                  <span className="work-more__name">{project.title}</span>
                  <span className="work-more__tagline">{project.tagline}</span>
                  <span className="work-more__date">{project.date}</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
