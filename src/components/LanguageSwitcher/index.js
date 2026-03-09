import React from 'react';
import { languages } from '../../hooks/useLanguage';
import { useLanguage, useTranslation } from '../../hooks/useLanguage';
import styles from './style.module.css';

/**
 * Language strip: multiple flags in a pill (size/shape similar to SkyToggle).
 * One click per flag to switch; clean and clear; scales by adding more flag buttons.
 */
const LanguageSwitcher = ({ className = '' }) => {
  const { currentLanguage, isLoading, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleSelect = async (code) => {
    if (code === currentLanguage) return;
    await changeLanguage(code);
  };

  return (
    <div
      className={`${styles.langStrip} ${className}`.trim()}
      role="group"
      aria-label={t('language')}
    >
      {Object.entries(languages).map(([code, config]) => {
        if (!config?.flag) return null;
        const isActive = code === currentLanguage;
        return (
          <button
            key={code}
            type="button"
            className={`${styles.langFlagBtn} ${isActive ? styles.active : ''}`}
            onClick={() => handleSelect(code)}
            disabled={isLoading}
            aria-pressed={isActive}
            aria-label={config.name}
            title={config.name}
          >
            <span className={styles.flagEmoji}>{config.flag}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
