"use client";

import { useState } from "react";
import { SoundManager } from "@/components/Sound/SoundManager";

type SettingsModalProps = {
  onClose: () => void;
};

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [effects, setEffects] = useState(true);
  const [sound, setSound] = useState(() => SoundManager.getInstance().isEnabled());

  function handleSoundChange(enabled: boolean) {
    SoundManager.getInstance().setEnabled(enabled);
    setSound(enabled);
  }

  return (
    <div className="modalBackdrop" role="presentation">
      <section
        className="modalPanel settingsPanel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <button className="modalClose" onClick={onClose} type="button" aria-label="閉じる">
          ×
        </button>
        <h2 id="settings-title">設定</h2>
        <label className="settingRow">
          <span>演出</span>
          <input checked={effects} onChange={(event) => setEffects(event.target.checked)} type="checkbox" />
        </label>
        <label className="settingRow">
          <span>サウンド</span>
          <input checked={sound} onChange={(event) => handleSoundChange(event.target.checked)} type="checkbox" />
        </label>
      </section>
    </div>
  );
}
