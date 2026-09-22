import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";

export default function QuizPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quiz Engine</h1>
          <p className="text-sm text-muted-foreground">
            Adaptive practice questions connected to the central Attempt pipeline.
          </p>
        </div>
        <Badge variant="outline">Phase 5 Module</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-rose-500" />
            <CardTitle>Central Pipeline Contract Ready</CardTitle>
          </div>
          <CardDescription>
            All questions and user answers will log to the unified Dexie 'attempts' store.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          <p>• Zero bypasses: No separate mistake table. All analytics derive from Attempts.</p>
        </CardContent>
      </Card>
    </div>
  );
}
