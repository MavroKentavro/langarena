import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FUNNEL_ORDER } from "./funnelSteps";
import type { FunnelAnswers, FunnelStep } from "./types";
import { DEFAULT_LOCALE_CODE } from "../i18n/locales";

/**
 * Funnel state machine.
 *
 * Iteration 1: local-state only. Next/prev walks the linear
 * `FUNNEL_ORDER` list and stores user-entered answers in memory.
 * Persistence, scoring, and submission will plug in here later
 * without rewriting screen components.
 */
interface FunnelContextValue {
  currentStep: FunnelStep;
  answers: FunnelAnswers;
  goTo: (step: FunnelStep) => void;
  next: () => void;
  back: () => void;
  updateAnswers: (patch: Partial<FunnelAnswers>) => void;
  canGoBack: boolean;
  canGoNext: boolean;
}

const FunnelContext = createContext<FunnelContextValue | undefined>(undefined);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<FunnelStep>(FUNNEL_ORDER[0]);
  // English is pre-selected per the Figma design; the user can change
  // it on the language screen before advancing.
  const [answers, setAnswers] = useState<FunnelAnswers>({
    nativeLanguage: DEFAULT_LOCALE_CODE,
  });

  const index = FUNNEL_ORDER.indexOf(currentStep);

  const goTo = useCallback((step: FunnelStep) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const next = useCallback(() => {
    setCurrentStep((prev) => {
      const i = FUNNEL_ORDER.indexOf(prev);
      if (i === -1 || i === FUNNEL_ORDER.length - 1) return prev;
      return FUNNEL_ORDER[i + 1];
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const back = useCallback(() => {
    setCurrentStep((prev) => {
      const i = FUNNEL_ORDER.indexOf(prev);
      if (i <= 0) return prev;
      return FUNNEL_ORDER[i - 1];
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const updateAnswers = useCallback((patch: Partial<FunnelAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<FunnelContextValue>(
    () => ({
      currentStep,
      answers,
      goTo,
      next,
      back,
      updateAnswers,
      canGoBack: index > 0,
      canGoNext: index < FUNNEL_ORDER.length - 1,
    }),
    [currentStep, answers, goTo, next, back, updateAnswers, index]
  );

  return (
    <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>
  );
}

export function useFunnel(): FunnelContextValue {
  const ctx = useContext(FunnelContext);
  if (!ctx)
    throw new Error("useFunnel must be used inside <FunnelProvider>");
  return ctx;
}
