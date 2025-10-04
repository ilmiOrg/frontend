import React from 'react'
import Button from '../ui-components/ui-elements/Button'
import { useTranslation } from '../../hooks/useLanguage'
import styles from './style.module.css'
import UniversityCard from './UniversityCard'

function FeaturedUniversities() {
  const { t } = useTranslation()
  const universities = [
    {
      id: 1,
      name: 'Harvard University',
      location: 'Cambridge, MA',
      logo: 'https://via.placeholder.com/80x80',
      rating: 4.9,
      programs: ['Liberal Arts', 'Medicine', 'Law'],
      tuition: 52000,
      acceptanceRate: 5
    },
    {
      id: 2,
      name: 'Stanford University',
      location: 'Stanford, CA',
      logo: 'https://via.placeholder.com/80x80',
      rating: 4.8,
      programs: ['Computer Science', 'Engineering', 'Business'],
      tuition: 56000,
      acceptanceRate: 4
    },
    {
      id: 3,
      name: 'MIT',
      location: 'Cambridge, MA',
      logo: 'https://via.placeholder.com/80x80',
      rating: 4.9,
      programs: ['Engineering', 'Computer Science', 'Physics'],
      tuition: 54000,
      acceptanceRate: 7
    },
    {
      id: 4,
      name: 'Oxford University',
      location: 'Oxford, UK',
      logo: 'https://via.placeholder.com/80x80',
      rating: 4.7,
      programs: ['Liberal Arts', 'Medicine', 'Law'],
      tuition: 45000,
      acceptanceRate: 17
    }
  ]

  return (
    <section className={styles.featuredUniversities}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('featuredTitle')}</h2>
          <p className={styles.subtitle}>
            {t('featuredSubtitle')}
          </p>
        </div>
        
        <div className={styles.universitiesGrid}>
          {universities.map(university => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
        
        <div className={styles.viewAll}>
          <Button variant="secondary" size="large">
            {t('viewAll')}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedUniversities
