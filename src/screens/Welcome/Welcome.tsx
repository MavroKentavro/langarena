import { ScreenShell } from "../../components/ScreenShell/ScreenShell";
import { Button } from "../../components/Button/Button";
import { Badge } from "../../components/Badge/Badge";
import { useFunnel } from "../../funnel/FunnelProvider";
import { SkillsRingChart } from "./SkillsRingChart";
import styles from "./Welcome.module.css";

/**
 * "Get ready for TOEFL" — entry screen of the funnel.
 *
 * Figma: node 6002:1812. Block order (top → bottom):
 *   1. Centered LangArena logo     (rendered by ScreenShell header)
 *   2. Main headline
 *   3. Supporting subtitle
 *   4. Centered "3 minute quiz" badge (clock icon + label)
 *   5. Animated four-ring skills chart
 *   6. Chart legend
 *   7. Bottom fixed "Next" CTA       (rendered by ScreenShell footer)
 *
 * The Figma frame for this screen shows no progress stepper, so the
 * shell's progress bar is hidden here.
 */
export function WelcomeScreen() {
  const { next } = useFunnel();

  return (
    <ScreenShell
      footer={<Button onClick={next}>Next</Button>}
      hideBack
      hideProgress
    >
      <div className={styles.titleBlock}>
        <h1 className={`typo-heading-large ${styles.heading}`}>
          Get ready for TOEFL
        </h1>
        <p className={`typo-heading-small ${styles.subtitle}`}>
          Get a TOEFL score estimate and a personalized learning plan
        </p>
      </div>

      <Badge icon={<ClockIcon />}>3 minute quiz</Badge>

      <SkillsRingChart />

      <div className={styles.legend}>
        <LegendItem
          color="var(--color-background-pink)"
          label="Reading"
          delayMs={200}
        />
        <LegendItem
          color="var(--color-background-cyan)"
          label="Listening"
          delayMs={350}
        />
        <LegendItem
          color="var(--color-background-orange)"
          label="Speaking"
          delayMs={500}
        />
        <LegendItem
          color="var(--color-background-mint)"
          label="Writing"
          delayMs={650}
        />
      </div>
    </ScreenShell>
  );
}

function LegendItem({
  color,
  label,
  delayMs,
}: {
  color: string;
  label: string;
  delayMs: number;
}) {
  return (
    <div
      className={styles.legendItem}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <span className={styles.legendDot} style={{ background: color }} />
      <span className={`typo-body-emphasized ${styles.legendLabel}`}>
        {label}
      </span>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ color: "var(--color-text-info)" }}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
