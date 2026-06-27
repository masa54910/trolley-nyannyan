import { CSSProperties } from "react";
import { TURNTABLE_ROTATION_MS } from "@/components/Animation/gameMotion";
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
      style={
        {
          "--turntable-rotation": `${tile.rotation}deg`,
          "--turntable-duration": `${TURNTABLE_ROTATION_MS}ms`,
        } as CSSProperties
      }
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
