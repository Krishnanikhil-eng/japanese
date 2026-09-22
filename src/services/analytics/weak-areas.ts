// ============================================================
// Analytics Service — Weak Area & Confusion Detection
// ============================================================
// DERIVED DIRECTLY FROM REAL ATTEMPT DATA.
// No fake metrics or static weak-area mocks.
// Analyzes accuracy, error frequency, and confusion pairings.
// ============================================================

import { db } from "../../db/index.ts";
import { PARTICLES } from "../../data/particles/index.ts";
import type { WeakArea, Attempt, Particle } from "@/types";

/**
 * Pure calculation engine for weak areas and confusion pairings from attempt history.
 * Fully deterministic and isolated for unit testing.
 */
export function calculateWeakAreasFromAttempts(
  allAttempts: Attempt[],
  particlesMeta: Particle[] = PARTICLES,
  titleResolver?: (conceptId: string, conceptType: string) => string
): WeakArea[] {
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

    // A concept is a weak area if accuracy is under 70% or there are multiple recent mistakes
    const hasWeakness =
      (totalAttempts >= 1 && accuracy < 0.7) ||
      recentMistakes >= 2;

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
      const particleMeta = particlesMeta.find(
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
    if (titleResolver) {
      title = titleResolver(conceptId, conceptType);
    } else if (conceptId.startsWith("particle-")) {
      const pMeta = particlesMeta.find(
        (p) => p.id === conceptId || `particle-${p.particle}` === conceptId
      );
      if (pMeta) {
        title = `Particle 「${pMeta.particle}」`;
      } else {
        const pChar = conceptId.replace("particle-", "");
        title = `Particle 「${pChar}」`;
      }
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

/**
 * Derives current weak areas by aggregating historical Attempt records from Dexie IndexedDB.
 */
export async function getWeakAreas(): Promise<WeakArea[]> {
  const allAttempts = await db.attempts.toArray();

  if (allAttempts.length === 0) {
    return [];
  }

  // Asynchronously resolve vocab and concept titles
  const vocabMap = new Map<string, string>();
  const conceptMap = new Map<string, string>();

  const nonParticleConcepts = Array.from(
    new Set(allAttempts.filter((a) => a.conceptType !== "particle").map((a) => a.conceptId))
  );

  for (const cId of nonParticleConcepts) {
    if (cId.startsWith("vocab-")) {
      const v = await db.vocabulary.get(cId);
      if (v) vocabMap.set(cId, `${v.word} (${v.meaning})`);
    } else if (cId.startsWith("concept-")) {
      const c = await db.concepts.get(cId);
      if (c) conceptMap.set(cId, c.title);
    }
  }

  return calculateWeakAreasFromAttempts(
    allAttempts,
    PARTICLES,
    (conceptId, _conceptType) => {
      if (conceptId.startsWith("particle-")) {
        const pChar = conceptId.replace("particle-", "");
        return `Particle 「${pChar}」`;
      }
      if (vocabMap.has(conceptId)) return vocabMap.get(conceptId)!;
      if (conceptMap.has(conceptId)) return conceptMap.get(conceptId)!;
      return conceptId;
    }
  );
}
