/**
 * Funnel model.
 *
 * Iteration 1: the funnel is a linear sequence of screens. The step
 * keys below map 1:1 to the frames on the Figma "Funnel" page. When
 * a real backend/router is added, `FunnelStep` can be the URL segment
 * and `FunnelAnswers` can be submitted to the API on each transition.
 */
export type FunnelStep =
  | "welcome"
  | "language"
  | "name"
  | "didYouKnow"
  | "difficultyAdaptation"
  | "updatedWriting"
  | "newSpeaking"
  | "shorterTestTime"
  | "evaluate"
  | "howWellEnglish"
  | "brainExercise"
  | "whyTOEFL"
  | "goodHands"
  | "lackOfPractice"
  | "pronunciation"
  | "fearOfSpeaking"
  | "brainLearns"
  | "planPractice"
  | "readyForTest"
  | "reading"
  | "listening"
  | "speaking"
  | "writing"
  | "email"
  | "paywall";

export interface FunnelAnswers {
  /** Temporary, UI-only personalization. Not persisted in iteration 1. */
  name?: string;
  /** Locale code selected as native language. */
  nativeLanguage?: string;
  /** Self-reported English level ("beginner" | "intermediate" | "advanced"). */
  selfLevel?: string;
  /** Selected reasons for taking TOEFL. */
  goals?: string[];
  /** Selected pain points (lack of practice, pronunciation, fear, …). */
  painPoints?: string[];
  /** Mock assessment answers keyed by question id. */
  assessment?: Record<string, string>;
  /** Email (captured for lead-gen — not sent anywhere in iteration 1). */
  email?: string;
}
