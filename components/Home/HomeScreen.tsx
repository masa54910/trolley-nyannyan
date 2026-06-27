type HomeScreenProps = {
  onStart: () => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
};

const previewTiles = [
  "blue straight",
  "yellow curve",
  "green s",
  "empty",
  "rose cross",
  "green curve",
  "blue s",
  "yellow straight",
  "green cross",
  "empty",
  "yellow s",
  "rose straight",
  "blue curve",
  "green straight",
  "yellow goal",
];

export function HomeScreen({ onStart, onOpenTutorial, onOpenSettings }: HomeScreenProps) {
  return (
    <section className="homeScreen">
      <div className="homeStars" aria-hidden="true" />
      <div className="homeHero">
        <div className="homeCopy">
          <p className="homeEyebrow">planet rail puzzle prototype</p>
          <h1>トロッコにゃんにゃん</h1>
          <p className="homeLead">小さな惑星で、猫のトロッコを導こう。</p>
          <div className="homeActions">
            <button className="primaryButton" onClick={onStart} type="button">
              ゲームを始める
            </button>
            <button className="secondaryButton" onClick={onOpenTutorial} type="button">
              遊び方
            </button>
            <button className="secondaryButton" onClick={onOpenSettings} type="button">
              設定
            </button>
          </div>
        </div>

        <div className="homeVisual" aria-label="惑星とレールパネルのメインビジュアル">
          <div className="homePlanet">
            <span className="planetGlow" />
            <span className="planetRim" />
            <div className="homePreviewBoard">
              {previewTiles.map((tile, index) => (
                <span className={`previewTile ${tile}`} key={`${tile}-${index}`}>
                  {tile.includes("empty") ? null : <span className="previewTurntable" />}
                </span>
              ))}
            </div>
            <div className="homeCart" aria-hidden="true">
              <span className="homeCat" />
              <span className="homeCartBody" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
