import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { LENSES, forLens, lenses, projects } from "../../content";
import { useI18n } from "../../lib/i18n";
import SectionTitle from "../primitives/SectionTitle";

/* The three doors into the profile pages. Each is one full-width row: the
   role, its claim, the builds that prove it, and the way in. A recruiter
   picks the role they are hiring for and lands on the page made for it. */

export default function Profiles() {
  const { t } = useI18n();

  return (
    <section className="section profiles" id="profiles" data-nav>
      <SectionTitle title={t("PROFILES-TITLE")} lead={t("PROFILES-TEXT")} />

      <ul className="profile-rows">
        {LENSES.map((id) => {
          const lens = lenses[id];
          const proof = forLens(projects, id).slice(0, 3);

          return (
            <li key={id} data-reveal>
              <Link to={lens.path} className="profile-row">
                <span className="profile-row__role">{lens.role}</span>
                <span className="profile-row__headline">{lens.headline}</span>
                <span className="profile-row__proof">
                  {proof.map((p) => p.title).join(", ")}
                </span>
                <span className="profile-row__go" aria-hidden="true">
                  <ArrowUpRight size={22} strokeWidth={1.5} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
