import { CSSProperties, PointerEvent, useRef } from "react";
import { CameraFollow } from "@/components/Camera/CameraFollow";
import { Cart } from "@/components/Cart/Cart";
import { GameManager } from "@/components/Game/GameManager";
import { CartState, Direction, GameStatus, ScorePopup, Stage } from "@/types/game";
import { Tile } from "./Tile";

type BoardProps = {
  stage: Stage;
  cart: CartState;
  disabled: boolean;
  status: GameStatus;
  activeBonusTileIds: string[];
  scorePopups: ScorePopup[];
  onStart: () => void;
  onRotateTile: (index: number) => void;
  onSlideTile: (index: number, direction: Direction) => void;
};

type DragStart = {
  index: number;
  x: number;
  y: number;
};

function directionFromDrag(dx: number, dy: number): Direction {
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }

  return dy > 0 ? "down" : "up";
}

export function Board({
  stage,
  cart,
  disabled,
  status,
  activeBonusTileIds,
  scorePopups,
  onStart,
  onRotateTile,
  onSlideTile,
}: BoardProps) {
  const dragStartRef = useRef<DragStart | null>(null);
  const currentCartIndex = GameManager.positionToIndex(cart.position, stage.size);
  const cartStartStyle = {
    left: `${((cart.position.col + 0.72) / stage.size) * 100}%`,
    top: `${((cart.position.row + 0.5) / stage.size) * 100}%`,
  } as CSSProperties;

  function handlePointerDown(index: number, event: PointerEvent<HTMLButtonElement>) {
    dragStartRef.current = {
      index,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(index: number, event: PointerEvent<HTMLButtonElement>) {
    const dragStart = dragStartRef.current;
    dragStartRef.current = null;

    if (!dragStart || dragStart.index !== index || disabled) {
      return;
    }

    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 12) {
      onRotateTile(index);
      return;
    }

    onSlideTile(index, directionFromDrag(dx, dy));
  }

  return (
    <CameraFollow cart={cart} boardSize={stage.size}>
      <div className="boardShell">
        <div
          className="boardGrid"
          style={{
            gridTemplateColumns: `repeat(${stage.size}, 1fr)`,
          }}
        >
          {stage.tiles.map((tile, index) => (
            <Tile
              activeBonus={activeBonusTileIds.includes(tile.id)}
              disabled={disabled}
              index={index}
              isCurrent={index === currentCartIndex}
              key={tile.id}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              tile={tile}
            />
          ))}

          {scorePopups.map((popup) => (
            <span
              className={`scorePopup ${popup.bonus > 0 ? "scorePopupBonus" : ""}`}
              key={popup.id}
              style={{
                left: `${((popup.position.col + 0.5) / stage.size) * 100}%`,
                top: `${((popup.position.row + 0.5) / stage.size) * 100}%`,
              }}
            >
              +{popup.total}
            </span>
          ))}

          <Cart cart={cart} boardSize={stage.size} />

          {status === "ready" ? (
            <button
              className="cartStartButton"
              onClick={onStart}
              style={cartStartStyle}
              type="button"
            >
              スタート
            </button>
          ) : null}
        </div>
      </div>
    </CameraFollow>
  );
}
