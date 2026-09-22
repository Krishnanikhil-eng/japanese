import test from "node:test";
import assert from "node:assert/strict";
import { PARTICLES, CONFUSION_PAIRS } from "../../src/data/particles/index.ts";
import { calculateWeakAreasFromAttempts } from "../../src/services/analytics/weak-areas.ts";
import { calculateStudyRecommendations } from "../../src/services/recommendation/engine.ts";

test("Phase 4: Particle dataset completeness (11 JLPT N5 particles)", () => {
  assert.equal(PARTICLES.length, 11, "Must contain exactly 11 core JLPT N5 particles");

  const expectedParticles = ["は", "が", "を", "に", "で", "へ", "と", "も", "の", "から", "まで"];
  const particleChars = PARTICLES.map((p) => p.particle);
  assert.deepEqual(
    particleChars.sort(),
    expectedParticles.sort(),
    "All 11 essential N5 particles must be present"
  );

  for (const p of PARTICLES) {
    assert.ok(p.id.startsWith("particle-"), `Particle id must follow pattern: ${p.id}`);
    assert.ok(p.particle.length >= 1, "Particle must have character");
    assert.ok(p.uses.length >= 1, "Particle must have at least 1 usage definition");
    assert.ok(Array.isArray(p.confusionPairs), "Particle must have confusionPairs array");

    for (const use of p.uses) {
      assert.ok(use.meaning.length > 0, "Usage must define meaning");
      assert.ok(use.description.length > 0, "Usage must define description");
      assert.ok(use.examples.length >= 1, "Usage must provide at least 1 example");
    }
  }
});

test("Phase 4: Particle confusion pairs completeness (5 essential pairs)", () => {
  assert.equal(CONFUSION_PAIRS.length, 5, "Must contain 5 essential N5 confusion pairs");

  const expectedPairIds = [
    "pair-ni-de",
    "pair-wa-ga",
    "pair-ni-e",
    "pair-to-de",
    "pair-kara-made",
  ];
  const pairIds = CONFUSION_PAIRS.map((cp) => cp.id);
  assert.deepEqual(pairIds.sort(), expectedPairIds.sort(), "All 5 expected pairs must be present");

  for (const cp of CONFUSION_PAIRS) {
    assert.ok(cp.title.length > 0, "Confusion pair must have title");
    assert.ok(cp.distinction.length > 0, "Confusion pair must explain linguistic distinction");
    assert.ok(cp.comparisonExamples.length >= 2, "Must have at least 2 contrasting examples");

    for (const ex of cp.comparisonExamples) {
      assert.ok(ex.sentence.includes("___"), "Contrasting example must contain blank placeholder");
      assert.ok(ex.correctParticle.length > 0, "Must specify correct particle");
      assert.ok(ex.wrongParticle.length > 0, "Must specify wrong particle");
      assert.ok(ex.explanation.length > 0, "Must specify clear contrast explanation");
    }
  }
});

test("Phase 4: Critical pipeline — Wrong particle answer triggers weak area and confusion detection", () => {
  // Scenario: User answers particle question for 「に」 incorrectly with 「で」
  const attempts = [
    {
      id: "att-001",
      questionId: "q-particle-ni-01",
      conceptId: "particle-ni",
      conceptType: "particle",
      answer: "で", // Mistake: chose で instead of に
      correct: false,
      timestamp: 1727000000000,
    },
  ];

  const weakAreas = calculateWeakAreasFromAttempts(attempts, PARTICLES);

  assert.equal(weakAreas.length, 1, "Exactly 1 weak area must be detected from the incorrect attempt");
  const weak = weakAreas[0];
  assert.equal(weak.conceptId, "particle-ni");
  assert.equal(weak.conceptType, "particle");
  assert.equal(weak.title, "Particle 「に」");
  assert.equal(weak.accuracy, 0, "Accuracy must be 0% for 1 failed attempt");
  assert.equal(weak.totalAttempts, 1);
  assert.equal(weak.recentMistakes, 1);

  // Confusion tracking: user answered 'で', and mapped confusion pairs include 'de' and 'e'
  assert.ok(weak.confusionWith.includes("で"), "Detected confusion must include wrong answer 'で'");
  assert.ok(weak.confusionWith.includes("de"), "Detected confusion must include mapped confusion pair 'de'");
});

