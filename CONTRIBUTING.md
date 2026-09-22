# Contribution & Workflow Guidelines

## 1. Branch Strategy

- **`main`**: Production/stable branch. Receives only verified, tagged release candidates. Never commit directly to `main`.
- **`develop`**: Central integration branch. All feature branches merge here after passing acceptance gates.
- **`feature/*`**: Feature and phase branches. All implementation work occurs on dedicated feature branches (e.g., `feature/phase0-project-contract`, `feature/person1-learning-engine`, `feature/person2-practice-experience`).

## 2. Commit Requirements

- **Minimum 5 meaningful commits per phase**: Every phase must contain at least 5 logical, focused Git commits representing genuine development progress.
- **No artificial/empty commits**: Commits must reflect substantive changes (scaffolding, contracts, configurations, implementations, tests, documentation).
- **Conventional commit style**:
  - `feat: ...` for new capabilities or domain contracts
  - `chore: ...` for environment, config, and scaffolding
  - `test: ...` for automated verification
  - `docs: ...` for architectural or specification documentation
  - `build: ...` for package and build tool modifications

## 3. Two-Person Ownership Model

| Developer | Primary Ownership | Key Areas |
|-----------|-------------------|-----------|
| **Person 1** | Learning Engine / Data | Dexie schema, Lesson/Vocabulary/Particle models, `logAttempt()`, analytics, ts-fsrs SRS, recommendations |
| **Person 2** | Practice / Exam / UI | Shell/layouts, Question renderer, JLPT Center, Sentence Builder, Kana/Kanji UI, Dictionary, AI Teacher |

## 4. Phase Acceptance Gates

Before merging any feature branch into `develop` or considering a phase complete:
1. **At least 5 meaningful commits** exist on the branch for that phase.
2. **Clean working tree**: No untracked or uncommitted changes.
3. **TypeScript**: `npm run typecheck` (`tsc --noEmit`) passes with zero errors.
4. **Tests**: `npm test` passes all unit and integration tests.
5. **Lint & Build**: Configured linting and production build pass.
