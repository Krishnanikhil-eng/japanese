"use client";

import { CONFUSION_PAIRS } from "@/data/particles";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft } from "lucide-react";

export function ParticleComparisonView() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight">Particle Confusion Comparisons</h2>
        <p className="text-xs text-muted-foreground">
          Side-by-side linguistic distinctions for the most frequently confused JLPT N5 particle pairs.
        </p>
      </div>

      <div className="space-y-4">
        {CONFUSION_PAIRS.map((pair) => (
          <Card key={pair.id} className="overflow-hidden border-2 hover:border-rose-500/40 transition-colors">
            <CardHeader className="p-5 pb-3 bg-secondary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-extrabold text-xl text-foreground">
                    <span className="h-9 w-9 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
                      {pair.particleA}
                    </span>
                    <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                    <span className="h-9 w-9 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center border">
                      {pair.particleB}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-base">{pair.title}</CardTitle>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  N5 Essential Pair
                </Badge>
              </div>

              <CardDescription className="text-xs pt-2 text-foreground font-normal leading-relaxed">
                {pair.distinction}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-3">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Contrasting Examples
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pair.comparisonExamples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border bg-card/60 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-foreground">
                        {ex.sentence.replace("___", `【 ${ex.correctParticle} 】`)}
                      </span>
                      <Badge variant="bamboo" className="font-mono text-[10px]">
                        Correct: {ex.correctParticle}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      {ex.explanation}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-1 border-t">
                      <span className="text-destructive font-medium">✕ Not 「{ex.wrongParticle}」</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
