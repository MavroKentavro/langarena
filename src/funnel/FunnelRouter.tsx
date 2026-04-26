import { useFunnel } from "./FunnelProvider";
import type { FunnelStep } from "./types";
import { STEP_CONTENT } from "./screenContent";

import { WelcomeScreen } from "../screens/Welcome/Welcome";
import { LanguageSelectScreen } from "../screens/LanguageSelect/LanguageSelect";
import { NameInputScreen } from "../screens/NameInput/NameInput";
import { DidYouKnowScreen } from "../screens/DidYouKnow/DidYouKnow";
import { EmailInputScreen } from "../screens/EmailInput/EmailInput";
import { PaywallScreen } from "../screens/Paywall/Paywall";
import { InfoScreen } from "../screens/InfoScreen/InfoScreen";
import { QuestionScreen } from "../screens/QuestionScreen/QuestionScreen";
import { MockAssessmentScreen } from "../screens/MockAssessment/MockAssessment";

/**
 * Funnel router — picks the right screen component for the current
 * step. Iteration 1 uses local state; when real URL-based routing is
 * added (React Router / TanStack Router), this file becomes the
 * `<Routes>` map.
 */
export function FunnelRouter() {
  const { currentStep } = useFunnel();
  return <StepView step={currentStep} />;
}

function StepView({ step }: { step: FunnelStep }) {
  // Custom screens first (screens that own their own layout)
  switch (step) {
    case "welcome":
      return <WelcomeScreen />;
    case "language":
      return <LanguageSelectScreen />;
    case "name":
      return <NameInputScreen />;
    case "didYouKnow":
      return <DidYouKnowScreen />;
    case "email":
      return <EmailInputScreen />;
    case "paywall":
      return <PaywallScreen />;
    default:
      break;
  }

  // Content-driven screens (info / question / assessment).
  const content = STEP_CONTENT[step];
  if (!content || content.kind === "custom") {
    // Defensive fallback — should never hit in practice.
    return (
      <InfoScreen
        title={step}
        body="Screen pending — design to be wired from Figma."
      />
    );
  }

  if (content.kind === "info") {
    return (
      <InfoScreen
        title={content.title}
        body={content.body}
        ctaLabel={content.ctaLabel}
      />
    );
  }

  if (content.kind === "question") {
    return (
      <QuestionScreen
        title={content.title}
        options={content.options}
        multi={content.multi}
        answerKey={content.answerKey}
      />
    );
  }

  // assessment
  return (
    <MockAssessmentScreen
      skill={content.skill}
      title={content.title}
      passage={content.passage}
      prompt={content.prompt}
      choices={content.choices}
    />
  );
}
