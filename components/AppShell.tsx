"use client";

import { useEffect, useState } from "react";
import { GameScreen } from "@/components/Game/GameScreen";
import { HomeScreen } from "@/components/Home/HomeScreen";
import { SettingsModal } from "@/components/UI/SettingsModal";
import { TutorialModal } from "@/components/UI/TutorialModal";

export type Screen = "home" | "game";

type AppShellProps = {
  initialScreen: Screen;
};

export function AppShell({ initialScreen }: AppShellProps) {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    function syncFromUrl() {
      const params = new URLSearchParams(window.location.search);
      setScreen(params.get("screen") === "game" ? "game" : "home");
    }

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  function showScreen(nextScreen: Screen) {
    const nextUrl = nextScreen === "game" ? "/?screen=game" : "/";
    window.history.pushState(null, "", nextUrl);
    setScreen(nextScreen);
  }

  return (
    <main className="trolleyApp">
      {screen === "home" ? (
        <HomeScreen
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenTutorial={() => setTutorialOpen(true)}
          onStart={() => showScreen("game")}
        />
      ) : (
        <GameScreen
          onBackHome={() => showScreen("home")}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenTutorial={() => setTutorialOpen(true)}
        />
      )}

      {tutorialOpen ? <TutorialModal onClose={() => setTutorialOpen(false)} /> : null}
      {settingsOpen ? <SettingsModal onClose={() => setSettingsOpen(false)} /> : null}
    </main>
  );
}
