import { BOARD_SIZE, Rotation, Stage, Tile, TileColor, TileKind } from "@/types/game";

type TileOptions = Pick<Tile, "bonus" | "goal" | "start">;

function panel(
  row: number,
  col: number,
  kind: Exclude<TileKind, "empty">,
  rotation: Rotation,
  color: TileColor,
  options: TileOptions = {}
): Tile {
  return {
    id: `tile-${row}-${col}-${kind}`,
    kind,
    rotation,
    color,
    ...options,
  };
}

function empty(row: number, col: number): Tile {
  return {
    id: `empty-${row}-${col}`,
    kind: "empty",
    rotation: 0,
  };
}

export class StageManager {
  static createInitialStage(): Stage {
    const tiles: Tile[] = [
      panel(0, 0, "rightCurve", 90, "green"),
      empty(0, 1),
      panel(0, 2, "sCurve", 270, "blue"),
      panel(0, 3, "straight", 90, "yellow"),
      panel(0, 4, "rightCurve", 180, "green"),
      panel(0, 5, "cross", 0, "rose"),
      panel(0, 6, "straight", 0, "yellow", { goal: true }),

      panel(1, 0, "straight", 0, "blue"),
      panel(1, 1, "sCurve", 90, "yellow"),
      panel(1, 2, "rightCurve", 0, "rose"),
      empty(1, 3),
      panel(1, 4, "cross", 90, "green"),
      panel(1, 5, "rightCurve", 180, "blue"),
      panel(1, 6, "straight", 0, "green"),

      panel(2, 0, "leftCurve", 90, "yellow"),
      panel(2, 1, "cross", 0, "green"),
      panel(2, 2, "rightCurve", 270, "blue"),
      panel(2, 3, "sCurve", 0, "rose"),
      panel(2, 4, "leftCurve", 180, "blue", { bonus: true }),
      panel(2, 5, "straight", 90, "yellow", { bonus: true }),
      panel(2, 6, "leftCurve", 0, "green"),

      empty(3, 0),
      panel(3, 1, "straight", 90, "rose"),
      panel(3, 2, "cross", 0, "yellow"),
      panel(3, 3, "rightCurve", 90, "blue"),
      panel(3, 4, "straight", 0, "green"),
      panel(3, 5, "sCurve", 180, "yellow"),
      empty(3, 6),

      panel(4, 0, "sCurve", 90, "blue"),
      panel(4, 1, "rightCurve", 180, "green"),
      panel(4, 2, "leftCurve", 180, "yellow"),
      panel(4, 3, "straight", 90, "rose", { bonus: true }),
      panel(4, 4, "leftCurve", 0, "blue"),
      empty(4, 5),
      panel(4, 6, "cross", 90, "yellow"),

      panel(5, 0, "rightCurve", 0, "green"),
      panel(5, 1, "sCurve", 270, "yellow"),
      panel(5, 2, "straight", 0, "green"),
      panel(5, 3, "cross", 0, "blue"),
      panel(5, 4, "rightCurve", 270, "rose"),
      empty(5, 5),
      panel(5, 6, "leftCurve", 180, "blue"),

      panel(6, 0, "straight", 90, "blue", { start: true }),
      panel(6, 1, "straight", 90, "yellow"),
      panel(6, 2, "leftCurve", 0, "rose"),
      empty(6, 3),
      panel(6, 4, "sCurve", 0, "green"),
      panel(6, 5, "straight", 0, "blue"),
      panel(6, 6, "rightCurve", 90, "yellow"),
    ];

    return {
      id: "planet-01",
      name: "ステージ 1 / 星くずレール",
      size: BOARD_SIZE,
      timeLimit: 90,
      targetScore: 250,
      tiles,
      start: {
        position: { row: 6, col: 0 },
        direction: "right",
        mood: "calm",
      },
    };
  }

  static resetStage(): Stage {
    return StageManager.createInitialStage();
  }
}
