import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Send, Sparkles } from "lucide-react";
import { identity, stats } from "../../data/portfolio";
import { EASE } from "../../lib/motion";
import Magnetic from "../primitives/Magnetic";
import CountUp from "../primitives/CountUp";

export default function Hero() {
  const reduce = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 140]);
  const opacity = useTransform(scrollY, [0, 480], [1, reduce ? 1 : 0]);

  const parent = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: reduce ? 0 : 0.08 } }
  };
  const rise = {
    hidden: { y: reduce ? 0 : "115%" },
    visible: { y: "0%", transition: { duration: reduce ? 0 : 0.9, ease: EASE } }
  };
  const fade = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } }
  };

  return (
    <section id="home" className="hero container">
      <motion.div className="hero-inner" initial="hidden" animate="visible" variants={parent}>
        <motion.div style={{ y, opacity }}>
          <motion.div variants={fade}>
            <span className="eyebrow hero-eyebrow">
              <Sparkles size={12} /> {identity.eyebrow}
            </span>
          </motion.div>

          <h1 className="hero-title" aria-label={identity.name}>
            <span className="hero-line">
              <motion.span variants={rise}>{identity.first}</motion.span>
            </span>
            <span className="hero-line">
              <motion.span variants={rise} className="hero-accent gradient-text">
                {identity.last}
              </motion.span>
            </span>
          </h1>

          <motion.p className="hero-role" variants={fade}>
            <b>{identity.role}</b> · Edge AI · Autonomous Systems
          </motion.p>

          <motion.p className="hero-lead" variants={fade}>
            {identity.headline}
          </motion.p>

          <motion.div className="hero-actions" variants={fade}>
            <Magnetic>
              <a href="#projects" className="btn btn-solid">
                View Work <ArrowUpRight size={16} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="btn btn-ghost">
                Let's Talk <Send size={15} />
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div className="hero-stats" variants={fade}>
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-num gradient-text">
                <CountUp target={s.target} prefix={s.prefix} suffix={s.suffix} noCount={s.noCount} />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <span className="scroll-cue-rail" />
      </div>
    </section>
  );
}
