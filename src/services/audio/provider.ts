// ============================================================
// Audio Provider — Interface
// ============================================================
// All audio providers must implement this interface.
//
// Provider adapter pattern:
//   AudioProvider
//     ├── BrowserTTSProvider  (Phase 8E)
//     └── FileAudioProvider   (future, for licensed recordings)
// ============================================================

import type { AudioPlaybackOptions } from "@/types";

export interface AudioProvider {
  readonly name: string;
  readonly isAvailable: () => boolean;
  speak(options: AudioPlaybackOptions): Promise<void>;
  stop(): void;
  pause(): void;
  resume(): void;
}
