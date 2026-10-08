import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";

import { useThreeScene } from "./three/useThreeScene";
import { useActiveSection } from "./lib/useActiveSection";
import { useRevealAnimations } from "./lib/reveal";
import { refreshScroll } from "./lib/scroll";
import { setAudioDucked } from "./lib/audio";
import {
  I18nContext,
  translate,
  type LocaleId,
  type StringKey,
} from "./lib/i18n";
import { projects } from "./data/portfolio";

import LoadingScreen from "./components/chrome/LoadingScreen";
import RingCursor from "./components/chrome/RingCursor";
import OverlayNav from "./components/chrome/OverlayNav";
import DotNav from "./components/chrome/DotNav";
import SoundBar from "./components/chrome/SoundBar";
import MusicCredits from "./components/chrome/MusicCredits";
import LangDropdown from "./components/chrome/LangDropdown";
import GameButton from "./components/chrome/GameButton";

import Home from "./components/sections/Home";
import About from "./components/sections/About";
import Capabilities from "./components/sections/Capabilities";
import Projects from "./components/sections/Projects";
import Achievements from "./components/sections/Achievements";
import Journey from "./components/sections/Journey";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import ProjectLightbox from "./components/projects/ProjectLightbox";

// The space-combat sim is a world of its own — never in the entry chunk.
const Game = lazy(() => import("./game"));

/** Minimum time the loader stays up, so the counter is readable. */
const LOADER_FLOOR_MS = 1400;


export default function App() {
  const [locale, setLocale] = useState<LocaleId>("en");
  const [progress, setProgress] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [floorElapsed, setFloorElapsed] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [cursorLabel, setCursorLabel] = useState(true);
  const [projectIndex, setProjectIndex] = useState(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [gameOpen, setGameOpen] = useState(false);

  const activeId = useActiveSection();

  const canvasRef = useThreeScene({
    onProgress: setProgress,
    onReady: () => setSceneReady(true),
  });

  const done = sceneReady && floorElapsed;

  useRevealAnimations(done);

  const i18n = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: StringKey) => translate(locale, key),
    }),
    [locale]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setFloorElapsed(true), LOADER_FLOOR_MS);
    return () => window.clearTimeout(timer);
  }, []);


  // Hold the page still behind the loader, then let it go and re-measure.
  useEffect(() => {
    document.body.classList.toggle("no-scroll", !done);
    if (done) refreshScroll();
  }, [done]);

  // The cursor's "click to enable sound" prompt retires after any click.
  useEffect(() => {
    if (!cursorLabel) return;

    const onClick = () => setCursorLabel(false);
    window.addEventListener("click", onClick, { once: true });
    return () => window.removeEventListener("click", onClick);
  }, [cursorLabel]);

  // Duck the ambient bed while the game holds the screen.
  useEffect(() => {
    setAudioDucked(gameOpen);
  }, [gameOpen]);

  /* Opened from the carousel — it is already on the right slide. */
  const openProject = useCallback((slug: string) => setOpenSlug(slug), []);

  /* Opened from an award card — move the carousel to that project first,
     so closing the lightbox leaves the user where they expect to be. */
  const openProjectFromAward = useCallback((slug: string) => {
    const ordered = [...projects].sort(
      (a, b) => Number(b.featured) - Number(a.featured)
    );
    const index = ordered.findIndex((p) => p.slug === slug);
    if (index < 0) return;

    setProjectIndex(index);
    setOpenSlug(slug);
  }, []);

  const openProjectData = openSlug
    ? projects.find((p) => p.slug === openSlug) ?? null
    : null;

  return (
    <I18nContext.Provider value={i18n}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <LoadingScreen progress={progress} done={done} />
      <Toaster position="top-right" theme="dark" richColors />

      <canvas id="main-content" ref={canvasRef} aria-hidden="true" />
      {/* The sound prompt only makes sense once the site is visible. */}
      <RingCursor showLabel={cursorLabel && done} />

      <SoundBar />
      <MusicCredits />
      <LangDropdown />
      <DotNav activeId={activeId} />
      <OverlayNav
        open={navOpen}
        onToggle={() => setNavOpen((o) => !o)}
        onClose={() => setNavOpen(false)}
        activeId={activeId}
      />
      <GameButton onLaunch={() => setGameOpen(true)} />

      <div className="shell">
        <main id="main">
          <Home ready={done} />
          <About />
          <Capabilities />
          <Projects
            index={projectIndex}
            onIndexChange={setProjectIndex}
            onOpen={openProject}
          />
          <Achievements onOpenProject={openProjectFromAward} />
          <Journey />
          <Contact />
        </main>
        <Footer />
      </div>

      {openProjectData ? (
        <ProjectLightbox
          project={openProjectData}
          onClose={() => setOpenSlug(null)}
        />
      ) : null}

      {gameOpen ? (
        <Suspense fallback={null}>
          <Game onExit={() => setGameOpen(false)} />
        </Suspense>
      ) : null}
    </I18nContext.Provider>
  );
}
