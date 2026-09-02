import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, FileCode2, Sparkles, UserRound } from "lucide-react";
import { domains, projects, type Domain, type Project } from "../../data/portfolio";
import { EASE, useMotionPrefs, viewportOnce } from "../../lib/motion";
import SectionHeading from "../primitives/SectionHeading";
import MedalBadge from "../primitives/Medal";

function ProjectCard({ p, index, featured }: { p: Project; index: number; featured: boolean }) {
  const [open, setOpen] = useState(false);
  const drawerId = `case-${p.slug}`;

  return (
    <motion.article
      className={`project ${featured ? "project--featured" : ""}`}
      layout
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -12 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div className="project-body">
        <div className="project-top">
          <span className="project-index">
            {String(index + 1).padStart(2, "0")} · {p.date}
          </span>
          {p.award && <MedalBadge medal={p.award.medal} label={p.award.label} />}
        </div>

        <span className="project-role">
          <UserRound size={12} /> {p.role}
        </span>

        <h3>{p.title}</h3>
        <p className="project-tagline">{p.tagline}</p>
        <p className="project-summary">{p.summary}</p>

        <p className="project-metric">
          <Sparkles size={14} /> {p.metric}
        </p>

        <div className="project-tags">
          {p.tags.map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>

        <div className="project-actions">
          <button
            type="button"
            className={`project-cta ${open ? "project-cta--open" : ""}`}
            aria-expanded={open}
            aria-controls={drawerId}
            onClick={() => setOpen((o) => !o)}
          >
            <FileCode2 size={15} />
            {open ? "Hide case study" : "Read case study"}
          </button>
          <a href="#contact" className="project-link">
            Discuss this build <ChevronRight size={15} />
          </a>
        </div>

        <div id={drawerId} className={`project-drawer ${open ? "is-open" : ""}`} role="region" aria-label="Case study details">
          <div className="project-drawer-inner">
            <div className="case-row">
              <span className="case-label">Problem</span>
              <p>{p.problem}</p>
            </div>
            <div className="case-row">
              <span className="case-label">Approach</span>
              <p>{p.approach}</p>
            </div>
            <div className="case-row">
              <span className="case-label">Result</span>
              <p>{p.result}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [active, setActive] = useState<Domain>("all");
  const { fadeUp } = useMotionPrefs();

  const filtered = active === "all" ? projects : projects.filter((p) => p.domain === active);
  const activeData = domains.find((d) => d.key === active)!;

  return (
    <section id="projects" className="section container">
      <SectionHeading
        eyebrow="03 / Projects"
        title={
          <>
            Signature builds, <span className="gradient-text">prototype to production.</span>
          </>
        }
        lead="Systems where sensing, intelligence, and control come together in the real world. Open any card for the full problem → approach → result."
      />

      <motion.div
        className="filter"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <span className="filter-prompt">~/projects $ filter --domain</span>
        <div className="filter-tabs" role="tablist" aria-label="Filter projects by domain">
          {domains.map((d) => {
            const Icon = d.icon;
            const isActive = active === d.key;
            const count = d.key === "all" ? projects.length : projects.filter((p) => p.domain === d.key).length;
            return (
              <button
                key={d.key}
                role="tab"
                aria-selected={isActive}
                className={`filter-tab ${isActive ? "filter-tab--active" : ""}`}
                onClick={() => setActive(d.key)}
              >
                <Icon size={13} />
                <span className="dir">{d.dir}</span>
                {d.label}
                <span className="filter-tab-count">{count}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div className="projects" layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <ProjectCard key={p.slug} p={p} index={i} featured={active === "all" && !!p.featured} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          className="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p>
            <span className="prompt">$</span> ls {activeData.dir}
          </p>
          <p>No projects in this directory yet. Check back soon.</p>
        </motion.div>
      )}
    </section>
  );
}
