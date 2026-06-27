import { PointerEvent } from "react";
import { Tile as TileModel } from "@/types/game";
import { TurnTable } from "./TurnTable";

type TileProps = {
  tile: TileModel;
  isCurrent: boolean;
  activeBonus: boolean;
  disabled: boolean;
  onPointerDown: (index: number, event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (index: number, event: PointerEvent<HTMLButtonElement>) => void;
  index: number;
};

const tileNames: Record<TileModel["kind"], string> = {
  straight: "直線",
  leftCurve: "左カーブ",
  rightCurve: "右カーブ",
  sCurve: "S字カーブ",
  cross: "クロス",
  empty: "空白",
};

export function Tile({
  tile,
  isCurrent,
  activeBonus,
  disabled,
  onPointerDown,
  onPointerUp,
  index,
}: TileProps) {
  const isEmpty = tile.kind === "empty";
  const colorClass = tile.color ? `tileBase${tile.color}` : "";

  return (
    <button
      type="button"
      className={[
        "tileButton",
        isEmpty ? "tileButtonEmpty" : "",
        isCurrent ? "tileButtonCurrent" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || isEmpty}
      aria-label={`${tileNames[tile.kind]}パネル`}
      onPointerDown={(event) => onPointerDown(index, event)}
      onPointerUp={(event) => onPointerUp(index, event)}
    >
      {isEmpty ? (
        <span className="emptyWell" />
      ) : (
        <span
          className={[
            "tileBase",
            colorClass,
            tile.bonus ? "tileBonus" : "",
            tile.goal ? "tileGoal" : "",
            tile.start ? "tileStart" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {tile.goal ? <span className="goalMarker" /> : null}
          {tile.start ? <span className="startMarker" /> : null}
          <TurnTable tile={tile} activeBonus={activeBonus} />
        </span>
      )}
    </button>
  );
}
