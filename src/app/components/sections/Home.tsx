import { useEffect, useRef } from "react";
import gsap from "gsap";
import { identity } from "../../content";
import { useI18n } from "../../lib/i18n";
import { scrollToSection } from "../../lib/scroll";

import PortraitParticles from "../../portrait/PortraitParticles";

type Props = { ready: boolean };

/** Splits a word into per-letter spans so the reveal can stagger. */
function Word({ text, serif }: { text: string; serif?: boolean }) {
  return (
    <span className={`name-word${serif ? " name2" : ""}`} aria-hidden="true">
      {Array.from(text).map((ch, i) => (
        <span className="letter" key={`${ch}-${i}`}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Home({ ready }: Props) {
  const { t } = useI18n();
  const nameRef = useRef<HTMLHeadingElement>(null);
  const restRef = useRef<HTMLDivElement>(null);

  // Letter reveal, held until the loader has cleared so it is not spent
  // behind a black overlay.
  useEffect(() => {
    if (!ready) return;

    const letters = nameRef.current?.querySelectorAll(".letter");
    if (!letters?.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    if (reduced) {
      gsap.set(letters, { opacity: 1, y: 0 });
      gsap.set(restRef.current, { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline();

    tl.to(letters, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.045,
    }).from(
      restRef.current,
      { opacity: 0, y: 24, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    );

    return () => {
      tl.kill();
    };
  }, [ready]);

  return (
    <section className="section" id="section-home" data-nav>
      <div className="hero-grid">
        <div className="home">
          {/* Letters are split for the reveal; the heading's accessible
              name is the whole name, read once. */}
          <h1 className="name-container" ref={nameRef} aria-label={identity.name}>
            <Word text={identity.first} />
            <Word text={identity.last} serif />
          </h1>

          <div ref={restRef}>
            <p className="home-role">{t("HOME-ROLE")}</p>
            <p className="home-sub">{t("HOME-SUB")}</p>

            <div className="contact-Btn-wrapper">
              <button
                type="button"
                className="contact-Btn"
                onClick={() => scrollToSection("#contact")}
              >
                {t("CONTACT-BTN")}
              </button>
            </div>
          </div>
        </div>

        {/* The particle canvas measures this box and draws the portrait
            into it; the box itself only reserves the space. */}
        <div className="hero-portrait" data-portrait-hero aria-hidden="true" />
        <PortraitParticles ready={ready} />
      </div>
    </section>
  );
}
