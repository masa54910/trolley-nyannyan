export const BOARD_SIZE = 7;

export const DIRECTIONS = ["up", "right", "down", "left"] as const;

export type Direction = (typeof DIRECTIONS)[number];
export type Rotation = 0 | 90 | 180 | 270;

export type TileKind =
  | "straight"
  | "leftCurve"
  | "rightCurve"
  | "sCurve"
  | "cross"
  | "empty";

export type TileColor = "blue" | "green" | "yellow" | "rose";

export type Position = {
  row: number;
  col: number;
};

export type Tile = {
  id: string;
  kind: TileKind;
  rotation: Rotation;
  color?: TileColor;
  bonus?: boolean;
  goal?: boolean;
  start?: boolean;
};

export type RailPath = {
  from: Direction;
  to: Direction;
};

export type CatMood = "calm" | "startled" | "happy";

export type CartState = {
  position: Position;
  direction: Direction;
  mood: CatMood;
};

export type Stage = {
  id: string;
  name: string;
  size: number;
  timeLimit: number;
  targetScore: number;
  tiles: Tile[];
  start: CartState;
};

export type GameStatus = "ready" | "running" | "gameOver" | "cleared";

export type ScoreBreakdown = {
  base: number;
  bonus: number;
  total: number;
};

export type AdvanceFailureReason =
  | "missing-current-tile"
  | "current-entry-mismatch"
  | "current-exit-missing"
  | "out-of-board"
  | "missing-next-tile"
  | "next-entry-mismatch";

export type AdvanceResult =
  | {
      type: "move";
      cart: CartState;
      passedIndex: number;
      nextIndex: number;
      passedTile: Tile;
      reachedGoal: boolean;
      score: ScoreBreakdown;
    }
  | {
      type: "fail";
      reason: AdvanceFailureReason;
      at: Position;
    };

export type ScorePopup = {
  id: string;
  position: Position;
  total: number;
  bonus: number;
};
