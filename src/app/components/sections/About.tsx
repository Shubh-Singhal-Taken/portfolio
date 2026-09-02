import { motion } from "motion/react";
import { pillars } from "../../data/portfolio";
import { useMotionPrefs, viewportOnce } from "../../lib/motion";
import SectionHeading from "../primitives/SectionHeading";

export default function About() {
  const { container, child } = useMotionPrefs();

  return (
    <section id="about" className="section container">
      <SectionHeading
        eyebrow="01 / About"
        title={
          <>
            Engineering systems that <span className="gradient-text">think, sense, and act.</span>
          </>
        }
        lead="I'm a multidisciplinary engineer working at the intersection of applied AI and embedded systems, turning research-grade ideas into hardware that ships and software that holds up in the field."
      />

      <motion.div
        className="pillars"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <motion.article className="pillar" key={p.title} variants={child}>
              <div className="pillar-icon">
                <Icon size={20} />
              </div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
