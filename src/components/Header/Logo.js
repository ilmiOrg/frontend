import React from 'react';
import styles from './style.module.css';

function Logo() {
  return (
    <div className={styles.logoContainer}>
      <h1 className={styles.logo}>UniversityMatch</h1>
    </div>
  );
}

export default Logo;
