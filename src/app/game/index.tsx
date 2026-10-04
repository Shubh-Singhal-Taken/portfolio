import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { GameEngine } from "./engine";
import { initialState, type GameState, type RadarBlip } from "./types";
import Hud from "./Hud";
import Tutorial from "./Tutorial";
import { lockScroll } from "../lib/scrollLock";

type Props = { onExit: () => void };

export default function Game({ onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [state, setState] = useState<GameState>(initialState);
  const [blips, setBlips] = useState<RadarBlip[]>([]);
  const [briefing, setBriefing] = useState(true);

  // Hold the portfolio still underneath and restore it on the way out.
  useEffect(() => {
    const scrollY = window.scrollY;
    const release = lockScroll();

    return () => {
      release();
      window.scrollTo({ top: scrollY, behavior: "auto" });
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let engine: GameEngine;
    try {
      engine = new GameEngine(canvas, {
        onState: setState,
        onBlips: setBlips,
      });
    } catch {
      // No WebGL — leave rather than present a black rectangle.
      onExit();
      return;
    }

    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [onExit]);

  // Escape pauses; from a pause or the briefing it exits.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();

      const engine = engineRef.current;
      if (!engine) return;

      if (briefing) {
        onExit();
      } else if (state.status === "playing") {
        engine.pause();
      } else if (state.status === "paused") {
        engine.resume();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [briefing, state.status, onExit]);

  const launch = useCallback(() => {
    setBriefing(false);
    engineRef.current?.start();
  }, []);

  const showHud = !briefing && state.status !== "over";

  return (
    <div className="game-root">
      <canvas id="game-canvas" ref={canvasRef} />

      {showHud ? <Hud state={state} blips={blips} /> : null}

      <button type="button" className="back-button" onClick={onExit}>
        <ArrowLeft size={13} />
        Back to portfolio
      </button>

      {briefing ? <Tutorial onStart={launch} onExit={onExit} /> : null}

      {state.status === "paused" ? (
        <div className="game-overlay">
          <div className="game-panel">
            <h2>Paused</h2>
            <p>Click the canvas to recapture the pointer when you resume.</p>
            <div className="game-actions">
              <button
                type="button"
                className="game-btn"
                onClick={() => engineRef.current?.resume()}
              >
                Resume
              </button>
              <button
                type="button"
                className="game-btn game-btn--ghost"
                onClick={onExit}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {state.status === "over" ? (
        <div className="game-overlay">
          <div className="game-panel">
            <h2>Hull breached</h2>
            <p>
              Final score {state.score.toLocaleString()} · reached level{" "}
              {state.level}.
            </p>
            <div className="game-actions">
              <button type="button" className="game-btn" onClick={launch}>
                Fly again
              </button>
              <button
                type="button"
                className="game-btn game-btn--ghost"
                onClick={onExit}
              >
                Back to portfolio
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
