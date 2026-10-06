import { useCallback, useState } from "react";

import { useActiveSection } from "../lib/useActiveSection";
import { homeSections } from "../lib/navigation";
import { useRevealAnimations } from "../lib/reveal";
import { useSceneReady } from "../lib/sceneReady";
import { identity, projects, projectsInOrder } from "../content";

import PageMeta from "../components/PageMeta";
import OverlayNav from "../components/chrome/OverlayNav";
import DotNav from "../components/chrome/DotNav";

import Home from "../components/sections/Home";
import About from "../components/sections/About";
import Profiles from "../components/sections/Profiles";
import Projects from "../components/sections/Projects";
import Achievements from "../components/sections/Achievements";
import Journey from "../components/sections/Journey";
import Contact from "../components/sections/Contact";
import ProjectLightbox from "../components/projects/ProjectLightbox";

/** The front page: who Shubh is across all three disciplines. */
export default function HomePage() {
  const ready = useSceneReady();
  const [navOpen, setNavOpen] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const activeId = useActiveSection(homeSections);
  useRevealAnimations(ready);

  /* Opened from the carousel, which is already on the right slide. */
  const openProject = useCallback((slug: string) => setOpenSlug(slug), []);

  /* Opened from an award card: move the carousel to that project first,
     so closing the lightbox leaves the visitor where they expect to be. */
  const openProjectFromAward = useCallback((slug: string) => {
    const index = projectsInOrder.findIndex((p) => p.slug === slug);
    if (index < 0) return;

    setProjectIndex(index);
    setOpenSlug(slug);
  }, []);

  const openProjectData = openSlug
    ? projects.find((p) => p.slug === openSlug) ?? null
    : null;

  return (
    <>
      <PageMeta
        title={`${identity.name} | ${identity.role}`}
        description={identity.description}
        path="/"
      />

      <DotNav items={homeSections} activeId={activeId} />
      <OverlayNav
        items={homeSections}
        open={navOpen}
        onToggle={() => setNavOpen((o) => !o)}
        onClose={() => setNavOpen(false)}
        activeId={activeId}
      />

      <main id="main">
        <Home ready={ready} />
        <About />
        <Profiles />
        <Projects
          index={projectIndex}
          onIndexChange={setProjectIndex}
          onOpen={openProject}
        />
        <Achievements onOpenProject={openProjectFromAward} />
        <Journey />
        <Contact />
      </main>

      {openProjectData ? (
        <ProjectLightbox
          project={openProjectData}
          onClose={() => setOpenSlug(null)}
        />
      ) : null}
    </>
  );
}
