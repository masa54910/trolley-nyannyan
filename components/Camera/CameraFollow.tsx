import { CSSProperties, ReactNode } from "react";
import { CartState } from "@/types/game";

type CameraFollowProps = {
  cart: CartState;
  boardSize: number;
  children: ReactNode;
};

export function CameraFollow({ cart, boardSize, children }: CameraFollowProps) {
  const center = (boardSize - 1) / 2;
  const leadByDirection = {
    up: { x: 0, y: -0.5 },
    right: { x: 0.5, y: 0 },
    down: { x: 0, y: 0.5 },
    left: { x: -0.5, y: 0 },
  }[cart.direction];

  const focusX = cart.position.col - center + leadByDirection.x;
  const focusY = cart.position.row - center + leadByDirection.y;

  return (
    <div className="cameraViewport">
      <div
        className="cameraLayer"
        style={
          {
            "--camera-shift-x": `${Math.max(-28, Math.min(28, focusX * -9))}px`,
            "--camera-shift-y": `${Math.max(-26, Math.min(26, focusY * -8))}px`,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
