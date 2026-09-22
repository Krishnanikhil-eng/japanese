// ============================================================
// Attempt Pipeline — Central logAttempt Service
// ============================================================
// ARCHITECTURE LAW:
// Every user answer across the entire app MUST flow through
// logAttempt(). No practice, quiz, sentence, listening, or
// mock test module may write directly to a separate mistake table.
// Mistakes and weak areas are ALWAYS derived from Attempts.
// ============================================================

import { db } from "@/db";
import {
  scheduleReview,
  serializeFSRSCard,
  deserializeFSRSCard,
  calculateMasteryLevel,
} from "@/services/srs";
import type { AttemptInput, Attempt, VocabularyProgress } from "@/types";

/**
 * Centrally records an attempt for any question in the system.
 * Persists both correct and incorrect attempts to IndexedDB.
 * Automatically updates ts-fsrs spaced repetition scheduling for vocabulary concepts.
 */
export async function logAttempt(input: AttemptInput): Promise<Attempt> {
  const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const attempt: Attempt = {
    ...input,
    id: attemptId,
    timestamp: input.timestamp || Date.now(),
  };

  // Persist attempt and update vocabulary progress in an atomic Dexie transaction
  await db.transaction("rw", [db.attempts, db.vocabularyProgress], async () => {
    // 1. Save attempt record (unified denominator for all analytics)
    await db.attempts.put(attempt);

    // 2. If this is a vocabulary concept, update its SRS review state
    if (input.conceptType === "vocabulary" || input.conceptId.startsWith("vocab-")) {
      const vocabId = input.conceptId;
      let progress = await db.vocabularyProgress.get(vocabId);

      if (!progress) {
        progress = {
          id: vocabId,
          vocabularyId: vocabId,
          attempts: 0,
          correctCount: 0,
          masteryLevel: "new",
          nextReview: null,
          lastAttempt: null,
          fsrsState: null,
        };
      }

      const nextAttempts = progress.attempts + 1;
      const nextCorrect = progress.correctCount + (input.correct ? 1 : 0);
      const nextMastery = calculateMasteryLevel(nextAttempts, nextCorrect);

      // Apply FSRS review scheduling
      const existingCard = progress.fsrsState
        ? deserializeFSRSCard(progress.fsrsState)
        : null;

      const scheduleResult = scheduleReview(
        existingCard,
        input.correct,
        new Date(attempt.timestamp)
      );

      const updatedProgress: VocabularyProgress = {
        ...progress,
        attempts: nextAttempts,
        correctCount: nextCorrect,
        masteryLevel: nextMastery,
        lastAttempt: attempt.timestamp,
        nextReview: scheduleResult.nextReviewDate.getTime(),
        fsrsState: serializeFSRSCard(scheduleResult.card),
      };

      await db.vocabularyProgress.put(updatedProgress);
    }
  });

  return attempt;
}

/**
 * Retrieves the VocabularyProgress record for a specific vocabulary ID.
 */
export async function getVocabularyProgress(
  vocabularyId: string
): Promise<VocabularyProgress | undefined> {
  return db.vocabularyProgress.get(vocabularyId);
}

/**
 * Retrieves all VocabularyProgress records from the database.
 */
export async function getAllVocabularyProgress(): Promise<VocabularyProgress[]> {
  return db.vocabularyProgress.toArray();
}
