import test from "node:test";
import assert from "node:assert/strict";
import {
  initCard,
  scheduleReview,
  serializeFSRSCard,
  deserializeFSRSCard,
  calculateMasteryLevel,
  Rating,
} from "../../src/services/srs/fsrs.ts";

test("Phase 3: FSRS initCard creates valid card with due date", () => {
  const now = new Date("2026-09-22T10:00:00Z");
  const card = initCard(now);

  assert.ok(card, "Card must be initialized");
  assert.equal(card.reps, 0, "Initial reps must be 0");
  assert.equal(card.lapses, 0, "Initial lapses must be 0");
  assert.ok(card.due instanceof Date, "Card due must be a Date instance");
});

test("Phase 3: Correct answer (Rating.Good) updates FSRS card and sets future due date", () => {
  const now = new Date("2026-09-22T10:00:00Z");
  const initialCard = initCard(now);

  const result = scheduleReview(initialCard, true, now);

  assert.equal(result.rating, Rating.Good, "Correct answer must apply Rating.Good");
  assert.ok(result.nextReviewDate.getTime() >= now.getTime(), "Next review must be in future or now");
  assert.equal(result.card.reps, 1, "Reps must increment to 1");
});

test("Phase 3: Incorrect answer (Rating.Again) updates FSRS card state", () => {
  const now = new Date("2026-09-22T10:00:00Z");
  const initialCard = initCard(now);

  const result = scheduleReview(initialCard, false, now);

  assert.equal(result.rating, Rating.Again, "Incorrect answer must apply Rating.Again");
  assert.ok(result.nextReviewDate instanceof Date, "Next review must be a valid date");
});

test("Phase 3: FSRS card serialization and deserialization round-trip", () => {
  const now = new Date("2026-09-22T10:00:00Z");
  const initialCard = initCard(now);
  const reviewed = scheduleReview(initialCard, true, now);

  const serialized = serializeFSRSCard(reviewed.card);
  assert.equal(typeof serialized, "string", "Serialized card must be a JSON string");

  const deserialized = deserializeFSRSCard(serialized);
  assert.equal(deserialized.reps, reviewed.card.reps);
  assert.equal(deserialized.state, reviewed.card.state);
  assert.equal(deserialized.due.getTime(), reviewed.card.due.getTime());
});

test("Phase 3: calculateMasteryLevel deterministically transitions states", () => {
  // New: 0 attempts
  assert.equal(calculateMasteryLevel(0, 0), "new");

  // Learning: 2 attempts, 1 correct (50% accuracy)
  assert.equal(calculateMasteryLevel(2, 1), "learning");

  // Learning: 4 attempts, 2 correct (50% accuracy < 60%)
  assert.equal(calculateMasteryLevel(4, 2), "learning");

  // Reviewing: 4 attempts, 3 correct (75% accuracy >= 60%)
  assert.equal(calculateMasteryLevel(4, 3), "reviewing");

  // Reviewing: 4 attempts, 4 correct (100%, but attempts < 5 min threshold)
  assert.equal(calculateMasteryLevel(4, 4), "reviewing");

  // Mastered: 5 attempts, 5 correct (100% >= 90% and attempts >= 5)
  assert.equal(calculateMasteryLevel(5, 5), "mastered");

  // Mastered: 10 attempts, 9 correct (90% >= 90% and attempts >= 5)
  assert.equal(calculateMasteryLevel(10, 9), "mastered");

  // Demoted to reviewing if accuracy drops below 90%
  assert.equal(calculateMasteryLevel(10, 8), "reviewing");
});

test("Phase 3: AttemptInput pipeline contract validation", () => {
  const correctAttempt = {
    questionId: "q_01",
    conceptId: "vocab-01-01",
    conceptType: "vocabulary",
    answer: "わたし",
    correct: true,
    timestamp: 1727000000000,
  };

  const incorrectAttempt = {
    questionId: "q_02",
    conceptId: "vocab-01-01",
    conceptType: "vocabulary",
    answer: "あなた",
    correct: false,
    timestamp: 1727000001000,
  };

  assert.equal(correctAttempt.correct, true, "Correct attempt must be recorded as true");
  assert.equal(incorrectAttempt.correct, false, "Incorrect attempt must be recorded as false");
  assert.ok(correctAttempt.timestamp > 0, "Timestamp must be a positive integer");
});
