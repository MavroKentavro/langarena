import { ScreenShell } from "../../components/ScreenShell/ScreenShell";
import { useFunnel } from "../../funnel/FunnelProvider";
import styles from "./DidYouKnow.module.css";

/**
 * Marketing / onboarding "Did you know TOEFL is changing in 2026?"
 * The Figma frame has no bottom CTA; it advances via two tappable rows:
 *   - "Learn more" (success / affirmative) → next
 *   - "I already know" (danger / dismiss)  → next
 */
export function DidYouKnowScreen() {
  const { next } = useFunnel();

  return (
    <ScreenShell>
      <h1 className={`typo-heading-large ${styles.title}`}>
        Did you know TOEFL is changing in 2026?
      </h1>

      <div className={styles.stack}>
        <button
          type="button"
          className={`${styles.row} ${styles.rowSuccess}`}
          onClick={next}
        >
          <CheckIcon />
          <span className={`typo-heading-small ${styles.rowLabel}`}>
            Learn more
          </span>
        </button>
        <button
          type="button"
          className={`${styles.row} ${styles.rowDanger}`}
          onClick={next}
        >
          <CloseIcon />
          <span className={`typo-heading-small ${styles.rowLabel}`}>
            I already know
          </span>
        </button>
      </div>
    </ScreenShell>
  );
}

function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={styles.rowIcon}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M7.5 12.5l3 3 6-6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={styles.rowIcon}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" />
      <path
        d="M8 8l8 8M16 8l-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
