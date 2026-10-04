import { useState } from "react";
import { ChevronRight, Download } from "lucide-react";
import {
  aboutText,
  certifications,
  education,
  educationIcon as EducationIcon,
  identity,
  skillTiers,
  softSkills,
  stats,
} from "../../data/portfolio";
import { useI18n } from "../../lib/i18n";
import SectionTitle from "../primitives/SectionTitle";
import CountUp from "../primitives/CountUp";

type Tab = "education" | "skills";

function CertificationBranch({
  title,
  Icon,
  items,
}: {
  title: string;
  Icon: typeof EducationIcon;
  items: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <li className="parent">
      <button
        type="button"
        className="toggle-button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <ChevronRight className="chevron" size={14} />
        <Icon size={15} />
        <span className="course-text">{title}</span>
      </button>

      <div className={`child${open ? " is-open" : ""}`}>
        <div>
          <ul>
            {items.length === 0 ? (
              <li>Coming soon.</li>
            ) : (
              items.map((item) => <li key={item}>{item}</li>)
            )}
          </ul>
        </div>
      </div>
    </li>
  );
}

export default function About() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("education");

  return (
    <section className="section" id="about" data-nav>
      {/* The portrait's stars become a galaxy turning behind this panel */}
      <div className="section-panel" data-portrait-galaxy>
        <SectionTitle title={t("ABOUT-TITLE")} />

        <p className="about-text" data-reveal>
          {aboutText}
        </p>

        <div className="stat-strip" data-reveal>
          {stats.map((stat) => (
            <div className="stat-cell" key={stat.label}>
              <div className="stat-value">
                <CountUp
                  target={stat.target}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  noCount={stat.noCount}
                />
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs ------------------------------------------------ */}
        <div className="tab-titles" role="tablist" aria-label={t("ABOUT-TITLE")}>
          <button
            type="button"
            role="tab"
            id="tab-education"
            aria-selected={tab === "education"}
            aria-controls="education"
            className={`tab-links${tab === "education" ? " active-link" : ""}`}
            onClick={() => setTab("education")}
          >
            <EducationIcon size={16} />
            {t("EDU-BTN")}
          </button>

          <button
            type="button"
            role="tab"
            id="tab-skills"
            aria-selected={tab === "skills"}
            aria-controls="skills"
            className={`tab-links skill-link${
              tab === "skills" ? " active-link" : ""
            }`}
            onClick={() => setTab("skills")}
          >
            {t("SKILL-BTN")}
          </button>
        </div>

        <div
          className={`tab-contents${tab === "education" ? " active-tab" : ""}`}
          id="education"
          role="tabpanel"
          aria-labelledby="tab-education"
          hidden={tab !== "education"}
        >
          <ul className="education-list">
            {education.map((entry) => (
              <li className="graduation-title" key={entry.qualification}>
                <strong>{entry.qualification}</strong>
                <span>{entry.institution}</span>
                <em>{entry.period}</em>
                {entry.note ? <span>{entry.note}</span> : null}
              </li>
            ))}

            {certifications.map((group) => (
              <CertificationBranch
                key={group.title}
                title={group.title}
                Icon={group.icon}
                items={group.items}
              />
            ))}
          </ul>
        </div>

        <div
          className={`tab-contents${tab === "skills" ? " active-tab" : ""}`}
          id="skills"
          role="tabpanel"
          aria-labelledby="tab-skills"
          hidden={tab !== "skills"}
        >
          {skillTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div className="skills-tier" key={tier.tier}>
                <div className="skills-tier-head">
                  <Icon size={15} />
                  <h3>{tier.tier}</h3>
                  <p>{tier.caption}</p>
                </div>

                <div className="our-skills">
                  {tier.skills.map((skill) => (
                    <div className="card" key={skill} tabIndex={0}>
                      <div className="card-face">{skill}</div>
                      <div className="card-content">{skill}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="skills-tier">
            <div className="skills-tier-head">
              <h3>{t("SOFT-SKILLS-TITLE")}</h3>
            </div>

            <div className="our-skills">
              {softSkills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div className="card" key={skill.label} tabIndex={0}>
                    <div className="card-face">
                      <Icon size={18} />
                    </div>
                    <div className="card-content">{skill.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="btn-cv-border">
          <a className="dcv" href={identity.resume} download>
            <Download size={15} />
            {t("DOWNLOAD-CV")}
          </a>
        </div>
      </div>
    </section>
  );
}
