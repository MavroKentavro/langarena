/**
 * Per-step content copy (title + body for marketing / info screens,
 * and option lists for question screens). Split out here so that:
 *   - Screen components stay concerned with layout.
 *   - Content can later be localized (replace these strings with
 *     i18n lookups without touching rendering code).
 *
 * Copy values below are placeholders informed by the Figma frame
 * names. When the exact Figma copy is available for each frame, it
 * should replace the fallback text here verbatim.
 */
import type { FunnelStep } from "./types";

export interface InfoContent {
  kind: "info";
  title: string;
  body?: string;
  ctaLabel?: string;
}

export interface QuestionContent {
  kind: "question";
  title: string;
  multi?: boolean;
  answerKey: "selfLevel" | "goals" | "painPoints";
  options: { id: string; label: string }[];
}

export interface AssessmentContent {
  kind: "assessment";
  skill: "reading" | "listening" | "speaking" | "writing";
  title: string;
  passage?: string;
  prompt: string;
  choices: { id: string; label: string }[];
}

export type StepContent =
  | InfoContent
  | QuestionContent
  | AssessmentContent
  | { kind: "custom" };

export const STEP_CONTENT: Partial<Record<FunnelStep, StepContent>> = {
  // Intro (custom — see Welcome / LanguageSelect / NameInput screens)
  welcome: { kind: "custom" },
  language: { kind: "custom" },
  name: { kind: "custom" },

  // Marketing / onboarding
  didYouKnow: { kind: "custom" }, // uses dedicated DidYouKnow screen
  difficultyAdaptation: {
    kind: "info",
    title: "Difficulty adapts to you",
    body:
      "Your plan changes in real time based on your answers so every exercise is at the right level.",
  },
  updatedWriting: {
    kind: "info",
    title: "Updated writing tasks",
    body:
      "New writing prompts matching the 2026 TOEFL format, with instant AI feedback.",
  },
  newSpeaking: {
    kind: "info",
    title: "New speaking section",
    body:
      "Practice all the new speaking prompts in the updated TOEFL exam with an AI examiner.",
  },
  shorterTestTime: {
    kind: "info",
    title: "Shorter test time",
    body:
      "The new TOEFL is under 2 hours. We&rsquo;ve updated every drill to match.",
  },

  // Self-report / motivation
  evaluate: {
    kind: "info",
    title: "Let's evaluate your English",
    body:
      "A few quick questions about your current level help us build your personalized plan.",
    ctaLabel: "Continue",
  },
  howWellEnglish: {
    kind: "question",
    title: "How well do you know English?",
    answerKey: "selfLevel",
    options: [
      { id: "some", label: "I know some" },
      { id: "conversational", label: "I can have a simple conversation" },
      { id: "confident", label: "I speak with confidence" },
    ],
  },
  brainExercise: {
    kind: "info",
    title: "Language learning exercises your brain",
    body:
      "Regular practice builds memory, focus, and problem-solving — the same skills TOEFL measures.",
  },
  whyTOEFL: {
    kind: "question",
    title: "Why do you want to pass TOEFL?",
    multi: true,
    answerKey: "goals",
    options: [
      { id: "study-abroad", label: "Study abroad" },
      { id: "work-abroad", label: "Work abroad" },
      { id: "immigration", label: "Immigration" },
      { id: "career", label: "Career advancement" },
      { id: "personal", label: "Personal goal" },
    ],
  },
  goodHands: {
    kind: "info",
    title: "You are in good hands",
    body:
      "Over 1 million learners trust LangArena to prepare for TOEFL and IELTS every year.",
  },

  // Pain points
  lackOfPractice: {
    kind: "question",
    title: "What slows you down most?",
    multi: true,
    answerKey: "painPoints",
    options: [
      { id: "practice", label: "Lack of practice" },
      { id: "pronunciation", label: "Pronunciation" },
      { id: "speaking-fear", label: "Fear of speaking" },
      { id: "time", label: "Not enough time" },
      { id: "motivation", label: "Staying motivated" },
    ],
  },
  pronunciation: {
    kind: "info",
    title: "We'll help with pronunciation",
    body:
      "Our AI listens to you and points out the exact sounds to work on — kindly, never judgmentally.",
  },
  fearOfSpeaking: {
    kind: "info",
    title: "Speaking gets easier",
    body:
      "Practice speaking with an AI partner in a low-stakes environment. No audience. No pressure.",
  },
  brainLearns: {
    kind: "info",
    title: "How your brain learns",
    body:
      "Spaced repetition turns short-term practice into long-term fluency. We schedule every exercise for you.",
  },
  planPractice: {
    kind: "info",
    title: "Plan your English practice",
    body:
      "Even 10 minutes a day adds up. Pick a daily goal and we&rsquo;ll fit it around your week.",
  },

  // Mock assessment
  readyForTest: {
    kind: "info",
    title: "Ready for a 3-minute test?",
    body:
      "Four short questions — one for each TOEFL skill — to estimate your current level.",
    ctaLabel: "Start test",
  },
  reading: {
    kind: "assessment",
    skill: "reading",
    title: "Reading",
    passage:
      "The migration of monarch butterflies spans thousands of miles. Each autumn, millions travel from Canada and the northern United States to forests in central Mexico, where they spend the winter clustered on fir trees before returning north in spring.",
    prompt:
      "According to the passage, where do monarch butterflies spend the winter?",
    choices: [
      { id: "a", label: "In the northern United States" },
      { id: "b", label: "In forests in central Mexico" },
      { id: "c", label: "In Canada" },
      { id: "d", label: "They do not migrate" },
    ],
  },
  listening: {
    kind: "assessment",
    skill: "listening",
    title: "Listening",
    prompt:
      "Play the audio and choose the professor's main point. (Audio will be available when media is wired up.)",
    choices: [
      { id: "a", label: "Marine biology is growing rapidly" },
      { id: "b", label: "Coral reefs protect coastlines" },
      { id: "c", label: "Reefs need time to recover after bleaching" },
      { id: "d", label: "Fish populations are declining" },
    ],
  },
  speaking: {
    kind: "assessment",
    skill: "speaking",
    title: "Speaking",
    prompt:
      "Describe a place you would like to visit and explain why. (Recording will be available when the microphone is wired up.)",
    choices: [
      { id: "a", label: "I'm ready" },
      { id: "b", label: "Skip for now" },
    ],
  },
  writing: {
    kind: "assessment",
    skill: "writing",
    title: "Writing",
    prompt:
      "Some people learn best by studying alone; others prefer studying with a group. Which do you prefer, and why?",
    choices: [
      { id: "alone", label: "Studying alone" },
      { id: "group", label: "Studying with a group" },
      { id: "both", label: "A mix of both" },
    ],
  },

  // Conversion
  email: { kind: "custom" },
  paywall: { kind: "custom" },
};
