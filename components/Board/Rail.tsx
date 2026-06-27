import type { ReactNode } from "react";
import { TileKind } from "@/types/game";

type RailProps = {
  kind: Exclude<TileKind, "empty">;
};

type TrackArt = {
  beds: string[];
  rails: string[];
  sleepers: ReactNode[];
};

const sleeperLine = (key: string, x1: number, y1: number, x2: number, y2: number) => (
  <line className="railSleeper" key={key} x1={x1} x2={x2} y1={y1} y2={y2} />
);

const curveSleeper = (key: string, rotation: number, length = 30) => (
  <rect
    className="curveSleeper"
    height={length}
    key={key}
    rx="3"
    style={{ transform: `rotate(${rotation}deg) translate(0, -36px)` }}
    width="8"
    x="46"
    y="46"
  />
);

const trackArt: Record<Exclude<TileKind, "empty">, TrackArt> = {
  straight: {
    beds: ["M50 -10 L50 110"],
    rails: ["M42 -10 L42 110", "M58 -10 L58 110"],
    sleepers: Array.from({ length: 8 }, (_, index) =>
      sleeperLine(`straight-${index}`, 31, 8 + index * 13, 69, 8 + index * 13)
    ),
  },
  leftCurve: {
    beds: ["M50 -8 C50 24 24 50 -8 50"],
    rails: [
      "M42 -8 C42 18 18 42 -8 42",
      "M58 -8 C58 32 32 58 -8 58",
    ],
    sleepers: Array.from({ length: 6 }, (_, index) =>
      curveSleeper(`left-${index}`, 188 + index * 17)
    ),
  },
  rightCurve: {
    beds: ["M50 -8 C50 24 76 50 108 50"],
    rails: [
      "M42 -8 C42 32 68 58 108 58",
      "M58 -8 C58 18 82 42 108 42",
    ],
    sleepers: Array.from({ length: 6 }, (_, index) =>
      curveSleeper(`right-${index}`, -8 - index * 17)
    ),
  },
  sCurve: {
    beds: ["M50 -8 C50 24 76 50 108 50", "M-8 50 C24 50 50 76 50 108"],
    rails: [
      "M42 -8 C42 32 68 58 108 58",
      "M58 -8 C58 18 82 42 108 42",
      "M-8 42 C32 42 58 68 58 108",
      "M-8 58 C18 58 42 82 42 108",
    ],
    sleepers: [
      ...Array.from({ length: 5 }, (_, index) =>
        curveSleeper(`s-a-${index}`, -8 - index * 17, 28)
      ),
      ...Array.from({ length: 5 }, (_, index) =>
        curveSleeper(`s-b-${index}`, 188 + index * 17, 28)
      ),
    ],
  },
  cross: {
    beds: ["M50 -10 L50 110", "M-10 50 L110 50"],
    rails: ["M42 -10 L42 110", "M58 -10 L58 110", "M-10 42 L110 42", "M-10 58 L110 58"],
    sleepers: [
      ...Array.from({ length: 6 }, (_, index) =>
        sleeperLine(`cross-v-${index}`, 31, 13 + index * 15, 69, 13 + index * 15)
      ),
      ...Array.from({ length: 6 }, (_, index) =>
        sleeperLine(`cross-h-${index}`, 13 + index * 15, 31, 13 + index * 15, 69)
      ),
    ],
  },
};

export function Rail({ kind }: RailProps) {
  const art = trackArt[kind];

  return (
    <svg className="railSvg" viewBox="0 0 100 100" aria-hidden="true">
      <g className="railBedLayer">
        {art.beds.map((path) => (
          <path className="railBedShadow" d={path} key={`shadow-${path}`} />
        ))}
        {art.beds.map((path) => (
          <path className="railBed" d={path} key={`bed-${path}`} />
        ))}
      </g>
      <g className="railSleepers">{art.sleepers}</g>
      <g className="railMetalLayer">
        {art.rails.map((path) => (
          <path className="railMetalOuter" d={path} key={`outer-${path}`} />
        ))}
        {art.rails.map((path) => (
          <path className="railMetalInner" d={path} key={`inner-${path}`} />
        ))}
        {art.rails.map((path) => (
          <path className="railMetalHighlight" d={path} key={`highlight-${path}`} />
        ))}
      </g>
    </svg>
  );
}
