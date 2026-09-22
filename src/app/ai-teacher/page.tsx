import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AITeacherPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Teacher</h1>
          <p className="text-sm text-muted-foreground">
            Context-aware grammatical explanations, mistake breakdowns, and practice generation.
          </p>
        </div>
        <Badge variant="outline">Phase 9 Module</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-rose-500" />
            <CardTitle>AIProvider Abstraction Prepared</CardTitle>
          </div>
          <CardDescription>
            Interacts through a minimal Next.js server route (/api/ai) in Phase 9 to protect API secrets. Non-AI app works fully without it.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
