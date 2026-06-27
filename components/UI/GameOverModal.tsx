import { GameStatus } from "@/types/game";

type GameOverModalProps = {
  status: Extract<GameStatus, "gameOver" | "cleared">;
  score: number;
  onRetry: () => void;
  onHome: () => void;
};

export function GameOverModal({ status, score, onRetry, onHome }: GameOverModalProps) {
  const cleared = status === "cleared";

  return (
    <div className="resultOverlay" role="presentation">
      <section
        className={`resultPanel ${cleared ? "resultPanelClear" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="resultCat" aria-hidden="true">
          <span className="resultCatFace">{cleared ? "♪" : "!"}</span>
        </div>
        <h2>{cleared ? "ステージクリア！" : "ゲームオーバー"}</h2>
        <p>{cleared ? "ゴールに到達しました" : "レールがつながっていません"}</p>
        <strong>{score.toLocaleString("ja-JP")} pt</strong>
        <div className="resultActions">
          <button className="retryButton" onClick={onRetry} type="button">
            リトライ
          </button>
          {cleared ? (
            <button className="ghostButton" onClick={onHome} type="button">
              ホーム
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
