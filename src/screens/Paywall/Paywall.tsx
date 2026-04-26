import { useState } from "react";
import { Button } from "../../components/Button/Button";
import { Logo } from "../../components/Logo/Logo";
import { useFunnel } from "../../funnel/FunnelProvider";
import styles from "./Paywall.module.css";

/**
 * Paywall — Figma frame "Paywall" (node 6003:14971).
 *
 * Iteration 1: UI-only. `selectedPlan` and "Get My Plan" do nothing
 * network-wise. Pricing text is copied verbatim from Figma so it can
 * be replaced by a real pricing service later without rewriting the
 * layout. When real payments are added, swap `handleCta` for a call
 * into the purchase provider.
 */
type PlanId = "monthly" | "quarterly";

interface Plan {
  id: PlanId;
  name: string;
  oldPerDay: string;
  perDayInt: string;
  perDayFrac: string;
  oldTotal: string;
  total: string;
  popular?: boolean;
}

// Pricing copy copied verbatim from Figma. Not a source of truth for
// real billing; the real pricing service will replace this.
const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "1 month",
    oldPerDay: "€1,00",
    perDayInt: "€0,",
    perDayFrac: "50",
    oldTotal: "€29,99",
    total: "€14,99",
  },
  {
    id: "quarterly",
    name: "3 month",
    oldPerDay: "€0,78",
    perDayInt: "€0,",
    perDayFrac: "39",
    oldTotal: "€69,99",
    total: "€34,99",
    popular: true,
  },
];

