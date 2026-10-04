export type GameStatus = "briefing" | "playing" | "paused" | "over";

export type RadarBlip = {
  /** -1 → 1 across the radar disc. */
  x: number;
  y: number;
  locked: boolean;
};

export type GameState = {
  status: GameStatus;
  hull: number;
  maxHull: number;
  shield: number;
  maxShield: number;
  boost: number;
  score: number;
  level: number;
  kills: number;
  killsToNext: number;
  /** Distance in metres to the locked target, or null when nothing is held. */
  targetDistance: number | null;
  locked: boolean;
  enemiesAlive: number;
};

export const initialState: GameState = {
  status: "briefing",
  hull: 100,
  maxHull: 100,
  shield: 100,
  maxShield: 100,
  boost: 1,
  score: 0,
  level: 1,
  kills: 0,
  killsToNext: 4,
  targetDistance: null,
  locked: false,
  enemiesAlive: 0,
};
