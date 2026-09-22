// ============================================================
// Learning Service — Module Exports
// ============================================================

import type { AttemptInput, Attempt } from "@/types";

/**
 * Log a learning attempt.
 * Implemented in Phase 3.
 */
export async function logAttempt(_input: AttemptInput): Promise<Attempt> {
  throw new Error("Not implemented — Phase 3");
}

export * from "./seed";
export * from "./repository";
