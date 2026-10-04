import { useState } from "react";

/* Five briefing pages, matching the reference's five tutorial clips.
   Each page shows its clip when the file exists at the listed path and
   silently falls back to the written instructions when it does not. */

type Page = {
  id: string;
  title: string;
  body: string;
  video: string;
  keys?: Array<{ key: string; label: string }>;
};

const PAGES: Page[] = [
  {
    id: "cockpit",
    title: "Cockpit",
    body: "You are looking out of the canopy. The ship holds forward thrust on its own — your job is where it points, not whether it moves.",
    video: "/videos/GameAssets/CockpitTutorial.mp4",
  },
  {
    id: "movement",
    title: "Movement",
    body: "Steer with the mouse once you click to capture the pointer, or fly on the keyboard alone. Roll to line up a shot; the ship levels itself when you let go.",
    video: "/videos/GameAssets/MovementTutorial.mp4",
    keys: [
      { key: "W A S D", label: "Pitch / yaw" },
      { key: "Q E", label: "Roll" },
      { key: "Mouse", label: "Aim" },
    ],
  },
  {
    id: "hud",
    title: "HUD",
    body: "Hull, shield and boost sit top-left; score and level top-right. The radar bottom-right is top-down and relative to your nose. Shields absorb damage first and recharge automatically once you break contact.",
    video: "/videos/GameAssets/HUDTutorialT.mp4",
  },
  {
    id: "hyperspeed",
    title: "Hyperspeed",
    body: "Burn boost to close distance or break away. It drains fast and refills whenever you are off the throttle.",
    video: "/videos/GameAssets/HyperspeedTutorial.mp4",
    keys: [{ key: "Shift", label: "Hyperspeed" }],
  },
  {
    id: "objectives",
    title: "Objectives",
    body: "Hold an enemy inside the reticule to lock — the reticule changes when you have one. Destroy enough of them to level up; every level brings more ships, faster, hitting harder.",
    video: "/videos/GameAssets/ObjectivesTutorial.mp4",
    keys: [{ key: "Space", label: "Fire" }],
  },
];

type Props = {
  onStart: () => void;
  onExit: () => void;
};

export default function Tutorial({ onStart, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [clipOk, setClipOk] = useState(true);
  const page = PAGES[index];
  const last = index === PAGES.length - 1;

  const go = (delta: number) => {
    setClipOk(true);
    setIndex((i) => Math.min(PAGES.length - 1, Math.max(0, i + delta)));
  };

  return (
    <div className="game-overlay">
      <div className="game-panel">
        {clipOk ? (
          <video
            key={page.video}
            className="game-tutorial-clip"
            src={page.video}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setClipOk(false)}
          />
        ) : null}

        <h2>{page.title}</h2>
        <p>{page.body}</p>

        {page.keys?.length ? (
          <div className="game-keys">
            {page.keys.map((k) => (
              <div className="game-key" key={k.key}>
                <kbd>{k.key}</kbd>
                {k.label}
              </div>
            ))}
          </div>
        ) : null}

        <div className="game-actions">
          <button
            type="button"
            className="game-btn game-btn--ghost"
            onClick={() => (index === 0 ? onExit() : go(-1))}
          >
            {index === 0 ? "Leave" : "Back"}
          </button>

          <button
            type="button"
            className="game-btn"
            onClick={() => (last ? onStart() : go(1))}
          >
            {last ? "Launch" : `Next · ${index + 2} / ${PAGES.length}`}
          </button>

          {!last ? (
            <button type="button" className="game-btn game-btn--ghost" onClick={onStart}>
              Skip
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
