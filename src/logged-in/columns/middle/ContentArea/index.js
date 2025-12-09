import React from 'react'
import styles from './style.module.css'

const ContentArea = ({ children, title, breadcrumbs }) => {
  return (
    <div className={styles.contentArea}>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className={styles.breadcrumbs}>
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className={styles.breadcrumb}>
              {index > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
              <a href={crumb.path} className={styles.breadcrumbLink}>
                {crumb.label}
              </a>
            </span>
          ))}
        </nav>
      )}

      {/* Page Title */}
      {title && (
        <div className={styles.pageTitle}>
          <h1 className={styles.title}>{title}</h1>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

export default ContentArea


