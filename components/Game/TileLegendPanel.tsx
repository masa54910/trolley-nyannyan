import { CSSProperties } from "react";
import { Rail } from "@/components/Board/Rail";
import { Rotation, TileColor, TileKind } from "@/types/game";

type LegendItem = {
  kind: Exclude<TileKind, "empty">;
  rotation: Rotation;
  color: TileColor;
  name: string;
  description: string;
};

const legendItems: LegendItem[] = [
  {
    kind: "straight",
    rotation: 0,
    color: "blue",
    name: "直線",
    description: "まっすぐ進む",
  },
  {
    kind: "leftCurve",
    rotation: 0,
    color: "yellow",
    name: "左カーブ",
    description: "左に曲がる",
  },
  {
    kind: "rightCurve",
    rotation: 0,
    color: "green",
    name: "右カーブ",
    description: "右に曲がる",
  },
  {
    kind: "sCurve",
    rotation: 0,
    color: "blue",
    name: "S字カーブ",
    description: "進行方向を反対側に変える",
  },
  {
    kind: "cross",
    rotation: 0,
    color: "yellow",
    name: "クロス",
    description: "進行方向をそのまま直進",
  },
];

export function TileLegendPanel() {
  return (
    <aside className="tileLegendPanel" aria-label="ターン式テーブルの種類">
      <h2>ターン式テーブルの種類</h2>
      <div className="tileLegendList">
        {legendItems.map((item) => (
          <article className="tileLegendItem" key={item.kind}>
            <span className={`legendTile tileBase${item.color}`} aria-hidden="true">
              <span
                className="legendTurnTable"
                style={{ "--turntable-rotation": `${item.rotation}deg` } as CSSProperties}
              >
                <Rail kind={item.kind} />
              </span>
            </span>
            <span className="tileLegendText">
              <strong>{item.name}</strong>
              <small>{item.description}</small>
            </span>
          </article>
        ))}
      </div>
    </aside>
  );
}
