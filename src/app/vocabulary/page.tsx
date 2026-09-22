"use client";

import { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VocabularyCard } from "@/features/vocabulary/VocabularyCard";
import { VocabularyFilters } from "@/features/vocabulary/VocabularyFilters";
import { VocabularyDetailModal } from "@/features/vocabulary/VocabularyDetailModal";
import { getVocabulary } from "@/services/learning";
import { Layers, SearchX } from "lucide-react";
import type { Vocabulary } from "@/types";

export default function VocabularyPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("all");
  const [selectedPos, setSelectedPos] = useState("all");
  const [selectedItem, setSelectedItem] = useState<Vocabulary | null>(null);

  useEffect(() => {
    let isMounted = true;
    getVocabulary().then((items) => {
      if (isMounted) {
        setVocabulary(items);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    return vocabulary.filter((item) => {
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
  }, [vocabulary, selectedLesson, selectedPos, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Vocabulary Browser</h1>
            <Badge variant="sakura">Lessons 1–5</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Search, explore, and study {vocabulary.length} core vocabulary items persisted in local Dexie IndexedDB.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <VocabularyFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLesson={selectedLesson}
        onLessonChange={setSelectedLesson}
        selectedPos={selectedPos}
        onPosChange={setSelectedPos}
        totalCount={filteredItems.length}
      />

      {/* Loading & Grid Results */}
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

      {/* Detail Modal */}
      <VocabularyDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
