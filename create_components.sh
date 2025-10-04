#!/bin/bash

# Create Hero component
cat > src/components/Hero/Hero.js << 'HERO_EOF'
import React from 'react';
import styles from './style.module.css';

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Find Your Perfect University Match
          </h1>
          <p className={styles.subtitle}>
            Discover universities and scholarships tailored to your academic goals and career aspirations.
          </p>
          <div className={styles.buttons}>
            <button className={styles.primaryButton}>
              Explore Universities
            </button>
            <button className={styles.secondaryButton}>
              Browse Scholarships
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
HERO_EOF

cat > src/components/Hero/index.js << 'HERO_INDEX_EOF'
import Hero from './Hero'

export default Hero
HERO_INDEX_EOF

cat > src/components/Hero/style.module.css << 'HERO_CSS_EOF'
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 120px 0 80px;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.content {
  max-width: 600px;
  margin: 0 auto;
}

.title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  line-height: 1.2;
}

.subtitle {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.5;
}

.buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.primaryButton {
  background-color: #fff;
  color: #667eea;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.primaryButton:hover {
  transform: translateY(-2px);
}

.secondaryButton {
  background-color: transparent;
  color: #fff;
  border: 2px solid #fff;
  padding: 13px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondaryButton:hover {
  background-color: #fff;
  color: #667eea;
}
HERO_CSS_EOF

# Create BottomNav component
cat > src/components/BottomNav/BottomNav.js << 'BOTTOM_EOF'
import React from 'react';
import styles from './style.module.css';

function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      <div className={styles.container}>
        <div className={styles.navItem}>
          <span className={styles.icon}>🏠</span>
          <span className={styles.label}>Home</span>
        </div>
        <div className={styles.navItem}>
          <span className={styles.icon}>🎓</span>
          <span className={styles.label}>Universities</span>
        </div>
        <div className={styles.navItem}>
          <span className={styles.icon}>💰</span>
          <span className={styles.label}>Scholarships</span>
        </div>
        <div className={styles.navItem}>
          <span className={styles.icon}>👤</span>
          <span className={styles.label}>Profile</span>
        </div>
      </div>
    </nav>
  );
}

export default BottomNav;
BOTTOM_EOF

cat > src/components/BottomNav/index.js << 'BOTTOM_INDEX_EOF'
import BottomNav from './BottomNav'

export default BottomNav
BOTTOM_INDEX_EOF

cat > src/components/BottomNav/style.module.css << 'BOTTOM_CSS_EOF'
.bottomNav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e9ecef;
  padding: 10px 0;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-around;
}

.navItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.navItem:hover {
  background-color: #f8f9fa;
}

.icon {
  font-size: 20px;
}

.label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}
BOTTOM_CSS_EOF

echo "Components created successfully!"
