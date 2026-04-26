import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./TextField.module.css";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  /** Force the focused/selected look regardless of focus. */
  alwaysFocused?: boolean;
}

export function TextField({
  icon,
  alwaysFocused = false,
  className = "",
  ...inputProps
}: TextFieldProps) {
  const classes = [
    styles.field,
    alwaysFocused ? styles.fieldFocus : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <input className={styles.input} {...inputProps} />
    </label>
  );
}
