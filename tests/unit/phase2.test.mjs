import test from "node:test";
import assert from "node:assert/strict";
import { SEED_LESSONS } from "../../src/data/lessons/index.ts";

test("Phase 2: Exactly 5 seed lessons are populated", () => {
  assert.equal(SEED_LESSONS.length, 5, "Seed bundle must contain exactly 5 lessons");
  const numbers = SEED_LESSONS.map((bundle) => bundle.lesson.number);
  assert.deepEqual(numbers, [1, 2, 3, 4, 5], "Lessons must be numbered sequentially from 1 to 5");
});

test("Phase 2: All 5 lessons have complete curriculum metadata", () => {
  for (const bundle of SEED_LESSONS) {
    const { lesson } = bundle;
    assert.ok(lesson.id.startsWith("lesson-0"), `Lesson id must follow format: ${lesson.id}`);
    assert.ok(lesson.title.length > 0, "Lesson must have English title");
    assert.ok(lesson.titleJa.length > 0, "Lesson must have Japanese title");
    assert.ok(lesson.grammarPoints.length >= 3, "Lesson must contain at least 3 grammar points");
    assert.ok(lesson.objectives.length >= 3, "Lesson must contain at least 3 objectives");
    assert.equal(lesson.vocabularyCount, bundle.vocabulary.length, "Reported vocabulary count must match actual item array");
  }
});

test("Phase 2: Total seeded vocabulary count and unique IDs", () => {
  const allVocab = SEED_LESSONS.flatMap((b) => b.vocabulary);
  assert.equal(allVocab.length, 80, "Expected 80 total vocabulary items across Lessons 1–5 (16 each)");

  const ids = new Set(allVocab.map((v) => v.id));
  assert.equal(ids.size, allVocab.length, "Every vocabulary item must have a unique ID (no collisions)");
});

test("Phase 2: Vocabulary attributes conform to domain contract", () => {
  const allVocab = SEED_LESSONS.flatMap((b) => b.vocabulary);
  for (const item of allVocab) {
    assert.ok(item.word && item.word.length > 0, "Item must have word");
    assert.ok(item.reading && item.reading.length > 0, "Item must have reading");
    assert.ok(item.meaning && item.meaning.length > 0, "Item must have meaning");
    assert.equal(item.jlptLevel, "N5", "All Lesson 1–5 vocabulary must be JLPT N5");
    assert.ok(item.partOfSpeech && item.partOfSpeech.length > 0, "Item must have partOfSpeech");
    assert.ok(item.topic && item.topic.length > 0, "Item must have topic");
    assert.ok(Array.isArray(item.examples), "Item must have examples array");
  }
});

test("Phase 2: Concepts have unique IDs and valid prerequisites", () => {
  const allConcepts = SEED_LESSONS.flatMap((b) => b.concepts);
  assert.ok(allConcepts.length >= 15, "Expected at least 15 total grammar/particle concepts");

  const conceptIds = new Set(allConcepts.map((c) => c.id));
  assert.equal(conceptIds.size, allConcepts.length, "All concept IDs must be unique");

  for (const concept of allConcepts) {
    assert.ok(concept.title && concept.title.length > 0, "Concept must have title");
    assert.ok(concept.examples.length > 0, "Concept must have at least one example sentence");
    assert.ok(Array.isArray(concept.prerequisites), "Prerequisites must be an array");
  }
});
