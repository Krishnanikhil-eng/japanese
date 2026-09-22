"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VocabularyFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLesson: string;
  onLessonChange: (lessonId: string) => void;
  selectedPos: string;
  onPosChange: (pos: string) => void;
  totalCount: number;
}

const LESSON_OPTIONS = [
  { id: "all", label: "All Lessons" },
  { id: "lesson-01", label: "Lesson 1" },
  { id: "lesson-02", label: "Lesson 2" },
  { id: "lesson-03", label: "Lesson 3" },
  { id: "lesson-04", label: "Lesson 4" },
  { id: "lesson-05", label: "Lesson 5" },
];

const POS_OPTIONS = [
  { id: "all", label: "All Parts of Speech" },
  { id: "noun", label: "Nouns" },
  { id: "verb", label: "Verbs" },
  { id: "pronoun", label: "Pronouns" },
  { id: "counter", label: "Counters" },
  { id: "adverb", label: "Adverbs" },
  { id: "phrase", label: "Phrases" },
];

export function VocabularyFilters({
  searchQuery,
  onSearchChange,
  selectedLesson,
  onLessonChange,
  selectedPos,
  onPosChange,
  totalCount,
}: VocabularyFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar & Stats */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by kanji, reading, or English meaning..."
            className="w-full h-9 pl-9 pr-8 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{totalCount}</strong> vocabulary terms
          </span>
        </div>
      </div>

      {/* Lesson Selection Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-muted-foreground text-xs shrink-0 mr-1 font-medium">
          Lesson:
        </span>
        {LESSON_OPTIONS.map((opt) => (
          <Button
            key={opt.id}
            variant={selectedLesson === opt.id ? "default" : "outline"}
            size="sm"
            onClick={() => onLessonChange(opt.id)}
            className="h-7 px-2.5 text-xs shrink-0"
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Part of Speech Selection Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-muted-foreground text-xs shrink-0 mr-1 font-medium">
          Type:
        </span>
        {POS_OPTIONS.map((opt) => (
          <Button
            key={opt.id}
            variant={selectedPos === opt.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onPosChange(opt.id)}
            className="h-7 px-2.5 text-xs shrink-0"
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
