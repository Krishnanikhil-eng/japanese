# Japanese Learning Companion

A personal, local-first Japanese-learning companion app. Minna no Nihongo study companion targeting JLPT N5.

> **This is NOT a startup, social platform, multi-user product, or Duolingo clone.**
> It is a personal learning tool that runs entirely in your browser.

---

## Architecture

```
                    JAPANESE LEARNING APP
                            │
             ┌──────────────┴──────────────┐
             │                             │
        LEARNING ENGINE              PRACTICE ENGINE
             │                             │
       ┌─────┼─────┐                ┌──────┼──────┐
       │     │     │                │      │      │
    Lessons Vocab Particles       Quiz   JLPT   Sentence
       │     │     │                │      │      │
       └─────┴─────┴────────────────┴──────┴──────┘
                            │
                            ↓
                       logAttempt()
                            │
                            ↓
                      Dexie / IndexedDB
                            │
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
          Accuracy       FSRS       Weak Areas
              │             │             │
              └─────────────┼─────────────┘
                            ↓
                    Recommendation Engine
                            │
                            ↓
                       HOME / STUDY NEXT
```

### External Capabilities

| Dependency | Purpose |
|-----------|---------|
| JMdict (local) | Dictionary search |
| KANJIDIC2 (local) | Kanji data |
| WanaKana | Kana/Romaji conversion |
| ts-fsrs | SRS review scheduling |
| Browser TTS | Listening practice |
| OpenAI (via `/api/ai`) | AI Teacher |

### AI Route (only server-side component)

```
Browser → /api/ai → AIProvider → OpenAI API
```

All other data lives locally in IndexedDB via Dexie. No backend, no database server.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js App Router + React |
| Styling | Tailwind CSS + shadcn/ui + lucide-react |
| Database | Dexie over IndexedDB |
| SRS | ts-fsrs |
| Japanese | WanaKana |
| Kanji data | KANJIDIC2 |
| Dictionary | JMdict (local, preprocessed) |
| AI | Provider adapter (OpenAI first) |
| Listening | Browser TTS (SpeechSynthesis API) |

---

## Modules

| Module | Purpose |
|--------|---------|
| Home | Daily plan, review queue, weak areas, Study Next, JLPT countdown |
| Minna Lessons | Lesson vocabulary, grammar, particles, patterns and progress |
| Vocabulary | Search, filters, review and quizzes |
| Dictionary | Japanese/English lookup and save-to-vocabulary |
| Kana | Hiragana/katakana refresher |
| Particles | Explanations, comparisons, targeted practice, confusion tracking |
| Sentence Builder | Constrained sentence formation |
| Kanji | N5 readings, meanings, vocabulary links and practice |
| Quizzes | Question rendering and answer flow |
| Listening | Lesson-linked and N5-style practice |
| AI Teacher | Explanations, correction, hints and controlled generation |
| JLPT Center | Timed sections, mock tests and scoring |
| Progress | Mastery, accuracy, mistakes and review state |

---

## Core Design Rule

**Every answer → `logAttempt()` → Dexie → Analytics → Recommendations**

No quiz, mock test, sentence exercise, or listening exercise may bypass the unified Attempt pipeline. Mistakes and weak areas are **derived from Attempts**, not stored separately.

---

## JLPT N5 Timing

| Section | Practice Mode | Timed Simulation |
|---------|--------------|-----------------|
| Vocabulary | By question type | 20 minutes |
| Grammar/Reading | Grammar and reading practice | 40 minutes |
| Listening | By listening task type | 30 minutes |
| Full N5 | All sections | 90 minutes total |

Target test date: **December 6, 2026** (configurable).

---

## Folder Structure

```
src/
  app/                          # Next.js App Router pages
    api/ai/route.ts             # Minimal AI proxy (only server route)
  components/                   # Shared UI components
    ui/                         # shadcn components
    layout/                     # Shell, nav, sidebar
    shared/                     # Reusable learning components
  db/                           # Dexie database + migrations
  data/                         # Seed data (JSON files)
    lessons/                    # lesson-01.json through lesson-05.json
    particles/
    kanji/
    dictionary/                 # Preprocessed JMdict subset
  domain/                       # Domain types + contracts
  services/
    learning/                   # Attempt logging, state
    analytics/                  # Accuracy, weak areas
    recommendation/             # Study Next engine
    srs/                        # ts-fsrs integration
    backup/                     # JSON export/import
    ai/                         # AIProvider adapter
    audio/                      # AudioProvider adapter
    dictionary/                 # JMdict search service
  features/                     # Feature-specific components/hooks
    lessons/ vocabulary/ particles/ progress/
    quiz/ jlpt/ sentence-builder/ listening/
    kana/ kanji/ dictionary/ ai-teacher/ home/
  types/                        # Shared TypeScript types
  lib/                          # Utilities
tests/
  unit/
  integration/
  e2e/
```

---

## Development Rules

1. Never implement more than one phase at a time
2. Inspect existing code before changing files
3. Don't add unapproved dependencies
4. Don't replace Dexie or add a backend (except `/api/ai`)
5. All answers → `logAttempt()` — no second mistake system
6. Don't hard-code fake analytics or progress
7. After every phase: type-check, lint, tests, build
8. Never commit secrets, API keys, `.env`, or `node_modules`
9. Don't reproduce copyrighted Minna content verbatim
10. Don't mark a phase complete just because the page renders — verify data flow E2E

---

## Seed Data

- **Lessons 1–5** initially populated
- Architecture supports Lessons 1–25
- Adding new lessons = adding a JSON file, not a code rewrite
- All content is original (not copied from Minna no Nihongo)

---

## Getting Started

```bash
# Install dependencies
npm install

# Create .env.local from the example
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

See `.env.example` for required variables. The only external API key needed is for the AI Teacher (optional — the app works fully without it).

---

## License & Content

- Uses Minna no Nihongo as the learner's study source, but does not reproduce textbook pages, exercises, audio, or copyrighted material verbatim
- JMdict/KANJIDIC2 used under their respective licenses with proper attribution
- Original explanations and examples throughout
