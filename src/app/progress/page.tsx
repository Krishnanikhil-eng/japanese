import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learning Progress & Mastery</h1>
          <p className="text-sm text-muted-foreground">
            Accuracy trends, weak-area analytics, and mastery indicators derived from Attempts.
          </p>
        </div>
        <Badge variant="outline">Phase 6 Module</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-rose-500" />
            <CardTitle>Deterministic Analytics Engine Ready</CardTitle>
          </div>
          <CardDescription>
            All progress metrics will be calculated strictly from real Attempt records—no hard-coded fake data.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
