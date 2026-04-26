import type { ReactNode } from "react";
import styles from "./OptionCard.module.css";

interface OptionCardProps {
  selected?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  label: string;
  meta?: ReactNode;
  className?: string;
}

export function OptionCard({
  selected = false,
  onClick,
  icon,
  label,
  meta,
  className = "",
}: OptionCardProps) {
  const classes = [
    styles.card,
    selected ? styles.selected : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-pressed={selected}
    >
      {icon && <div className={styles.flag}>{icon}</div>}
      <span className={`typo-heading-small ${styles.label}`}>{label}</span>
      {meta && <span className={`typo-body ${styles.meta}`}>{meta}</span>}
    </button>
  );
}
