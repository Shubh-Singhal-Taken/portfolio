import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useActiveSection } from "../lib/useActiveSection";
import { homeSections } from "../lib/navigation";
import { useRevealAnimations } from "../lib/reveal";
import { useSceneReady } from "../lib/sceneReady";
import { identity } from "../content";

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

/** The front page: who Shubh is across all three disciplines. */
export default function HomePage() {
  const ready = useSceneReady();
  const [navOpen, setNavOpen] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);

  const activeId = useActiveSection(homeSections);
  useRevealAnimations(ready);

  const navigate = useNavigate();
  const openProject = useCallback(
    (slug: string) => navigate(`/projects/${slug}`),
    [navigate]
  );

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
        <Achievements />
        <Journey />
        <Contact />
      </main>
    </>
  );
}
