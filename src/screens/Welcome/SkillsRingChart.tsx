import { useEffect, useState } from "react";
import styles from "./SkillsRingChart.module.css";

/**
 * Four-ring circular chart used on the "Get ready for TOEFL" screen.
 *
 * Geometry (spec):
 *   - Stroke width:       16
 *   - Outer diameters:    70, 118, 166, 214   (ring 1 is innermost)
 *   - Center-line radii:  27, 51, 75, 99      (= (outerD − stroke) / 2)
 *   - Canvas:             214 × 214, center (107, 107)
 *
 * Skill → ring mapping (outer = pink, per Figma):
 *   r=99 (outermost) — Reading   (pink)
 *   r=75             — Listening (cyan)
 *   r=51             — Speaking  (orange)
 *   r=27 (innermost) — Writing   (mint)
 *
 * Animation (per reference):
 *   - All arcs start at length 0 from the 12 o'clock position, rendered
 *     as a colored dot thanks to stroke-linecap="round" + a tiny
 *     non-zero dash length.
 *   - They then sweep clockwise to their target length. No bounce.
 *   - Small stagger (outer first) for a controlled "unfolding".
 */

interface RingSpec {
  key: "reading" | "listening" | "speaking" | "writing";
  /** Radius of the stroke's center line. */
  radius: number;
  /** Final arc length in % of circumference (0–100). */
  targetPct: number;
  /** CSS variable with the ring color. */
  colorVar: string;
}

const STROKE_WIDTH = 16;
const SIZE = 214;
const CENTER = SIZE / 2;
const TRACK_COLOR = "var(--color-background-secondary)";

/**
 * Every arc starts at 12 o'clock. The initial "dot" state is
 * strokeDasharray="0.001 100" — a dash length of effectively zero that
 * still triggers the rounded cap, yielding a filled circle with the
 * stroke's diameter.
 */
const INITIAL_DASHARRAY = "0.001 100";

/** Outer → inner order matches the render (and stagger) sequence. */
const RINGS: RingSpec[] = [
  { key: "reading", radius: 99, targetPct: 92, colorVar: "--color-background-pink" },
  { key: "listening", radius: 75, targetPct: 72, colorVar: "--color-background-cyan" },
  { key: "speaking", radius: 51, targetPct: 62, colorVar: "--color-background-orange" },
  { key: "writing", radius: 27, targetPct: 38, colorVar: "--color-background-mint" },
];

export function SkillsRingChart() {
  /** Flips true on the frame after mount so dasharray transitions. */
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Defer to next frame so the 0 → target transition actually runs.
    const raf = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={styles.chartWrapper}
      role="img"
      aria-label="TOEFL skills overview: Reading, Listening, Speaking, Writing"
    >
      <svg
        className={styles.chart}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden="true"
      >
        {/* Background tracks — full-circle strokes behind each colored arc. */}
        {RINGS.map((ring) => (
          <circle
            key={`track-${ring.key}`}
            cx={CENTER}
            cy={CENTER}
            r={ring.radius}
            fill="none"
            stroke={TRACK_COLOR}
            strokeWidth={STROKE_WIDTH}
          />
        ))}

        {/*
         * Colored arcs — pathLength=100 so strokeDasharray reads in %.
         * All arcs share the same rotation (-90°) so their start point
         * sits at 12 o'clock; they grow clockwise from there.
         */}
        {RINGS.map((ring, i) => (
          <circle
            key={`arc-${ring.key}`}
            cx={CENTER}
            cy={CENTER}
            r={ring.radius}
            fill="none"
            stroke={`var(${ring.colorVar})`}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={
              animated ? `${ring.targetPct} 100` : INITIAL_DASHARRAY
            }
            style={{
              transform: "rotate(-90deg)",
              transformBox: "fill-box",
              transformOrigin: "center",
              transition: `stroke-dasharray 1100ms cubic-bezier(0.22, 0.61, 0.36, 1) ${i * 90}ms`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
