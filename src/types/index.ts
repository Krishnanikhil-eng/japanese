// ============================================================
// Japanese Learning Companion — Shared Domain Types
// ============================================================
// This file defines the core domain contracts used across
// both the Learning Engine and Practice Engine.
// Do not independently redesign this schema.
// ============================================================

// --- Question & Content Types ---

export type QuestionType =
  | "vocabulary"
  | "particle"
  | "grammar"
  | "kana"
  | "kanji"
  | "sentence"
  | "listening";

export type JLPTSection =
  | "vocabulary"
  | "grammar_reading"
  | "listening";

export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export type MasteryLevel =
  | "new"
  | "learning"
  | "reviewing"
  | "mastered";

export type LessonStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "completed";

export type ConceptType =
  | "grammar"
  | "particle"
  | "vocabulary"
  | "kanji"
  | "expression";

// --- Core Data Contracts ---

export interface Lesson {
  id: string;
  number: number;               // Minna lesson number (1–25)
  title: string;
  titleJa: string;              // Japanese title
  topic: string;
  status: LessonStatus;
  description: string;
  objectives: string[];
  vocabularyCount: number;
  grammarPoints: string[];
}

export interface Concept {
  id: string;
  lessonId: string;
  type: ConceptType;
  title: string;
  titleJa: string;
  description: string;
  examples: ConceptExample[];
  prerequisites: string[];      // Concept IDs
}

export interface ConceptExample {
  japanese: string;
  reading: string;
  english: string;
  notes?: string;
}

export interface Vocabulary {
  id: string;
  lessonId: string;
  word: string;                 // Kanji or kana form
  reading: string;              // Hiragana reading
  meaning: string;              // English meaning
  partOfSpeech: string;
  jlptLevel: JLPTLevel;
  topic: string;
  examples: VocabularyExample[];
}

export interface VocabularyExample {
  japanese: string;
  reading: string;
  english: string;
}

export interface VocabularyProgress {
  id: string;
  vocabularyId: string;
  attempts: number;
  correctCount: number;
  masteryLevel: MasteryLevel;
  nextReview: number | null;    // Timestamp
  lastAttempt: number | null;   // Timestamp
  fsrsState: string | null;     // Serialized FSRS card state
}

export interface Particle {
  id: string;
  particle: string;             // e.g., "は", "が", "に", "で"
  uses: ParticleUse[];
  confusionPairs: string[];     // Other particle IDs often confused with
}

export interface ParticleUse {
  meaning: string;
  description: string;
  examples: ConceptExample[];
}

export interface Kanji {
  id: string;
  character: string;
  meanings: string[];
  kunReadings: string[];
  onReadings: string[];
  jlptLevel: JLPTLevel;
  strokeCount: number;
  vocabularyLinks: string[];    // Vocabulary IDs
}

export interface Question {
  id: string;
  type: QuestionType;
  conceptId: string;
  section: JLPTSection;
  difficulty: number;           // 1–5
  prompt: string;
  promptJa?: string;
  options?: string[];           // For multiple choice
  correctAnswer: string;
  explanation?: string;
  audioText?: string;           // Text to speak for listening questions
}

export interface MockTest {
  id: string;
  section: JLPTSection | "full";
  questionIds: string[];
  timeLimit: number;            // Seconds
  startedAt: number | null;
  completedAt: number | null;
  score: number | null;
  totalQuestions: number;
  correctAnswers: number;
}

export interface StudySession {
  id: string;
  date: string;                 // ISO date string
  duration: number;             // Seconds
  activities: StudyActivity[];
}

export interface StudyActivity {
  type: QuestionType | "review" | "lesson" | "mock_test";
  count: number;
  correctCount: number;
}

export interface UserState {
  id: string;
  currentLessonId: string;
  unlockedLessonIds: string[];
  unlockedConceptIds: string[];
  goals: UserGoals;
  jlptTargetDate: string;      // ISO date
  jlptLevel: JLPTLevel;
  createdAt: number;
  updatedAt: number;
}

export interface UserGoals {
  dailyNewWords: number;
  dailyReviews: number;
  dailyStudyMinutes: number;
}

// --- Attempt Pipeline (THE core contract) ---

export interface AttemptInput {
  questionId: string;
  conceptId: string;
  conceptType: string;
  answer: string;
  correct: boolean;
  timestamp: number;
}

export interface Attempt extends AttemptInput {
  id: string;
}

// --- Recommendation Engine ---

export interface StudyRecommendation {
  conceptId: string;
  title: string;
  reason: string;
  questionCount?: number;
  priority: number;             // Higher = more urgent
  type: QuestionType;
}

export interface WeakArea {
  conceptId: string;
  conceptType: string;
  title: string;
  accuracy: number;             // 0–1
  totalAttempts: number;
  recentMistakes: number;
  confusionWith?: string[];     // What it's confused with
}

// --- AI Teacher ---

export interface LearnerContext {
  currentLesson: Lesson | null;
  knownVocabulary: string[];    // Vocabulary IDs
  knownGrammar: string[];       // Concept IDs
  knownParticles: string[];     // Particle IDs
  weakAreas: WeakArea[];
  recentMistakes: Attempt[];
  overallAccuracy: number;
  studyStreak: number;
}

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIRequest {
  messages: AIMessage[];
  learnerContext: LearnerContext;
  mode: "explain" | "correct" | "hint" | "generate" | "conversation";
}

export interface AIResponse {
  content: string;
  generatedQuestions?: Question[];
}

// --- Audio Provider ---

export interface AudioPlaybackOptions {
  text: string;
  lang: string;                 // e.g., "ja-JP"
  rate?: number;                // 0.1–10, default 1
  pitch?: number;               // 0–2, default 1
}

// --- Backup ---

export interface BackupData {
  version: number;
  exportedAt: string;           // ISO timestamp
  lessons: Lesson[];
  vocabulary: Vocabulary[];
  vocabularyProgress: VocabularyProgress[];
  particles: Particle[];
  kanji: Kanji[];
  questions: Question[];
  attempts: Attempt[];
  mockTests: MockTest[];
  studySessions: StudySession[];
  userState: UserState | null;
}

// --- Dictionary (JMdict) ---

export interface DictionaryEntry {
  id: string;
  kanji: string[];              // Kanji forms
  readings: string[];           // Kana readings
  meanings: DictionaryMeaning[];
  jlptLevel?: JLPTLevel;
  commonWord: boolean;
}

export interface DictionaryMeaning {
  partOfSpeech: string[];
  glosses: string[];            // English definitions
}
