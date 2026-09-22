"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllLessons } from "@/services/learning";
import { BookOpen, CheckCircle2, ArrowRight, Languages, Sparkles } from "lucide-react";
import { ROUTES } from "@/domain/enums";
import type { Lesson } from "@/types";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAllLessons().then((data) => {
      if (isMounted) {
        setLessons(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Minna no Nihongo Curriculum</h1>
            <Badge variant="sakura">Lessons 1–5 Seeded</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Structured Japanese grammar patterns, vocabulary terms, and progressive learning milestones.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading lessons from database...
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="hover:border-rose-500/50 transition-all overflow-hidden">
              <CardHeader className="p-5 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center text-sm shrink-0">
                      第{lesson.number}課
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-foreground">
                        {lesson.title}
                      </h2>
                      <span className="text-xs text-muted-foreground font-normal">
                        {lesson.titleJa}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Badge variant="outline" className="text-[11px] gap-1">
                      <Languages className="h-3 w-3 text-rose-500" />
                      <span>{lesson.vocabularyCount} words</span>
                    </Badge>
                    <Badge variant="bamboo" className="text-[11px]">
                      {lesson.status}
                    </Badge>
                  </div>
                </div>

                <CardDescription className="text-xs pt-2">
                  {lesson.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4">
                {/* Grammar Points */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Core Grammar Patterns
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lesson.grammarPoints.map((point, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground font-mono"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Objectives */}
                <div className="space-y-1 text-xs text-muted-foreground">
                  {lesson.objectives.slice(0, 3).map((obj, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-3 border-t">
                  <Link href={ROUTES.vocabulary}>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <Languages className="h-3.5 w-3.5" />
                      <span>Study Vocabulary</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
