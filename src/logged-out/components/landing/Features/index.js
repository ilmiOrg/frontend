import React from 'react'
import styles from './style.module.css'

const FeaturesSection = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Intelligent Matching',
      description: 'Our advanced AI analyzes your profile, preferences, and goals to find universities that are the perfect fit for your academic journey.'
    },
    {
      icon: '💰',
      title: 'Financial Planning',
      description: 'Discover scholarships, grants, and financial aid opportunities to make your education dreams financially achievable and sustainable.'
    },
    {
      icon: '📊',
      title: 'Data-Driven Insights',
      description: 'Access detailed statistics about admission rates, program outcomes, and career prospects for informed decision-making.'
    },
    {
      icon: '🌍',
      title: 'Global Network',
      description: 'Explore universities worldwide with comprehensive information about international programs and admission requirements.'
    },
    {
      icon: '📱',
      title: 'Mobile Experience',
      description: 'Access your matches and manage applications seamlessly across all your devices with our responsive design.'
    },
    {
      icon: '🤝',
      title: 'Expert Guidance',
      description: 'Get personalized support from education counselors who understand the application process and can help you succeed.'
    }
  ]

  return (
    <section className={styles.features} id="features">
      <div className={styles.featuresContainer}>
        <h2 className={styles.sectionTitle}>Everything You Need</h2>
        <p className={styles.sectionSubtitle}>
          Our comprehensive platform provides all the tools and resources you need to find your perfect university match.
        </p>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection


