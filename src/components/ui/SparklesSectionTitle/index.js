import React from "react";
import { SparklesCore } from "../sparkles";
import styles from "./style.module.css";

/**
 * Section heading (h2 or h3) with a subtle sparkles effect under the text.
 * Use for "my interface" section names (Dashboard, DashboardPage, etc.).
 *
 * @param {Object} props
 * @param {'h2'|'h3'} [props.as='h2'] - Heading level
 * @param {string} [props.className] - Class for the heading (e.g. styles.sectionTitle)
 * @param {React.ReactNode} props.children - Title text
 * @param {string} [props.particleColor] - Sparkles color (hex or CSS variable value)
 * @param {number} [props.particleDensity] - Particle count
 */
export function SparklesSectionTitle({
  as: Tag = "h2",
  className = "",
  children,
  particleColor,
  particleDensity = 200,
}) {
  return (
    <div className={styles.wrapper}>
      <Tag className={`${styles.title} ${className}`.trim()}>{children}</Tag>
      <div className={styles.sparklesStrip}>
        <SparklesCore
          background="transparent"
          minSize={0.3}
          maxSize={0.9}
          particleDensity={particleDensity}
          className={styles.sparklesFill}
          particleColor={particleColor || "var(--ownGreen)"}
          speed={2}
        />
      </div>
    </div>
  );
}

export default SparklesSectionTitle;
