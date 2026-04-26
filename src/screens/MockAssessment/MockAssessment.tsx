import { useState } from "react";
import { ScreenShell } from "../../components/ScreenShell/ScreenShell";
import { Button } from "../../components/Button/Button";
import { useFunnel } from "../../funnel/FunnelProvider";
import styles from "./MockAssessment.module.css";

interface MockAssessmentProps {
  skill: "reading" | "listening" | "speaking" | "writing";
  title: string;
  passage?: string;
  prompt: string;
  choices: { id: string; label: string }[];
}

/**
 * Mock assessment step.
 * Iteration 1: records the raw answer in `answers.assessment` but does
 * not score or validate anything. A later iteration can wire a real
 * scoring service here without changing the screen API.
 */
export function MockAssessmentScreen({
  skill,
  title,
  passage,
  prompt,
  choices,
}: MockAssessmentProps) {
  const { next, updateAnswers, answers } = useFunnel();
  const [selected, setSelected] = useState<string | null>(
    answers.assessment?.[skill] ?? null
  );

  const handleNext = () => {
    updateAnswers({
      assessment: { ...answers.assessment, [skill]: selected ?? "" },
    });
    next();
  };

  return (
    <ScreenShell
      footer={
        <Button onClick={handleNext} disabled={!selected}>
          Next
        </Button>
      }
    >
      <h1 className={`typo-heading-large ${styles.title}`}>{title}</h1>

      {passage && (
        <div className={`typo-body-large ${styles.passage}`}>{passage}</div>
      )}

      <p className={`typo-heading-small ${styles.prompt}`}>{prompt}</p>

      <div className={styles.choices}>
        {choices.map((c) => {
          const isSelected = c.id === selected;
          return (
            <button
              key={c.id}
              type="button"
              className={`${styles.choice} ${isSelected ? styles.selected : ""}`}
              onClick={() => setSelected(c.id)}
              aria-pressed={isSelected}
            >
              <span className={styles.radio} />
              <span className="typo-body-large">{c.label}</span>
            </button>
          );
        })}
      </div>
    </ScreenShell>
  );
}
