// ============================================================
// Recommendation Service — Study Next Engine
// ============================================================
// Generates prioritized study recommendations based on real
// learner performance: weak areas, confusion pairs, and due reviews.
// Zero static or fake demo data.
// ============================================================

import { getWeakAreas, getDueReviews } from "@/services/analytics";
import { db } from "@/db";
import type { StudyRecommendation } from "@/types";

/**
 * Derives actionable study recommendations dynamically from real Attempt records
 * and SRS review schedules.
 */
export async function getStudyRecommendation(): Promise<StudyRecommendation[]> {
  const recommendations: StudyRecommendation[] = [];

  // 1. Check for real weak areas derived from user attempts
  const weakAreas = await getWeakAreas();

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
  const dueReviews = await getDueReviews();
  if (dueReviews.length > 0) {
    recommendations.push({
      conceptId: "srs-due-reviews",
      title: `Complete Due Reviews (${dueReviews.length} words)`,
      reason: `ts-fsrs has scheduled ${dueReviews.length} vocabulary ${dueReviews.length === 1 ? "card" : "cards"} for recall reinforcement.`,
      priority: 85,
      type: "vocabulary",
      questionCount: dueReviews.length,
    });
  }

  // 3. Fallback: If no urgent weak areas or reviews, recommend advancing the current lesson
  if (recommendations.length === 0) {
    const userState = await db.userState.get("default-user");
    const lessonId = userState?.currentLessonId || "lesson-01";
    const lesson = await db.lessons.get(lessonId);

    recommendations.push({
      conceptId: lessonId,
      title: lesson ? `Study ${lesson.title}` : "Study Next Lesson",
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
