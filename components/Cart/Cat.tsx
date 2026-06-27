import { CatMood } from "@/types/game";

type CatProps = {
  mood: CatMood;
};

export function Cat({ mood }: CatProps) {
  return (
    <span className={`catFigure catMood-${mood}`} aria-hidden="true">
      <span className="catEar catEarLeft" />
      <span className="catEar catEarRight" />
      <span className="catHeadShape">
        <span className="catStripe catStripeLeft" />
        <span className="catStripe catStripeCenter" />
        <span className="catStripe catStripeRight" />
        <span className="catEye catEyeLeft" />
        <span className="catEye catEyeRight" />
        <span className="catNose" />
        <span className="catMouth" />
      </span>
    </span>
  );
}
