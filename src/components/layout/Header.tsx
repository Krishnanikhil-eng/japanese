"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Calendar, Database } from "lucide-react";
import { DEFAULT_JLPT_TARGET_DATE, DEFAULT_JLPT_LEVEL } from "@/domain/enums";
import { initDatabase } from "@/db";

export function Header() {
  const [dbReady, setDbReady] = useState<boolean | null>(null);
  const targetDate =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_JLPT_TARGET_DATE
      ? process.env.NEXT_PUBLIC_JLPT_TARGET_DATE
      : DEFAULT_JLPT_TARGET_DATE;

  useEffect(() => {
    initDatabase().then((ready) => {
      setDbReady(ready);
    });
  }, []);

  return (
    <header className="h-16 border-b bg-card/40 backdrop-blur-sm sticky top-0 z-10 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-base font-semibold tracking-tight">
          日本語 学習コンパニオン
        </h2>
        <span className="text-xs text-muted-foreground hidden sm:inline-block">
          Personal Japanese Companion
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* JLPT Target Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-xs text-secondary-foreground">
          <Calendar className="h-3.5 w-3.5 text-rose-500" />
          <span>
            {DEFAULT_JLPT_LEVEL} Target:{" "}
            <span className="font-semibold">{targetDate}</span>
          </span>
        </div>

        {/* Database Status Indicator */}
        <Badge
          variant={dbReady ? "bamboo" : "secondary"}
          className="gap-1 hidden sm:inline-flex text-[11px]"
        >
          <Database className="h-3 w-3" />
          <span>{dbReady === null ? "Connecting..." : dbReady ? "Dexie Online" : "DB Error"}</span>
        </Badge>

        {/* Theme Switcher */}
        <ThemeToggle />
      </div>
    </header>
  );
}
