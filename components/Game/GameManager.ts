import {
  AdvanceResult,
  BOARD_SIZE,
  CartState,
  Direction,
  Position,
  Rotation,
  Stage,
  Tile,
} from "@/types/game";
import {
  canEnterTile,
  directionDelta,
  getExitDirection,
  oppositeDirection,
} from "@/utils/railConnections";
import { ScoreManager } from "./ScoreManager";

function nextRotation(rotation: Rotation): Rotation {
  return ((rotation + 90) % 360) as Rotation;
}

export class GameManager {
  static positionToIndex(position: Position, size = BOARD_SIZE): number {
    return position.row * size + position.col;
  }

  static indexToPosition(index: number, size = BOARD_SIZE): Position {
    return {
      row: Math.floor(index / size),
      col: index % size,
    };
  }

  static isInside(position: Position, size = BOARD_SIZE): boolean {
    return (
      position.row >= 0 &&
      position.row < size &&
      position.col >= 0 &&
      position.col < size
    );
  }

  static movePosition(position: Position, direction: Direction): Position {
    const delta = directionDelta[direction];

    return {
      row: position.row + delta.row,
      col: position.col + delta.col,
    };
  }

  static rotateTile(tiles: Tile[], index: number): Tile[] {
    return tiles.map((tile, tileIndex) => {
      if (tileIndex !== index || tile.kind === "empty") {
        return tile;
      }

      return {
        ...tile,
        rotation: nextRotation(tile.rotation),
      };
    });
  }

  static slideTile(
    tiles: Tile[],
    fromIndex: number,
    direction: Direction,
    size = BOARD_SIZE
  ): { moved: boolean; tiles: Tile[] } {
    const fromTile = tiles[fromIndex];

    if (!fromTile || fromTile.kind === "empty") {
      return { moved: false, tiles };
    }

    const fromPosition = GameManager.indexToPosition(fromIndex, size);
    const targetPosition = GameManager.movePosition(fromPosition, direction);

    if (!GameManager.isInside(targetPosition, size)) {
      return { moved: false, tiles };
    }

    const targetIndex = GameManager.positionToIndex(targetPosition, size);
    const targetTile = tiles[targetIndex];

    if (!targetTile || targetTile.kind !== "empty") {
      return { moved: false, tiles };
    }

    const nextTiles = [...tiles];
    nextTiles[targetIndex] = fromTile;
    nextTiles[fromIndex] = targetTile;

    return { moved: true, tiles: nextTiles };
  }

  static advanceCart(stage: Stage, cart: CartState): AdvanceResult {
    const currentIndex = GameManager.positionToIndex(cart.position, stage.size);
    const currentTile = stage.tiles[currentIndex];

    if (!currentTile || currentTile.kind === "empty") {
      return {
        type: "fail",
        reason: "missing-current-tile",
        at: cart.position,
      };
    }

    const entry = oppositeDirection[cart.direction];

    if (!canEnterTile(currentTile, entry)) {
      return {
        type: "fail",
        reason: "current-entry-mismatch",
        at: cart.position,
      };
    }

    const exit = getExitDirection(currentTile, entry);

    if (!exit) {
      return {
        type: "fail",
        reason: "current-exit-missing",
        at: cart.position,
      };
    }

    const nextPosition = GameManager.movePosition(cart.position, exit);

    if (!GameManager.isInside(nextPosition, stage.size)) {
      return {
        type: "fail",
        reason: "out-of-board",
        at: nextPosition,
      };
    }

    const nextIndex = GameManager.positionToIndex(nextPosition, stage.size);
    const nextTile = stage.tiles[nextIndex];

    if (!nextTile || nextTile.kind === "empty") {
      return {
        type: "fail",
        reason: "missing-next-tile",
        at: nextPosition,
      };
    }

    if (!canEnterTile(nextTile, oppositeDirection[exit])) {
      return {
        type: "fail",
        reason: "next-entry-mismatch",
        at: nextPosition,
      };
    }

    return {
      type: "move",
      cart: {
        position: nextPosition,
        direction: exit,
        mood: nextTile.goal ? "happy" : "calm",
      },
      passedIndex: currentIndex,
      nextIndex,
      passedTile: currentTile,
      reachedGoal: Boolean(nextTile.goal),
      score: ScoreManager.getTileScore(currentTile),
    };
  }
}
