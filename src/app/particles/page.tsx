"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PARTICLES } from "@/data/particles";
import { ParticleCard } from "@/features/particles/ParticleCard";
import { ParticleComparisonView } from "@/features/particles/ParticleComparisonView";
import { ParticlePracticeDrill } from "@/features/particles/ParticlePracticeDrill";
import { getWeakAreas } from "@/services/analytics";
import { getStudyRecommendation } from "@/services/recommendation";
import type { WeakArea, StudyRecommendation } from "@/types";
import {
  Sparkles,
  AlertTriangle,
  ArrowRightLeft,
  BookOpen,
  Target,
  CheckCircle2,
  RefreshCw,
  TrendingDown,
} from "lucide-react";

export default function ParticlesPage() {
  const [activeTab, setActiveTab] = useState<"reference" | "confusion" | "drill">("drill");
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAnalytics = useCallback(async () => {
    try {
      const [areas, recs] = await Promise.all([
        getWeakAreas(),
        getStudyRecommendation(),
      ]);
      setWeakAreas(areas);
      setRecommendations(recs);
    } catch (err) {
      console.error("Failed to load weak areas/recommendations:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  // Filter particle-specific weak areas
  const particleWeakAreas = weakAreas.filter(
    (w) => w.conceptType === "particle" || w.conceptId.startsWith("particle-")
  );

  const topRecommendation = recommendations.find(
    (r) => r.type === "particle" || r.conceptId.startsWith("particle-")
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Particle Lab & Confusion Pairs</h1>
            <Badge variant="sakura" className="text-xs">
              JLPT N5
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Master tricky Japanese particles (助詞) through targeted drills and confusion contrast pairs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAnalytics}
            disabled={isLoading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Sync Analytics</span>
          </Button>
        </div>
      </div>

      {/* Dynamic Weak-Area & Recommendation Banner */}
      {particleWeakAreas.length > 0 ? (
        <Card className="border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent shadow-sm">
          <CardHeader className="p-4 sm:p-5 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base text-rose-950 dark:text-rose-200 flex items-center gap-2">
                    <span>Weak Particle Areas Detected</span>
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0 font-mono">
                      {particleWeakAreas.length} Weakness{particleWeakAreas.length > 1 ? "es" : ""}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs text-rose-900/70 dark:text-rose-300/70">
                    Derived directly from your recent practice attempts in IndexedDB.
                  </CardDescription>
                </div>
              </div>

              {topRecommendation && (
                <Button
                  size="sm"
                  variant="sakura"
                  onClick={() => setActiveTab("drill")}
                  className="hidden sm:inline-flex text-xs font-semibold gap-1.5"
                >
                  <Target className="h-3.5 w-3.5" />
                  <span>Drill Weak Area</span>
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {particleWeakAreas.map((weak) => (
                <div
                  key={weak.conceptId}
                  className="p-3 rounded-lg border border-rose-500/20 bg-background/80 space-y-1.5 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm">
                      {weak.title}
                    </span>
                    <Badge variant="outline" className="text-[10px] text-rose-600 dark:text-rose-400 border-rose-500/30 font-mono">
                      {Math.round(weak.accuracy * 100)}% Acc
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <TrendingDown className="h-3 w-3 text-rose-500 shrink-0" />
                    <span>
                      {weak.recentMistakes} mistake{weak.recentMistakes === 1 ? "" : "s"} across {weak.totalAttempts} attempt{weak.totalAttempts === 1 ? "" : "s"}
                    </span>
                  </div>

                  {weak.confusionWith && weak.confusionWith.length > 0 && (
                    <div className="text-[10px] text-rose-900/80 dark:text-rose-300/80 pt-1 border-t border-border/40">
                      Confused with: <span className="font-bold">{weak.confusionWith.join(", ")}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {topRecommendation && (
              <div className="p-3 rounded-lg bg-card/90 border text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">
                      Recommendation: {topRecommendation.title}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {topRecommendation.reason}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab("confusion")}
                  className="text-xs shrink-0"
                >
                  View Confusion
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="font-semibold text-emerald-950 dark:text-emerald-200">
                  No Particle Weaknesses Detected
                </span>
                <p className="text-muted-foreground text-[11px]">
                  All answered particle questions meet the 70%+ accuracy threshold. Keep practicing!
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveTab("drill")}
              className="text-xs"
            >
              Start Drill
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-border/70 gap-2 pb-px">
        <Button
          variant={activeTab === "drill" ? "sakura" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("drill")}
          className="gap-2 text-xs font-semibold"
        >
          <Target className="h-4 w-4" />
          <span>Targeted Practice</span>
        </Button>

        <Button
          variant={activeTab === "confusion" ? "sakura" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("confusion")}
          className="gap-2 text-xs font-semibold"
        >
          <ArrowRightLeft className="h-4 w-4" />
          <span>Confusion Pairs (5 Pairs)</span>
        </Button>

        <Button
          variant={activeTab === "reference" ? "sakura" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("reference")}
          className="gap-2 text-xs font-semibold"
        >
          <BookOpen className="h-4 w-4" />
          <span>Particle Reference ({PARTICLES.length})</span>
        </Button>
      </div>

      {/* Tab Contents */}
      {activeTab === "drill" && (
        <div className="space-y-4 pt-2">
          <ParticlePracticeDrill onAttemptLogged={refreshAnalytics} />
        </div>
      )}

      {activeTab === "confusion" && (
        <div className="pt-2">
          <ParticleComparisonView />
        </div>
      )}

      {activeTab === "reference" && (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PARTICLES.map((particle) => (
              <ParticleCard key={particle.id} particle={particle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
