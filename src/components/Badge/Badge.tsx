import type { ReactNode } from "react";
import styles from "./Badge.module.css";

interface BadgeProps {
  icon?: ReactNode;
  children: ReactNode;
}

export function Badge({ icon, children }: BadgeProps) {
  return (
    <span className={styles.badge}>
      {icon}
      <span className={`typo-body-emphasized ${styles.badgeLabel}`}>
        {children}
      </span>
    </span>
  );
}
