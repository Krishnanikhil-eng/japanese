import test from "node:test";
import assert from "node:assert/strict";
import { DB_SCHEMA_V1 } from "../../src/db/schema.ts";
import { DB_NAME, DB_VERSION } from "../../src/domain/enums.ts";

test("Database schema contains all required entity tables", () => {
  const expectedTables = [
    "lessons",
    "concepts",
    "vocabulary",
    "vocabularyProgress",
    "particles",
    "kanji",
    "questions",
    "attempts",
    "mockTests",
    "studySessions",
    "userState",
    "dictionary",
  ];

  for (const table of expectedTables) {
    assert.ok(
      table in DB_SCHEMA_V1,
      `Table '${table}' must be defined in DB_SCHEMA_V1`
    );
  }
});

test("Attempts table indexes support performance analytics", () => {
  const attemptsSchema = DB_SCHEMA_V1.attempts;
  assert.ok(attemptsSchema.includes("id"), "attempts must have primary key id");
  assert.ok(attemptsSchema.includes("questionId"), "attempts must index questionId");
  assert.ok(attemptsSchema.includes("conceptId"), "attempts must index conceptId");
  assert.ok(attemptsSchema.includes("correct"), "attempts must index correct status");
  assert.ok(attemptsSchema.includes("timestamp"), "attempts must index timestamp");
});

test("Vocabulary table indexes support search and filters", () => {
  const vocabSchema = DB_SCHEMA_V1.vocabulary;
  assert.ok(vocabSchema.includes("lessonId"), "vocabulary must index lessonId");
  assert.ok(vocabSchema.includes("jlptLevel"), "vocabulary must index jlptLevel");
  assert.ok(vocabSchema.includes("word"), "vocabulary must index word");
  assert.ok(vocabSchema.includes("reading"), "vocabulary must index reading");
});

test("Dictionary table indexes multi-entry kanji and readings", () => {
  const dictSchema = DB_SCHEMA_V1.dictionary;
  assert.ok(dictSchema.includes("*kanji"), "dictionary must multi-entry index kanji");
  assert.ok(dictSchema.includes("*readings"), "dictionary must multi-entry index readings");
});

test("Database configuration has valid name and version", () => {
  assert.equal(DB_NAME, "japanese-learning-companion");
  assert.equal(DB_VERSION, 1);
});
