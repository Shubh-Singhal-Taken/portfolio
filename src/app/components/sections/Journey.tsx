import { useRef, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { journey, journeyIcons, journeyLabels } from "../../data/portfolio";
import { EASE, viewportOnce } from "../../lib/motion";
import SectionHeading from "../primitives/SectionHeading";

/** Cyan→purple down the timeline: newest (top) is cyan, oldest (bottom) purple. */
function dotAccent(i: number, n: number) {
  const pct = n <= 1 ? 0 : Math.round((i / (n - 1)) * 100);
  return `color-mix(in oklab, var(--accent), var(--accent-2) ${pct}%)`;
}

export default function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 65%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);
  const n = journey.length;

  const item = {
    hidden: { opacity: 0, x: reduce ? 0 : -28, filter: reduce ? "blur(0px)" : "blur(6px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0 : 0.6, ease: EASE }
    }
  };

  return (
    <section id="journey" className="section container">
      <SectionHeading
        eyebrow="05 / Journey"
        title="From first hackathon to General Secretary."
        lead="Two and a half years of builds, wins, workshops, and leadership — the milestones that shaped how I engineer and lead."
      />

      <div className="timeline" ref={ref}>
        <div className="timeline-line">
          <motion.div className="timeline-progress" style={{ scaleY }} />
        </div>

        {journey.map((j, i) => {
          const Icon = journeyIcons[j.type];
          return (
            <motion.article
              className="timeline-item"
              key={`${j.title}-${j.order}`}
              style={{ "--dot-accent": dotAccent(i, n) } as CSSProperties}
              variants={item}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <span className="timeline-dot" aria-hidden="true">
                <Icon size={13} />
              </span>
              <div className="timeline-meta">
                <span className="timeline-period">{j.date}</span>
                <span className="timeline-type">{journeyLabels[j.type]}</span>
              </div>
              <h3 className="timeline-role">{j.title}</h3>
              <p className="timeline-org">{j.org}</p>
              <p className="timeline-detail">{j.detail}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
