import React from "react";
import styles from "./style.module.css";

export default function AccentButton({ children, onClick, className = "" }) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
