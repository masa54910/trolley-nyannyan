"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Dir = "up" | "right" | "down" | "left";
type TileType = "straight" | "curve" | "empty";

type Tile = {
  id: number;
  type: TileType;
  rot: number;
};

const BOARD_SIZE = 4;
const START_INDEX = 5;

const opposite: Record<Dir, Dir> = {
  up: "down",
  right: "left",
  down: "up",
  left: "right",
};

const dirDelta: Record<Dir, number> = {
  up: -BOARD_SIZE,
  right: 1,
  down: BOARD_SIZE,
  left: -1,
};

const baseConnections: Record<Exclude<TileType, "empty">, Dir[]> = {
  straight: ["left", "right"],
  curve: ["left", "down"],
};

const initialTiles: Tile[] = [
  { id: 1, type: "straight", rot: 0 },
  { id: 2, type: "straight", rot: 90 },
  { id: 3, type: "curve", rot: 90 },
  { id: 4, type: "straight", rot: 90 },

  { id: 5, type: "curve", rot: 180 },
  { id: 6, type: "straight", rot: 0 },
  { id: 7, type: "straight", rot: 0 },
  { id: 8, type: "curve", rot: 270 },

  { id: 9, type: "straight", rot: 90 },
  { id: 10, type: "straight", rot: 0 },
  { id: 11, type: "curve", rot: 0 },
  { id: 12, type: "straight", rot: 90 },

  { id: 13, type: "curve", rot: 180 },
  { id: 14, type: "straight", rot: 90 },
  { id: 15, type: "straight", rot: 0 },
  { id: 16, type: "empty", rot: 0 },
];

function rotateDir(dir: Dir, rot: number): Dir {
  const dirs: Dir[] = ["up", "right", "down", "left"];
  const i = dirs.indexOf(dir);
  const steps = Math.round(rot / 90) % 4;
  return dirs[(i + steps + 4) % 4];
}

function getConnections(tile: Tile): Dir[] {
  if (tile.type === "empty") return [];
  return baseConnections[tile.type].map((d) => rotateDir(d, tile.rot));
}

function canEnter(tile: Tile, from: Dir) {
  return getConnections(tile).includes(from);
}

function getExit(tile: Tile, enteredFrom: Dir): Dir | null {
  const cons = getConnections(tile);
  if (!cons.includes(enteredFrom)) return null;
  return cons.find((d) => d !== enteredFrom) ?? null;
}

