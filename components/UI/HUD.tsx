import { Stage } from "@/types/game";

type HUDProps = {
  stage: Stage;
  remainingTime: number;
  score: number;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function HUD({
  stage,
  remainingTime,
  score,
  onOpenTutorial,
  onOpenSettings,
}: HUDProps) {
  return (
    <>
      <section className="stageInfoPanel" aria-label="ステージ情報">
        <span className="stageLabel">ステージ 12</span>
        <strong>{stage.name}</strong>
      </section>

      <header className="hud" aria-label="ステージHUD">
        <div className="hudMetrics" aria-live="polite">
          <div className="hudMetric hudMetricTimer">
            <span className="hudIcon timerIcon" />
            <span>{formatTime(remainingTime)}</span>
          </div>
          <div className="hudDivider" aria-hidden="true" />
          <div className="hudMetric">
            <small>スコア</small>
            <span>{score.toLocaleString("ja-JP")}</span>
          </div>
          <div className="hudDivider" aria-hidden="true" />
          <div className="hudMetric">
            <small>目標スコア</small>
            <span>{stage.targetScore.toLocaleString("ja-JP")}</span>
          </div>
        </div>
      </header>

      <div className="hudActions" aria-label="補助ボタン">
        <button className="roundIconButton glassIconButton" onClick={onOpenTutorial} type="button">
          ?
          <span>遊び方</span>
        </button>
        <button className="roundIconButton glassIconButton" onClick={onOpenSettings} type="button">
          ⚙
          <span>設定</span>
        </button>
      </div>
    </>
  );
}
