import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bookmark } from "lucide-react";

export default function KanjiPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kanji N5 Interface</h1>
          <p className="text-sm text-muted-foreground">
            Explore JLPT N5 kanji characters, readings, and vocabulary connections.
          </p>
        </div>
        <Badge variant="outline">Phase 8C Module</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-rose-500" />
            <CardTitle>Kanji Database Store Ready</CardTitle>
          </div>
          <CardDescription>
            Dexie table 'kanji' is ready for KANJIDIC2 integration in Phase 8C.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          <p>• Indexed by character and JLPT level for instant offline lookup.</p>
        </CardContent>
      </Card>
    </div>
  );
}
