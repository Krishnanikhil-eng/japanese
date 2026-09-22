"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { logAttempt } from "@/services/learning";

interface PracticeItem {
  id: string;
  conceptId: string; // e.g. "particle-ni"
  sentence: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  english: string;
}

const PRACTICE_ITEMS: PracticeItem[] = [
  {
    id: "particle-q1",
    conceptId: "particle-ni",
    sentence: "部屋 ___ 猫がいます。",
    options: ["に", "で", "を", "へ"],
    correctAnswer: "に",
    explanation: "います expresses static existence; the location where something exists requires に.",
    english: "There is a cat in the room.",
  },
  {
    id: "particle-q2",
    conceptId: "particle-de",
    sentence: "図書館 ___ 勉強します。",
    options: ["で", "に", "へ", "を"],
    correctAnswer: "で",
    explanation: "勉強します is a dynamic action verb; the location where an action takes place requires で.",
    english: "I study in the library.",
  },
  {
    id: "particle-q3",
    conceptId: "particle-ni",
    sentence: "毎朝7時 ___ 起きます。",
    options: ["に", "で", "を", "は"],
    correctAnswer: "に",
    explanation: "Specific numerical times take particle に.",
    english: "I wake up at 7 o'clock every morning.",
  },
  {
    id: "particle-q4",
    conceptId: "particle-de",
    sentence: "バス ___ 学校へ行きます。",
    options: ["で", "に", "を", "と"],
    correctAnswer: "で",
    explanation: "Vehicles and transportation methods take particle で.",
    english: "I go to school by bus.",
  },
  {
    id: "particle-q5",
    conceptId: "particle-e",
    sentence: "明日東京 ___ 行きます。",
    options: ["へ", "で", "を", "から"],
    correctAnswer: "へ",
    explanation: "Directions and destinations of movement verbs take particle へ (or に).",
    english: "I will go to Tokyo tomorrow.",
  },
  {
    id: "particle-q6",
    conceptId: "particle-wa",
    sentence: "わたし ___ 学生です。",
    options: ["は", "が", "に", "で"],
    correctAnswer: "は",
    explanation: "The topic of identity statements takes particle は.",
    english: "I am a student.",
  },
  {
    id: "particle-q7",
    conceptId: "particle-ga",
    sentence: "雨 ___ 降っています。",
    options: ["が", "は", "を", "に"],
    correctAnswer: "が",
    explanation: "Natural phenomena and unprompted subject descriptions take particle が.",
    english: "Rain is falling.",
  },
  {
    id: "particle-q8",
    conceptId: "particle-to",
    sentence: "友だち ___ 映画を見ました。",
    options: ["と", "で", "に", "を"],
    correctAnswer: "と",
    explanation: "Accompaniment (doing an action with someone) takes particle と.",
    english: "I watched a movie with a friend.",
  },
];

interface ParticlePracticeDrillProps {
  onAttemptLogged?: () => void;
}

export function ParticlePracticeDrill({ onAttemptLogged }: ParticlePracticeDrillProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });

  const current = PRACTICE_ITEMS[currentIndex];

  const handleSelectOption = async (option: string) => {
    if (hasSubmitted) return;

    setSelectedAnswer(option);
    setHasSubmitted(true);

    const isCorrect = option === current.correctAnswer;

    // Central pipeline rule: EVERY answer flows through logAttempt()
    await logAttempt({
      questionId: current.id,
      conceptId: current.conceptId,
      conceptType: "particle",
      answer: option,
      correct: isCorrect,
      timestamp: Date.now(),
    });

    setSessionScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (onAttemptLogged) {
      onAttemptLogged();
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setCurrentIndex((prev) => (prev + 1) % PRACTICE_ITEMS.length);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setSessionScore({ correct: 0, total: 0 });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Targeted Particle Practice
          </span>
          <p className="text-xs text-muted-foreground">
            Question {currentIndex + 1} of {PRACTICE_ITEMS.length}
          </p>
        </div>

        {sessionScore.total > 0 && (
          <Badge variant="outline" className="font-mono text-xs">
            Score: {sessionScore.correct} / {sessionScore.total} (
            {Math.round((sessionScore.correct / sessionScore.total) * 100)}%)
          </Badge>
        )}
      </div>

      {/* Main Practice Question Card */}
      <Card className="p-6 space-y-6 border-2">
        <CardHeader className="p-0 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="sakura">JLPT N5 Drill</Badge>
            <span className="text-xs text-muted-foreground italic">
              "{current.english}"
            </span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight pt-2">
            {current.sentence.split("___").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="inline-block mx-1.5 px-3 py-1 rounded border-2 border-dashed border-rose-500 text-rose-600 dark:text-rose-400 font-extrabold bg-rose-500/5">
                    {hasSubmitted ? selectedAnswer : " ? "}
                  </span>
                )}
              </span>
            ))}
          </CardTitle>
        </CardHeader>

        {/* Options */}
        <CardContent className="p-0 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {current.options.map((opt) => {
              let btnVariant: "outline" | "default" | "destructive" | "sakura" = "outline";
              if (hasSubmitted) {
                if (opt === current.correctAnswer) {
                  btnVariant = "sakura";
                } else if (opt === selectedAnswer) {
                  btnVariant = "destructive";
                }
              }

              return (
                <Button
                  key={opt}
                  variant={btnVariant}
                  size="lg"
                  onClick={() => handleSelectOption(opt)}
                  disabled={hasSubmitted}
                  className="text-xl font-bold h-14"
                >
                  {opt}
                </Button>
              );
            })}
          </div>

          {/* Answer Feedback */}
          {hasSubmitted && (
            <div
              className={`p-4 rounded-lg border text-xs space-y-1.5 animate-in fade-in-0 ${
                selectedAnswer === current.correctAnswer
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                  : "bg-destructive/10 border-destructive/30 text-destructive-foreground"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-sm">
                {selectedAnswer === current.correctAnswer ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Correct! Correct particle logged to Attempt database.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span>Incorrect! Logged to Attempt database as a weakness.</span>
                  </>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {current.explanation}
              </p>
            </div>
          )}
        </CardContent>

        {/* Action Controls */}
        {hasSubmitted && (
          <div className="flex justify-end pt-2">
            <Button variant="default" size="sm" onClick={handleNext} className="gap-1 text-xs">
              <span>Next Question</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
