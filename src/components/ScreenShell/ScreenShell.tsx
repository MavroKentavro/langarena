import type { ReactNode } from "react";
import styles from "./ScreenShell.module.css";
import { Logo } from "../Logo/Logo";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { useFunnel } from "../../funnel/FunnelProvider";
import { getProgress } from "../../funnel/funnelSteps";

interface ScreenShellProps {
  children: ReactNode;
  /** Footer content (usually the primary CTA button). */
  footer?: ReactNode;
  /** Hide progress bar — used on welcome screen chapter edge cases. */
  hideProgress?: boolean;
  /** Hide back button — default: shown unless first step. */
  hideBack?: boolean;
}

export function ScreenShell({
  children,
  footer,
  hideProgress = false,
  hideBack = false,
}: ScreenShellProps) {
  const { currentStep, back, canGoBack } = useFunnel();
  const progress = getProgress(currentStep);

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        {!hideBack && canGoBack && (
          <button
            className={styles.backButton}
            onClick={back}
            aria-label="Go back"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <Logo className={styles.logo} />
        {!hideProgress && (
          <ProgressBar
            currentChapter={progress.chapterIndex}
            chapterProgress={progress.chapterProgress}
            totalChapters={progress.totalChapters}
          />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.contentInner}>{children}</div>
      </div>

      {footer && <div className={styles.actionContainer}>{footer}</div>}
    </div>
  );
}
