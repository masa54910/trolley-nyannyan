import { GameStatus } from "@/types/game";

type GameOverModalProps = {
  status: Extract<GameStatus, "gameOver" | "cleared">;
  score: number;
  onRetry: () => void;
};

export function GameOverModal({ status, score, onRetry }: GameOverModalProps) {
  const cleared = status === "cleared";

  return (
    <div className="resultOverlay" role="presentation">
      <section className={`resultPanel ${cleared ? "resultPanelClear" : ""}`} role="dialog" aria-modal="true">
        <div className="resultCat" aria-hidden="true">
          <span className="resultCatFace">{cleared ? "＾" : "!"}</span>
        </div>
        <h2>{cleared ? "クリア" : "ゲームオーバー"}</h2>
        <p>{cleared ? "光るゴール地点に到達しました。" : "レールの接続が切れてしまいました。"}</p>
        <strong>{score.toLocaleString("ja-JP")} pt</strong>
        <button className="retryButton" onClick={onRetry} type="button">
          リトライ
        </button>
      </section>
    </div>
  );
}
