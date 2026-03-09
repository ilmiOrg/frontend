import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import ilmiLogo from '../../../assets/images/ilmi-logo.jpg'
import { SplineScene } from '../../../components/SplineScene'
import { Spotlight } from '../../../components/Spotlight'
import { LandingSparklesHeader } from '../../../components/ui/LandingSparklesHeader'
import { SkyToggle } from '../../../components/ui/SkyToggle'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import { ScrollContainer } from '../../../components/ui/ScrollContainer'
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
  const { isAuthenticated } = useAuth()
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true
    const saved = localStorage.getItem('theme')
    if (saved === 'light') return false
    if (saved === 'dark') return true
    return true
  })

  useEffect(() => {
    const handler = () => setIsDark(document.body.getAttribute('theme') === 'dark')
    window.addEventListener('themeChanged', handler)
    return () => window.removeEventListener('themeChanged', handler)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.body.setAttribute('theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.classList.toggle('light', !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next ? 'dark' : 'light', isDark: next } }))
  }

  // Section refs for smooth scrolling
  const featuresRef = useRef(null)
  const pricingRef = useRef(null)
  const aboutRef = useRef(null)

  // Layout: no body scroll – only ScrollContainer (custom scrollbar on the right)
  useEffect(() => {
    const styleEl = document.createElement('style')
    styleEl.id = 'ilmi-page-styles'
    styleEl.textContent = `
      html, body {
        overflow: hidden !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
      }
      #root {
        height: 100% !important;
        overflow: hidden !important;
      }
    `
    document.head.appendChild(styleEl)
    return () => {
      const existingStyle = document.getElementById('ilmi-page-styles')
      if (existingStyle) existingStyle.remove()
    }
  }, [])

  /** Log in → go to login page. */
  const handleLogin = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  /** Get started / Sign up → go to register page (there you can sign up or "Continue as guest"). */
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  // Smooth scroll to section
  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={styles.page}>
      {/* Navigation – fixed above scroll area */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <button onClick={() => navigate('/')} className={styles.logo}>
            <img src={ilmiLogo} alt="ilmi" className={styles.logoImage} />
            <span>ilmi</span>
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
            <button onClick={handleGetStarted} className={styles.btnPrimary}>
              Get started
            </button>
            <div className={styles.navControls}>
              <SkyToggle checked={isDark} onChange={toggleTheme} />
              <LanguageSwitcher className={styles.navLang} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main scroll area – below navbar so scrollbar doesn’t overlap it */}
      <div className={styles.scrollArea}>
        <ScrollContainer className={styles.mainScroll} disableHorizontalScroll>
          <div className={styles.scrollContent}>
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
            fill="var(--color-contrast)"
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
                <button onClick={handleGetStarted} className={styles.btnHero}>
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
          <LandingSparklesHeader title="Features" />

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
          <LandingSparklesHeader title="Pricing" />

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
              <button onClick={handleGetStarted} className={styles.btnPricing}>
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
              <button onClick={handleGetStarted} className={styles.btnPricingFeatured}>
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
          <LandingSparklesHeader title="About" />

          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <p className={styles.aboutDesc}>
                ilmi was born from a simple idea: finding the right university shouldn't be 
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
              Join 50,000+ students who found their dream university with ilmi.
            </p>
            <button onClick={handleGetStarted} className={styles.btnCta}>
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
              <img src={ilmiLogo} alt="ilmi" className={styles.footerLogoImg} />
              <span>ilmi</span>
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
        </ScrollContainer>
      </div>
    </div>
  )
}

export default PublicHomePage
