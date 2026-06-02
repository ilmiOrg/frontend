import React, { useId, useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "../../hooks/useLanguage";
import styles from "./style.module.css";

const Chevron = ({ open }) => (
  <svg
    className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function SelectField({
  label,
  value,
  onChange,
  options,
  id: idProp,
  className = "",
  compact = false,
}) {
  const { t } = useTranslation();
  const uid = useId();
  const id = idProp || `select-${uid}`;
  const listId = `${id}-listbox`;
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const rootRef = useRef(null);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected?.label ?? "—";

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, [open]);

  const pick = useCallback(
    (v) => {
      onChange(v);
      setOpen(false);
      setHighlightIndex(-1);
    },
    [onChange]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        setHighlightIndex(-1);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((h) => Math.min(h + 1, options.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((h) => Math.max(h - 1, 0));
      }
      if (e.key === "Enter" && highlightIndex >= 0) {
        e.preventDefault();
        pick(options[highlightIndex].value);
      }
    },
    [open, options, pick, highlightIndex]
  );

  useEffect(() => {
    if (open) {
      const i = options.findIndex((o) => o.value === value);
      setHighlightIndex(i >= 0 ? i : 0);
    } else {
      setHighlightIndex(-1);
    }
  }, [open, value, options]);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${compact ? styles.compact : ""} ${className}`.trim()}
    >
      {label && (
        <span
          className={`${styles.label} ${compact ? styles.labelCompact : ""}`}
          id={`${id}-label`}
        >
          {label}
        </span>
      )}
      <button
        type="button"
        id={id}
        className={`${styles.trigger} ${compact ? styles.triggerCompact : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-label={label ? undefined : t("selectFieldDefaultPlaceholder")}
        aria-activedescendant={
          open && highlightIndex >= 0 ? `${id}-opt-${highlightIndex}` : undefined
        }
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span className={styles.triggerText}>{displayLabel}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <ul id={listId} role="listbox" className={styles.menu}>
          {options.map((opt, i) => (
            <li
              key={String(opt.value)}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={value === opt.value}
              className={`${styles.option} ${
                value === opt.value ? styles.optionSelected : ""
              } ${i === highlightIndex ? styles.optionActive : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
