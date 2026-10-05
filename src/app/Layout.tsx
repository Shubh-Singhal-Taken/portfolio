import { useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";

import { useThreeScene } from "./three/useThreeScene";
import { refreshScroll } from "./lib/scroll";
import { lockScroll } from "./lib/scrollLock";
import { SceneReadyContext } from "./lib/sceneReady";

import LoadingScreen from "./components/chrome/LoadingScreen";
import Footer from "./components/sections/Footer";

/* The shell every page shares: the WebGL scene, the loader and the
   footer. It stays mounted across route changes, so moving between the
   front page and a lens never rebuilds the 3D scene. */

export default function Layout() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const { pathname } = useLocation();

  const canvasRef = useThreeScene({
    onProgress: setProgress,
    onReady: () => setReady(true),
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

      <div className="shell">
        <Outlet />
        <Footer />
      </div>

      <ScrollRestoration />
    </SceneReadyContext.Provider>
  );
}
