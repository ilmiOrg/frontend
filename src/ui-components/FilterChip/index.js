import React from "react";
import styles from "./style.module.css";

export default function FilterChip({ pressed, onToggle, children, className = "" }) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${pressed ? styles.chipPressed : ""} ${className}`.trim()}
      aria-pressed={pressed}
      onClick={onToggle}
    >
      {children}
    </button>
  );
}
