import { type CSSProperties } from "react";
import { motion } from "motion/react";
import { skillTiers, softSkills } from "../../data/portfolio";
import { useMotionPrefs, viewportOnce } from "../../lib/motion";
import SectionHeading from "../primitives/SectionHeading";

/** Disciplined cyan→purple accent per tier, no rainbow. */
function accentFor(i: number, n: number) {
  const pct = n <= 1 ? 0 : Math.round((i / (n - 1)) * 100);
  return `color-mix(in oklab, var(--accent), var(--accent-2) ${pct}%)`;
}

export default function Skills() {
  const { container, child } = useMotionPrefs();
  const n = skillTiers.length;

  return (
    <section id="skills" className="section container">
      <SectionHeading
        eyebrow="02 / Skills"
        title="The stack I reach for, end to end."
        lead="Tiered by real project evidence — from firmware and robotics I ship daily, to tools I'm actively growing into."
      />

      <motion.div
        className="tiers"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {skillTiers.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div
              className="tier"
              key={t.tier}
              variants={child}
              style={{ "--tier-accent": accentFor(i, n) } as CSSProperties}
            >
              <div className="tier-head">
                <div className="tier-icon">
                  <Icon size={16} />
                </div>
                <div>
                  <h3 className="tier-name">{t.tier}</h3>
                  <p className="tier-caption">{t.caption}</p>
                </div>
                <span className="tier-count">{t.skills.length}</span>
              </div>
              <div className="tier-chips">
                {t.skills.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="soft">
        <p className="soft-label">Beyond the toolkit</p>
        <motion.div
          className="soft-row"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {softSkills.map((s) => {
            const Icon = s.icon;
            return (
              <motion.span className="soft-chip" key={s.label} variants={child}>
                <Icon size={13} /> {s.label}
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
