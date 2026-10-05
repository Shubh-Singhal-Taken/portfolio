import { Download } from "lucide-react";
import { identity, type LensProfile } from "../../content";
import { useI18n } from "../../lib/i18n";
import { scrollToSection } from "../../lib/scroll";
import PortraitParticles from "../../portrait/PortraitParticles";

type Props = { profile: LensProfile; ready: boolean };

/* Statement-led hero: who and which role in one small line, the role's
   claim as the headline, one line of evidence, and two ways forward. */

export default function LensHero({ profile, ready }: Props) {
  const { t } = useI18n();

  return (
    <section className="section lens-hero" id="lens-top">
      <div className="hero-grid">
        <div className="lens-hero__copy">
          <p className="lens-hero__kicker" data-reveal>
            {identity.name} · {profile.role}
          </p>
          <h1 className="lens-hero__headline" data-reveal>
            {profile.headline}
          </h1>
          <p className="lens-hero__sub" data-reveal>
            {profile.sub}
          </p>

          <div className="lens-hero__actions" data-reveal>
            {profile.resume ? (
              <a className="contact-Btn" href={profile.resume} download>
                <Download size={15} />
                {t("DOWNLOAD-RESUME")}
              </a>
            ) : (
              <button
                type="button"
                className="contact-Btn"
                onClick={() => scrollToSection("#work")}
              >
                {t("VIEW-WORK")}
              </button>
            )}
            <button
              type="button"
              className="lens-hero__link"
              onClick={() => scrollToSection("#contact")}
            >
              {t("CONTACT-BTN")} →
            </button>
          </div>
        </div>

        <div className="hero-portrait" data-portrait-hero aria-hidden="true" />
        <PortraitParticles ready={ready} />
      </div>
    </section>
  );
}
