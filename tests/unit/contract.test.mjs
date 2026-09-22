import test from "node:test";
import assert from "node:assert/strict";
import {
  JLPT_N5_TIMING,
  DEFAULT_USER_GOALS,
  TOTAL_MINNA_LESSONS,
  INITIAL_SEED_LESSONS,
  DEFAULT_JLPT_TARGET_DATE,
  ROUTES,
  DB_NAME,
} from "../../src/domain/enums.ts";

test("JLPT N5 official timings match master specification", () => {
  assert.equal(JLPT_N5_TIMING.vocabulary, 20 * 60, "Vocabulary must be 20 minutes (1200s)");
  assert.equal(JLPT_N5_TIMING.grammar_reading, 40 * 60, "Grammar/Reading must be 40 minutes (2400s)");
  assert.equal(JLPT_N5_TIMING.listening, 30 * 60, "Listening must be 30 minutes (1800s)");
  assert.equal(JLPT_N5_TIMING.full, 90 * 60, "Full test must be 90 minutes total");
});

test("Lesson configuration aligns with incremental seed strategy", () => {
  assert.equal(TOTAL_MINNA_LESSONS, 25, "Total Minna lessons architecture must support 25");
  assert.equal(INITIAL_SEED_LESSONS, 5, "Initial seed scope is 5 lessons");
});

test("Default JLPT target date is December 6, 2026", () => {
  assert.equal(DEFAULT_JLPT_TARGET_DATE, "2026-12-06");
});

test("All 13 application modules have designated routes", () => {
  const expectedRoutes = [
    "home",
    "lessons",
    "vocabulary",
    "dictionary",
    "kana",
    "particles",
    "sentenceBuilder",
    "kanji",
    "quiz",
    "listening",
    "aiTeacher",
    "jlpt",
    "progress",
  ];
  for (const routeKey of expectedRoutes) {
    assert.ok(ROUTES[routeKey], `Route for ${routeKey} must be defined`);
  }
});

test("Dexie database identifier is configured", () => {
  assert.equal(DB_NAME, "japanese-learning-companion");
});
