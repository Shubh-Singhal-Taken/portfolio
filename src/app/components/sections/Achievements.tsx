import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { achievements } from "../../data/portfolio";
import { useMotionPrefs, viewportOnce } from "../../lib/motion";
import SectionHeading from "../primitives/SectionHeading";
import { medalIcon } from "../primitives/Medal";

export default function Achievements() {
  const { container, scaleIn } = useMotionPrefs();

  return (
    <section id="achievements" className="section container">
      <SectionHeading
        eyebrow="04 / Recognition"
        title={
          <>
            Competitions won and <span className="gradient-text">selections earned.</span>
          </>
        }
        lead="Four national and campus stages where the builds held up under judging — from Smart India Hackathon to Google DevHouse."
      />

      <motion.div
        className="achievements"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {achievements.map((a) => {
          const Icon = medalIcon(a.medal);
          return (
            <motion.article className="achievement" key={a.title} variants={scaleIn} data-medal={a.medal}>
              <div className="achievement-glow" aria-hidden="true" />
              <div className="achievement-top">
                <span className="achievement-medal" data-medal={a.medal}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="achievement-date">{a.date}</span>
              </div>
              <h3 className="achievement-title">{a.title}</h3>
              <p className="achievement-event">{a.event}</p>
              <p className="achievement-desc">{a.description}</p>
              {a.projectSlug && (
                <a href="#projects" className="achievement-link">
                  View the build <ArrowUpRight size={14} />
                </a>
              )}
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
