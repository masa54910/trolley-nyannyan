import { CSSProperties } from "react";
import { Tile } from "@/types/game";
import { Rail } from "./Rail";

type TurnTableProps = {
  tile: Tile;
  activeBonus: boolean;
};

export function TurnTable({ tile, activeBonus }: TurnTableProps) {
  if (tile.kind === "empty") {
    return null;
  }

  return (
    <div
      className={`turnTable ${activeBonus ? "turnTableActiveBonus" : ""}`}
      style={{ "--turntable-rotation": `${tile.rotation}deg` } as CSSProperties}
    >
      <span className="turnTableRim" />
      <span className="turnTablePin pinTop" />
      <span className="turnTablePin pinRight" />
      <span className="turnTablePin pinBottom" />
      <span className="turnTablePin pinLeft" />
      <Rail kind={tile.kind} />
    </div>
  );
}
