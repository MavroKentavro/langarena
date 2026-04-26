import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LOCALE_CODE, LOCALES, type Locale } from "./locales";

/**
 * Selected native language.
 *
 * Iteration 1: this drives UI state only (which language card is
 * active in the selector). It does NOT change interface copy.
 * Later iterations can plug a real translator into this provider.
 *
 * English (`DEFAULT_LOCALE_CODE`) is pre-selected per the design —
 * the user can always change the selection before advancing.
 */
interface LocaleContextValue {
  locales: Locale[];
  selectedCode: string;
  setSelectedCode: (code: string) => void;
  selected: Locale | null;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [selectedCode, setSelectedCodeState] = useState<string>(
    DEFAULT_LOCALE_CODE
  );

  const setSelectedCode = useCallback((code: string) => {
    setSelectedCodeState(code);
  }, []);

  const selected = useMemo(
    () => LOCALES.find((l) => l.code === selectedCode) ?? null,
    [selectedCode]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locales: LOCALES, selectedCode, setSelectedCode, selected }),
    [selectedCode, setSelectedCode, selected]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx)
    throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
