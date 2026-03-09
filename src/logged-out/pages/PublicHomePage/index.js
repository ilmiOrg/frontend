import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import quadLogo from '../../../assets/images/quad-logo.jpg'
import { SplineScene } from '../../../components/SplineScene'
import { Spotlight } from '../../../components/Spotlight'
import styles from './style.module.css'

const SPLINE_SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

/** Adjust hero text here in one place */
const HERO_COPY = {
  badge: 'AI university matching',
  titleLine1: 'Find your',
  titleLine2: 'perfect fit',
  description: 'AI matches you with universities that fit your goals and budget.',
  ctaPrimary: 'Start free',
  ctaSecondary: 'How it works',
}

const PublicHomePage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  // Section refs for smooth scrolling
  const featuresRef = useRef(null)
  const pricingRef = useRef(null)
  const aboutRef = useRef(null)

  // Layout styling for logged-out mode - SINGLE scrollbar on body
  useEffect(() => {
    const styleEl = document.createElement('style')
    styleEl.id = 'quad-page-styles'
    styleEl.textContent = `
      /* html doesn't scroll - just contains body */
      html {
        overflow: hidden !important;
        height: 100% !important;
        background: #000 !important;
      }
      
      /* body is the ONLY scrollable element */
      body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        height: 100% !important;
        background: #000 !important;
        margin: 0 !important;
        padding: 0 !important;
        scroll-behavior: smooth !important;
      }
      
      #root {
        overflow: visible !important;
        height: auto !important;
        min-height: 100% !important;
      }
      
      /* Hide html scrollbar completely */
      html::-webkit-scrollbar { 
        display: none !important;
        width: 0 !important; 
      }
    `
    document.head.appendChild(styleEl)

    return () => {
      const existingStyle = document.getElementById('quad-page-styles')
      if (existingStyle) existingStyle.remove()
    }
  }, [])

  const handleLogin = () => {
    login()
    navigate('/dashboard')
  }

  // Smooth scroll to section
  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <button onClick={() => navigate('/')} className={styles.logo}>
            <img src={quadLogo} alt="Quad" className={styles.logoImage} />
            <span>Quad</span>
          </button>
          <div className={styles.navCenter}>
            <button className={styles.navLink} onClick={() => scrollToSection(featuresRef)}>Features</button>
            <button className={styles.navLink} onClick={() => scrollToSection(pricingRef)}>Pricing</button>
            <button className={styles.navLink} onClick={() => scrollToSection(aboutRef)}>About</button>
          </div>
          <div className={styles.navButtons}>
            <button onClick={handleLogin} className={styles.btnGhost}>
              Log in
            </button>
            <button onClick={handleLogin} className={styles.btnPrimary}>
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero: robot full space; content inside so robot can react to hover over text */}
      <section className={styles.hero}>
        <div className={styles.heroSplineWrap}>
          <SplineScene
            scene={SPLINE_SCENE_URL}
            className={styles.heroSpline}
            nudgeRobotRight={0.85}
            robotObjectNames={['Robot', 'Character', 'Agent', 'robot', 'Character2', 'Cube', 'Model', 'Avatar', 'Figure']}
          />
          <div className={styles.heroOverlay} aria-hidden />
          <Spotlight
            className={styles.heroSpotlight}
            fill="var(--text-white)"
          />
          <div className={styles.heroContentWrap}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <span className={styles.badgeDot}></span>
                <span>{HERO_COPY.badge}</span>
              </div>

              <h1 className={styles.heroTitle}>
                <span className={styles.heroLine}>{HERO_COPY.titleLine1}</span>
                <span className={styles.heroLineGradient}>{HERO_COPY.titleLine2}</span>
              </h1>

              <p className={styles.heroDescription}>
                {HERO_COPY.description}
              </p>

              <div className={styles.heroActions}>
                <button onClick={handleLogin} className={styles.btnHero}>
                  {HERO_COPY.ctaPrimary}
                </button>
                <button className={styles.btnSecondary}>
                  <span className={styles.playIcon}>▶</span>
                  {HERO_COPY.ctaSecondary}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} ref={featuresRef}>
        <div className={styles.featuresContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Features</span>
            <h2 className={styles.sectionTitle}>
              Everything you need to<br />find your dream school
            </h2>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.featureIcon}>🎯</span>
              </div>
              <h3 className={styles.featureTitle}>Smart Matching</h3>
              <p className={styles.featureDesc}>
                Our AI analyzes your profile, grades, and preferences to find 
                universities where you'll thrive.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.featureIcon}>💰</span>
              </div>
              <h3 className={styles.featureTitle}>Scholarship Finder</h3>
              <p className={styles.featureDesc}>
                Discover scholarships and financial aid you qualify for. 
                Never miss an opportunity.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.featureIcon}>📊</span>
              </div>
              <h3 className={styles.featureTitle}>Admission Insights</h3>
              <p className={styles.featureDesc}>
                Real acceptance rates, deadlines, and requirements. 
                Make informed decisions.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <span className={styles.featureIcon}>🌍</span>
              </div>
              <h3 className={styles.featureTitle}>Global Reach</h3>
              <p className={styles.featureDesc}>
                Access universities worldwide. From local colleges 
                to international institutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricing} ref={pricingRef}>
        <div className={styles.pricingContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Pricing</span>
            <h2 className={styles.sectionTitle}>
              Choose the plan that<br />works for you
            </h2>
          </div>

          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3 className={styles.pricingName}>Free</h3>
                <div className={styles.pricingPrice}>
                  <span className={styles.priceAmount}>$0</span>
                  <span className={styles.pricePeriod}>/month</span>
                </div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>✓ University matching</li>
                <li>✓ Scholarship finder</li>
                <li>✓ Basic search</li>
                <li>✓ Application tracking</li>
              </ul>
              <button onClick={handleLogin} className={styles.btnPricing}>
                Get started
              </button>
            </div>

            <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
              <div className={styles.featuredBadge}>Most Popular</div>
              <div className={styles.pricingHeader}>
                <h3 className={styles.pricingName}>Premium</h3>
                <div className={styles.pricingPrice}>
                  <span className={styles.priceAmount}>$29</span>
                  <span className={styles.pricePeriod}>/month</span>
                </div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>✓ Everything in Free</li>
                <li>✓ AI-powered matching</li>
                <li>✓ Essay reviews</li>
                <li>✓ Mock interviews</li>
                <li>✓ Concierge support</li>
                <li>✓ Priority matching</li>
              </ul>
              <button onClick={handleLogin} className={styles.btnPricingFeatured}>
                Start free trial
              </button>
            </div>

            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3 className={styles.pricingName}>Enterprise</h3>
                <div className={styles.pricingPrice}>
                  <span className={styles.priceAmount}>Custom</span>
                  <span className={styles.pricePeriod}></span>
                </div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>✓ Everything in Premium</li>
                <li>✓ Dedicated advisor</li>
                <li>✓ Unlimited reviews</li>
                <li>✓ School partnerships</li>
                <li>✓ Custom integrations</li>
              </ul>
              <button onClick={handleLogin} className={styles.btnPricing}>
                Contact sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about} ref={aboutRef}>
        <div className={styles.aboutContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>About</span>
            <h2 className={styles.sectionTitle}>
              Empowering students to<br />find their perfect match
            </h2>
          </div>

          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <p className={styles.aboutDesc}>
                Quad was born from a simple idea: finding the right university shouldn't be 
                complicated or overwhelming. We use cutting-edge AI to match students with 
                universities that align with their goals, budget, and aspirations.
              </p>
              <p className={styles.aboutDesc}>
                Our mission is to democratize access to higher education by making the search 
                process intelligent, personalized, and stress-free. With thousands of universities 
                and millions of data points, we help students make informed decisions about their 
                future.
              </p>
            </div>
            <div className={styles.aboutStats}>
              <div className={styles.aboutStat}>
                <span className={styles.aboutStatValue}>50K+</span>
                <span className={styles.aboutStatLabel}>Students Helped</span>
              </div>
              <div className={styles.aboutStat}>
                <span className={styles.aboutStatValue}>2,500+</span>
                <span className={styles.aboutStatLabel}>Universities</span>
              </div>
              <div className={styles.aboutStat}>
                <span className={styles.aboutStatValue}>95%</span>
                <span className={styles.aboutStatLabel}>Satisfaction Rate</span>
              </div>
              <div className={styles.aboutStat}>
                <span className={styles.aboutStatValue}>150+</span>
                <span className={styles.aboutStatLabel}>Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to find your match?</h2>
            <p className={styles.ctaDesc}>
              Join 50,000+ students who found their dream university with Quad.
            </p>
            <button onClick={handleLogin} className={styles.btnCta}>
              Get started free
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <img src={quadLogo} alt="Quad" className={styles.footerLogoImg} />
              <span>Quad</span>
            </div>
            <span className={styles.footerCopy}>© 2024 All rights reserved</span>
          </div>
          <div className={styles.footerLinks}>
            <button className={styles.footerLink}>Privacy</button>
            <button className={styles.footerLink}>Terms</button>
            <button className={styles.footerLink}>Contact</button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicHomePage
