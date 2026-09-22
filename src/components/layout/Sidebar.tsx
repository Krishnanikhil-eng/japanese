"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Languages,
  Sparkles,
  Layers,
  Puzzle,
  FileQuestion,
  Headphones,
  GraduationCap,
  Bot,
  BookText,
  BarChart3,
  Bookmark,
} from "lucide-react";
import { ROUTES } from "@/domain/enums";
import { cn } from "@/lib/utils";

interface NavSection {
  title: string;
  items: {
    name: string;
    nameJa: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { name: "Home", nameJa: "ホーム", href: ROUTES.home, icon: Home },
      { name: "Progress", nameJa: "進捗", href: ROUTES.progress, icon: BarChart3 },
    ],
  },
  {
    title: "Curriculum",
    items: [
      { name: "Lessons", nameJa: "課", href: ROUTES.lessons, icon: BookOpen },
      { name: "Vocabulary", nameJa: "単語", href: ROUTES.vocabulary, icon: Languages },
      { name: "Particles", nameJa: "助詞", href: ROUTES.particles, icon: Sparkles },
      { name: "Kanji", nameJa: "漢字", href: ROUTES.kanji, icon: Bookmark },
      { name: "Kana", nameJa: "仮名", href: ROUTES.kana, icon: Layers },
    ],
  },
  {
    title: "Practice & Exam",
    items: [
      { name: "Quizzes", nameJa: "クイズ", href: ROUTES.quiz, icon: FileQuestion },
      { name: "JLPT Center", nameJa: "JLPT対策", href: ROUTES.jlpt, icon: GraduationCap },
      { name: "Sentence Builder", nameJa: "文作成", href: ROUTES.sentenceBuilder, icon: Puzzle },
      { name: "Listening", nameJa: "聴解", href: ROUTES.listening, icon: Headphones },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Dictionary", nameJa: "辞書", href: ROUTES.dictionary, icon: BookText },
      { name: "AI Teacher", nameJa: "AI先生", href: ROUTES.aiTeacher, icon: Bot },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card/60 backdrop-blur-sm flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="h-16 border-b flex items-center px-6 gap-3">
        <div className="h-9 w-9 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
          日
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-tight">Japanese Companion</span>
          <span className="text-[11px] text-muted-foreground">Minna • JLPT N5</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <h4 className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h4>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors group",
                      isActive
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] opacity-60 font-normal",
                        isActive ? "text-rose-600 dark:text-rose-400" : ""
                      )}
                    >
                      {item.nameJa}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t text-[11px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Local-First DB</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            IndexedDB Ready
          </span>
        </div>
      </div>
    </aside>
  );
}
