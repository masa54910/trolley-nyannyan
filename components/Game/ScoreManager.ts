import { ScoreBreakdown, Tile } from "@/types/game";
import { getGoalScoreBreakdown, getScoreBreakdown } from "@/utils/scoring";

export class ScoreManager {
  static getTileScore(tile: Tile): ScoreBreakdown {
    return getScoreBreakdown(tile);
  }

  static getGoalScore(): ScoreBreakdown {
    return getGoalScoreBreakdown();
  }

  static addTileScore(currentScore: number, tile: Tile): number {
    return currentScore + ScoreManager.getTileScore(tile).total;
  }
}
