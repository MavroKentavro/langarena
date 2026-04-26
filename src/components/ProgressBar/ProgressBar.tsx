import { Fragment } from "react";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  /** Zero-indexed chapter currently in progress. */
  currentChapter: number;
  /** Ratio (0..1) of the current chapter completed. */
  chapterProgress: number;
  /** Total chapters — matches Figma's 5 knobs but kept configurable. */
  totalChapters?: number;
  className?: string;
}

export function ProgressBar({
  currentChapter,
  chapterProgress,
  totalChapters = 5,
  className = "",
}: ProgressBarProps) {
  const segments = Array.from({ length: totalChapters });

  return (
    <div
      className={`${styles.progress} ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={totalChapters}
      aria-valuenow={currentChapter + chapterProgress}
    >
      {segments.map((_, i) => {
        const isDone = i < currentChapter;
        const isActive = i === currentChapter;
        const knobClass = [
          styles.knob,
          isDone ? styles.done : "",
          isActive ? styles.active : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <Fragment key={i}>
            <div className={knobClass} />
            {i < totalChapters - 1 && (
              <div className={styles.bar}>
                <div
                  className={styles.barFill}
                  style={{
                    width: isDone
                      ? "100%"
                      : isActive
                      ? `${Math.max(0, Math.min(1, chapterProgress)) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
