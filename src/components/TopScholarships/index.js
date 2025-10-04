import React from 'react'
import Button from '../ui-components/ui-elements/Button'
import Card from '../ui-components/ui-elements/Card'
import Badge from '../ui-components/ui-elements/Badge'
import { useTranslation } from '../../hooks/useLanguage'
import styles from './style.module.css'

function TopScholarships() {
  const { t } = useTranslation()
  
  const scholarships = [
    {
      id: 1,
      name: 'Gates Foundation Scholarship',
      amount: '$50,000',
      deadline: 'Dec 15, 2024',
      type: 'meritBased',
      description: 'Full scholarship for outstanding students pursuing STEM fields'
    },
    {
      id: 2,
      name: 'Central Asia Excellence Award',
      amount: '$25,000',
      deadline: 'Jan 30, 2025',
      type: 'needBased',
      description: 'Supporting students from Central Asia with financial need'
    },
    {
      id: 3,
      name: 'Tech Innovation Grant',
      amount: '$15,000',
      deadline: 'Feb 15, 2025',
      type: 'projectBased',
      description: 'For students with innovative technology projects'
    }
  ]

  return (
    <section className={styles.topScholarships}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('scholarshipTitle')}</h2>
          <p className={styles.subtitle}>
            {t('scholarshipSubtitle')}
          </p>
        </div>

        <div className={styles.scholarshipsGrid}>
          {scholarships.map(scholarship => (
            <Card key={scholarship.id} className={styles.scholarshipCard} hover>
              <div className={styles.scholarshipHeader}>
                <h3 className={styles.scholarshipName}>{scholarship.name}</h3>
                <Badge variant="success" className={styles.amountBadge}>
                  {scholarship.amount}
                </Badge>
              </div>

              <div className={styles.scholarshipContent}>
                <div className={styles.scholarshipInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>{t('deadline')}</span>
                    <span className={styles.infoValue}>{scholarship.deadline}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>{t('type')}</span>
                    <Badge variant="outline" size="small">{t(`${scholarship.type}Based`)}</Badge>
                  </div>
                </div>

                <p className={styles.scholarshipDescription}>
                  {scholarship.description}
                </p>
              </div>

              <div className={styles.scholarshipActions}>
                <Button variant="outline" size="small">
                  {t('learnMore')}
                </Button>
                <Button variant="primary" size="small">
                  {t('apply')}
                </Button>
              </div>
            </Card>
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

export default TopScholarships
