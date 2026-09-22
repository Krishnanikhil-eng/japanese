import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Languages } from "lucide-react";

export default function VocabularyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vocabulary Browser</h1>
          <p className="text-sm text-muted-foreground">
            Search, filter by lesson and JLPT level, and review with flashcards.
          </p>
        </div>
        <Badge variant="outline">Phase 2 Module</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-rose-500" />
            <CardTitle>Vocabulary Store Initialized</CardTitle>
          </div>
          <CardDescription>
            Dexie table 'vocabulary' and 'vocabularyProgress' are ready to index words, readings, and SRS review states.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>• Multi-field indexes on word, reading, lessonId, and jlptLevel.</p>
          <p>• Connects to ts-fsrs spaced repetition scheduling in Phase 3.</p>
        </CardContent>
      </Card>
    </div>
  );
}
