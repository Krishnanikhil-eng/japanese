// ============================================================
// Recommendation Service — Study Next Engine
// ============================================================
// Generates prioritized study recommendations based on real
// learner performance: weak areas, confusion pairs, and due reviews.
// Zero static or fake demo data.
// ============================================================

import { getWeakAreas, getDueReviews } from "../analytics/index.ts";
import { db } from "../../db/index.ts";
import type { StudyRecommendation, WeakArea } from "@/types";

/**
 * Pure recommendation calculation algorithm.
 * Evaluates weak areas, ts-fsrs due review load, and lesson progress.
 */
export function calculateStudyRecommendations(
  weakAreas: WeakArea[],
  dueReviewsCount: number = 0,
  fallbackLessonTitle?: string
): StudyRecommendation[] {
  const recommendations: StudyRecommendation[] = [];

  // 1. Check for real weak areas derived from user attempts
  for (const weak of weakAreas) {
    let title = `Review ${weak.title}`;
    let reason = `Accuracy is ${Math.round(weak.accuracy * 100)}% with ${weak.recentMistakes} recent mistake${weak.recentMistakes === 1 ? "" : "s"}.`;

    if (weak.confusionWith && weak.confusionWith.length > 0) {
      reason += ` Frequently confused with: ${weak.confusionWith.join(", ")}.`;
    }

    // High priority for low accuracy and recurring mistakes
    const priority = 100 - Math.round(weak.accuracy * 50) + weak.recentMistakes * 10;

    recommendations.push({
      conceptId: weak.conceptId,
      title,
      reason,
      priority,
      type: weak.conceptType === "particle" ? "particle" : "vocabulary",
      questionCount: Math.min(10, Math.max(5, weak.recentMistakes * 3)),
    });
  }

  // 2. Check for due SRS reviews
  if (dueReviewsCount > 0) {
    recommendations.push({
      conceptId: "srs-due-reviews",
      title: `Complete Due Reviews (${dueReviewsCount} words)`,
      reason: `ts-fsrs has scheduled ${dueReviewsCount} vocabulary ${dueReviewsCount === 1 ? "card" : "cards"} for recall reinforcement.`,
      priority: 85,
      type: "vocabulary",
      questionCount: dueReviewsCount,
    });
  }

  // 3. Fallback: If no urgent weak areas or reviews, recommend advancing the current lesson
  if (recommendations.length === 0) {
    recommendations.push({
      conceptId: "current-lesson",
      title: fallbackLessonTitle ? `Study ${fallbackLessonTitle}` : "Study Next Lesson",
      reason: "No current weaknesses detected. Advance through new grammar and vocabulary.",
      priority: 50,
      type: "grammar",
      questionCount: 10,
    });
  }

  // Sort by priority descending
  recommendations.sort((a, b) => b.priority - a.priority);

  return recommendations;
}

/**
 * Derives actionable study recommendations dynamically from real Attempt records
 * in Dexie and SRS review schedules.
 */
export async function getStudyRecommendation(): Promise<StudyRecommendation[]> {
  const weakAreas = await getWeakAreas();
  const dueReviews = await getDueReviews();

  let fallbackTitle: string | undefined;
  if (weakAreas.length === 0 && dueReviews.length === 0) {
    const userState = await db.userState.get("default-user");
    const lessonId = userState?.currentLessonId || "lesson-01";
    const lesson = await db.lessons.get(lessonId);
    fallbackTitle = lesson?.title;
  }

  return calculateStudyRecommendations(weakAreas, dueReviews.length, fallbackTitle);
}
