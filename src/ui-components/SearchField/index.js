import React, { useId } from "react";
import { useTranslation } from "../../hooks/useLanguage";
import styles from "./style.module.css";

const SearchIcon = () => (
  <svg
    className={styles.searchIcon}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default function SearchField({
  value,
  onChange,
  placeholder,
  label,
  id: idProp,
  className = "",
}) {
  const { t } = useTranslation();
  const uid = useId();
  const id = idProp || `search-${uid}`;
  const effectivePlaceholder = placeholder ?? t("searchUniNamePlaceholder");
  const effectiveLabel = label ?? t("searchFieldDefaultPlaceholder");

  return (
    <div className={`${styles.wrap} ${className}`.trim()}>
      <label htmlFor={id} className={styles.visuallyHidden}>
        {effectiveLabel}
      </label>
      <div className={styles.inner}>
        <SearchIcon />
        <input
          id={id}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          className={styles.input}
          placeholder={effectivePlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
