import { identity } from "../../data/portfolio";

/** AI "boot" loading screen. Visibility is driven by the `done` prop;
 *  the fade-out and progress fill are handled in CSS. */
export default function LoadingScreen({ done }: { done: boolean }) {
  return (
    <div className={`loader ${done ? "loader--done" : ""}`} aria-hidden={done}>
      <p className="loader-mono">
        <span className="dim">&gt;</span> initializing neural interface
        <span className="loader-cursor">_</span>
      </p>
      <div className="loader-track">
        <div className="loader-fill" />
      </div>
      <p className="loader-name">{identity.name}</p>
    </div>
  );
}
