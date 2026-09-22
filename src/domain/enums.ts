// ============================================================
// Japanese Learning Companion — Shared Enums & Constants
// ============================================================

// --- JLPT N5 Official Timing (seconds) ---

export const JLPT_N5_TIMING = {
  vocabulary: 20 * 60,          // 20 minutes
  grammar_reading: 40 * 60,     // 40 minutes
  listening: 30 * 60,           // 30 minutes
  full: 90 * 60,                // 90 minutes total
} as const;

// --- Default User Goals ---

export const DEFAULT_USER_GOALS = {
  dailyNewWords: 10,
  dailyReviews: 20,
  dailyStudyMinutes: 30,
} as const;

// --- Lesson Configuration ---

export const TOTAL_MINNA_LESSONS = 25;
export const INITIAL_SEED_LESSONS = 5;

// --- JLPT Target ---

export const DEFAULT_JLPT_TARGET_DATE = "2026-12-06";
export const DEFAULT_JLPT_LEVEL = "N5";

// --- Mastery Thresholds ---

export const MASTERY_THRESHOLDS = {
  new: 0,                       // 0 attempts
  learning: 1,                  // 1+ attempts, accuracy < 60%
  reviewing: 0.6,               // accuracy >= 60%
  mastered: 0.9,                // accuracy >= 90% with 5+ attempts
  minAttemptsForMastery: 5,
} as const;

// --- Question Types Display ---

export const QUESTION_TYPE_LABELS: Record<string, string> = {
  vocabulary: "Vocabulary",
  particle: "Particles",
  grammar: "Grammar",
  kana: "Kana",
  kanji: "Kanji",
  sentence: "Sentence Building",
  listening: "Listening",
} as const;

// --- JLPT Section Labels ---

export const JLPT_SECTION_LABELS: Record<string, string> = {
  vocabulary: "Vocabulary (もじ・ごい)",
  grammar_reading: "Grammar & Reading (ぶんぽう・どっかい)",
  listening: "Listening (ちょうかい)",
} as const;

// --- Navigation Routes ---

export const ROUTES = {
  home: "/",
  lessons: "/lessons",
  vocabulary: "/vocabulary",
  dictionary: "/dictionary",
  kana: "/kana",
  particles: "/particles",
  sentenceBuilder: "/sentence-builder",
  kanji: "/kanji",
  quiz: "/quiz",
  listening: "/listening",
  aiTeacher: "/ai-teacher",
  jlpt: "/jlpt",
  progress: "/progress",
} as const;

// --- Database ---

export const DB_NAME = "japanese-learning-companion";
export const DB_VERSION = 1;
