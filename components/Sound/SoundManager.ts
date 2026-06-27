export type SoundCue = "click" | "run" | "clear" | "gameOver";

export class SoundManager {
  private static instance: SoundManager | null = null;

  private enabled = false;

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }

    return SoundManager.instance;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  play(_cue: SoundCue) {
    if (!this.enabled) {
      return;
    }

    void _cue;
  }
}
