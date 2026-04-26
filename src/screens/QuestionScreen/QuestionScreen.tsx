import type { ReactNode } from "react";
import { useState } from "react";
import { ScreenShell } from "../../components/ScreenShell/ScreenShell";
import { Button } from "../../components/Button/Button";
import { useFunnel } from "../../funnel/FunnelProvider";
import type { FunnelAnswers } from "../../funnel/types";
import styles from "./QuestionScreen.module.css";

export interface QuestionOption {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface QuestionScreenProps {
  title: string;
  options: QuestionOption[];
  multi?: boolean;
  /** Which funnel-answer key to persist the selection under. */
  answerKey: "selfLevel" | "goals" | "painPoints";
}

/**
 * Shared single/multi-choice question layout. Matches Figma frames:
 * "How well do you know English?", "Why do you want to pass TOEFL?",
 * the pain-point screens, etc. — all use vertically-stacked option
 * rows with image bullet + text.
 */
export function QuestionScreen({
  title,
  options,
  multi = false,
  answerKey,
}: QuestionScreenProps) {
  const { next, updateAnswers, answers } = useFunnel();

  const existing: string[] =
    answerKey === "selfLevel"
      ? answers.selfLevel
        ? [answers.selfLevel]
        : []
      : (answers[answerKey] as string[] | undefined) ?? [];

  const [selected, setSelected] = useState<string[]>(existing);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (!multi) return [id];
      return prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
    });
  };

  const handleNext = () => {
    const patch: Partial<FunnelAnswers> =
      answerKey === "selfLevel"
        ? { selfLevel: selected[0] }
        : answerKey === "goals"
        ? { goals: selected }
        : { painPoints: selected };
    updateAnswers(patch);
    next();
  };

  return (
    <ScreenShell
      footer={
        <Button onClick={handleNext} disabled={selected.length === 0}>
          Next
        </Button>
      }
    >
      <h1 className={`typo-heading-large ${styles.title}`}>{title}</h1>

      <div className={styles.stack}>
        {options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              className={`${styles.listRow} ${isSelected ? styles.selected : ""}`}
              onClick={() => toggle(opt.id)}
              aria-pressed={isSelected}
            >
              <div className={styles.bullet}>{opt.icon ?? <DefaultBullet />}</div>
              <span className={`typo-heading-small ${styles.label}`}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </ScreenShell>
  );
}

function DefaultBullet() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <circle
        cx="14"
        cy="14"
        r="12"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <path
        d="M9 14l3.5 3.5L19 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
