import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";

export default function KanaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kana Refresher</h1>
          <p className="text-sm text-muted-foreground">
            Hiragana and Katakana charts and practice with WanaKana conversion.
          </p>
        </div>
        <Badge variant="outline">Phase 8B Module</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-rose-500" />
            <CardTitle>WanaKana Integration Active</CardTitle>
          </div>
          <CardDescription>
            Kana and romaji conversion library is installed and ready for interactive typing drills.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
