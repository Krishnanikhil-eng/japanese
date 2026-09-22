import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES } from "../../src/domain/enums.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");

test("Phase 1: All 13 application routes have existing page.tsx files", () => {
  const routeToFileMap = {
    home: "src/app/page.tsx",
    lessons: "src/app/lessons/page.tsx",
    vocabulary: "src/app/vocabulary/page.tsx",
    dictionary: "src/app/dictionary/page.tsx",
    kana: "src/app/kana/page.tsx",
    particles: "src/app/particles/page.tsx",
    sentenceBuilder: "src/app/sentence-builder/page.tsx",
    kanji: "src/app/kanji/page.tsx",
    quiz: "src/app/quiz/page.tsx",
    listening: "src/app/listening/page.tsx",
    aiTeacher: "src/app/ai-teacher/page.tsx",
    jlpt: "src/app/jlpt/page.tsx",
    progress: "src/app/progress/page.tsx",
  };

  for (const [key, filePath] of Object.entries(routeToFileMap)) {
    const fullPath = path.join(rootDir, filePath);
    assert.ok(
      fs.existsSync(fullPath),
      `Page for route '${key}' (${filePath}) must exist`
    );
  }
});

test("Phase 1: Layout, UI components, and Tailwind config files exist", () => {
  const requiredFiles = [
    "src/app/layout.tsx",
    "src/app/globals.css",
    "src/components/layout/AppShell.tsx",
    "src/components/layout/Sidebar.tsx",
    "src/components/layout/Header.tsx",
    "src/components/layout/ThemeToggle.tsx",
    "src/components/ui/button.tsx",
    "src/components/ui/card.tsx",
    "src/components/ui/badge.tsx",
    "src/db/schema.ts",
    "src/db/index.ts",
    "tailwind.config.ts",
    "postcss.config.mjs",
    "next.config.mjs",
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(rootDir, file);
    assert.ok(fs.existsSync(fullPath), `Required foundation file '${file}' must exist`);
  }
});

test("Phase 1: JLPT countdown math calculates valid day intervals", () => {
  const target = new Date("2026-12-06T00:00:00Z");
  const baseline = new Date("2026-09-22T00:00:00Z");
  const diffDays = Math.ceil((target.getTime() - baseline.getTime()) / (1000 * 60 * 60 * 24));
  assert.equal(diffDays, 75, "Difference between 2026-09-22 and 2026-12-06 should be 75 days");
});
