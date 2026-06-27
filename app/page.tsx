"use client";

import { useState } from "react";
import { GameScreen } from "@/components/Game/GameScreen";
import { HomeScreen } from "@/components/Home/HomeScreen";
import { SettingsModal } from "@/components/UI/SettingsModal";
import { TutorialModal } from "@/components/UI/TutorialModal";

type Screen = "home" | "game";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <main className="trolleyApp">
      {screen === "home" ? (
        <HomeScreen
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenTutorial={() => setTutorialOpen(true)}
          onStart={() => setScreen("game")}
        />
      ) : (
        <GameScreen
          onBackHome={() => setScreen("home")}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenTutorial={() => setTutorialOpen(true)}
        />
      )}

      {tutorialOpen ? <TutorialModal onClose={() => setTutorialOpen(false)} /> : null}
      {settingsOpen ? <SettingsModal onClose={() => setSettingsOpen(false)} /> : null}
    </main>
  );
}