test("Phase 4: Weak area directly influences Study Next recommendation", () => {
  // 1. Generate weak area from incorrect attempt
  const attempts = [
    {
      id: "att-001",
      questionId: "q-particle-ni-01",
      conceptId: "particle-ni",
      conceptType: "particle",
      answer: "で",
      correct: false,
      timestamp: 1727000000000,
    },
  ];

  const weakAreas = calculateWeakAreasFromAttempts(attempts, PARTICLES);
  assert.equal(weakAreas.length, 1);

  // 2. Feed into recommendation engine
  const recommendations = calculateStudyRecommendations(weakAreas, 0);

  assert.ok(recommendations.length >= 1, "At least one recommendation must be generated");
  const topRec = recommendations[0];

  assert.equal(topRec.conceptId, "particle-ni");
  assert.equal(topRec.title, "Review Particle 「に」");
  assert.equal(topRec.type, "particle");
  assert.ok(topRec.reason.includes("Accuracy is 0%"), "Reason must state actual derived accuracy");
  assert.ok(topRec.reason.includes("1 recent mistake"), "Reason must report recent mistake count");
  assert.ok(topRec.reason.includes("Frequently confused with: で"), "Reason must note identified confusion partner");
  assert.ok(topRec.priority > 85, "Weak area priority must be higher than normal study");
});

test("Phase 4: Repeated attempts dynamically update weakness state (improvement clears weakness)", () => {
  // Stage 1: Initial mistake (0% accuracy -> weak area)
  const initialAttempts = [
    {
      id: "att-001",
      questionId: "q-particle-ni-01",
      conceptId: "particle-ni",
      conceptType: "particle",
      answer: "で",
      correct: false,
      timestamp: 1000,
    },
  ];

  let weakAreas = calculateWeakAreasFromAttempts(initialAttempts, PARTICLES);
  assert.equal(weakAreas.length, 1, "Initial failure must be flagged as weak area");
  assert.equal(weakAreas[0].accuracy, 0);

  // Stage 2: User performs 5 consecutive correct answers on particle-ni
  const improvedAttempts = [
    ...initialAttempts,
    { id: "att-002", questionId: "q-particle-ni-02", conceptId: "particle-ni", conceptType: "particle", answer: "に", correct: true, timestamp: 2000 },
    { id: "att-003", questionId: "q-particle-ni-03", conceptId: "particle-ni", conceptType: "particle", answer: "に", correct: true, timestamp: 3000 },
    { id: "att-004", questionId: "q-particle-ni-04", conceptId: "particle-ni", conceptType: "particle", answer: "に", correct: true, timestamp: 4000 },
    { id: "att-005", questionId: "q-particle-ni-05", conceptId: "particle-ni", conceptType: "particle", answer: "に", correct: true, timestamp: 5000 },
    { id: "att-006", questionId: "q-particle-ni-06", conceptId: "particle-ni", conceptType: "particle", answer: "に", correct: true, timestamp: 6000 },
  ];

  weakAreas = calculateWeakAreasFromAttempts(improvedAttempts, PARTICLES);
  // Total attempts: 6, correct: 5 -> accuracy = 5/6 = 83.3% (>= 70%)
  // Recent 5 attempts: all 5 correct -> recentMistakes = 0 (< 2)
  assert.equal(weakAreas.length, 0, "Weak area must clear after user achieves mastery and accuracy >= 70%");
});

test("Phase 4: Repeated mistakes intensify weak area priority", () => {
  // 3 consecutive failures
  const severeAttempts = [
    { id: "att-01", questionId: "q-01", conceptId: "particle-de", conceptType: "particle", answer: "に", correct: false, timestamp: 1000 },
    { id: "att-02", questionId: "q-02", conceptId: "particle-de", conceptType: "particle", answer: "に", correct: false, timestamp: 2000 },
    { id: "att-03", questionId: "q-03", conceptId: "particle-de", conceptType: "particle", answer: "へ", correct: false, timestamp: 3000 },
  ];

  const weakAreas = calculateWeakAreasFromAttempts(severeAttempts, PARTICLES);
  assert.equal(weakAreas.length, 1);
  assert.equal(weakAreas[0].recentMistakes, 3);
  assert.equal(weakAreas[0].totalAttempts, 3);
  assert.equal(weakAreas[0].accuracy, 0);

  const recs = calculateStudyRecommendations(weakAreas, 0);
  assert.equal(recs.length, 1);
  // Priority: 100 - 0 + (3 * 10) = 130
  assert.equal(recs[0].priority, 130, "Priority must scale with mistake severity");
  assert.equal(recs[0].questionCount, 9, "Recommended drill length scales with mistake count (3 * 3 = 9)");
});

test("Phase 4: Fallback recommendation when no weak areas or due reviews exist", () => {
  const emptyWeakAreas = [];
  const recs = calculateStudyRecommendations(emptyWeakAreas, 0, "Lesson 1");

  assert.equal(recs.length, 1, "Must generate exactly 1 fallback progression recommendation");
  assert.equal(recs[0].type, "grammar");
  assert.equal(recs[0].priority, 50, "Fallback priority must be baseline 50");
  assert.ok(recs[0].title.includes("Lesson 1"));
});
