import {
  DIRECTIONS,
  Direction,
  RailPath,
  Rotation,
  Tile,
  TileKind,
} from "@/types/game";

export const oppositeDirection: Record<Direction, Direction> = {
  up: "down",
  right: "left",
  down: "up",
  left: "right",
};

export const directionDelta: Record<Direction, { row: number; col: number }> = {
  up: { row: -1, col: 0 },
  right: { row: 0, col: 1 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
};

const baseRailPaths: Record<Exclude<TileKind, "empty">, RailPath[]> = {
  straight: [{ from: "up", to: "down" }],
  leftCurve: [{ from: "up", to: "left" }],
  rightCurve: [{ from: "up", to: "right" }],
  sCurve: [
    { from: "up", to: "right" },
    { from: "left", to: "down" },
  ],
  cross: [
    { from: "up", to: "down" },
    { from: "left", to: "right" },
  ],
};

export function rotateDirection(direction: Direction, rotation: Rotation): Direction {
  const currentIndex = DIRECTIONS.indexOf(direction);
  const steps = rotation / 90;

  return DIRECTIONS[(currentIndex + steps + DIRECTIONS.length) % DIRECTIONS.length];
}

export function getRailPaths(tile: Tile): RailPath[] {
  if (tile.kind === "empty") {
    return [];
  }

  return baseRailPaths[tile.kind].map((path) => ({
    from: rotateDirection(path.from, tile.rotation),
    to: rotateDirection(path.to, tile.rotation),
  }));
}

export function canEnterTile(tile: Tile, entry: Direction): boolean {
  return getRailPaths(tile).some((path) => path.from === entry || path.to === entry);
}

export function getExitDirection(tile: Tile, entry: Direction): Direction | null {
  const path = getRailPaths(tile).find(
    (candidate) => candidate.from === entry || candidate.to === entry
  );

  if (!path) {
    return null;
  }

  return path.from === entry ? path.to : path.from;
}

export function getTileConnections(tile: Tile): Direction[] {
  const connections = new Set<Direction>();

  for (const path of getRailPaths(tile)) {
    connections.add(path.from);
    connections.add(path.to);
  }

  return [...connections];
}
