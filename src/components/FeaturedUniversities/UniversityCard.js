import React from 'react'
import Button from '../ui-components/ui-elements/Button'
import Card from '../ui-components/ui-elements/Card'
import Badge from '../ui-components/ui-elements/Badge'
import { useTranslation } from '../../hooks/useLanguage'
import styles from './UniversityCard.module.css'

function UniversityCard({ university }) {
  const { t } = useTranslation()
  return (
    <Card className={styles.universityCard} hover>
      <div className={styles.cardHeader}>
        <img 
          src={university.logo} 
          alt={university.name}
          className={styles.universityLogo}
        />
        <div className={styles.universityInfo}>
          <h3 className={styles.universityName}>{university.name}</h3>
          <p className={styles.universityLocation}>{university.location}</p>
          <div className={styles.rating}>
            <span className={styles.stars}>★★★★★</span>
            <span className={styles.ratingValue}>{university.rating}</span>
          </div>
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.universityStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t('universityTuition')}</span>
            <span className={styles.statValue}>${university.tuition.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t('universityAcceptanceRate')}</span>
            <span className={styles.statValue}>{university.acceptanceRate}%</span>
          </div>
        </div>

        <div className={styles.programs}>
          <h4 className={styles.programsTitle}>{t('universityPrograms')}</h4>
          <div className={styles.programsList}>
            {university.programs.map((program, index) => (
              <Badge key={index} variant="outline" size="small">
                {program}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cardActions}>
        <Button variant="secondary" size="small">
          {t('learnMore')}
        </Button>
        <Button variant="primary" size="small">
          {t('apply')}
        </Button>
      </div>
    </Card>
  )
}

export default UniversityCard
