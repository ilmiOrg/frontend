import React, { useState } from 'react';
import { FiMenu, FiX, FiUser, FiBell, FiSettings } from 'react-icons/fi';
import { useTranslation } from '../../hooks/useLanguage';
import styles from './style.module.css';
import Logo from './Logo';
import Navigation from './Navigation';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Logo />
          <Navigation />
        </div>
        
        <div className={styles.rightSection}>
          <LanguageSwitcher />
          <ThemeToggle />
          <button className={styles.iconButton} aria-label={t('notifications')}>
            <FiBell />
          </button>
          <button className={styles.iconButton} aria-label={t('settings')}>
            <FiSettings />
          </button>
          <button className={styles.userButton}>
            <FiUser />
            <span>{t('profile')}</span>
          </button>
        </div>
        
        <button 
          className={styles.mobileMenuToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? t('close') : t('open')}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Navigation />
          <div className={styles.mobileActions}>
            <button className={`${styles.mobileButton} btn btn-outline`}>
              <FiBell />
              {t('notifications')}
            </button>
            <button className={`${styles.mobileButton} btn btn-outline`}>
              <FiSettings />
              {t('settings')}
            </button>
            <button className={`${styles.mobileButton} btn btn-primary`}>
              <FiUser />
              {t('profile')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
