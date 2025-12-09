import React from 'react'
import styles from './style.module.css'

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Your Dream University Awaits</h1>
          <p className={styles.heroSubtitle}>
            Connect with the perfect university that matches your academic aspirations, 
            financial situation, and personal preferences.
          </p>
          <div className={styles.heroButtons}>
            <a href="/login" className={`${styles.btn} ${styles.btnPrimary}`}>
              Start Matching
            </a>
            <a href="#demo" className={`${styles.btn} ${styles.btnOutline}`}>
              Watch Demo
            </a>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNumber}>50K+</div>
              <div className={styles.heroStatLabel}>Students</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNumber}>2,500+</div>
              <div className={styles.heroStatLabel}>Universities</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNumber}>95%</div>
              <div className={styles.heroStatLabel}>Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection


