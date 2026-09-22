import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function ParticlesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Particle Lab & Confusion Pairs</h1>
          <p className="text-sm text-muted-foreground">
            Targeted particle practice with confusion analysis (に vs で, は vs が).
          </p>
        </div>
        <Badge variant="outline">Phase 4 Module</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            <CardTitle>Particle Schema Foundation Ready</CardTitle>
          </div>
          <CardDescription>
            Dexie table 'particles' is indexed and ready for confusion pair mapping in Phase 4.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          <p>• Wrong answers will dynamically influence the Study Next recommendation engine.</p>
        </CardContent>
      </Card>
    </div>
  );
}
