// ============================================================
// AI Provider — Interface
// ============================================================
// All AI providers must implement this interface.
// The app uses this abstraction so providers can be swapped
// without changing the rest of the codebase.
//
// Provider adapter pattern:
//   AIProvider
//     ├── OpenAIProvider  (Phase 9)
//     ├── GeminiProvider  (future)
//     └── ClaudeProvider  (future)
// ============================================================

import type { AIRequest, AIResponse } from "@/types";

export interface AIProvider {
  readonly name: string;
  readonly isAvailable: () => Promise<boolean>;
  sendMessage(request: AIRequest): Promise<AIResponse>;
}
