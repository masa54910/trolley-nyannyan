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

const guideCards = [
  {
    title: "レールをつなごう",
    body: "ターンテーブルを回して、先の線路をつないでいこう。",
    icon: "rail",
  },
  {
    title: "猫のトロッコが走る",
    body: "スタートすると、猫のトロッコがゆっくり進みます。",
    icon: "cart",
  },
  {
    title: "つながらないとゲームオーバー",
    body: "レールが切れたり、空白マスへ進むと失敗です。",
    icon: "warning",
  },
  {
    title: "ゴールを目指そう",
    body: "光る星パネルまで導けばステージクリアです。",
    icon: "goal",
  },
];

export function HomeScreen({ onStart, onOpenTutorial, onOpenSettings }: HomeScreenProps) {
  return (
    <section className="homeScreen">
      <div className="homeStars" aria-hidden="true" />
      <span className="shootingStar shootingStarOne" aria-hidden="true" />
      <span className="shootingStar shootingStarTwo" aria-hidden="true" />
      <span className="distantPlanet distantPlanetOne" aria-hidden="true" />
      <span className="distantPlanet distantPlanetTwo" aria-hidden="true" />
      <span className="asteroid asteroidOne" aria-hidden="true" />
      <span className="asteroid asteroidTwo" aria-hidden="true" />

      <header className="homeTopBar">
        <div className="miniBrand" aria-label="トロッコにゃんにゃん">
          <span className="miniCatIcon" aria-hidden="true" />
          <span>
            <strong>トロッコにゃんにゃん</strong>
            <small>TROLLEY NYANNYAN</small>
          </span>
        </div>
        <div className="homeTopActions">
          <button className="roundIconButton glassIconButton" onClick={onOpenTutorial} type="button">
            ?
            <span>遊び方</span>
          </button>
          <button className="roundIconButton glassIconButton" onClick={onOpenSettings} type="button">
            ⚙
            <span>設定</span>
          </button>
        </div>
      </header>

      <div className="homeHero">
        <div className="homeCopy">
          <p className="homeEyebrow">猫のトロッコを導くパズルゲーム</p>
          <h1 className="gameLogo">
            <span className="logoCatBadge" aria-hidden="true" />
            <span className="logoLine">トロッコ</span>
            <span className="logoLine">にゃんにゃん</span>
          </h1>
          <p className="homeLead">
            小さな惑星で、<span>猫のトロッコ</span>を導こう。
          </p>
          <div className="homeActions">
            <form
              action="/"
              className="homeStartForm"
              method="get"
              onSubmit={(event) => {
                event.preventDefault();
                onStart();
              }}
            >
              <input name="screen" type="hidden" value="game" />
              <button className="primaryButton homePrimaryButton" type="submit">
                <span className="playIcon" aria-hidden="true" />
                ゲームを始める
              </button>
            </form>
            <button className="secondaryButton glassButton" onClick={onOpenTutorial} type="button">
              <span className="bookIcon" aria-hidden="true" />
              遊び方
            </button>
            <button className="secondaryButton glassButton" onClick={onOpenSettings} type="button">
              <span className="gearIcon" aria-hidden="true" />
              設定
            </button>
          </div>
        </div>

        <div className="homeVisual" aria-label="惑星とレールパネルのメインビジュアル">
          <div className="homePlanet">
            <span className="planetGlow" />
            <span className="planetRim" />
            <span className="homeGoalCallout">ゴールを目指そう！</span>
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

      <div className="homeGuideGrid" aria-label="ゲーム説明">
        {guideCards.map((card) => (
          <article className="guideCard" key={card.title}>
            <span className={`guideIcon guideIcon-${card.icon}`} aria-hidden="true" />
            <div>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
