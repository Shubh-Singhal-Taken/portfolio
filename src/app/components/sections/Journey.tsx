import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey, journeyIcons, journeyLabels } from "../../content";
import { useI18n } from "../../lib/i18n";
import SectionTitle from "../primitives/SectionTitle";

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
  const { t } = useI18n();
  const railRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    const list = listRef.current;
    if (!rail || !list) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(rail, { scaleY: 1 });
      return;
    }

    // The rail fills as the timeline passes through the viewport.
    const tween = gsap.fromTo(
      rail,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: list,
          start: "top 75%",
          end: "bottom 65%",
          scrub: 0.4,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="section" id="journey" data-nav>
      <SectionTitle title={t("JOURNEY-TITLE")} lead={t("JOURNEY-TEXT")} />

      <div className="timeline" ref={listRef}>
        <div className="timeline__rail" aria-hidden="true">
          <div className="timeline__progress" ref={railRef} />
        </div>

        <ol>
          {journey.map((entry) => {
            const Icon = journeyIcons[entry.type];

            return (
              <li
                className="timeline__item"
                key={`${entry.order}-${entry.title}`}
                data-reveal
              >
                <span className="timeline__dot" aria-hidden="true">
                  <Icon size={11} />
                </span>

                <div className="timeline__meta">
                  <span className="timeline__date">{entry.date}</span>
                  <span className="timeline__type">
                    {journeyLabels[entry.type]}
                  </span>
                </div>

                <h3>{entry.title}</h3>
                <p className="timeline__org">{entry.org}</p>
                <p>{entry.detail}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
