import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { languages } from '../../hooks/useLanguage';
import { useLanguage, useTranslation } from '../../hooks/useLanguage';
import styles from './style.module.css';

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, isLoading, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleLanguageChange = async (languageCode) => {
    if (languageCode === currentLanguage) {
      setIsOpen(false);
      return;
    }

    const success = await changeLanguage(languageCode);
    
    if (success) {
      setIsOpen(false);
      const config = languages[languageCode];
      if (config) {
        console.log(`Language switched to ${config.name}`);
      }
    } else {
      console.error('Failed to switch language');
    }
  };

  // Get current language config with fallback
  const currentLangConfig = languages[currentLanguage] || { 
    name: 'English', 
    flag: '🇺🇸', 
    dir: 'ltr' 
  };

  return (
    <div className={styles.languageSwitcher}>
      <button 
        className={styles.languageToggle}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        aria-label={t('language')}
      >
        <span className={styles.languageFlag}>
          {currentLangConfig.flag}
        </span>
        <span className={styles.languageName}>
          {currentLangConfig.name}
        </span>
        <FiChevronDown 
          className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.languageMenu}>
          <div className={styles.languageList}>
            {Object.entries(languages).map(([code, config]) => {
              // Ensure config exists and has required properties
              if (!config || !config.flag || !config.name) {
                console.warn(`Invalid config for language ${code}:`, config);
                return null;
              }
              
              return (
                <button
                  key={code}
                  className={`${styles.languageOption} ${
                    code === currentLanguage ? styles.active : ''
                  }`}
                  onClick={() => handleLanguageChange(code)}
                  disabled={isLoading}
                >
                  <span className={styles.optionFlag}>
                    {config.flag}
                  </span>
                  <span className={styles.optionName}>
                    {config.name}
                  </span>
                  {code === currentLanguage && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Overlay to close menu when clicking outside */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher;
