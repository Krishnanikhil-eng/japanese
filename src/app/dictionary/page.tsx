import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookText } from "lucide-react";

export default function DictionaryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Local JMdict Dictionary</h1>
          <p className="text-sm text-muted-foreground">
            Fast, offline Japanese-English dictionary lookup powered by Dexie.
          </p>
        </div>
        <Badge variant="outline">Phase 8D Module</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookText className="h-5 w-5 text-rose-500" />
            <CardTitle>Local Index Storage Ready</CardTitle>
          </div>
          <CardDescription>
            Dexie table 'dictionary' contains multi-entry indexes on kanji and readings for zero-latency local lookup.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
