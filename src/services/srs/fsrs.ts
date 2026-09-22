// ============================================================
// SRS Service — ts-fsrs Integration
// ============================================================
// Industry-standard Free Spaced Repetition Scheduler (FSRS).
// Manages card memory states, intervals, and next review dates.
// ============================================================

import {
  fsrs,
  createEmptyCard,
  Rating,
  type Card,
  type State,
} from "ts-fsrs";
import { MASTERY_THRESHOLDS } from "@/domain/enums";
import type { MasteryLevel } from "@/types";

export { Rating };
export type { Card, State };

// Standard FSRS scheduler instance
const fsrsEngine = fsrs({
  request_retention: 0.9,
  maximum_interval: 365,
});

/**
 * Creates a brand new empty FSRS card initialized at the given timestamp.
 */
export function initCard(now = new Date()): Card {
  return createEmptyCard(now);
}

export interface ReviewScheduleResult {
  card: Card;
  nextReviewDate: Date;
  rating: Rating;
  state: State;
}

/**
 * Schedules the next review for a card based on answer correctness.
 * Correct answers apply Rating.Good; incorrect answers apply Rating.Again.
 */
export function scheduleReview(
  existingCard: Card | null | undefined,
  isCorrect: boolean,
  now = new Date()
): ReviewScheduleResult {
  const card = existingCard ? { ...existingCard } : initCard(now);
  const rating = isCorrect ? Rating.Good : Rating.Again;

  const repeatRecord = fsrsEngine.repeat(card, now);
  const scheduledItem = repeatRecord[rating];

  return {
    card: scheduledItem.card,
    nextReviewDate: new Date(scheduledItem.card.due),
    rating,
    state: scheduledItem.card.state,
  };
}

/**
 * Serializes an FSRS Card object to a compact JSON string for storage in Dexie.
 */
export function serializeFSRSCard(card: Card): string {
  return JSON.stringify(card);
}

/**
 * Deserializes an FSRS Card from stored JSON, converting date strings back to Date objects.
 */
export function deserializeFSRSCard(json: string): Card {
  const parsed = JSON.parse(json);
  return {
    ...parsed,
    due: new Date(parsed.due),
    last_review: parsed.last_review ? new Date(parsed.last_review) : undefined,
  };
}

/**
 * Deterministically computes the qualitative MasteryLevel based on attempts and accuracy.
 */
export function calculateMasteryLevel(
  attempts: number,
  correctCount: number
): MasteryLevel {
  if (attempts <= 0) {
    return "new";
  }

  const accuracy = correctCount / attempts;

  if (
    attempts >= MASTERY_THRESHOLDS.minAttemptsForMastery &&
    accuracy >= MASTERY_THRESHOLDS.mastered
  ) {
    return "mastered";
  }

  if (accuracy >= MASTERY_THRESHOLDS.reviewing) {
    return "reviewing";
  }

  return "learning";
}
