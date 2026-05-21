import React from "react";
import styles from "./style.module.css";

const PageTemplate = ({
  icon,
  title,
  description,
  actions,
  children,
  headerShellClassName,
}) => {
  return (
    <div className={styles.page}>
      <div
        className={[styles.headerShell, headerShellClassName]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerContent}>
              {icon && <span className={styles.icon}>{icon}</span>}
              <div>
                <h1 className={styles.title}>{title}</h1>
                {description && (
                  <p className={styles.description}>{description}</p>
                )}
              </div>
            </div>
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </div>
      <div className={styles.scrollInner}>{children}</div>
    </div>
  );
};

export default PageTemplate;
