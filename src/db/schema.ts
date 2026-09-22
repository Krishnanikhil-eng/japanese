// ============================================================
// Database Schema — Dexie Store Definitions
// ============================================================
// Defines table index schemas for all domain entities.
// Reuses exact types from src/types/index.ts.
// ============================================================

export const DB_SCHEMA_V1 = {
  // Minna Lessons
  lessons: "id, number, status",

  // Grammar & Particle Concepts
  concepts: "id, lessonId, type",

  // Vocabulary Items
  vocabulary: "id, lessonId, word, reading, jlptLevel, topic",

  // Vocabulary Learning & SRS State
  vocabularyProgress: "id, vocabularyId, masteryLevel, nextReview, lastAttempt",

  // Particles & Confusion Mappings
  particles: "id, particle",

  // N5 Kanji Characters
  kanji: "id, character, jlptLevel",

  // Practice & Exam Questions
  questions: "id, type, conceptId, section, difficulty",

  // Unified Attempt Pipeline Records (Denominators for all analytics)
  attempts: "id, questionId, conceptId, conceptType, correct, timestamp",

  // JLPT Mock Test Sessions
  mockTests: "id, section, startedAt, completedAt",

  // Daily Study Tracking
  studySessions: "id, date",

  // User Learning State & Goals
  userState: "id",

  // Local JMdict-Derived Dictionary
  dictionary: "id, *kanji, *readings, jlptLevel, commonWord",
} as const;
