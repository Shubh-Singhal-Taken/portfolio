import { type ReactNode } from "react";
import { motion } from "motion/react";
import { useMotionPrefs, viewportOnce } from "../../lib/motion";

/** Eyebrow + display title + optional lead, with a shared scroll reveal. */
export default function SectionHeading({
  eyebrow,
  title,
  lead
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
}) {
  const { fadeUp } = useMotionPrefs();
  return (
    <motion.div
      className="section-head"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </motion.div>
  );
}
