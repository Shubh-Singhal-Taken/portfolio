import type { CSSProperties } from "react";
import type { GameState, RadarBlip } from "./types";

type Props = {
  state: GameState;
  blips: RadarBlip[];
};

function Meter({
  value,
  max,
  variant,
}: {
  value: number;
  max: number;
  variant: "shield" | "hull";
}) {
  const fill = Math.max(0, Math.min(1, value / max));

  return (
    <div
      className={`hud-meter hud-meter--${variant}`}
      data-critical={variant === "hull" && fill < 0.3}
    >
      <div
        className="hud-meter__fill"
        style={{ "--fill": fill } as CSSProperties}
      />
    </div>
  );
}

export default function Hud({ state, blips }: Props) {
  return (
    <div className="game-hud" aria-hidden="true">
      <div className="hud-corner hud-corner--tl">
        <div className="hud-row">
          <span>Hull</span>
          <span>{Math.round(state.hull)}</span>
        </div>
        <Meter value={state.hull} max={state.maxHull} variant="hull" />

        <div className="hud-row">
          <span>Shield</span>
          <span>{Math.round(state.shield)}</span>
        </div>
        <Meter value={state.shield} max={state.maxShield} variant="shield" />

        <div className="hud-row">
          <span>Boost</span>
          <span>{Math.round(state.boost * 100)}%</span>
        </div>
      </div>

      <div className="hud-corner hud-corner--tr">
        <div className="hud-row">
          <span>Score</span>
          <span>{state.score.toLocaleString()}</span>
        </div>
        <div className="hud-row">
          <span>Level</span>
          <span>{state.level}</span>
        </div>
        <div className="hud-row">
          <span>Next</span>
          <span>
            {state.kills} / {state.killsToNext}
          </span>
        </div>
      </div>

      <div className="hud-corner hud-corner--bl">
        <div className="hud-row">
          <span>Target</span>
          <span>{state.locked ? "Locked" : "No target"}</span>
        </div>
        <div className="hud-row">
          <span>Distance</span>
          <span>
            {state.targetDistance !== null ? `${state.targetDistance} m` : "—"}
          </span>
        </div>
        <div className="hud-row">
          <span>Contacts</span>
          <span>{state.enemiesAlive}</span>
        </div>
      </div>

      {/* Reticule — square while searching, rotated cross once locked */}
      <svg
        className="hud-reticule"
        data-locked={state.locked}
        viewBox="0 0 56 56"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="28" cy="28" r="17" />
        <path d="M28 2v10M28 44v10M2 28h10M44 28h10" />
        {state.locked ? <circle cx="28" cy="28" r="3.5" fill="currentColor" /> : null}
      </svg>

      <div className="hud-radar">
        <span className="hud-radar__self" />
        {blips.map((blip, i) => (
          <span
            key={i}
            className="hud-radar__blip"
            data-locked={blip.locked}
            style={{
              left: `${50 + blip.x * 46}%`,
              top: `${50 - blip.y * 46}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
