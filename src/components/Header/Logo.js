import React from 'react';
import styles from './style.module.css';
import ilmiLogo from '../../assets/images/ilmi-logo.jpg';

function Logo() {
  return (
    <div className={styles.logoContainer}>
      <img 
        src={ilmiLogo} 
        alt="ilmi logo" 
        className={styles.logoImage}
      />
      <h1 className={styles.logo}>ilmi</h1>
    </div>
  );
}

export default Logo;
