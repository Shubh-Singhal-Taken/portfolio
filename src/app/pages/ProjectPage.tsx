import { useState, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import PageMeta from "../components/PageMeta";
import { projectStructuredData } from "../lib/structuredData";
import OverlayNav from "../components/chrome/OverlayNav";
import ArchitectureDiagram from "../components/projects/ArchitectureDiagram";
import NotFound from "./NotFound";
import {
  LENSES,
  diagrams,
  identity,
  lenses,
  medalColors,
  projectVideoSrc,
  projectsInOrder,
} from "../content";
import { useI18n } from "../lib/i18n";
import { useRevealAnimations } from "../lib/reveal";
import { useSceneReady } from "../lib/sceneReady";

/* One case study at its own URL (/projects/<slug>), prerendered so it can
   be shared and found. Problem, approach, result, the system diagram
   where there is one, the stack, and the way on to the next build. */

/** Route entry: remount per project so moving to the next one starts its
    page fresh (entrance animations, scroll, menu state). */
export default function ProjectRoute() {
  const { slug } = useParams();
  return <ProjectPage key={slug} slug={slug} />;
}

function ProjectPage({ slug }: { slug?: string }) {
  const { t } = useI18n();
  const ready = useSceneReady();
  const [navOpen, setNavOpen] = useState(false);
  useRevealAnimations(ready);

  const index = projectsInOrder.findIndex((p) => p.slug === slug);
  const project = projectsInOrder[index];
  if (!project) return <NotFound />;

  const prev = projectsInOrder[(index - 1 + projectsInOrder.length) % projectsInOrder.length];
  const next = projectsInOrder[(index + 1) % projectsInOrder.length];
  const shownOn = LENSES.filter((id) => project.lenses[id] !== undefined);
  const diagram = diagrams[project.slug];
  const video = projectVideoSrc(project.slug);

  return (
    <>
      <PageMeta
        title={`${project.title}: ${project.tagline} | ${identity.name}`}
        description={project.summary}
        path={`/projects/${project.slug}`}
        image={`/og/projects/${project.slug}.jpg`}
        structuredData={projectStructuredData(project)}
      />

      <OverlayNav
        items={[]}
        open={navOpen}
        onToggle={() => setNavOpen((o) => !o)}
        onClose={() => setNavOpen(false)}
        activeId=""
      />

      <main id="main" className="project-page">
        <header className="section case-hero">
          <nav className="case-crumbs" aria-label={t("CASE-CRUMBS")}>
            <Link to="/">{identity.name}</Link>
            <span aria-hidden="true">/</span>
            <span>{t("PROJECTS-MENU")}</span>
          </nav>

          {project.award ? (
            <span
              className="work-award"
              style={{ "--medal": medalColors[project.award.medal] } as CSSProperties}
            >
              {project.award.label}
            </span>
          ) : null}

          <h1 className="case-hero__title">{project.title}</h1>
          <p className="case-hero__tagline">{project.tagline}</p>

          <dl className="case-facts">
            <div>
              <dt>{t("CASE-WHEN")}</dt>
              <dd>{project.date}</dd>
            </div>
            <div>
              <dt>{t("CASE-ROLE")}</dt>
              <dd>
                {project.role}
                {project.team ? `, ${project.team}` : ""}
              </dd>
            </div>
            <div>
              <dt>{t("PROJECT-METRIC")}</dt>
              <dd className="case-facts__metric">{project.metric}</dd>
            </div>
          </dl>

          {shownOn.length ? (
            <p className="case-lenses">
              {t("CASE-SHOWN-ON")}{" "}
              {shownOn.map((id, i) => (
                <span key={id}>
                  {i > 0 ? ", " : ""}
                  <Link to={lenses[id].path}>{lenses[id].role}</Link>
                </span>
              ))}
            </p>
          ) : null}

          {project.github || project.demo ? (
            <div className="case-links">
              {project.github ? (
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github size={15} aria-hidden="true" /> {t("CASE-CODE")}
                </a>
              ) : null}
              {project.demo ? (
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={15} aria-hidden="true" /> {t("CASE-DEMO")}
                </a>
              ) : null}
            </div>
          ) : null}
        </header>

        <section className="section case-body">
          <p className="case-summary" data-reveal>
            {project.summary}
          </p>

          {video ? (
            <div className="case-media" data-reveal>
              <video src={video} controls muted playsInline preload="metadata" />
            </div>
          ) : null}

          {diagram ? (
            <div data-reveal>
              <ArchitectureDiagram diagram={diagram} title={project.title} />
            </div>
          ) : null}

          <div className="case-story">
            {(
              [
                ["PROJECT-PROBLEM", project.problem],
                ["PROJECT-APPROACH", project.approach],
                ["PROJECT-RESULT", project.result],
              ] as const
            ).map(([label, text]) => (
              <section className="case-story__part" key={label} data-reveal>
                <h2>{t(label)}</h2>
                <p>{text}</p>
              </section>
            ))}
          </div>

          <div className="case-stack" data-reveal>
            <h2>{t("CASE-STACK")}</h2>
            <ul className="skill-group__list">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </section>

        <nav className="section case-next" aria-label={t("CASE-MORE")}>
          <Link to={`/projects/${prev.slug}`} className="case-next__link is-prev">
            <ArrowLeft size={18} aria-hidden="true" />
            <span>
              <small>{t("PROJECT-PREV")}</small>
              {prev.title}
            </span>
          </Link>
          <Link to={`/projects/${next.slug}`} className="case-next__link is-next">
            <span>
              <small>{t("PROJECT-NEXT")}</small>
              {next.title}
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </nav>
      </main>
    </>
  );
}
