type TutorialModalProps = {
  onClose: () => void;
};

const tutorialItems = [
  "パネルをクリックすると、円形レールが90度回転します。",
  "空白マスの隣のパネルは、ドラッグで移動できます。",
  "トロッコが脱線しないように、先のレールをつなげてください。",
  "光るパネルを通るとボーナスポイントです。",
  "猫のトロッコをゴールまで導けばクリアです。",
];

export function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <div className="modalBackdrop" role="presentation">
      <section className="modalPanel" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
        <button className="modalClose" onClick={onClose} type="button" aria-label="閉じる">
          ×
        </button>
        <h2 id="tutorial-title">遊び方</h2>
        <ol className="tutorialList">
          {tutorialItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
