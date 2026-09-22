import particlesData from "./particles.json" with { type: "json" };
import confusionPairsData from "./confusion-pairs.json" with { type: "json" };
import type { Particle } from "@/types";

export interface ConfusionPair {
  id: string;
  particleA: string;
  particleB: string;
  title: string;
  distinction: string;
  comparisonExamples: {
    sentence: string;
    correctParticle: string;
    wrongParticle: string;
    explanation: string;
  }[];
}

export const PARTICLES: Particle[] = particlesData as unknown as Particle[];
export const CONFUSION_PAIRS: ConfusionPair[] = confusionPairsData as unknown as ConfusionPair[];
