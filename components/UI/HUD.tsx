import { GameStatus, Stage } from "@/types/game";
import { StartButton } from "./StartButton";

type HUDProps = {
  stage: Stage;
  remainingTime: number;
  score: number;
  status: GameStatus;
  onStart: () => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
};

export function HUD({
  stage,
  remainingTime,
  score,
  status,
  onStart,
  onOpenTutorial,
  onOpenSettings,
}: HUDProps) {
  return (
    <header className="hud">
      <div className="stagePlate">
        <span className="stageLabel">ステージ</span>
        <strong>{stage.name}</strong>
      </div>

      <div className="hudMetrics" aria-live="polite">
        <div className="hudMetric">
          <span className="hudIcon timerIcon" />
          <span>{remainingTime.toString().padStart(2, "0")}秒</span>
        </div>
        <div className="hudMetric">
          <small>スコア</small>
          <span>{score.toLocaleString("ja-JP")}</span>
        </div>
        <div className="hudMetric">
          <small>目標</small>
          <span>{stage.targetScore.toLocaleString("ja-JP")}</span>
        </div>
      </div>

      <div className="hudActions">
        <StartButton onStart={onStart} status={status} />
        <button className="roundIconButton" onClick={onOpenTutorial} type="button">
          ?
          <span>遊び方</span>
        </button>
        <button className="roundIconButton" onClick={onOpenSettings} type="button">
          ⚙
          <span>設定</span>
        </button>
      </div>
    </header>
  );
}
