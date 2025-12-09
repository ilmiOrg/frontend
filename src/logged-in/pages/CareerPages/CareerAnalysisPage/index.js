import React from 'react'
import PageTemplate from '../../../shared/PageTemplate'
import styles from './style.module.css'

const CareerAnalysisPage = () => {
  return (
    <PageTemplate
      icon="📊"
      title="Career Path Analysis"
      description="Analyze potential career paths and opportunities"
      actions={
        <button className={styles.primaryBtn}>
          Get Started
        </button>
      }
    >
      <div className={styles.contentContainer}>
        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Welcome to Career Path Analysis!</h2>
          <p className={styles.sectionText}>
            Analyze potential career paths and opportunities. This powerful feature will help you achieve your university goals faster and more efficiently.
          </p>
          
          <div className={styles.features}>
            <h3 className={styles.featuresTitle}>Key Features</h3>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>⚡</span>
                <h4>Fast & Efficient</h4>
                <p>Get results quickly with our optimized system</p>
              </div>
              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>🎯</span>
                <h4>Highly Accurate</h4>
                <p>AI-powered recommendations tailored to you</p>
              </div>
              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>🔒</span>
                <h4>Secure & Private</h4>
                <p>Your data is protected and confidential</p>
              </div>
              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>💪</span>
                <h4>Expert Support</h4>
                <p>24/7 assistance from our team</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.actionSection}>
          <div className={styles.actionCard}>
            <h3 className={styles.actionTitle}>Ready to get started?</h3>
            <p className={styles.actionText}>
              Begin your journey with Career Path Analysis and unlock your full potential.
            </p>
            <button className={styles.actionBtn}>
              📊 Start Now
            </button>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}

export default CareerAnalysisPage
