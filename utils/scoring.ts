import { ScoreBreakdown, Tile, TileKind } from "@/types/game";

export const TILE_POINTS: Record<Exclude<TileKind, "empty">, number> = {
  straight: 10,
  leftCurve: 20,
  rightCurve: 20,
  sCurve: 40,
  cross: 30,
};

export const BONUS_POINTS = 70;

export function getScoreBreakdown(tile: Tile): ScoreBreakdown {
  if (tile.kind === "empty") {
    return { base: 0, bonus: 0, total: 0 };
  }

  const base = TILE_POINTS[tile.kind];
  const bonus = tile.bonus ? BONUS_POINTS : 0;

  return {
    base,
    bonus,
    total: base + bonus,
  };
}
