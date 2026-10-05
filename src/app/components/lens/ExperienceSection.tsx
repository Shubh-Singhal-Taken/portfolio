import type { Experience } from "../../content";
import { useI18n } from "../../lib/i18n";
import SectionTitle from "../primitives/SectionTitle";

type Props = { roles: Experience[] };

/* Role history for one lens. The panel is also where the portrait's
   stars settle into the galaxy, so it carries [data-portrait-galaxy]. */

export default function ExperienceSection({ roles }: Props) {
  const { t } = useI18n();

  return (
    <section className="section lens-experience" id="experience">
      <div className="section-panel" data-portrait-galaxy>
        <SectionTitle title={t("EXPERIENCE-TITLE")} />

        <ol className="roles">
          {roles.map((role) => (
            <li className="role" key={role.org} data-reveal>
              <div className="role__head">
                <h3 className="role__title">
                  {role.role}
                  <span className="role__org">{role.org}</span>
                </h3>
                <p className="role__when">
                  {role.period}
                  <span>{role.place}</span>
                </p>
              </div>

              {role.previousRole ? (
                <p className="role__previous">
                  {t("EXPERIENCE-PREVIOUSLY")}: {role.previousRole.role},{" "}
                  {role.previousRole.period}
                </p>
              ) : null}

              <ul className="role__bullets">
                {role.bullets.map((bullet) => (
                  <li key={bullet.text}>{bullet.text}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
