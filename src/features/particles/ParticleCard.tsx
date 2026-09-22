"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Particle } from "@/types";

interface ParticleCardProps {
  particle: Particle;
}

export function ParticleCard({ particle }: ParticleCardProps) {
  return (
    <Card className="hover:border-rose-500/50 transition-all overflow-hidden flex flex-col justify-between">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold flex items-center justify-center text-2xl shrink-0 shadow-sm border border-rose-500/20">
              {particle.particle}
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                助詞 「{particle.particle}」
              </h3>
              <span className="text-xs text-muted-foreground">
                {particle.uses.length} distinct {particle.uses.length === 1 ? "usage" : "usages"}
              </span>
            </div>
          </div>

          {particle.confusionPairs.length > 0 && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-muted-foreground">Confused with</span>
              <div className="flex gap-1">
                {particle.confusionPairs.map((p) => (
                  <Badge key={p} variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                    {p.replace("particle-", "")}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        {particle.uses.map((use, idx) => (
          <div key={idx} className="p-2.5 rounded-lg bg-secondary/40 space-y-1 text-xs">
            <span className="font-semibold text-foreground block">
              {idx + 1}. {use.meaning}
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {use.description}
            </p>
            {use.examples && use.examples[0] && (
              <div className="pt-1 text-[11px] border-t border-border/50 space-y-0.5">
                <span className="font-medium text-foreground block">
                  {use.examples[0].japanese}
                </span>
                <span className="text-muted-foreground italic block">
                  "{use.examples[0].english}"
                </span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
