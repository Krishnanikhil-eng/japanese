// ============================================================
// Repository Service — Learning Data Access
// ============================================================
// Centralized queries for Lessons, Concepts, and Vocabulary.
// Connects UI components to local Dexie IndexedDB tables.
// ============================================================

import { db } from "@/db";
import { seedInitialContent } from "./seed";
import type { Lesson, Concept, Vocabulary, JLPTLevel } from "@/types";

export interface VocabularyQueryFilters {
  lessonId?: string;
  jlptLevel?: JLPTLevel | "all";
  partOfSpeech?: string | "all";
  topic?: string | "all";
  searchQuery?: string;
}

/**
 * Ensures the database contains baseline seed content before querying.
 */
export async function ensureContentSeeded(): Promise<void> {
  const count = await db.lessons.count();
  if (count === 0) {
    await seedInitialContent();
  }
}

/**
 * Retrieves all Minna no Nihongo lessons sorted by lesson number.
 */
export async function getAllLessons(): Promise<Lesson[]> {
  await ensureContentSeeded();
  return db.lessons.orderBy("number").toArray();
}

/**
 * Retrieves a single lesson by its ID.
 */
export async function getLessonById(id: string): Promise<Lesson | undefined> {
  await ensureContentSeeded();
  return db.lessons.get(id);
}

/**
 * Retrieves all concepts associated with a specific lesson.
 */
export async function getConceptsByLesson(lessonId: string): Promise<Concept[]> {
  await ensureContentSeeded();
  return db.concepts.where("lessonId").equals(lessonId).toArray();
}

/**
 * Retrieves vocabulary items with optional multi-attribute search and filtering.
 */
export async function getVocabulary(filters?: VocabularyQueryFilters): Promise<Vocabulary[]> {
  await ensureContentSeeded();
  let collection = db.vocabulary.toCollection();

  if (filters?.lessonId && filters.lessonId !== "all") {
    collection = db.vocabulary.where("lessonId").equals(filters.lessonId);
  }

  let items = await collection.toArray();

  if (filters?.jlptLevel && filters.jlptLevel !== "all") {
    items = items.filter((item) => item.jlptLevel === filters.jlptLevel);
  }

  if (filters?.partOfSpeech && filters.partOfSpeech !== "all") {
    items = items.filter((item) => item.partOfSpeech === filters.partOfSpeech);
  }

  if (filters?.topic && filters.topic !== "all") {
    items = items.filter((item) => item.topic === filters.topic);
  }

  if (filters?.searchQuery && filters.searchQuery.trim().length > 0) {
    const q = filters.searchQuery.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.word.toLowerCase().includes(q) ||
        item.reading.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q)
    );
  }

  return items;
}

/**
 * Retrieves a single vocabulary word by ID.
 */
export async function getVocabularyById(id: string): Promise<Vocabulary | undefined> {
  await ensureContentSeeded();
  return db.vocabulary.get(id);
}

/**
 * Retrieves distinct topic tags across all vocabulary items for filter chips.
 */
export async function getVocabularyTopics(): Promise<string[]> {
  await ensureContentSeeded();
  const all = await db.vocabulary.toArray();
  const topics = new Set(all.map((item) => item.topic));
  return Array.from(topics).sort();
}
