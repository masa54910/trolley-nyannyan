import Image from "next/image";
import { SpaceDecor } from "@/components/Effects/SpaceDecor";

type HomeScreenProps = {
  onStart: () => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
};

const guideCards = [
  {
    title: "レールをつなごう",
    body: "ターンテーブルを回して、ゴールまでの道をつくろう。",
    image: "/assets/lp-card-rail-v1.png",
    icon: "rail",
  },
  {
    title: "猫のトロッコが走る！",
    body: "スタートすると、猫のトロッコがレールの上を進みます。",
    image: "/assets/lp-card-cart-v1.png",
    icon: "cart",
  },
  {
    title: "つながらないとゲームオーバー",
    body: "レールが切れたり、空白マスに落ちると失敗です。",
    image: "/assets/lp-card-danger-v1.png",
    icon: "warning",
  },
  {
    title: "ゴールを目指そう",
    body: "光る星までレールをつないで、ステージクリア！",
    image: "/assets/lp-card-goal-v1.png",
    icon: "goal",
  },
];

export function HomeScreen({ onStart, onOpenTutorial, onOpenSettings }: HomeScreenProps) {
  return (
    <section className="homeScreen lpMasterScreen">
      <SpaceDecor variant="home" />

      <header className="lpMasterTopBar" aria-label="ホームナビゲーション">
        <div className="lpMasterLogo" aria-label="トロッコにゃんにゃん">
          <span className="lpMasterLogoCat" aria-hidden="true" />
          <span>
            <strong>トロッコにゃんにゃん</strong>
            <small>TROLLEY NYANNYAN</small>
          </span>
        </div>
        <div className="lpMasterTopActions">
          <button className="lpMasterTopButton" onClick={onOpenTutorial} type="button">
            <span className="lpMasterQuestionIcon" aria-hidden="true">
              ?
            </span>
            遊び方
          </button>
          <button className="lpMasterTopButton" onClick={onOpenSettings} type="button">
            <span className="lpMasterGearIcon" aria-hidden="true" />
            設定
          </button>
        </div>
      </header>

      <main className="lpMasterHero" aria-label="トロッコにゃんにゃん LP">
        <section className="lpMasterCopy" aria-label="ゲーム紹介">
          <p className="lpMasterKicker">猫のトロッコを導くパズルゲーム</p>
          <h1 className="lpMasterTitle">
            <span>トロッコ</span>
            <span>にゃんにゃん</span>
          </h1>
          <p className="lpMasterLead">小さな惑星で、猫のトロッコを導こう。</p>
          <p className="lpMasterDescription">
            回せるレールパネルをつなぎ、光る星のゴールへ。木製玩具のような小さな惑星で遊ぶ、かわいいトロッコ誘導パズルです。
          </p>

          <div className="lpMasterActions">
            <form
              action="/"
              className="lpMasterStartForm"
              method="get"
              onSubmit={(event) => {
                event.preventDefault();
                onStart();
              }}
            >
              <input name="screen" type="hidden" value="game" />
              <button className="lpMasterStartButton" type="submit">
                <span className="lpMasterPlayIcon" aria-hidden="true" />
                ゲームを始める
              </button>
            </form>
            <div className="lpMasterSubActions">
              <button className="lpMasterSubButton" onClick={onOpenTutorial} type="button">
                <span className="lpMasterBookIcon" aria-hidden="true" />
                遊び方
              </button>
              <button className="lpMasterSubButton" onClick={onOpenSettings} type="button">
                <span className="lpMasterGearIcon" aria-hidden="true" />
                設定
              </button>
            </div>
          </div>
        </section>

        <section className="lpMasterVisual" aria-label="惑星と猫トロッコのキービジュアル">
          <div className="lpMasterVisualHalo" aria-hidden="true" />
          <div className="lpMasterKeyFrame">
            <Image
              alt="猫のトロッコが小さな惑星のレールパネルを走るキービジュアル"
              className="lpMasterKeyImage"
              draggable={false}
              height={302}
              priority
              src="/assets/lp-key-visual-v1.png"
              width={388}
            />
            <span className="lpMasterPlanetShadow" aria-hidden="true" />
            <span className="lpMasterGoalGlow" aria-hidden="true" />
            <span className="lpMasterCallout" aria-hidden="true">
              ゴールを目指そう！
            </span>
          </div>
        </section>
      </main>

      <section className="lpMasterCards" aria-label="ゲーム説明">
        {guideCards.map((card) => (
          <article className="lpMasterCard" key={card.title}>
            <span className={`lpMasterCardIcon lpMasterCardIcon-${card.icon}`} aria-hidden="true" />
            <div className="lpMasterCardText">
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </div>
            <Image
              alt=""
              className="lpMasterCardImage"
              draggable={false}
              height={80}
              src={card.image}
              width={160}
            />
          </article>
        ))}
      </section>
    </section>
  );
}