export function PaywallScreen() {
  const { back, canGoBack } = useFunnel();
  const [selected, setSelected] = useState<PlanId>("quarterly");

  const handleCta = () => {
    // Iteration 1: mock only. A later iteration wires this to a real
    // payments provider (App Store / Stripe / RevenueCat).
    // eslint-disable-next-line no-alert
    alert(
      `Mock purchase: ${selected} plan selected. Real payments will be wired in a later iteration.`
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.paywallHeader}>
        {canGoBack && (
          <button
            className={styles.closeButton}
            onClick={back}
            aria-label="Close paywall"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        <Logo className={styles.paywallLogo} />
      </div>
      <div className={styles.hero}>
        <h1 className="typo-heading-large">
          Grab your personal offer before it&rsquo;s gone!
        </h1>
      </div>

        <div className={styles.section}>
          <PlanStack selected={selected} onSelect={setSelected} />
        </div>

        <CtaBlock onClick={handleCta} />

        <div className={styles.section}>
          <div className={styles.paymentRow}>
            {["Visa", "Mastercard", "Apple Pay", "Discover", "Amex", "Google Pay"].map(
              (label) => (
                <span key={label} className={styles.paymentPill}>
                  {label}
                </span>
              )
            )}
          </div>
        </div>

        <div className={styles.section}>
          <ScoreProjection />
        </div>

        <div className={styles.section}>
          <h2 className={`typo-heading ${styles.sectionHeading}`}>
            Trusted and accepted by organizations including:
          </h2>
          <div className={styles.trustSlider}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.trustCard}>
                University {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={`typo-heading ${styles.sectionHeading}`}>
            What you get with LangArena
          </h2>
          <FeatureList />
        </div>

        <div className={styles.section}>
          <h2 className={`typo-heading ${styles.sectionHeading}`}>
            How LangArena Works
          </h2>
          <HowItWorks />
        </div>

        <div className={styles.section}>
          <div className={styles.moneyBack}>
            <h3 className="typo-heading">14-Day Money-Back Guarantee</h3>
            <p className="typo-body-large" style={{ marginTop: "var(--space-8)" }}>
              Try LangArena risk-free for 14 days. If it&rsquo;s not right for
              you, we&rsquo;ll refund your subscription — no questions asked.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={`typo-heading ${styles.sectionHeading}`}>
            Up to 50× cheaper than a tutor
          </h2>
          <ComparisonTable />
        </div>

        <div className={styles.section}>
          <PlanStack selected={selected} onSelect={setSelected} />
        </div>

        <CtaBlock onClick={handleCta} />
    </div>
  );
}

function PlanStack({
  selected,
  onSelect,
}: {
  selected: PlanId;
  onSelect: (id: PlanId) => void;
}) {
  return (
    <div className={styles.planStack}>
      {PLANS.map((p) => {
        const isSelected = p.id === selected;
        return (
          <button
            key={p.id}
            type="button"
            className={`${styles.plan} ${isSelected ? styles.selected : ""}`}
            onClick={() => onSelect(p.id)}
            aria-pressed={isSelected}
          >
            {p.popular && isSelected && (
              <div className={`typo-heading-small ${styles.planPopular}`}>
                Most Popular
              </div>
            )}
            <div className={styles.planBody}>
              <div className={styles.planRow}>
                <span className={`typo-heading-small ${styles.planName}`}>
                  {p.name}
                </span>
                <span className={`typo-body ${styles.planOldPrice}`}>
                  {p.oldPerDay}
                </span>
              </div>
              <div className={styles.planRow}>
                <span className={`typo-body-emphasized ${styles.savePill}`}>
                  Save 50%
                </span>
                <div className={styles.planPrice}>
                  <span className={styles.planPriceInt}>{p.perDayInt}</span>
                  <span className={styles.planPriceFrac}>{p.perDayFrac}</span>
                </div>
              </div>
              <div className={styles.planRow}>
                <span className={`typo-body ${styles.planOldPrice}`}>
                  {p.oldTotal}
                </span>
                <span className="typo-body-emphasized">
                  {p.total}{" "}
                  <span className={styles.planPerDay}>Per Day</span>
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CtaBlock({ onClick }: { onClick: () => void }) {
  return (
    <div className={styles.ctaBlock}>
      <button
        type="button"
        className={`typo-body-emphasized ${styles.guaranteeLink}`}
        onClick={() => {}}
      >
        14-Day Money-Back Guarantee
      </button>
      <Button onClick={onClick}>Get My Plan</Button>
      <div className={`typo-body-small ${styles.secureRow}`}>
        <LockIcon />
        <span>Your payment is secured</span>
      </div>
      <p className={`typo-body-small ${styles.renewalText}`}>
        Your subscription will renew at €69.99 every 3 month(s). Cancel anytime.
      </p>
    </div>
  );
}

function FeatureList() {
  const items = [
    "Improve all TOEFL skills",
    "Real time feedback from AI",
    "Dynamic program adjustments",
    "2,500+ practice exercises",
    "10 full length tests",
    "Follow your personalized plan",
    "Get results faster",
  ];
  return (
    <ul className={styles.features}>
      {items.map((t) => (
        <li key={t} className={styles.feature}>
          <CheckIcon className={styles.featureIcon} />
          <span className={`typo-heading-small ${styles.featureLabel}`}>
            {t}
          </span>
        </li>
      ))}
    </ul>
  );
}

function HowItWorks() {
  const cards = [
    {
      title: "Skill Tracking",
      body:
        "We track 13 specific TOEFL skills across all sections to find your strengths.",
    },
    {
      title: "Smart Repetition",
      body:
        "Mastered a topic? We rotate it out. Struggling? We bring it back.",
    },
    {
      title: "Adaptive Learning",
      body:
        "We update your level in real-time and adjust the program for optimal learning.",
    },
    {
      title: "Detailed Analytics",
      body:
        "Get deep insights into your performance with every question you answer.",
    },
    {
      title: "Exam Mode",
      body:
        "Practice with realistic timing and pressure before your test day.",
    },
  ];
  return (
    <div className={styles.howItWorks}>
      {cards.map((c) => (
        <div key={c.title} className={styles.howCard}>
          <img alt="" aria-hidden src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'/>" />
          <h3 className={`typo-heading ${styles.howCardTitle}`}>{c.title}</h3>
          <p className={`typo-body-large ${styles.howCardBody}`}>{c.body}</p>
        </div>
      ))}
    </div>
  );
}

function ComparisonTable() {
  const langArena = [
    "Instant feedback",
    "Practice anytime, even for 5 minutes",
    "Understand different voices and accents",
    "Stress free",
    "50× cheaper",
  ];
  const tutor = [
    "Schedule in advance",
    "Little variety",
    "Takes time to break",
    "Expensive",
  ];
  return (
    <div className={styles.comparison}>
      <div className={`${styles.compCol} ${styles.compColBrand}`}>
        <h3 className={`typo-heading-small ${styles.compColHeaderBrand}`}>
          LangArena
        </h3>
        {langArena.map((t) => (
          <div key={t} className={styles.compRow}>
            <CheckIcon />
            <span className="typo-body">{t}</span>
          </div>
        ))}
      </div>
      <div className={styles.compCol}>
        <h3 className={`typo-heading-small ${styles.compColHeader}`}>Tutor</h3>
        {tutor.map((t) => (
          <div
            key={t}
            className={`${styles.compRow} ${styles.negative}`}
          >
            <CloseIcon />
            <span className="typo-body">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreProjection() {
  const legend = [
    { label: "Reading", color: "var(--color-background-brand)" },
    { label: "Listening", color: "var(--color-background-cyan)" },
    { label: "Speaking", color: "var(--color-background-orange)" },
    { label: "Writing", color: "var(--color-background-pink)" },
  ];
  return (
    <div className={styles.scoreCard}>
      <span className={`typo-caption ${styles.scoreHeader}`}>
        Estimated Score
      </span>
      <h3 className={`typo-heading-large ${styles.scoreBody}`}>
        40–60% ready
      </h3>
      <span className={`typo-body ${styles.scoreReadiness}`}>
        Refine with Diagnostic Test
      </span>
      <div className={styles.scoreChart} aria-hidden />
      <div className={`typo-body ${styles.scoreLegend}`}>
        {legend.map((l) => (
          <span key={l.label} className={styles.scoreLegendItem}>
            <span
              className={styles.scoreLegendDot}
              style={{ background: l.color }}
            />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <path
        d="M7.5 12.5l3 3 6-6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" />
      <path
        d="M8 8l8 8M16 8l-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="11"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 11V8a4 4 0 118 0v3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
