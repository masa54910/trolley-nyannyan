"use client";

import { useEffect, useRef, useState } from "react";
import { BONUS_PULSE_MS, CART_STEP_MS, SCORE_POPUP_MS } from "@/components/Animation/gameMotion";
import { Board } from "@/components/Board/Board";
import { SpaceDecor } from "@/components/Effects/SpaceDecor";
import { SoundManager } from "@/components/Sound/SoundManager";
import { GameOverModal } from "@/components/UI/GameOverModal";
import { HUD } from "@/components/UI/HUD";
import { CartState, Direction, GameStatus, ScorePopup, Stage } from "@/types/game";
import { GameManager } from "./GameManager";
import { StageManager } from "./StageManager";

type GameScreenProps = {
  onBackHome: () => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
};

type MoveResult = Extract<ReturnType<typeof GameManager.advanceCart>, { type: "move" }>;

export function GameScreen({
  onBackHome,
  onOpenTutorial,
  onOpenSettings,
}: GameScreenProps) {
  const [stage, setStage] = useState<Stage>(() => StageManager.createInitialStage());
  const [cart, setCart] = useState<CartState>(() => stage.start);
  const [status, setStatus] = useState<GameStatus>("ready");
  const [remainingTime, setRemainingTime] = useState(stage.timeLimit);
  const [score, setScore] = useState(0);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [activeBonusTileIds, setActiveBonusTileIds] = useState<string[]>([]);

  const stageRef = useRef(stage);
  const cartRef = useRef(cart);
  const statusRef = useRef(status);
  const soundManagerRef = useRef(SoundManager.getInstance());

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  function setNextStatus(nextStatus: GameStatus) {
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  }

  function updateStage(updater: (currentStage: Stage) => Stage) {
    setStage((currentStage) => {
      const nextStage = updater(currentStage);
      stageRef.current = nextStage;
      return nextStage;
    });
  }

  function resetGame() {
    const nextStage = StageManager.resetStage();

    stageRef.current = nextStage;
    cartRef.current = nextStage.start;
    statusRef.current = "ready";

    setStage(nextStage);
    setCart(nextStage.start);
    setNextStatus("ready");
    setRemainingTime(nextStage.timeLimit);
    setScore(0);
    setScorePopups([]);
    setActiveBonusTileIds([]);
    soundManagerRef.current.play("click");
  }

  function startGame() {
    if (statusRef.current !== "ready") {
      return;
    }

    soundManagerRef.current.play("run");
    setNextStatus("running");
  }

  function handleRotateTile(index: number) {
    if (statusRef.current !== "ready") {
      return;
    }

    soundManagerRef.current.play("click");
    updateStage((currentStage) => ({
      ...currentStage,
      tiles: GameManager.rotateTile(currentStage.tiles, index),
    }));
  }

  function handleSlideTile(index: number, direction: Direction) {
    if (statusRef.current !== "ready") {
      return;
    }

    const currentStage = stageRef.current;
    const cartIndex = GameManager.positionToIndex(cartRef.current.position, currentStage.size);

    if (index === cartIndex) {
      return;
    }

    soundManagerRef.current.play("click");
    updateStage((stageToUpdate) => {
      const result = GameManager.slideTile(
        stageToUpdate.tiles,
        index,
        direction,
        stageToUpdate.size
      );

      return result.moved ? { ...stageToUpdate, tiles: result.tiles } : stageToUpdate;
    });
  }

  function addScorePopup(result: MoveResult) {
    if (result.score.total <= 0) {
      return;
    }

    const popup: ScorePopup = {
      id: `${result.passedTile.id}-${Date.now()}`,
      position: GameManager.indexToPosition(result.passedIndex, stageRef.current.size),
      total: result.score.total,
      bonus: result.score.bonus,
    };

    setScorePopups((current) => [...current, popup]);
    window.setTimeout(() => {
      setScorePopups((current) => current.filter((item) => item.id !== popup.id));
    }, SCORE_POPUP_MS);

    if (result.score.bonus > 0) {
      setActiveBonusTileIds((current) => [...new Set([...current, result.passedTile.id])]);
      window.setTimeout(() => {
        setActiveBonusTileIds((current) =>
          current.filter((tileId) => tileId !== result.passedTile.id)
        );
      }, BONUS_PULSE_MS);
    }
  }

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingTime((current) => {
        if (current <= 1) {
          const startledCart = { ...cartRef.current, mood: "startled" as const };
          cartRef.current = startledCart;
          setCart(startledCart);
          soundManagerRef.current.play("gameOver");
          setNextStatus("gameOver");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const ticker = window.setInterval(() => {
      if (statusRef.current !== "running") {
        return;
      }

      const result = GameManager.advanceCart(stageRef.current, cartRef.current);

      if (result.type === "fail") {
        const startledCart = { ...cartRef.current, mood: "startled" as const };
        cartRef.current = startledCart;
        setCart(startledCart);
        soundManagerRef.current.play("gameOver");
        setNextStatus("gameOver");
        return;
      }

      cartRef.current = result.cart;
      setCart(result.cart);
      setScore((currentScore) => currentScore + result.score.total);
      addScorePopup(result);

      if (result.reachedGoal) {
        soundManagerRef.current.play("clear");
        setNextStatus("cleared");
      }
    }, CART_STEP_MS);

    return () => window.clearInterval(ticker);
  }, [status]);

  return (
    <section className={`gameScreen gameStatus-${status}`}>
      <SpaceDecor variant="game" />
      <HUD
        onOpenSettings={onOpenSettings}
        onOpenTutorial={onOpenTutorial}
        remainingTime={remainingTime}
        score={score}
        stage={stage}
      />

      <div className="stageWorld">
        <div className="planetBackdrop" aria-hidden="true">
          <span className="planetRock rockOne" />
          <span className="planetRock rockTwo" />
          <span className="planetRock rockThree" />
          <span className="planetTree treeOne" />
          <span className="planetTree treeTwo" />
          <span className="planetTree treeThree" />
        </div>
        <Board
          activeBonusTileIds={activeBonusTileIds}
          cart={cart}
          disabled={status !== "ready"}
          onRotateTile={handleRotateTile}
          onSlideTile={handleSlideTile}
          onStart={startGame}
          scorePopups={scorePopups}
          stage={stage}
          status={status}
        />
      </div>

      <div className="stageFooter">
        <button className="ghostButton" onClick={onBackHome} type="button">
          ホーム
        </button>
        <button className="ghostButton" onClick={resetGame} type="button">
          リトライ
        </button>
      </div>

      {status === "gameOver" || status === "cleared" ? (
        <GameOverModal onHome={onBackHome} onRetry={resetGame} score={score} status={status} />
      ) : null}
    </section>
  );
}
