import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Headphones } from "lucide-react";

export default function ListeningPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Listening Practice</h1>
          <p className="text-sm text-muted-foreground">
            Audio comprehension drills powered by browser TTS and AudioProvider abstraction.
          </p>
        </div>
        <Badge variant="outline">Phase 8E Module</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-rose-500" />
            <CardTitle>AudioProvider Interface Defined</CardTitle>
          </div>
          <CardDescription>
            Audio synthesis and playback controls will integrate with lesson questions in Phase 8E.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
