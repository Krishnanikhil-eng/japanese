import lesson01 from "./lesson-01.json" with { type: "json" };
import lesson02 from "./lesson-02.json" with { type: "json" };
import lesson03 from "./lesson-03.json" with { type: "json" };
import lesson04 from "./lesson-04.json" with { type: "json" };
import lesson05 from "./lesson-05.json" with { type: "json" };
import type { Lesson, Concept, Vocabulary } from "@/types";

export interface LessonSeedData {
  lesson: Lesson;
  concepts: Concept[];
  vocabulary: Vocabulary[];
}

export const SEED_LESSONS: LessonSeedData[] = [
  lesson01 as unknown as LessonSeedData,
  lesson02 as unknown as LessonSeedData,
  lesson03 as unknown as LessonSeedData,
  lesson04 as unknown as LessonSeedData,
  lesson05 as unknown as LessonSeedData,
];
