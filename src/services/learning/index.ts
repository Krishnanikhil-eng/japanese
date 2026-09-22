// ============================================================
// Learning Service — Interface Placeholder
// ============================================================
// The central Attempt pipeline. Phase 3 implements this.
//
// RULE: Every practice answer in the entire app
//       MUST flow through logAttempt().
//       No module may bypass this pipeline.
// ============================================================

import type { AttemptInput, Attempt } from "@/types";

/**
 * Log a learning attempt. This is THE core function.
 * Every quiz, mock test, sentence exercise, listening exercise,
 * and practice question MUST call this function.
 *
 * Implemented in Phase 3.
 */
export async function logAttempt(_input: AttemptInput): Promise<Attempt> {
  throw new Error("Not implemented — Phase 3");
}
