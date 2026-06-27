import { CSSProperties } from "react";
import { CartState, Direction } from "@/types/game";
import { Cat } from "./Cat";

type CartProps = {
  cart: CartState;
  boardSize: number;
};

const directionRotation: Record<Direction, number> = {
  up: -90,
  right: 0,
  down: 90,
  left: 180,
};

export function Cart({ cart, boardSize }: CartProps) {
  const style = {
    "--cart-x": `${((cart.position.col + 0.5) / boardSize) * 100}%`,
    "--cart-y": `${((cart.position.row + 0.5) / boardSize) * 100}%`,
    "--cart-rotation": `${directionRotation[cart.direction]}deg`,
  } as CSSProperties;

  return (
    <div className={`cart cartMood-${cart.mood}`} style={style} aria-hidden="true">
      <Cat mood={cart.mood} />
      <span className="cartBody">
        <span className="cartPanel" />
        <span className="cartLight" />
      </span>
      <span className="cartWheel cartWheelFront" />
      <span className="cartWheel cartWheelBack" />
    </div>
  );
}
