import React, { useId } from "react";
import styles from "./style.module.css";

export default function NumberField({
  label,
  value,
  onChange,
  placeholder,
  id: idProp,
  className = "",
}) {
  const uid = useId();
  const id = idProp || `num-${uid}`;

  return (
    <div className={`${styles.root} ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
            onChange(raw);
          }
        }}
      />
    </div>
  );
}