function Rail({ tile }: { tile: Tile }) {
  if (tile.type === "empty") {
    return <div className="emptySlot" />;
  }

  return (
    <div className="roundTile">
      <div className="tileLip" />
      <div className="railSpin" style={{ transform: `rotate(${tile.rot}deg)` }}>
        {tile.type === "straight" ? (
          <div className="straightRail">
            <div className="metal topMetal" />
            <div className="metal bottomMetal" />
            <div className="woodBed" />
            {Array.from({ length: 9 }).map((_, i) => (
              <span className="sleeper" key={i} />
            ))}
          </div>
        ) : (
          <div className="curveRail">
            <div className="curveMetal outerOne" />
            <div className="curveMetal outerTwo" />
            {Array.from({ length: 7 }).map((_, i) => (
              <span className={`curveSleeper s${i + 1}`} key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [tiles, setTiles] = useState<Tile[]>(initialTiles);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);

  const [cartIndex, setCartIndex] = useState(START_INDEX);
  const [cartX, setCartX] = useState(1.5);
  const [cartY, setCartY] = useState(1.5);
  const [direction, setDirection] = useState<Dir>("right");

  const dragRef = useRef<{ index: number; x: number; y: number } | null>(null);
  const moveLockRef = useRef(false);

  function resetGame() {
    setTiles(initialTiles);
    setRunning(false);
    setGameOver(false);
    setElapsed(0);
    setScore(0);
    setCartIndex(START_INDEX);
    setCartX(1.5);
    setCartY(1.5);
    setDirection("right");
    moveLockRef.current = false;
  }

  function getEmptyIndex() {
    return tiles.findIndex((t) => t.type === "empty");
  }

  function isAdjacentToEmpty(index: number) {
    const emptyIndex = getEmptyIndex();
    const row = Math.floor(index / BOARD_SIZE);
    const emptyRow = Math.floor(emptyIndex / BOARD_SIZE);

    return (
      index === emptyIndex - BOARD_SIZE ||
      index === emptyIndex + BOARD_SIZE ||
      (row === emptyRow && (index === emptyIndex - 1 || index === emptyIndex + 1))
    );
  }

  function dragTowardEmpty(index: number, dx: number, dy: number) {
    const emptyIndex = getEmptyIndex();
    const diff = emptyIndex - index;

    if (diff === -BOARD_SIZE) return dy < -20;
    if (diff === BOARD_SIZE) return dy > 20;
    if (diff === -1) return dx < -20;
    if (diff === 1) return dx > 20;

    return false;
  }

  function swapWithEmpty(index: number) {
    const emptyIndex = getEmptyIndex();
    setTiles((prev) => {
      const next = [...prev];
      [next[index], next[emptyIndex]] = [next[emptyIndex], next[index]];
      return next;
    });
  }

  function rotateTile(index: number, clockwise: boolean) {
    if (tiles[index].type === "empty") return;

    setTiles((prev) =>
      prev.map((tile, i) =>
        i === index
          ? { ...tile, rot: (tile.rot + (clockwise ? 90 : -90) + 360) % 360 }
          : tile
      )
    );
  }

  function onPointerDown(index: number, e: React.PointerEvent) {
    if (running || gameOver) return;
    dragRef.current = { index, x: e.clientX, y: e.clientY };
  }

  function onPointerUp(e: React.PointerEvent) {
    if (running || gameOver || !dragRef.current) return;

    const { index, x, y } = dragRef.current;
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    const distance = Math.hypot(dx, dy);

    if (distance < 10) {
      dragRef.current = null;
      return;
    }

    if (isAdjacentToEmpty(index) && dragTowardEmpty(index, dx, dy)) {
      swapWithEmpty(index);
    } else {
      rotateTile(index, Math.abs(dx) >= Math.abs(dy) ? dx > 0 : dy > 0);
    }

    dragRef.current = null;
  }

  useEffect(() => {
    if (!running || gameOver) return;

    const timer = setInterval(() => {
      setElapsed((v) => v + 0.1);
    }, 100);

    return () => clearInterval(timer);
  }, [running, gameOver]);

  useEffect(() => {
    if (!running || gameOver) return;

    const tick = setInterval(() => {
      if (moveLockRef.current) return;
      moveLockRef.current = true;

      const current = tiles[cartIndex];
      const enterFrom = opposite[direction];

      if (!canEnter(current, enterFrom)) {
        setGameOver(true);
        setRunning(false);
        moveLockRef.current = false;
        return;
      }

      const exit = getExit(current, enterFrom);
      if (!exit) {
        setGameOver(true);
        setRunning(false);
        moveLockRef.current = false;
        return;
      }

      const nextIndex = cartIndex + dirDelta[exit];
      const row = Math.floor(cartIndex / BOARD_SIZE);
      const nextRow = Math.floor(nextIndex / BOARD_SIZE);

      if (
        nextIndex < 0 ||
        nextIndex >= 16 ||
        (exit === "left" && row !== nextRow) ||
        (exit === "right" && row !== nextRow)
      ) {
        setGameOver(true);
        setRunning(false);
        moveLockRef.current = false;
        return;
      }

      const nextTile = tiles[nextIndex];
      if (!canEnter(nextTile, opposite[exit])) {
        setGameOver(true);
        setRunning(false);
        moveLockRef.current = false;
        return;
      }

      const nextCol = nextIndex % BOARD_SIZE;
      const nextRow2 = Math.floor(nextIndex / BOARD_SIZE);

      setCartX(nextCol + 0.5);
      setCartY(nextRow2 + 0.5);
      setDirection(exit);

      setTimeout(() => {
        setCartIndex(nextIndex);
        setScore((s) => s + 10);
        moveLockRef.current = false;
      }, 1200);
    }, 1300);

    return () => clearInterval(tick);
  }, [running, gameOver, tiles, cartIndex, direction]);

  const cartStyle = useMemo(
    () => ({
      left: `${(cartX / BOARD_SIZE) * 100}%`,
      top: `${(cartY / BOARD_SIZE) * 100}%`,
    }),
    [cartX, cartY]
  );

  return (
    <main className="page">
      <section className="scene">
        <header className="header">
          <div className="woodSign">
            <div className="signCat">🐱</div>
            <div>
              <h1>トロッコにゃんにゃん</h1>
              <p>3Dパズルでレールをつなごう！</p>
            </div>
          </div>

          <div className="topButtons">
            <button>？ 遊び方</button>
            <button>⚙ 設定</button>
          </div>
        </header>

        <div className="mainLayout">
          <div className="toyArea">
            <div className="miniTrees">
              <span />
              <span />
              <span />
            </div>

            <div className="boardFrame">
              <div className="board">
                {tiles.map((tile, index) => (
                  <button
                    key={tile.id}
                    className="cell"
                    onPointerDown={(e) => onPointerDown(index, e)}
                    onPointerUp={onPointerUp}
                  >
                    <Rail tile={tile} />
                  </button>
                ))}

                {!gameOver && (
                  <div className={`cart ${direction}`} style={cartStyle}>
                    <div className="catHead">🐱</div>
                    <div className="cartBody" />
                    <div className="cartWheel w1" />
                    <div className="cartWheel w2" />
                  </div>
                )}
              </div>

              {gameOver && (
                <div className="gameOver">
                  <b>GAME OVER</b>
                  <span>レールが途切れたにゃ…</span>
                </div>
              )}
            </div>

            <div className="bottomMemo">
              <b>パネルをドラッグ：</b>
              <span>隣の空きマスへ移動 / 隣でない場合は90°回転</span>
            </div>
          </div>

          <aside className="clipboard">
            <div className="clip" />
            <h2>ステータス</h2>

            <div className="noteCard">🕒 経過時間 <b>{elapsed.toFixed(1)} 秒</b></div>
            <div className="noteCard">🚃 トロッコの速度 <b>Lv.1</b></div>
            <div className="noteCard">🏆 スコア <b>{score}</b></div>

            <button className="start" onClick={() => setRunning(true)} disabled={running || gameOver}>
              ▶ スタート
            </button>

            <button className="pause" onClick={() => setRunning(false)} disabled={!running}>
              Ⅱ 一時停止
            </button>

            <button className="reset" onClick={resetGame}>
              ↻ リセット
            </button>

            <div className="directionPanel">
              <h3>トロッコの進行方向</h3>
              <div className="arrows">
                <span>↑</span>
                <div>
                  <span>←</span>
                  <b>🐱</b>
                  <span className="green">→</span>
                </div>
                <span>↓</span>
              </div>
            </div>

            <div className="progress">
              <span>次の速度レベルまで</span>
              <div><i style={{ width: `${Math.min(score / 2, 100)}%` }} /></div>
              <small>{score} / 200</small>
            </div>
          </aside>
        </div>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #6d4526;
        }

        .page {
          min-height: 100vh;
          padding: 22px;
          background:
            radial-gradient(circle at 12% 18%, rgba(255, 238, 200, .45), transparent 16%),
            radial-gradient(circle at 88% 8%, rgba(255, 238, 200, .22), transparent 20%),
            linear-gradient(135deg, #a96f3d, #583016);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #4a2b14;
          overflow-x: auto;
        }

        .scene {
          max-width: 1220px;
          margin: 0 auto;
          position: relative;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          gap: 16px;
        }

        .woodSign {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 28px 16px;
          background:
            linear-gradient(180deg, #7a461f, #4f2b14);
          color: #fff1d5;
          border-radius: 18px;
          box-shadow:
            inset 0 2px 0 rgba(255,255,255,.25),
            0 8px 0 #2d170b,
            0 18px 30px rgba(0,0,0,.28);
          border: 2px solid #9a642f;
        }

        .signCat {
          font-size: 38px;
        }

        h1 {
          margin: 0;
          font-size: 34px;
          letter-spacing: .04em;
          text-shadow: 0 3px 0 rgba(0,0,0,.28);
        }

        .woodSign p {
          margin: 4px 0 0;
          font-weight: 900;
          font-size: 16px;
        }

        .topButtons {
          display: flex;
          gap: 12px;
        }

        button {
          font: inherit;
          font-weight: 900;
          cursor: pointer;
          user-select: none;
        }

        .topButtons button {
          border: 2px solid #c99757;
          color: #4a2b14;
          padding: 12px 22px;
          border-radius: 12px;
          background: linear-gradient(#fff7e8, #eed2a3);
          box-shadow: 0 5px 0 #9a642f;
        }

        .mainLayout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 22px;
          align-items: start;
        }

        .toyArea {
          position: relative;
          min-width: 720px;
          padding-top: 24px;
        }

        .miniTrees {
          position: absolute;
          top: -28px;
          left: 62%;
          display: flex;
          gap: 16px;
          z-index: 1;
        }

        .miniTrees span {
          display: block;
          width: 38px;
          height: 60px;
          background: linear-gradient(#4f8a3d, #2e5a2c);
          clip-path: polygon(50% 0, 82% 35%, 68% 35%, 92% 70%, 62% 70%, 62% 100%, 38% 100%, 38% 70%, 8% 70%, 32% 35%, 18% 35%);
          filter: drop-shadow(0 8px 4px rgba(0,0,0,.25));
        }

        .boardFrame {
          position: relative;
          padding: 22px;
          border-radius: 30px;
          background:
            linear-gradient(145deg, #c98b45, #7a461f);
          box-shadow:
            inset 0 0 0 10px #8a5527,
            inset 0 0 0 16px #d69b56,
            0 32px 55px rgba(0,0,0,.42);
          transform: perspective(1200px) rotateX(5deg);
          transform-origin: top center;
        }

        .board {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          aspect-ratio: 1 / 1;
          background: #9b5d28;
          border-radius: 18px;
          overflow: hidden;
          border: 3px solid #5a3218;
          box-shadow: inset 0 0 28px rgba(0,0,0,.28);
        }

        .cell {
          position: relative;
          border: 1px solid rgba(83, 45, 18, .35);
          background: linear-gradient(145deg, #c78b48, #ac6e31);
          padding: 8px;
          touch-action: none;
        }

        .roundTile {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background:
            radial-gradient(circle at 32% 24%, #f6dfb5, #d49b58 58%, #a9662c);
          border: 3px solid #f1d6a9;
          box-shadow:
            inset 0 0 0 3px rgba(120, 70, 28, .52),
            inset -12px -18px 22px rgba(77, 42, 16, .2),
            0 8px 0 rgba(74, 39, 15, .55),
            0 12px 18px rgba(0,0,0,.2);
          overflow: hidden;
        }

        .tileLip {
          position: absolute;
          inset: 9px;
          border-radius: 50%;
          border: 2px solid rgba(255, 240, 210, .72);
          box-shadow: inset 0 0 0 2px rgba(125,75,30,.28);
          pointer-events: none;
        }

        .emptySlot {
          width: 100%;
          height: 100%;
          border-radius: 18px;
          background:
            linear-gradient(145deg, #7a451f, #4c2812);
          box-shadow:
            inset 0 9px 22px rgba(0,0,0,.55),
            inset 0 -3px 0 rgba(255,255,255,.08);
        }

        .railSpin {
          position: absolute;
          inset: 0;
          transform-origin: center;
          transition: transform .18s ease;
        }

        .straightRail {
          position: absolute;
          left: -5%;
          right: -5%;
          top: calc(50% - 18px);
          height: 36px;
        }

        .woodBed {
          position: absolute;
          left: 0;
          right: 0;
          top: 8px;
          height: 20px;
          background: linear-gradient(#9a5b2a, #633619);
          box-shadow: inset 0 2px 0 rgba(255,255,255,.18);
        }

        .metal {
          position: absolute;
          left: 0;
          right: 0;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(#4b4b4b, #1f1f1f);
          box-shadow: 0 2px 2px rgba(0,0,0,.45);
          z-index: 3;
        }

        .topMetal { top: 4px; }
        .bottomMetal { bottom: 4px; }

        .sleeper {
          position: relative;
          z-index: 2;
          display: inline-block;
          width: 8px;
          height: 42px;
          margin: -3px 4px 0;
          background: linear-gradient(90deg, #422414, #75411f, #422414);
          border-radius: 4px;
          box-shadow: 0 2px 2px rgba(0,0,0,.3);
        }

        .curveRail {
          position: absolute;
          inset: 0;
        }

        .curveMetal {
          position: absolute;
          left: -5%;
          bottom: -5%;
          width: 72%;
          height: 72%;
          border-radius: 0 100% 0 0;
          border-top: 7px solid #2d2d2d;
          border-right: 7px solid #2d2d2d;
          box-shadow: 0 2px 3px rgba(0,0,0,.4);
        }

        .outerOne {
          left: -3%;
          bottom: -3%;
        }

        .outerTwo {
          left: 12%;
          bottom: 12%;
          width: 50%;
          height: 50%;
        }

        .curveSleeper {
          position: absolute;
          width: 8px;
          height: 30px;
          background: linear-gradient(90deg, #422414, #75411f, #422414);
          border-radius: 4px;
          left: 47%;
          top: 48%;
          transform-origin: -33px 32px;
          box-shadow: 0 2px 2px rgba(0,0,0,.35);
        }

        .s1 { transform: rotate(8deg) translateX(43px); }
        .s2 { transform: rotate(22deg) translateX(45px); }
        .s3 { transform: rotate(36deg) translateX(47px); }
        .s4 { transform: rotate(50deg) translateX(48px); }
        .s5 { transform: rotate(64deg) translateX(50px); }
        .s6 { transform: rotate(78deg) translateX(51px); }
        .s7 { transform: rotate(92deg) translateX(52px); }

        .cart {
          position: absolute;
          width: 72px;
          height: 64px;
          z-index: 20;
          transform: translate(-50%, -50%);
          transition: left 1.2s linear, top 1.2s linear;
          pointer-events: none;
          filter: drop-shadow(0 8px 5px rgba(0,0,0,.28));
        }

        .cart.up { rotate: -90deg; }
        .cart.right { rotate: 0deg; }
        .cart.down { rotate: 90deg; }
        .cart.left { rotate: 180deg; }

        .catHead {
          position: absolute;
          left: 17px;
          top: -14px;
          font-size: 36px;
          z-index: 4;
          rotate: 0deg;
        }

        .cartBody {
          position: absolute;
          left: 8px;
          top: 24px;
          width: 58px;
          height: 28px;
          background: linear-gradient(#a76732, #673716);
          border: 4px solid #2f1b10;
          border-radius: 7px 7px 13px 13px;
          box-shadow: inset 0 3px 0 rgba(255,255,255,.22);
        }

        .cartWheel {
          position: absolute;
          bottom: 2px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #232323;
          border: 3px solid #777;
          z-index: 5;
        }

        .w1 { left: 15px; }
        .w2 { right: 15px; }

        .gameOver {
          position: absolute;
          inset: 22px;
          border-radius: 18px;
          background: rgba(54, 29, 12, .82);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 40;
          font-size: 24px;
        }

        .gameOver b {
          color: #ff7da0;
          font-size: 54px;
        }

        .bottomMemo {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          margin-top: 16px;
          background: linear-gradient(#75431f, #4f2b14);
          color: #fff1d5;
          padding: 14px 20px;
          border-radius: 14px;
          font-weight: 900;
          box-shadow: 0 8px 0 #2d170b;
        }

        .clipboard {
          position: relative;
          background: linear-gradient(#fff4dd, #eed3a7);
          border-radius: 22px;
          padding: 46px 20px 20px;
          box-shadow:
            inset 0 0 0 4px #c9965a,
            0 18px 35px rgba(0,0,0,.28);
          border: 2px solid #7f5129;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .clip {
          position: absolute;
          top: -18px;
          left: 50%;
          width: 92px;
          height: 42px;
          transform: translateX(-50%);
          border-radius: 20px 20px 10px 10px;
          background: linear-gradient(#d8d8d8, #8e8e8e);
          border: 3px solid #6f6f6f;
          box-shadow: 0 5px 8px rgba(0,0,0,.22);
        }

        .clip::after {
          content: "";
          position: absolute;
          left: 35px;
          top: -10px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 5px solid #777;
          background: #fff4dd;
        }

        .clipboard h2 {
          margin: 0;
          font-size: 24px;
        }

        .noteCard,
        .directionPanel,
        .progress {
          background: rgba(255,255,255,.55);
          border: 1px solid #d6b480;
          border-radius: 14px;
          padding: 14px;
          font-weight: 800;
        }

        .noteCard {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .noteCard b {
          font-size: 20px;
        }

        .start,
        .pause,
        .reset {
          border: 0;
          border-radius: 12px;
          padding: 16px;
          font-size: 21px;
        }

        .start {
          background: linear-gradient(#ff7da7, #e44d7a);
          color: white;
          box-shadow: 0 6px 0 #a63554;
        }

        .pause {
          background: linear-gradient(#d7d7d7, #aaa);
          color: white;
          box-shadow: 0 6px 0 #777;
        }

        .reset {
          background: linear-gradient(#fff0d1, #e9c58e);
          color: #4a2b14;
          box-shadow: 0 6px 0 #b17b3e;
        }

        .start:disabled,
        .pause:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .arrows {
          text-align: center;
          font-size: 30px;
          color: #7a4a22;
          line-height: 1.1;
        }

        .arrows div {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 26px;
        }

        .arrows b {
          font-size: 34px;
        }

        .green {
          color: #2a9f46;
        }

        .progress div {
          height: 16px;
          margin-top: 10px;
          background: #d9bd8c;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress i {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #4fb34b, #79d95f);
        }

        @media (max-width: 980px) {
          .mainLayout {
            grid-template-columns: 1fr;
          }

          .toyArea {
            min-width: 0;
          }

          .header {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </main>
  );
}