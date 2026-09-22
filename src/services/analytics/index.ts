// ============================================================
// Analytics Service — Deterministic Attempt Intelligence
// ============================================================
// All metrics, accuracy values, and due review states are
// derived strictly from real Attempt and VocabularyProgress
// records in IndexedDB. No fake or static mock metrics.
// ============================================================

import { db } from "@/db";
import type { Attempt, MasteryLevel } from "@/types";

export interface ConceptAnalytics {
  conceptId: string;
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number; // 0.0 to 1.0
  lastAttemptTimestamp: number | null;
}

export interface OverallAnalytics {
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number; // 0.0 to 1.0
}

/**
 * Retrieves all vocabulary IDs that are currently due for review according to ts-fsrs.
 */
export async function getDueReviews(now = Date.now()): Promise<string[]> {
  const records = await db.vocabularyProgress
    .where("nextReview")
    .belowOrEqual(now)
    .toArray();

  return records.map((r) => r.vocabularyId);
}

/**
 * Retrieves deterministic performance metrics for a specific concept or question topic.
 */
export async function getConceptAnalytics(conceptId: string): Promise<ConceptAnalytics> {
  const attempts = await db.attempts.where("conceptId").equals(conceptId).toArray();

  const totalAttempts = attempts.length;
  const correctCount = attempts.filter((a) => a.correct).length;
  const incorrectCount = totalAttempts - correctCount;
  const accuracy = totalAttempts > 0 ? correctCount / totalAttempts : 0;
  const lastAttemptTimestamp =
    totalAttempts > 0
      ? Math.max(...attempts.map((a) => a.timestamp))
      : null;

  return {
    conceptId,
    totalAttempts,
    correctCount,
    incorrectCount,
    accuracy,
    lastAttemptTimestamp,
  };
}

/**
 * Calculates global system-wide accuracy and attempt counts across all learning modules.
 */
export async function getOverallAnalytics(): Promise<OverallAnalytics> {
  const allAttempts = await db.attempts.toArray();
  const totalAttempts = allAttempts.length;
  const correctCount = allAttempts.filter((a) => a.correct).length;
  const incorrectCount = totalAttempts - correctCount;
  const accuracy = totalAttempts > 0 ? correctCount / totalAttempts : 0;

  return {
    totalAttempts,
    correctCount,
    incorrectCount,
    accuracy,
  };
}

/**
 * Retrieves the most recent learning attempts in reverse chronological order.
 */
export async function getRecentAttempts(limit = 20): Promise<Attempt[]> {
  return db.attempts
    .orderBy("timestamp")
    .reverse()
    .limit(limit)
    .toArray();
}

/**
 * Returns a breakdown of all seeded vocabulary items by their current mastery level.
 */
export async function getMasteryBreakdown(): Promise<Record<MasteryLevel, number>> {
  const allProgress = await db.vocabularyProgress.toArray();
  const allVocabCount = await db.vocabulary.count();

  const counts: Record<MasteryLevel, number> = {
    new: 0,
    learning: 0,
    reviewing: 0,
    mastered: 0,
  };

  for (const p of allProgress) {
    counts[p.masteryLevel] = (counts[p.masteryLevel] || 0) + 1;
  }

  // Items with no progress record are implicitly 'new'
  const trackedCount = allProgress.length;
  const untrackedCount = Math.max(0, allVocabCount - trackedCount);
  counts.new += untrackedCount;

  return counts;
}
