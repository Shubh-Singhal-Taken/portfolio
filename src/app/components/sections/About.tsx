import { useState } from "react";
import { ChevronRight, Download } from "lucide-react";
import {
  LENSES,
  aboutText,
  certificationIcon,
  certifications,
  education,
  educationIcon as EducationIcon,
  lenses,
  skillTiers,
  softSkills,
} from "../../content";
import { useI18n } from "../../lib/i18n";
import SectionTitle from "../primitives/SectionTitle";

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
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export default function About() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("education");
  const resumes = LENSES.map((id) => lenses[id]).filter((lens) => lens.resume);

  return (
    <section className="section" id="about" data-nav>
      {/* The portrait's stars become a galaxy turning behind this panel */}
      <div className="section-panel" data-portrait-galaxy>
        <SectionTitle title={t("ABOUT-TITLE")} />

        <p className="about-text" data-reveal>
          {aboutText}
        </p>

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

            {certifications.length ? (
              <CertificationBranch
                title={t("CERTS-TITLE")}
                Icon={certificationIcon}
                items={certifications.map(
                  (c) => `${c.title}, ${c.issuer}${c.note ? ` (${c.note})` : ""}`
                )}
              />
            ) : null}
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

                <ul className="skill-group__list">
                  {tier.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="skills-tier">
            <div className="skills-tier-head">
              <h3>{t("SOFT-SKILLS-TITLE")}</h3>
            </div>

            <ul className="skill-group__list">
              {softSkills.map((skill) => (
                <li key={skill.label}>{skill.label}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* One download per profile, shown only once its PDF exists */}
        {resumes.length ? (
          <div className="btn-cv-border">
            {resumes.map((lens) => (
              <a className="dcv" href={lens.resume} download key={lens.id}>
                <Download size={15} />
                {lens.role} {t("RESUME")}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
