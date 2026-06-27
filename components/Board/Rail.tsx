import type { ReactNode } from "react";
import { TileKind } from "@/types/game";

type RailProps = {
  kind: Exclude<TileKind, "empty">;
};

const railPaths: Record<Exclude<TileKind, "empty">, string[]> = {
  straight: ["M50 -8 L50 108"],
  leftCurve: ["M50 -6 C50 25 25 50 -6 50"],
  rightCurve: ["M50 -6 C50 25 75 50 106 50"],
  sCurve: ["M50 -6 C50 25 75 50 106 50", "M-6 50 C25 50 50 75 50 106"],
  cross: ["M50 -8 L50 108", "M-8 50 L108 50"],
};

const sleepers: Record<Exclude<TileKind, "empty">, ReactNode[]> = {
  straight: Array.from({ length: 7 }, (_, index) => (
    <line
      key={`straight-${index}`}
      className="railSleeper"
      x1="35"
      x2="65"
      y1={14 + index * 12}
      y2={14 + index * 12}
    />
  )),
  leftCurve: Array.from({ length: 5 }, (_, index) => (
    <rect
      key={`left-${index}`}
      className="curveSleeper"
      x="46"
      y="46"
      width="7"
      height="26"
      rx="3"
      style={{
        transform: `rotate(${188 + index * 18}deg) translate(0, -34px)`,
      }}
    />
  )),
  rightCurve: Array.from({ length: 5 }, (_, index) => (
    <rect
      key={`right-${index}`}
      className="curveSleeper"
      x="47"
      y="46"
      width="7"
      height="26"
      rx="3"
      style={{
        transform: `rotate(${-8 - index * 18}deg) translate(0, -34px)`,
      }}
    />
  )),
  sCurve: [
    ...Array.from({ length: 4 }, (_, index) => (
      <rect
        key={`s-a-${index}`}
        className="curveSleeper"
        x="47"
        y="46"
        width="7"
        height="24"
        rx="3"
        style={{
          transform: `rotate(${-8 - index * 18}deg) translate(0, -34px)`,
        }}
      />
    )),
    ...Array.from({ length: 4 }, (_, index) => (
      <rect
        key={`s-b-${index}`}
        className="curveSleeper"
        x="46"
        y="46"
        width="7"
        height="24"
        rx="3"
        style={{
          transform: `rotate(${188 + index * 18}deg) translate(0, -34px)`,
        }}
      />
    )),
  ],
  cross: [
    ...Array.from({ length: 5 }, (_, index) => (
      <line
        key={`cross-v-${index}`}
        className="railSleeper"
        x1="35"
        x2="65"
        y1={20 + index * 15}
        y2={20 + index * 15}
      />
    )),
    ...Array.from({ length: 5 }, (_, index) => (
      <line
        key={`cross-h-${index}`}
        className="railSleeper"
        x1={20 + index * 15}
        x2={20 + index * 15}
        y1="35"
        y2="65"
      />
    )),
  ],
};

export function Rail({ kind }: RailProps) {
  return (
    <svg className="railSvg" viewBox="0 0 100 100" aria-hidden="true">
      <g className="railSleepers">{sleepers[kind]}</g>
      <g>
        {railPaths[kind].map((path) => (
          <path className="railBed" d={path} key={`bed-${path}`} />
        ))}
      </g>
      <g>
        {railPaths[kind].map((path) => (
          <path className="railMetalOuter" d={path} key={`outer-${path}`} />
        ))}
      </g>
      <g>
        {railPaths[kind].map((path) => (
          <path className="railMetalInner" d={path} key={`inner-${path}`} />
        ))}
      </g>
    </svg>
  );
}
