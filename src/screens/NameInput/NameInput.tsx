import { useState } from "react";
import { ScreenShell } from "../../components/ScreenShell/ScreenShell";
import { Button } from "../../components/Button/Button";
import { TextField } from "../../components/TextField/TextField";
import { useFunnel } from "../../funnel/FunnelProvider";
import styles from "./NameInput.module.css";

/**
 * Name input — Figma frame "What's your name?".
 * Iteration 1: name lives in funnel state for UI personalization only.
 */
export function NameInputScreen() {
  const { next, updateAnswers, answers } = useFunnel();
  const [value, setValue] = useState(answers.name ?? "");

  const handleNext = () => {
    updateAnswers({ name: value.trim() || undefined });
    next();
  };

  return (
    <ScreenShell
      footer={
        <Button onClick={handleNext} disabled={value.trim().length === 0}>
          Next
        </Button>
      }
    >
      <h1 className={`typo-heading-large ${styles.title}`}>
        What&rsquo;s your name?
      </h1>

      <TextField
        alwaysFocused
        className={styles.field}
        autoFocus
        placeholder="Name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        icon={<PersonIcon />}
        maxLength={40}
      />
    </ScreenShell>
  );
}

function PersonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 20c1.2-3.6 4.2-6 8-6s6.8 2.4 8 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
