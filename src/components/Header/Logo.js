import React from 'react';
import styles from './style.module.css';
import quadLogo from '../../assets/images/quad-logo.jpg';

function Logo() {
  return (
    <div className={styles.logoContainer}>
      <img 
        src={quadLogo} 
        alt="Quad logo" 
        className={styles.logoImage}
      />
      <h1 className={styles.logo}>Quad</h1>
    </div>
  );
}

export default Logo;
