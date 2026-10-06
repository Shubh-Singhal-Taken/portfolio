import { Suspense, lazy, useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";

import { useThreeScene } from "./three/useThreeScene";
import { refreshScroll } from "./lib/scroll";
import { lockScroll } from "./lib/scrollLock";
import { SceneReadyContext } from "./lib/sceneReady";
import { LENSES, type Lens } from "./content";
import type { WorldId } from "./three/worlds";

import LoadingScreen from "./components/chrome/LoadingScreen";
import TopBar from "./components/chrome/TopBar";
import Footer from "./components/sections/Footer";

// The space-combat sim is a world of its own, never in the entry chunk.
const Game = lazy(() => import("./game"));

/* The shell every page shares: the WebGL scene, the loader and the
   footer. It stays mounted across route changes, so moving between the
   front page and a lens never rebuilds the 3D scene. */

export default function Layout() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const { pathname } = useLocation();

  // A profile page shows its own world; everything else the neutral sky.
  const segment = pathname.split("/")[1] ?? "";
  const world: WorldId = (LENSES as readonly string[]).includes(segment)
    ? (segment as Lens)
    : "neutral";

  const canvasRef = useThreeScene({
    onProgress: setProgress,
    onReady: () => setReady(true),
    world,
  });

  // Hold the page still behind the loader, then let it go and re-measure.
  useEffect(() => {
    if (ready) {
      refreshScroll();
      return;
    }
    return lockScroll();
  }, [ready]);

  // A new page has a new height; the camera's scroll mapping follows it.
  useEffect(() => {
    refreshScroll();
  }, [pathname]);

  return (
    <SceneReadyContext.Provider value={ready}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <LoadingScreen progress={progress} done={ready} />
      <canvas id="main-content" ref={canvasRef} aria-hidden="true" />
      <TopBar />

      <div className="shell">
        <Outlet />
        {/* The game is a front-page easter egg, launched from the footer */}
        <Footer onPlayGame={pathname === "/" ? () => setGameOpen(true) : undefined} />
      </div>

      {gameOpen ? (
        <Suspense fallback={null}>
          <Game onExit={() => setGameOpen(false)} />
        </Suspense>
      ) : null}

      <ScrollRestoration />
    </SceneReadyContext.Provider>
  );
}
