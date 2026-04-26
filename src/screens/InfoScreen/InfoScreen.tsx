import type { ReactNode } from "react";
import { ScreenShell } from "../../components/ScreenShell/ScreenShell";
import { Button } from "../../components/Button/Button";
import { useFunnel } from "../../funnel/FunnelProvider";
import styles from "./InfoScreen.module.css";

interface InfoScreenProps {
  title: string;
  body?: string;
  /** Optional visual — e.g. Figma illustration placeholder. */
  visual?: ReactNode;
  /** CTA label (defaults to "Next"). */
  ctaLabel?: string;
}

/**
 * Shared scaffolding for the many marketing/onboarding screens in
 * the funnel (Did you know, Difficulty Adaptation, Updated Writing,
 * You are in good hands, Language learning exercises your brain, …).
 *
 * Figma provides rich illustrations per screen that will be swapped
 * in later — for iteration 1 we render a neutral branded placeholder
 * so the layout and progression feel complete. Flagged as a known
 * gap: these need real assets wired from Figma.
 */
export function InfoScreen({
  title,
  body,
  visual,
  ctaLabel = "Next",
}: InfoScreenProps) {
  const { next } = useFunnel();

  return (
    <ScreenShell footer={<Button onClick={next}>{ctaLabel}</Button>}>
      <div className={styles.container}>
        <h1 className={`typo-heading-large ${styles.title}`}>{title}</h1>
        <div className={styles.visual}>
          {visual ?? <div className={styles.visualPlaceholder}>LangArena</div>}
        </div>
        {body && <p className={`typo-body-large ${styles.body}`}>{body}</p>}
      </div>
    </ScreenShell>
  );
}
