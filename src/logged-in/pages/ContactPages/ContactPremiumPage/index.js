import React from 'react'
import PageTemplate from '../../shared/PageTemplate'
import styles from './style.module.css'

const ContactPremiumPage = () => {
  return (
    <PageTemplate
      icon="📞"
      title="Premium Support"
      description="Get priority support from our team"
      actions={
        <button className={styles.primaryBtn}>
          Contact Us
        </button>
      }
    >
      <div className={styles.contentContainer}>
        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Premium Support</h2>
          <p className={styles.sectionText}>
            As a premium member, you have access to priority support. Our team is here to help you.
          </p>
        </div>
      </div>
    </PageTemplate>
  )
}

export default ContactPremiumPage
