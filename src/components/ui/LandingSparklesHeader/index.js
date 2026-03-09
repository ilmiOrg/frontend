import React from "react";
import { SparklesCore } from "../sparkles";
import styles from "./style.module.css";

/**
 * EnviroVision-style section header: big centered title with clean sparkles
 * and green→blue gradient lines. Use for Features, Pricing, About on landing.
 */
export function LandingSparklesHeader({ title, particleColor = "#10b981", particleDensity = 120 }) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.sparklesArea}>
        <div className={styles.sparklesMask}>
          <div className={styles.gradientLine1} />
          <div className={styles.gradientLine2} />
          <div className={styles.gradientLine3} />
          <div className={styles.gradientLine4} />
          <SparklesCore
            background="transparent"
            minSize={0.7}
            maxSize={2.2}
            particleDensity={particleDensity}
            className={styles.sparklesFill}
            particleColor={particleColor}
          />
        </div>
      </div>
    </div>
  );
}

export default LandingSparklesHeader;
