import { ScreenShell } from "../../components/ScreenShell/ScreenShell";
import { Button } from "../../components/Button/Button";
import { useFunnel } from "../../funnel/FunnelProvider";
import { useLocale } from "../../i18n/LocaleProvider";
import type { Locale } from "../../i18n/locales";
import styles from "./LanguageSelect.module.css";

/**
 * "What's your native language?" — Figma frames 6021:67571 (375),
 * 6021:65912 (425), 6021:66493 (768).
 *
 * Layout is identical across all three breakpoints. Only the grid
 * column count and the content column width change:
 *   - 375 / 425 → 2 columns
 *   - ≥768      → 4 columns
 * Card shape, padding (16/12), radius (20), flag slot (32×24 with
 * 1px border and 4px radius) and gap (16) stay the same.
 *
 * Interaction:
 *   - English is pre-selected (default).
 *   - The selected card shows a brand-colored check_circle badge in
 *     the top-right corner (Figma material icon).
 *   - Clicking a card sets that locale as the active one and writes
 *     it into the funnel answers.
 */
export function LanguageSelectScreen() {
  const { next, updateAnswers } = useFunnel();
  const { locales, selectedCode, setSelectedCode } = useLocale();

  const handleSelect = (code: string) => {
    setSelectedCode(code);
    updateAnswers({ nativeLanguage: code });
  };

  const handleNext = () => {
    updateAnswers({ nativeLanguage: selectedCode });
    next();
  };

  return (
    <div className={styles.screen}>
      <ScreenShell footer={<Button onClick={handleNext}>Next</Button>} hideProgress>
        <h1 className={`typo-heading-large ${styles.title}`}>
          What&rsquo;s your native language?
        </h1>

        <div className={styles.grid} role="radiogroup" aria-label="Native language">
          {locales.map((locale) => (
            <LanguageCard
              key={locale.code}
              locale={locale}
              selected={locale.code === selectedCode}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </ScreenShell>
    </div>
  );
}

interface LanguageCardProps {
  locale: Locale;
  selected: boolean;
  onSelect: (code: string) => void;
}

function LanguageCard({ locale, selected, onSelect }: LanguageCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`${styles.card} ${selected ? styles.cardSelected : ""}`}
      onClick={() => onSelect(locale.code)}
    >
      <div
        className={`${styles.flag} ${
          locale.code === "other" ? styles.flagNoBorder : ""
        }`}
      >
        {locale.flagSrc ? (
          <img src={locale.flagSrc} alt="" className={styles.flagImg} />
        ) : null}
      </div>
      <span className={`typo-heading-small ${styles.label}`}>
        {locale.label}
      </span>
      {selected && <CheckCircle className={styles.check} />}
    </button>
  );
}

/**
 * Material-style check_circle badge shown on the selected card.
 * Reconstructed from Figma's export so the "check" cuts out cleanly
 * inside a filled brand-colored circle.
 */
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" fill="var(--color-background-brand)" />
      <path
        d="M7.5 12.2 L10.3 15 L16.5 8.8"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
