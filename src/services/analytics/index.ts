// ============================================================
// Analytics Service — Interface Placeholder
// ============================================================
// Accuracy, weak areas, confusion analysis. Phase 3-4 implements.
// ============================================================

import type { WeakArea } from "@/types";

/**
 * Get weak areas derived from Attempt data.
 *
 * Implemented in Phase 4.
 */
export async function getWeakAreas(): Promise<WeakArea[]> {
  throw new Error("Not implemented — Phase 4");
}

/**
 * Get due reviews based on FSRS scheduling.
 *
 * Implemented in Phase 3.
 */
export async function getDueReviews(): Promise<string[]> {
  throw new Error("Not implemented — Phase 3");
}
