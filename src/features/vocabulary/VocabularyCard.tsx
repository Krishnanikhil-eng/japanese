"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Vocabulary } from "@/types";

interface VocabularyCardProps {
  item: Vocabulary;
  onSelect: (item: Vocabulary) => void;
}

export function VocabularyCard({ item, onSelect }: VocabularyCardProps) {
  return (
    <Card
      onClick={() => onSelect(item)}
      className="cursor-pointer hover:border-rose-500/60 hover:shadow-md transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs text-muted-foreground block font-normal">
              {item.reading}
            </span>
            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {item.word}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="sakura" className="text-[10px] py-0 px-1.5">
              {item.jlptLevel}
            </Badge>
            <span className="text-[10px] text-muted-foreground capitalize font-medium">
              {item.lessonId.replace("lesson-0", "L").replace("lesson-", "L")}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1">
        <p className="text-xs text-muted-foreground line-clamp-2 font-medium">
          {item.meaning}
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground font-mono">
            {item.partOfSpeech}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {item.topic}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
