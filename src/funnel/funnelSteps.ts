import type { FunnelStep } from "./types";

/**
 * Canonical order of funnel steps. Matches the left-to-right frame
 * order on the Figma "Funnel" page.
 *
 * Progress grouping: Figma's progress bar shows 5 knobs. We map
 * funnel steps onto 5 progress "chapters" below. The exact boundaries
 * aren't explicit in Figma — we've grouped by narrative section
 * (intro → marketing/onboarding → self-report → pain points →
 * assessment/conversion). Flagging this as an inferred mapping:
 * the design should confirm or correct the chapter boundaries.
 */
export const FUNNEL_ORDER: FunnelStep[] = [
  "welcome",

  "language",
  "name",

  "didYouKnow",
  "difficultyAdaptation",
  "updatedWriting",
  "newSpeaking",
  "shorterTestTime",

  "evaluate",
  "howWellEnglish",
  "brainExercise",
  "whyTOEFL",
  "goodHands",

  "lackOfPractice",
  "pronunciation",
  "fearOfSpeaking",
  "brainLearns",
  "planPractice",

  "readyForTest",
  "reading",
  "listening",
  "speaking",
  "writing",

  "email",
  "paywall",
];

export const PROGRESS_CHAPTERS: FunnelStep[][] = [
  // Chapter 1 — Intro & identification
  ["welcome", "language", "name"],
  // Chapter 2 — Product marketing beats
  [
    "didYouKnow",
    "difficultyAdaptation",
    "updatedWriting",
    "newSpeaking",
    "shorterTestTime",
  ],
  // Chapter 3 — Self-report / motivation
  ["evaluate", "howWellEnglish", "brainExercise", "whyTOEFL", "goodHands"],
  // Chapter 4 — Pain-point education
  [
    "lackOfPractice",
    "pronunciation",
    "fearOfSpeaking",
    "brainLearns",
    "planPractice",
  ],
  // Chapter 5 — Mock assessment + conversion
  [
    "readyForTest",
    "reading",
    "listening",
    "speaking",
    "writing",
    "email",
    "paywall",
  ],
];

/**
 * Compute current progress state for the 5-knob progress bar.
 * Returns which chapter we're in (0..4) and the within-chapter ratio.
 */
export function getProgress(step: FunnelStep): {
  chapterIndex: number;
  chapterProgress: number;
  totalChapters: number;
} {
  for (let i = 0; i < PROGRESS_CHAPTERS.length; i++) {
    const chapter = PROGRESS_CHAPTERS[i];
    const idx = chapter.indexOf(step);
    if (idx !== -1) {
      return {
        chapterIndex: i,
        chapterProgress: chapter.length === 1 ? 1 : (idx + 1) / chapter.length,
        totalChapters: PROGRESS_CHAPTERS.length,
      };
    }
  }
  return { chapterIndex: 0, chapterProgress: 0, totalChapters: PROGRESS_CHAPTERS.length };
}
