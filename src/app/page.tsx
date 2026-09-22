"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  BookOpen,
  Languages,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Layers,
  GraduationCap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_JLPT_TARGET_DATE, DEFAULT_JLPT_LEVEL, ROUTES } from "@/domain/enums";

export default function HomePage() {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  const targetDateStr =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_JLPT_TARGET_DATE
      ? process.env.NEXT_PUBLIC_JLPT_TARGET_DATE
      : DEFAULT_JLPT_TARGET_DATE;

  useEffect(() => {
    const target = new Date(targetDateStr);
    const today = new Date();
    // Calculate full calendar days difference
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysRemaining(diffDays > 0 ? diffDays : 0);
  }, [targetDateStr]);

  return (
    <div className="space-y-8">
      {/* Hero Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl border bg-gradient-to-br from-rose-500/5 via-card to-background">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="sakura" className="gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Phase 1 — Foundation Ready</span>
            </Badge>
            <Badge variant="outline">Minna no Nihongo Companion</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            日本語 学習コンパニオン
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            A personal, local-first Japanese study companion. Powered by a single Attempt
            pipeline, Dexie IndexedDB, and official JLPT N5 timings.
          </p>
        </div>

        {/* JLPT Countdown Card */}
        <div className="bg-card border rounded-lg p-5 flex flex-col items-center justify-center min-w-[200px] shadow-sm text-center">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Calendar className="h-3.5 w-3.5 text-rose-500" />
            <span>JLPT {DEFAULT_JLPT_LEVEL} Target</span>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">
            {daysRemaining !== null ? `${daysRemaining}` : "..."}
            <span className="text-sm font-normal text-muted-foreground ml-1">days left</span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1">
            {targetDateStr}
          </span>
        </div>
      </div>

      {/* Quick Launch & Phase Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Application Modules Foundation</h2>
          <span className="text-xs text-muted-foreground">13 Dedicated Subsystems</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Lessons */}
          <Card className="hover:border-rose-500/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <BookOpen className="h-5 w-5 text-rose-500" />
                <Badge variant="outline" className="text-[10px]">Phase 2</Badge>
              </div>
              <CardTitle className="text-base mt-2">Minna Lessons</CardTitle>
              <CardDescription className="text-xs">
                Lessons 1–5 structured curriculum, grammar points, and unlock progression.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={ROUTES.lessons}>
                <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                  <span>Explore Module</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Vocabulary */}
          <Card className="hover:border-rose-500/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Languages className="h-5 w-5 text-rose-500" />
                <Badge variant="outline" className="text-[10px]">Phase 2</Badge>
              </div>
              <CardTitle className="text-base mt-2">Vocabulary Browser</CardTitle>
              <CardDescription className="text-xs">
                Search, topic filters, JLPT levels, and flashcard review queues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={ROUTES.vocabulary}>
                <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                  <span>Explore Module</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* JLPT Center */}
          <Card className="hover:border-rose-500/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <GraduationCap className="h-5 w-5 text-rose-500" />
                <Badge variant="outline" className="text-[10px]">Phase 7</Badge>
              </div>
              <CardTitle className="text-base mt-2">JLPT Center</CardTitle>
              <CardDescription className="text-xs">
                Official N5 timing: 20m Vocab, 40m Grammar/Reading, 30m Listening.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={ROUTES.jlpt}>
                <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                  <span>Explore Module</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Architecture Guarantees */}
      <div className="p-5 rounded-lg border bg-card/40 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-500" />
          <span>Phase 1 Architecture Specifications</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Local-first Dexie IndexedDB</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Single unified logAttempt() pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>ts-fsrs spaced repetition ready</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>WanaKana Japanese conversion</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>No external backend or auth overhead</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Clean light & dark Japanese theme</span>
          </div>
        </div>
      </div>
    </div>
  );
}
