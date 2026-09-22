import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function LessonsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Minna no Nihongo Lessons</h1>
          <p className="text-sm text-muted-foreground">
            Structured grammar, vocabulary, and pattern progression for Lessons 1–25.
          </p>
        </div>
        <Badge variant="outline">Phase 2 Module</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-rose-500" />
            <CardTitle>Lessons Foundation Ready</CardTitle>
          </div>
          <CardDescription>
            The Lesson database store is initialized in Dexie. Seed data for Lessons 1–5 will be populated in Phase 2.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>• Architecture supports all 25 Minna no Nihongo lessons.</p>
          <p>• Initial seed scope covers Lessons 1–5 with original explanations.</p>
        </CardContent>
      </Card>
    </div>
  );
}
