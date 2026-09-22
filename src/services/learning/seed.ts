// ============================================================
// Seed Service — Idempotent Curriculum Loader
// ============================================================
// Seeds initial Lessons 1–5, Concepts, and Vocabulary into Dexie.
// Guarantee: Re-running this function is idempotent and never creates duplicate records.
// ============================================================

import { db } from "@/db";
import { SEED_LESSONS } from "@/data/lessons";
import { DEFAULT_JLPT_TARGET_DATE, DEFAULT_JLPT_LEVEL, DEFAULT_USER_GOALS } from "@/domain/enums";
import type { Lesson, Concept, Vocabulary, UserState } from "@/types";

export interface SeedResult {
  seeded: boolean;
  lessonsCount: number;
  conceptsCount: number;
  vocabularyCount: number;
}

/**
 * Seeds Lessons 1–5, Concepts, and Vocabulary into Dexie.
 * If data already exists and force is false, it skips seeding to preserve existing user data.
 * When force is true, it upserts via bulkPut, preventing any duplicate entries.
 */
export async function seedInitialContent(force = false): Promise<SeedResult> {
  const existingLessons = await db.lessons.count();

  if (existingLessons > 0 && !force) {
    const [lessonsCount, conceptsCount, vocabularyCount] = await Promise.all([
      db.lessons.count(),
      db.concepts.count(),
      db.vocabulary.count(),
    ]);

    return {
      seeded: false,
      lessonsCount,
      conceptsCount,
      vocabularyCount,
    };
  }

  const allLessons: Lesson[] = [];
  const allConcepts: Concept[] = [];
  const allVocabulary: Vocabulary[] = [];

  for (const bundle of SEED_LESSONS) {
    allLessons.push(bundle.lesson);
    allConcepts.push(...bundle.concepts);
    allVocabulary.push(...bundle.vocabulary);
  }

  // Perform bulk upsert in a single atomic transaction
  await db.transaction("rw", [db.lessons, db.concepts, db.vocabulary, db.userState], async () => {
    await db.lessons.bulkPut(allLessons);
    await db.concepts.bulkPut(allConcepts);
    await db.vocabulary.bulkPut(allVocabulary);

    // Initialize UserState if not already present
    const existingState = await db.userState.get("default-user");
    if (!existingState) {
      const initialUserState: UserState = {
        id: "default-user",
        currentLessonId: "lesson-01",
        unlockedLessonIds: allLessons.map((l) => l.id),
        unlockedConceptIds: allConcepts.map((c) => c.id),
        goals: DEFAULT_USER_GOALS,
        jlptTargetDate: DEFAULT_JLPT_TARGET_DATE,
        jlptLevel: DEFAULT_JLPT_LEVEL,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await db.userState.put(initialUserState);
    }
  });

  return {
    seeded: true,
    lessonsCount: allLessons.length,
    conceptsCount: allConcepts.length,
    vocabularyCount: allVocabulary.length,
  };
}
