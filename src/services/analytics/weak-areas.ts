// ============================================================
// Analytics Service — Weak Area & Confusion Detection
// ============================================================
// DERIVED DIRECTLY FROM REAL ATTEMPT DATA.
// No fake metrics or static weak-area mocks.
// Analyzes accuracy, error frequency, and confusion pairings.
// ============================================================

import { db } from "@/db";
import { PARTICLES } from "@/data/particles";
import type { WeakArea, Attempt } from "@/types";

/**
 * Derives current weak areas by aggregating historical Attempt records.
 * Identifies concepts with low accuracy (< 70%) or recent recurring mistakes.
 */
export async function getWeakAreas(): Promise<WeakArea[]> {
  const allAttempts = await db.attempts.toArray();

  if (allAttempts.length === 0) {
    return [];
  }

  // Group attempts by conceptId
  const attemptsByConcept = new Map<string, Attempt[]>();
  for (const attempt of allAttempts) {
    const list = attemptsByConcept.get(attempt.conceptId) || [];
    list.push(attempt);
    attemptsByConcept.set(attempt.conceptId, list);
  }

  const weakAreas: WeakArea[] = [];

  for (const [conceptId, attempts] of attemptsByConcept.entries()) {
    // Sort attempts chronologically
    attempts.sort((a, b) => a.timestamp - b.timestamp);

    const totalAttempts = attempts.length;
    const correctCount = attempts.filter((a) => a.correct).length;
    const accuracy = totalAttempts > 0 ? correctCount / totalAttempts : 0;

    // Recent mistakes in the last 5 attempts for this concept
    const recentWindow = attempts.slice(-5);
    const recentMistakes = recentWindow.filter((a) => !a.correct).length;

    // A concept is a weak area if accuracy is under 70% or there are recent mistakes with at least 1 wrong answer
    const hasWeakness =
      (totalAttempts >= 1 && accuracy < 0.7) ||
      recentMistakes >= 1;

    if (!hasWeakness) {
      continue;
    }

    const conceptType = attempts[0]?.conceptType || "grammar";

    // Detect confusion pairs: inspect wrong answers given
    const confusionWith = new Set<string>();
    for (const a of attempts) {
      if (!a.correct && a.answer && a.answer !== "incorrect_self_rating") {
        confusionWith.add(a.answer);
      }
    }

    // Add mapped confusion pairs for known particles
    if (conceptType === "particle") {
      const particleMeta = PARTICLES.find(
        (p) => p.id === conceptId || `particle-${p.particle}` === conceptId
      );
      if (particleMeta) {
        for (const pairId of particleMeta.confusionPairs) {
          confusionWith.add(pairId.replace("particle-", ""));
        }
      }
    }

    // Resolve human-readable title
    let title = conceptId;
    if (conceptId.startsWith("particle-")) {
      const pChar = conceptId.replace("particle-", "");
      title = `Particle 「${pChar}」`;
    } else if (conceptId.startsWith("vocab-")) {
      const vocab = await db.vocabulary.get(conceptId);
      title = vocab ? `${vocab.word} (${vocab.meaning})` : conceptId;
    } else if (conceptId.startsWith("concept-")) {
      const concept = await db.concepts.get(conceptId);
      title = concept ? concept.title : conceptId;
    }

    weakAreas.push({
      conceptId,
      conceptType,
      title,
      accuracy,
      totalAttempts,
      recentMistakes,
      confusionWith: Array.from(confusionWith),
    });
  }

  // Sort by priority: lowest accuracy and highest recent mistakes first
  weakAreas.sort((a, b) => {
    if (a.accuracy !== b.accuracy) {
      return a.accuracy - b.accuracy;
    }
    return b.recentMistakes - a.recentMistakes;
  });

  return weakAreas;
}
