// ============================================================
// Database — Dexie IndexedDB Foundation
// ============================================================
// Central persistent storage for the local-first application.
// No backend or remote database is used.
// ============================================================

import Dexie, { type Table } from "dexie";
import { DB_NAME, DB_VERSION } from "../domain/enums.ts";
import { DB_SCHEMA_V1 } from "./schema.ts";
import type {
  Lesson,
  Concept,
  Vocabulary,
  VocabularyProgress,
  Particle,
  Kanji,
  Question,
  Attempt,
  MockTest,
  StudySession,
  UserState,
  DictionaryEntry,
} from "@/types";

export class JapaneseLearningDB extends Dexie {
  lessons!: Table<Lesson, string>;
  concepts!: Table<Concept, string>;
  vocabulary!: Table<Vocabulary, string>;
  vocabularyProgress!: Table<VocabularyProgress, string>;
  particles!: Table<Particle, string>;
  kanji!: Table<Kanji, string>;
  questions!: Table<Question, string>;
  attempts!: Table<Attempt, string>;
  mockTests!: Table<MockTest, string>;
  studySessions!: Table<StudySession, string>;
  userState!: Table<UserState, string>;
  dictionary!: Table<DictionaryEntry, string>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores(DB_SCHEMA_V1);
  }
}

// Singleton database instance
export const db = new JapaneseLearningDB();

/**
 * Ensures the Dexie database can open cleanly.
 * Useful for health checks and startup validation.
 */
export async function initDatabase(): Promise<boolean> {
  try {
    if (!db.isOpen()) {
      await db.open();
    }
    return true;
  } catch (error) {
    console.error("Failed to open Dexie database:", error);
    return false;
  }
}

export * from "./schema.ts";
