import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTranslation } from '../../hooks/useLanguage';
import styles from './style.module.css';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  // Initialize theme on component mount
  useEffect(() => {
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let shouldBeDark = false;
        
        if (savedTheme === 'dark') {
          shouldBeDark = true;
        } else if (savedTheme === 'light') {
          shouldBeDark = false;
        } else {
          // No saved preference, use system preference
          shouldBeDark = systemPrefersDark;
        }
        
        setIsDarkMode(shouldBeDark);
        
        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
        
        console.log('Theme initialized:', shouldBeDark ? 'dark' : 'light');
      } catch (error) {
        console.error('Theme initialization error:', error);
        // Fallback to light mode
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    };

    initializeTheme();
  }, []);

  const toggleTheme = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const newTheme = !isDarkMode;
      console.log('Toggling theme to:', newTheme ? 'dark' : 'light');
      
      setIsDarkMode(newTheme);
      
      if (newTheme) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
      }
      
      // Dispatch theme change event for other components
      window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { 
          theme: newTheme ? 'dark' : 'light',
          isDark: newTheme
        }
      }));
      
      console.log('Theme changed successfully to:', newTheme ? 'dark' : 'light');
      
    } catch (error) {
      console.error('Theme toggle error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className={styles.themeToggle}
      onClick={toggleTheme}
      disabled={isLoading}
      aria-label={isDarkMode ? t('lightMode') : t('darkMode')}
      title={isDarkMode ? t('switchToLight') : t('switchToDark')}
    >
      <div className={`${styles.iconContainer} ${isDarkMode ? styles.dark : styles.light}`}>
        {isDarkMode ? (
          <FiSun className={styles.icon} />
        ) : (
          <FiMoon className={styles.icon} />
        )}
      </div>
      <span className={styles.label}>
        {isDarkMode ? t('light') : t('dark')}
      </span>
    </button>
  );
};

export default ThemeToggle;
