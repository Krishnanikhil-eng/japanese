"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Shuffle, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logAttempt } from "@/services/learning";
import type { Vocabulary } from "@/types";

interface FlashcardDeckProps {
  items: Vocabulary[];
  onBackToBrowse: () => void;
  onAttemptLogged?: () => void;
}

export function FlashcardDeck({
  items,
  onBackToBrowse,
  onAttemptLogged,
}: FlashcardDeckProps) {
  const [deck, setDeck] = useState<Vocabulary[]>(items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setDeck(items);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [items]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setFeedback(null);
    setCurrentIndex((prev) => (prev < deck.length - 1 ? prev + 1 : 0));
  }, [deck.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setFeedback(null);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : deck.length - 1));
  }, [deck.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleGrade = async (isCorrect: boolean) => {
    const current = deck[currentIndex];
    if (!current) return;

    await logAttempt({
      questionId: `flashcard_${current.id}`,
      conceptId: current.id,
      conceptType: "vocabulary",
      answer: isCorrect ? current.meaning : "incorrect_self_rating",
      correct: isCorrect,
      timestamp: Date.now(),
    });

    setFeedback(isCorrect ? "✓ Good! Saved to FSRS queue" : "✕ Again! Scheduled for relearning");
    if (onAttemptLogged) {
      onAttemptLogged();
    }

    setTimeout(() => {
      handleNext();
    }, 600);
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setFeedback(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleFlip();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "1" && isFlipped) {
        e.preventDefault();
        handleGrade(false);
      } else if (e.key === "2" && isFlipped) {
        e.preventDefault();
        handleGrade(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, isFlipped]);

  if (deck.length === 0) {
    return (
      <div className="py-16 text-center space-y-3 border rounded-xl bg-card/40 p-6">
        <p className="text-sm text-muted-foreground">
          No vocabulary cards available for the current filter selection.
        </p>
        <Button variant="outline" size="sm" onClick={onBackToBrowse}>
          Back to Browse
        </Button>
      </div>
    );
  }

  const current = deck[currentIndex];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Controls Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBackToBrowse} className="text-xs">
          ← Back to Browse
        </Button>
        <div className="flex items-center gap-2">
          {feedback && (
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 animate-in fade-in-0">
              {feedback}
            </span>
          )}
          <Badge variant="outline" className="font-mono text-xs">
            {currentIndex + 1} / {deck.length}
          </Badge>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShuffle}
            title="Shuffle deck"
            aria-label="Shuffle deck"
            className="h-8 w-8"
          >
            <Shuffle className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Flashcard Card */}
      <div
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? "Flip to front" : "Flip to back"}
        className="cursor-pointer perspective-1000 select-none focus:outline-none"
      >
        <Card className="min-h-[320px] flex flex-col justify-between p-8 border-2 hover:border-rose-500/80 transition-all shadow-md bg-gradient-to-br from-card via-card to-secondary/30 text-center relative overflow-hidden">
          {/* Top badges */}
          <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
            <Badge variant="sakura">{current.jlptLevel}</Badge>
            <span className="capitalize font-medium text-[11px]">
              {current.lessonId.replace("-0", " ").replace("-", " ")}
            </span>
          </div>

          {/* Card Body */}
          <div className="py-8 space-y-3">
            {!isFlipped ? (
              // FRONT
              <div className="space-y-4 animate-in fade-in-50">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Japanese Word
                </span>
                <h2 className="text-5xl font-extrabold tracking-tight text-foreground">
                  {current.word}
                </h2>
                <p className="text-xs text-muted-foreground/80 pt-2">
                  (Click or press Space to reveal meaning)
                </p>
              </div>
            ) : (
              // BACK
              <div className="space-y-3 animate-in fade-in-50">
                <span className="text-sm font-semibold text-muted-foreground block">
                  {current.reading}
                </span>
                <h3 className="text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                  {current.meaning}
                </h3>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-secondary text-secondary-foreground font-mono">
                  {current.partOfSpeech}
                </span>

                {current.examples && current.examples[0] && (
                  <div className="mt-4 pt-4 border-t text-xs text-left bg-card/60 p-3 rounded-md space-y-1">
                    <p className="font-semibold text-foreground">
                      {current.examples[0].japanese}
                    </p>
                    <p className="text-muted-foreground">
                      {current.examples[0].reading}
                    </p>
                    <p className="text-muted-foreground italic">
                      "{current.examples[0].english}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Indicator */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <RotateCw className="h-3.5 w-3.5 text-rose-500" />
            <span>{isFlipped ? "Grade your recall below" : "Click to flip"}</span>
          </div>
        </Card>
      </div>

      {/* Grading Controls (Active when card is flipped) */}
      {isFlipped ? (
        <div className="space-y-2 animate-in fade-in-50">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="destructive"
              size="default"
              onClick={() => handleGrade(false)}
              className="flex-1 gap-1.5 font-semibold"
            >
              <X className="h-4 w-4" />
              <span>Again (Incorrect) [1]</span>
            </Button>
            <Button
              variant="sakura"
              size="default"
              onClick={() => handleGrade(true)}
              className="flex-1 gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="h-4 w-4" />
              <span>Good (Correct) [2]</span>
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground">
            Grading automatically records an Attempt and schedules next review using ts-fsrs.
          </p>
        </div>
      ) : (
        /* Standard Navigation */
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            className="flex-1 gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleFlip}
            className="flex-1"
          >
            Flip Card
          </Button>

          <Button
            variant="sakura"
            size="sm"
            onClick={handleNext}
            className="flex-1 gap-1"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
