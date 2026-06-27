import { GameStatus } from "@/types/game";

type StartButtonProps = {
  status: GameStatus;
  onStart: () => void;
};

export function StartButton({ status, onStart }: StartButtonProps) {
  const isReady = status === "ready";

  return (
    <button
      className="startButton"
      disabled={!isReady}
      onClick={onStart}
      type="button"
    >
      {isReady ? "スタート" : status === "running" ? "進行中" : "終了"}
    </button>
  );
}
