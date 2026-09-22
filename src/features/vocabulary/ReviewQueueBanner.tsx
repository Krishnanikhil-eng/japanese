"use client";

import { Clock, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReviewQueueBannerProps {
  dueCount: number;
  onStartReview: () => void;
}

export function ReviewQueueBanner({ dueCount, onStartReview }: ReviewQueueBannerProps) {
  if (dueCount === 0) {
    return (
      <div className="flex items-center justify-between p-3.5 rounded-lg border bg-emerald-500/5 text-emerald-800 dark:text-emerald-300 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>All caught up! No vocabulary reviews currently due.</span>
        </div>
        <Badge variant="bamboo" className="text-[10px]">
          FSRS Up to Date
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-rose-500/30 bg-rose-500/5 text-xs shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
          <Clock className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-foreground">
            Spaced Repetition Reviews Due
          </h3>
          <p className="text-muted-foreground">
            You have <strong className="text-rose-600 dark:text-rose-400">{dueCount}</strong>{" "}
            vocabulary {dueCount === 1 ? "card" : "cards"} scheduled for review by ts-fsrs.
          </p>
        </div>
      </div>

      <Button
        variant="sakura"
        size="sm"
        onClick={onStartReview}
        className="gap-1.5 shrink-0 text-xs"
      >
        <Play className="h-3.5 w-3.5 fill-current" />
        <span>Review Now ({dueCount})</span>
      </Button>
    </div>
  );
}
