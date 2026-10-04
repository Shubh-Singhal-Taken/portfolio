import { useEffect, useRef } from "react";
import Typed from "typed.js";
import gsap from "gsap";
import { identity } from "../../data/portfolio";
import { useI18n } from "../../lib/i18n";
import { scrollToSection } from "../../lib/scroll";

import PortraitParticles from "../../portrait/PortraitParticles";

type Props = { ready: boolean };

/** Splits a word into per-letter spans so the reveal can stagger. */
function Word({ text, serif }: { text: string; serif?: boolean }) {
  return (
    <span className={`name-word${serif ? " name2" : ""}`}>
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
  const nameRef = useRef<HTMLDivElement>(null);
  const typedElRef = useRef<HTMLSpanElement>(null);
  const restRef = useRef<HTMLDivElement>(null);

  // Letter reveal — held until the loader has cleared so it is not
  // spent behind a black overlay.
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

  // Typed.js role line.
  useEffect(() => {
    if (!ready || !typedElRef.current) return;

    const strings = [
      t("HOME-TYPED-1"),
      t("HOME-TYPED-2"),
      t("HOME-TYPED-3"),
      t("HOME-TYPED-4"),
    ];

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    if (reduced) {
      typedElRef.current.textContent = strings[0];
      return;
    }

    const typed = new Typed(typedElRef.current, {
      strings,
      typeSpeed: 55,
      backSpeed: 28,
      backDelay: 2200,
      startDelay: 600,
      loop: true,
      smartBackspace: true,
    });

    return () => typed.destroy();
  }, [ready, t]);

  return (
    <section className="section" id="section-home" data-nav>
      <div className="hero-grid">
        <div className="home">
          <div className="name-container" ref={nameRef}>
            <Word text={identity.first} />
            <Word text={identity.last} serif />
          </div>

          <div ref={restRef}>
            <div className="typed-wrapper">
              <span className="typed" ref={typedElRef} />
            </div>

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
