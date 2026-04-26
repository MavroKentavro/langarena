/**
 * Supported locales for the "What's your native language?" screen.
 *
 * Iteration 1: the selector is interactive but interface copy stays
 * in English regardless of selection. The shape here is ready to be
 * wired to a real i18n provider in a later iteration.
 *
 * Flag assets are SVGs hosted under /flags/<Label>.svg — the filenames
 * match the labels shown in the UI. "other" has no native flag; the
 * component renders a globe icon for it.
 *
 * Order below matches the Figma design (top-left → bottom-right):
 *   Row 1: English, Spanish
 *   Row 2: Portuguese, German
 *   Row 3: French, Turkish
 *   Row 4: Italian, Bulgarian
 *   Row 5: Chinese, Czech
 *   Row 6: Finnish, Greek
 *   Row 7: Indonesian, Japanese
 *   Row 8: Korean, Polish
 *   Row 9: Russian, Swedish
 *   Row 10: Ukrainian, Other
 */
export interface Locale {
  /** Stable identifier. BCP-47-ish for real languages; "other" for the fallback. */
  code: string;
  /** English name shown in the UI. */
  label: string;
  /**
   * Path to the flag SVG in /public/flags/. `null` for the "Other"
   * option — the component renders a globe icon instead.
   */
  flagSrc: string | null;
}

export const LOCALES: Locale[] = [
  { code: "en", label: "English", flagSrc: "/flags/English.svg" },
  { code: "es", label: "Spanish", flagSrc: "/flags/Spanish.svg" },
  { code: "pt", label: "Portuguese", flagSrc: "/flags/Portuguese.svg" },
  { code: "de", label: "German", flagSrc: "/flags/German.svg" },
  { code: "fr", label: "French", flagSrc: "/flags/French.svg" },
  { code: "tr", label: "Turkish", flagSrc: "/flags/Turkish.svg" },
  { code: "it", label: "Italian", flagSrc: "/flags/Italian.svg" },
  { code: "bg", label: "Bulgarian", flagSrc: "/flags/Bulgarian.svg" },
  { code: "zh", label: "Chinese", flagSrc: "/flags/Chinese.svg" },
  { code: "cs", label: "Czech", flagSrc: "/flags/Czech.svg" },
  { code: "fi", label: "Finnish", flagSrc: "/flags/Finnish.svg" },
  { code: "el", label: "Greek", flagSrc: "/flags/Greek.svg" },
  { code: "id", label: "Indonesian", flagSrc: "/flags/Indonesian.svg" },
  { code: "ja", label: "Japanese", flagSrc: "/flags/Japanese.svg" },
  { code: "ko", label: "Korean", flagSrc: "/flags/Korean.svg" },
  { code: "pl", label: "Polish", flagSrc: "/flags/Polish.svg" },
  { code: "ru", label: "Russian", flagSrc: "/flags/Russian.svg" },
  { code: "sv", label: "Swedish", flagSrc: "/flags/Swedish.svg" },
  { code: "uk", label: "Ukrainian", flagSrc: "/flags/Ukrainian.svg" },
  { code: "other", label: "Other", flagSrc: null },
];

/** Default selection — English is pre-selected per the design. */
export const DEFAULT_LOCALE_CODE: string = "en";
