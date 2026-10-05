import type { SkillGroup } from "../../content";
import { useI18n } from "../../lib/i18n";
import SectionTitle from "../primitives/SectionTitle";

type Props = { groups: SkillGroup[] };

/* The lens's resume skill groups, each a short labelled cluster rather
   than one long undifferentiated cloud. Everything is visible at rest:
   nothing hides behind hover. */

export default function SkillsSection({ groups }: Props) {
  const { t } = useI18n();

  return (
    <section className="section lens-skills" id="skills">
      <SectionTitle title={t("SKILLS-TITLE")} lead={t("SKILLS-TEXT")} />

      <div className="skill-groups">
        {groups.map((group) => (
          <div className="skill-group" key={group.label} data-reveal>
            <h3 className="skill-group__label">{group.label}</h3>
            <ul className="skill-group__list">
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
