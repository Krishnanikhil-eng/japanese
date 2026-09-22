import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Puzzle } from "lucide-react";

export default function SentenceBuilderPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sentence Builder</h1>
          <p className="text-sm text-muted-foreground">
            Constrained Japanese sentence composition using unlocked lesson grammar.
          </p>
        </div>
        <Badge variant="outline">Phase 8A Module</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-rose-500" />
            <CardTitle>Grammar Constraints Ready</CardTitle>
          </div>
          <CardDescription>
            Tied to unlocked concepts and vocabulary from your active Minna lesson progress.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
