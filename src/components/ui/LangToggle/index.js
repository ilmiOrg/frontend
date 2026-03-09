import React from 'react';
import styles from './style.module.css';

function UKUSFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" className={styles.flagSvg} aria-hidden>
      <defs>
        <clipPath id="lang-lft">
          <rect x="0" y="0" width="30" height="40" />
        </clipPath>
        <clipPath id="lang-rgt">
          <rect x="30" y="0" width="30" height="40" />
        </clipPath>
      </defs>
      <g clipPath="url(#lang-lft)">
        <rect width="60" height="40" fill="#012169" />
        <line x1="0" y1="0" x2="60" y2="40" stroke="#fff" strokeWidth="9" />
        <line x1="60" y1="0" x2="0" y2="40" stroke="#fff" strokeWidth="9" />
        <line x1="0" y1="0" x2="60" y2="40" stroke="#C8102E" strokeWidth="4.5" />
        <line x1="60" y1="0" x2="0" y2="40" stroke="#C8102E" strokeWidth="4.5" />
        <rect x="24" y="0" width="12" height="40" fill="#fff" />
        <rect x="0" y="14" width="60" height="12" fill="#fff" />
        <rect x="26" y="0" width="8" height="40" fill="#C8102E" />
        <rect x="0" y="16" width="60" height="8" fill="#C8102E" />
      </g>
      <g clipPath="url(#lang-rgt)">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <rect key={i} x="30" y={i * 3.077} width="30" height="3.077" fill={i % 2 === 0 ? '#B22234' : '#fff'} />
        ))}
        <rect x="30" y="0" width="14" height="21.54" fill="#3C3B6E" />
      </g>
    </svg>
  );
}

function RUFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" className={styles.flagSvg} aria-hidden>
      <rect width="60" height="13.33" fill="#fff" />
      <rect y="13.33" width="60" height="13.34" fill="#0052A5" />
      <rect y="26.67" width="60" height="13.33" fill="#D52B1E" />
    </svg>
  );
}

/**
 * EnviroVision-style language toggle: EN (UK/US flag) vs RU.
 * language is 'en' or 'ru'; onChange receives the toggle event (switch to other).
 */
export function LangToggle({ language, onChange, isDark }) {
  const isRu = language === 'ru';

  return (
    <div className={styles.wrapper} data-dark={isDark}>
      <label className={styles.langSwitch} title={isRu ? 'Switch to English' : 'Переключить на Русский'}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={isRu}
          onChange={onChange}
          aria-label={isRu ? 'Switch to English' : 'Switch to Russian'}
        />
        <div className={styles.track}>
          <span className={`${styles.flag} ${styles.flagEn}`}>
            <UKUSFlag />
          </span>
          <div className={styles.knob} />
          <span className={`${styles.flag} ${styles.flagRu}`}>
            <RUFlag />
          </span>
        </div>
      </label>
    </div>
  );
}

export default LangToggle;
