import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GraduationCap, Clock } from "lucide-react";
import { JLPT_N5_TIMING } from "@/domain/enums";

export default function JLPTCenterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">JLPT Center — N5 Exam Preparation</h1>
          <p className="text-sm text-muted-foreground">
            Official timed sections and full mock test simulations.
          </p>
        </div>
        <Badge variant="outline">Phase 7 Module</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Section 1</span>
              <Badge variant="sakura">20 min</Badge>
            </div>
            <CardTitle className="text-base mt-2">Language Knowledge</CardTitle>
            <CardDescription className="text-xs">Vocabulary (もじ・ごい)</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Official timer: {JLPT_N5_TIMING.vocabulary / 60} minutes
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Section 2</span>
              <Badge variant="sakura">40 min</Badge>
            </div>
            <CardTitle className="text-base mt-2">Grammar & Reading</CardTitle>
            <CardDescription className="text-xs">ぶんぽう・どっかい</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Official timer: {JLPT_N5_TIMING.grammar_reading / 60} minutes
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Section 3</span>
              <Badge variant="sakura">30 min</Badge>
            </div>
            <CardTitle className="text-base mt-2">Listening</CardTitle>
            <CardDescription className="text-xs">ちょうかい</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Official timer: {JLPT_N5_TIMING.listening / 60} minutes
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
