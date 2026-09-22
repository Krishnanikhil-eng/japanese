"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VocabularyCard } from "@/features/vocabulary/VocabularyCard";
import { VocabularyFilters } from "@/features/vocabulary/VocabularyFilters";
import { VocabularyDetailModal } from "@/features/vocabulary/VocabularyDetailModal";
import { FlashcardDeck } from "@/features/vocabulary/FlashcardDeck";
import { ReviewQueueBanner } from "@/features/vocabulary/ReviewQueueBanner";
import { getVocabulary } from "@/services/learning";
import { getDueReviews, getOverallAnalytics } from "@/services/analytics";
import { LayoutGrid, Layers, SearchX, Activity } from "lucide-react";
import type { Vocabulary } from "@/types";

export default function VocabularyPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("all");
  const [selectedPos, setSelectedPos] = useState("all");
  const [selectedItem, setSelectedItem] = useState<Vocabulary | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "flashcards">("grid");

  // Phase 3 SRS and analytics states
  const [dueVocabIds, setDueVocabIds] = useState<string[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalAttempts: 0,
    accuracy: 0,
    correctCount: 0,
  });

  const refreshData = useCallback(async () => {
    const [items, due, stats] = await Promise.all([
      getVocabulary(),
      getDueReviews(),
      getOverallAnalytics(),
    ]);
    setVocabulary(items);
    setDueVocabIds(due);
    setAnalytics({
      totalAttempts: stats.totalAttempts,
      accuracy: stats.accuracy,
      correctCount: stats.correctCount,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const filteredItems = useMemo(() => {
    return vocabulary.filter((item) => {
      if (isReviewMode && !dueVocabIds.includes(item.id)) {
        return false;
      }
      if (selectedLesson !== "all" && item.lessonId !== selectedLesson) {
        return false;
      }
      if (selectedPos !== "all" && item.partOfSpeech !== selectedPos) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.trim().toLowerCase();
        const matchesWord = item.word.toLowerCase().includes(q);
        const matchesReading = item.reading.toLowerCase().includes(q);
        const matchesMeaning = item.meaning.toLowerCase().includes(q);
        if (!matchesWord && !matchesReading && !matchesMeaning) {
          return false;
        }
      }
      return true;
    });
  }, [vocabulary, isReviewMode, dueVocabIds, selectedLesson, selectedPos, searchQuery]);

  const handleStartReview = () => {
    setIsReviewMode(true);
    setViewMode("flashcards");
  };

  return (
    <div className="space-y-6">
      {/* Page Header with SRS Stats & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Vocabulary & Spaced Repetition</h1>
            <Badge variant="sakura">Lessons 1–5</Badge>
            {analytics.totalAttempts > 0 && (
              <Badge variant="outline" className="gap-1 text-[11px]">
                <Activity className="h-3 w-3 text-rose-500" />
                <span>
                  Accuracy: {Math.round(analytics.accuracy * 100)}% ({analytics.correctCount}/{analytics.totalAttempts})
                </span>
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {vocabulary.length} items persisted in Dexie. Powered by ts-fsrs memory scheduling.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border bg-card/60 self-start sm:self-auto">
          <Button
            variant={viewMode === "grid" && !isReviewMode ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setIsReviewMode(false);
              setViewMode("grid");
            }}
            className="gap-1.5 text-xs h-8"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Browse Grid</span>
          </Button>
          <Button
            variant={viewMode === "flashcards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("flashcards")}
            className="gap-1.5 text-xs h-8"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Flashcards ({filteredItems.length})</span>
          </Button>
        </div>
      </div>

      {/* Review Queue Banner */}
      <ReviewQueueBanner
        dueCount={dueVocabIds.length}
        onStartReview={handleStartReview}
      />

      {isReviewMode && (
        <div className="flex items-center justify-between p-3 rounded-md bg-secondary/60 text-xs">
          <span>
            Studying <strong className="text-rose-600 dark:text-rose-400">Due Reviews Only</strong> ({filteredItems.length} cards)
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReviewMode(false)}
            className="h-6 px-2 text-[11px]"
          >
            Show All Vocabulary
          </Button>
        </div>
      )}

      {viewMode === "flashcards" ? (
        /* Flashcard Study Mode with live attempt logger */
        <FlashcardDeck
          items={filteredItems}
          onBackToBrowse={() => {
            setIsReviewMode(false);
            setViewMode("grid");
          }}
          onAttemptLogged={refreshData}
        />
      ) : (
        /* Browse Grid Mode */
        <>
          {/* Filters Toolbar */}
          <VocabularyFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedLesson={selectedLesson}
            onLessonChange={setSelectedLesson}
            selectedPos={selectedPos}
            onPosChange={setSelectedPos}
            totalCount={filteredItems.length}
          />

          {/* Loading or Results */}
          {loading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading vocabulary database...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 border rounded-xl bg-card/40 text-center flex flex-col items-center justify-center p-6 space-y-3">
              <SearchX className="h-10 w-10 text-muted-foreground/60" />
              <h3 className="font-semibold text-base">No vocabulary items match your criteria</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Try adjusting your search keyword, clearing filters, or switching lesson selections.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsReviewMode(false);
                  setSearchQuery("");
                  setSelectedLesson("all");
                  setSelectedPos("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <VocabularyCard
                  key={item.id}
                  item={item}
                  onSelect={setSelectedItem}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <VocabularyDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
