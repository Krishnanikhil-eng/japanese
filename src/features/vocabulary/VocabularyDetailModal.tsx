"use client";

import { useEffect } from "react";
import { X, BookOpen, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Vocabulary } from "@/types";

interface VocabularyDetailModalProps {
  item: Vocabulary | null;
  onClose: () => void;
}

export function VocabularyDetailModal({ item, onClose }: VocabularyDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div
        className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Word Title & Readings */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="sakura">{item.jlptLevel}</Badge>
            <Badge variant="outline" className="capitalize">
              {item.lessonId.replace("lesson-", "Lesson ")}
            </Badge>
            <span className="text-xs text-muted-foreground ml-auto pr-8">
              {item.partOfSpeech}
            </span>
          </div>
          <span className="text-sm text-muted-foreground block pt-2">
            {item.reading}
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            {item.word}
          </h2>
          <p className="text-base text-rose-600 dark:text-rose-400 font-medium">
            {item.meaning}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-secondary/50 text-xs">
          <div className="flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Topic:</span>
            <span className="font-medium text-foreground">{item.topic}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Minna:</span>
            <span className="font-medium text-foreground capitalize">
              {item.lessonId.replace("-0", " ").replace("-", " ")}
            </span>
          </div>
        </div>

        {/* Examples Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Example Sentences
          </h4>
          {item.examples && item.examples.length > 0 ? (
            <div className="space-y-2.5">
              {item.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border bg-card/60 space-y-1 text-sm"
                >
                  <p className="font-semibold text-foreground">{ex.japanese}</p>
                  <p className="text-xs text-muted-foreground">{ex.reading}</p>
                  <p className="text-xs text-muted-foreground italic pt-0.5">
                    "{ex.english}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No example sentences recorded for this term.
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
