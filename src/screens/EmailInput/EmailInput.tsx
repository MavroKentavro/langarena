import { useState } from "react";
import { ScreenShell } from "../../components/ScreenShell/ScreenShell";
import { Button } from "../../components/Button/Button";
import { TextField } from "../../components/TextField/TextField";
import { useFunnel } from "../../funnel/FunnelProvider";
import styles from "./EmailInput.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email capture step — Figma frame "Enter your email".
 * Iteration 1: email is held in local state only; no network call.
 */
export function EmailInputScreen() {
  const { next, updateAnswers, answers } = useFunnel();
  const [value, setValue] = useState(answers.email ?? "");
  const [touched, setTouched] = useState(false);

  const valid = EMAIL_RE.test(value.trim());
  const showError = touched && !valid;

  const handleNext = () => {
    if (!valid) {
      setTouched(true);
      return;
    }
    updateAnswers({ email: value.trim() });
    next();
  };

  return (
    <ScreenShell
      footer={
        <Button onClick={handleNext} disabled={!valid}>
          Next
        </Button>
      }
    >
      <h1 className={`typo-heading-large ${styles.title}`}>
        Enter your email
      </h1>
      <p className={`typo-body-large ${styles.subtitle}`}>
        We&rsquo;ll send you your personalized plan and score estimate.
      </p>
      <TextField
        alwaysFocused
        className={styles.field}
        autoFocus
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        icon={<MailIcon />}
      />
      {showError && (
        <p className={`typo-body-small ${styles.error}`}>
          Please enter a valid email address.
        </p>
      )}
    </ScreenShell>
  );
}

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
