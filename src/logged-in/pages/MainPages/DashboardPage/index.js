import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../contexts/AuthContext'
import Chart from 'chart.js/auto'
import quadLogo from '../../../../assets/images/quad-logo.jpg'
import styles from './style.module.css'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const universityViewsChartRef = useRef(null)
  const statusChartRef = useRef(null)
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    applicationManagement: false,
    aiMatching: false,
    community: false,
    verification: false,
    career: false,
    premium: false,
    learning: false,
    privacy: false
  })
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)

  // Hide ALL scrollbars when dashboard is mounted
  useEffect(() => {
    // Create a style element to hide all scrollbars globally
    const styleEl = document.createElement('style')
    styleEl.id = 'dashboard-no-scroll'
    styleEl.textContent = `
      html, body, #root {
        overflow: hidden !important;
        height: 100vh !important;
        width: 100vw !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
      }
      html::-webkit-scrollbar,
      body::-webkit-scrollbar,
      #root::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `
    document.head.appendChild(styleEl)
    
    // Cleanup: remove the style element when component unmounts
    return () => {
      const existingStyle = document.getElementById('dashboard-no-scroll')
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])

  // Load Voiceflow Chatbot - ensure it's positioned relative to viewport, not dashboard container
  useEffect(() => {
    // Check if script already exists to prevent duplicate loading
    let script = document.querySelector('script[src="https://cdn.voiceflow.com/widget-next/bundle.mjs"]')
    
    if (!script) {
      script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs'
      script.onload = () => {
        if (window.voiceflow) {
          window.voiceflow.chat.load({
            verify: { projectID: '68e16d089e709b6501735885' },
            url: 'https://general-runtime.voiceflow.com',
            versionID: 'production',
            voice: {
              url: "https://runtime-api.voiceflow.com"
            }
          })
        }
      }
      document.head.appendChild(script)
    } else if (window.voiceflow && !window.voiceflow.chat._loaded) {
      // Script exists but widget not loaded yet
      window.voiceflow.chat.load({
        verify: { projectID: '68e16d089e709b6501735885' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        voice: {
          url: "https://runtime-api.voiceflow.com"
        }
      })
    }

    // Minimal CSS - only ensure viewport positioning, Voiceflow handles all other styling
    const chatbotStyle = document.createElement('style')
    chatbotStyle.id = 'voiceflow-viewport-position'
    chatbotStyle.textContent = `
      /* Ensure widget is positioned relative to viewport, escapes dashboard container */
      [id*="voiceflow"],
      [class*="vf-widget"],
      [class*="vf-chat"],
      iframe[src*="voiceflow"],
      div[id*="voiceflow"],
      div[class*="vf-widget"] {
        position: fixed !important;
        z-index: 99999 !important;
      }
    `
    document.head.appendChild(chatbotStyle)

    // Also ensure widget is moved to body if it gets injected elsewhere
    const moveWidgetToBody = () => {
      const widgets = document.querySelectorAll('[id*="voiceflow"], [class*="vf-widget"]')
      widgets.forEach(widget => {
        if (widget.parentElement && widget.parentElement.tagName !== 'BODY') {
          document.body.appendChild(widget)
        }
      })
    }

    // Check for widget periodically and on DOM changes
    const checkInterval = setInterval(moveWidgetToBody, 500)
    const observer = new MutationObserver(moveWidgetToBody)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearInterval(checkInterval)
      observer.disconnect()
      // Don't remove script or style as it might be used by other pages
      // Just remove the style to prevent conflicts
      const existingStyle = document.getElementById('voiceflow-viewport-position')
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])

  // Initialize Charts
  useEffect(() => {
    let universityChart = null
    let statusChart = null

    // Add a small delay to ensure DOM elements are ready
    const timer = setTimeout(() => {
      // University Views Chart (Line Chart)
      if (universityViewsChartRef.current) {
        try {
          const ctx = universityViewsChartRef.current.getContext('2d')
          universityChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Universities',
                data: [3, 5, 8, 10, 12, 15],
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#7c3aed',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
              }, {
                label: 'Scholarships',
                data: [2, 3, 5, 6, 7, 8],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    color: '#94A3B8',
                    usePointStyle: true,
                    padding: 20
                  }
                }
              },
              scales: {
                x: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: '#94A3B8'
                  }
                },
                y: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: '#94A3B8'
                  }
                }
              }
            }
          })
        } catch (error) {
          console.error('Error creating university chart:', error)
        }
      }

      // Status Chart (Doughnut Chart)
      if (statusChartRef.current) {
        try {
          const ctx = statusChartRef.current.getContext('2d')
          statusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Plan to Apply', 'Applied', 'Accepted', 'Waitlist', 'Rejected'],
              datasets: [{
                data: [5, 4, 3, 2, 1],
                backgroundColor: ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'],
                borderWidth: 4,
                borderColor: '#0F172A'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              cutout: '50%',
              elements: {
                arc: {
                  borderWidth: 4,
                  borderColor: '#0F172A'
                }
              }
            }
          })
        } catch (error) {
          console.error('Error creating status chart:', error)
        }
      }
    }, 100)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      if (universityChart) {
        universityChart.destroy()
      }
      if (statusChart) {
        statusChart.destroy()
      }
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleNavClick = (path) => {
    navigate(path)
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className={`${styles.dashboard} ${leftSidebarCollapsed ? styles.leftCollapsed : ''} ${rightSidebarCollapsed ? styles.rightCollapsed : ''}`}>
      {/* Sidebar Toggle Buttons */}
      <button 
        className={styles.leftSidebarToggle} 
        onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
        title={leftSidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
      >
        {leftSidebarCollapsed ? '☰' : '✕'}
      </button>
      <button 
        className={styles.rightSidebarToggle} 
        onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
        title={rightSidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
      >
        {rightSidebarCollapsed ? '☰' : '✕'}
      </button>

      {/* Liquid Shapes Background */}
      <div className={styles.liquidShape}></div>
      <div className={styles.liquidShape}></div>
      <div className={styles.liquidShape}></div>

      {/* Left Sidebar */}
      <aside className={`${styles.leftSidebar} ${leftSidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <img src={quadLogo} alt="Quad" className={styles.logoImage} />
            <span>Quad</span>
          </div>
          <div className={styles.tagline}>Your university journey starts here</div>
        </div>

        <nav className={styles.leftNav}>
          {/* Main Navigation */}
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle} onClick={() => toggleSection('main')}>
              Main {expandedSections.main ? '▼' : '▶'}
            </div>
            {expandedSections.main && (
              <>
                <button className={`${styles.navItem} ${styles.active}`}>
                  <span className={styles.navIcon}>🏠</span>
                  <span className={styles.navLabel}>Main Dashboard</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/dream-university')} className={styles.navItem}>
                  <span className={styles.navIcon}>🌟</span>
                  <span className={styles.navLabel}>Dream University</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/search/universities')} className={styles.navItem}>
                  <span className={styles.navIcon}>🔍</span>
                  <span className={styles.navLabel}>Search Universities</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/search/scholarships')} className={styles.navItem}>
                  <span className={styles.navIcon}>💰</span>
                  <span className={styles.navLabel}>Search Scholarships</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/study-together')} className={styles.navItem}>
                  <span className={styles.navIcon}>📚</span>
                  <span className={styles.navLabel}>Study Together</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/university-reels')} className={styles.navItem}>
                  <span className={styles.navIcon}>🎬</span>
                  <span className={styles.navLabel}>University Reels</span>
                </button>
              </>
            )}
          </div>

          {/* Application Management */}
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle} onClick={() => toggleSection('applicationManagement')}>
              Application Management {expandedSections.applicationManagement ? '▼' : '▶'}
            </div>
            {expandedSections.applicationManagement && (
              <>
                <button onClick={() => handleNavClick('/dashboard/applications/timeline')} className={styles.navItem}>
                  <span className={styles.navIcon}>📅</span>
                  <span className={styles.navLabel}>Application Timeline</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/applications/documents')} className={styles.navItem}>
                  <span className={styles.navIcon}>📄</span>
                  <span className={styles.navLabel}>My Documents</span>
                </button>
              </>
            )}
          </div>

          {/* AI & Smart Matching */}
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle} onClick={() => toggleSection('aiMatching')}>
              AI & Smart Matching {expandedSections.aiMatching ? '▼' : '▶'}
            </div>
            {expandedSections.aiMatching && (
              <>
                <button onClick={() => handleNavClick('/dashboard/ai/match-universities')} className={styles.navItem}>
                  <span className={styles.navIcon}>🎯</span>
                  <span className={styles.navLabel}>Match Universities</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/ai/match-scholarships')} className={styles.navItem}>
                  <span className={styles.navIcon}>🎯</span>
                  <span className={styles.navLabel}>Match Scholarships</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/ai/similar-students')} className={styles.navItem}>
                  <span className={styles.navIcon}>👥</span>
                  <span className={styles.navLabel}>Similar Students</span>
                </button>
              </>
            )}
          </div>

          {/* Community & Networking */}
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle} onClick={() => toggleSection('community')}>
              Community & Networking {expandedSections.community ? '▼' : '▶'}
            </div>
            {expandedSections.community && (
              <>
                <button onClick={() => handleNavClick('/dashboard/community/friends')} className={styles.navItem}>
                  <span className={styles.navIcon}>👫</span>
                  <span className={styles.navLabel}>Connect Friends</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/community/mentors')} className={styles.navItem}>
                  <span className={styles.navIcon}>🎓</span>
                  <span className={styles.navLabel}>Alumni Mentors</span>
                </button>
              </>
            )}
          </div>

          {/* Verification */}
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle} onClick={() => toggleSection('verification')}>
              Verification {expandedSections.verification ? '▼' : '▶'}
            </div>
            {expandedSections.verification && (
              <>
                <button onClick={() => handleNavClick('/dashboard/contact-premium')} className={styles.navItem}>
                  <span className={styles.navIcon}>✅</span>
                  <span className={styles.navLabel}>Get Verified</span>
                </button>
              </>
            )}
          </div>

          {/* Career & Professional Development */}
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle} onClick={() => toggleSection('career')}>
              Career & Professional Development {expandedSections.career ? '▼' : '▶'}
            </div>
            {expandedSections.career && (
              <>
                <button onClick={() => handleNavClick('/dashboard/career/internships')} className={styles.navItem}>
                  <span className={styles.navIcon}>💼</span>
                  <span className={styles.navLabel}>Internships Matching</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/career/masters')} className={styles.navItem}>
                  <span className={styles.navIcon}>💼</span>
                  <span className={styles.navLabel}>Masters Matching</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/career/analysis')} className={styles.navItem}>
                  <span className={styles.navIcon}>📊</span>
                  <span className={styles.navLabel}>Career Path Analysis</span>
                </button>
              </>
            )}
          </div>

          {/* Premium Services */}
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle} onClick={() => toggleSection('premium')}>
              Premium Services {expandedSections.premium ? '▼' : '▶'}
            </div>
            {expandedSections.premium && (
              <>
                <button onClick={() => handleNavClick('/dashboard/premium/essay-reviews')} className={styles.navItem}>
                  <span className={styles.navIcon}>📝</span>
                  <span className={styles.navLabel}>Essay Reviews</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/premium/mock-interviews')} className={styles.navItem}>
                  <span className={styles.navIcon}>🎤</span>
                  <span className={styles.navLabel}>Mock Interviews</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/premium/concierge')} className={styles.navItem}>
                  <span className={styles.navIcon}>🎩</span>
                  <span className={styles.navLabel}>Concierge Support</span>
                </button>
              </>
            )}
          </div>

          {/* Learning & Courses */}
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle} onClick={() => toggleSection('learning')}>
              Learning & Courses {expandedSections.learning ? '▼' : '▶'}
            </div>
            {expandedSections.learning && (
              <>
                <button onClick={() => handleNavClick('/dashboard/courses')} className={styles.navItem}>
                  <span className={styles.navIcon}>📝</span>
                  <span className={styles.navLabel}>Get Courses</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/courses/math')} className={styles.navItem}>
                  <span className={styles.navIcon}>🔢</span>
                  <span className={styles.navLabel}>Math</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/courses/english')} className={styles.navItem}>
                  <span className={styles.navIcon}>📚</span>
                  <span className={styles.navLabel}>English</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/courses/essay-writing')} className={styles.navItem}>
                  <span className={styles.navIcon}>✍️</span>
                  <span className={styles.navLabel}>Essay Writing</span>
                </button>
                <button onClick={() => handleNavClick('/dashboard/courses/ai-literacy')} className={styles.navItem}>
                  <span className={styles.navIcon}>🤖</span>
                  <span className={styles.navLabel}>AI Literacy</span>
                </button>
              </>
            )}
          </div>

          {/* Privacy & Security */}
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle} onClick={() => toggleSection('privacy')}>
              Privacy & Security {expandedSections.privacy ? '▼' : '▶'}
            </div>
            {expandedSections.privacy && (
              <>
                <button onClick={() => handleNavClick('/dashboard/privacy')} className={styles.navItem}>
                  <span className={styles.navIcon}>🔒</span>
                  <span className={styles.navLabel}>My Privacy Dashboard</span>
                </button>
              </>
            )}
          </div>

          {/* Logout Section */}
          <div className={styles.navSection}>
            <button onClick={handleLogout} className={styles.navItem}>
              <span className={styles.navIcon}>🚪</span>
              <span className={styles.navLabel}>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.mainContentInner}>
        {/* Top Navbar */}
        <div className={styles.topNavbar}>
          <div className={styles.navbarLeft}>
            <div className={styles.profileSectionCompact}>
              <div className={styles.profileMain}>
                <div className={styles.profileAvatarCircle}>
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face" alt="Profile" className={styles.profileImg} />
                </div>
                <div className={styles.profileInfoVertical}>
                  <span className={styles.profileName}>Alex Johnson</span>
                  <span className={styles.profileBadge}>Premium</span>
                </div>
                <div className={styles.profileTimezoneInfo}>
                  <span className={styles.timezoneText}>Times are converted to Bishkek time (GMT+6)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.navbarCenter}>
            {/* Center content removed */}
          </div>
          
          <div className={styles.navbarRight}>
            <div className={styles.quickActions}>
              <div className={styles.streakIconCompact}>
                <span className={styles.fireIcon}>🔥</span>
                <span className={styles.fireNumber}>47</span>
              </div>
              <button className={styles.quickActionBtn} title="Dark Mode">
                <span className={styles.actionIcon}>🌙</span>
              </button>
              <button className={styles.quickActionBtn} title="Language">
                <span className={styles.actionIcon}>🌐</span>
              </button>
              <button className={styles.quickActionBtn} title="Notifications">
                <span className={styles.actionIcon}>🔔</span>
                <span className={styles.notificationBadge}>3</span>
              </button>
              <button className={styles.quickActionBtn} title="My Profile" onClick={() => handleNavClick('/dashboard/profile')}>
                <span className={styles.actionIcon}>👤</span>
              </button>
            </div>
          </div>
        </div>

        {/* Essential Dashboard Blocks */}
        <div className={styles.dashboardGridExtended}>
          {/* Block 1: Dream University (Enhanced & Moved to First) */}
          <div className={`${styles.dashboardCard} ${styles.dreamUniversityCard}`}>
            <div className={styles.dreamUniversityHeader}>
              <h3>🌟 Dream University</h3>
              <div className={styles.dreamProgress}>
                <div className={styles.progressRing}>
                  <svg className={styles.progressRingSvg} width="50" height="50">
                    <defs>
                      <linearGradient id="dreamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#2563EB',stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'#7C3AED',stopOpacity:1}} />
                      </linearGradient>
                    </defs>
                    <circle className={styles.progressRingCircleBg} cx="25" cy="25" r="20"></circle>
                    <circle className={`${styles.progressRingCircle} ${styles.dreamRing}`} cx="25" cy="25" r="20"></circle>
                  </svg>
                  <span className={styles.progressText}>92%</span>
                </div>
                <div className={styles.progressInfo}>
                  <span className={styles.progressEarned}>Perfect Match</span>
                  <span className={styles.progressTotal}>UCA Peak</span>
                </div>
              </div>
            </div>
            <div className={styles.dreamUniversityContent}>
              <div className={styles.dreamUniversityVisual}>
                <div className={styles.universityLogoLarge}>🎓</div>
                <div className={styles.universityNameLarge}>University of Central Asia</div>
                <div className={styles.universityLocationLarge}>Naryn, Kyrgyzstan</div>
              </div>
              <div className={styles.dreamActions}>
                <button className={`${styles.dreamBtn} ${styles.dreamBtnPrimary}`}>
                  <span className={styles.btnIcon}>🏔️</span>
                  Start Climb
                </button>
                <button className={`${styles.dreamBtn} ${styles.dreamBtnSecondary}`}>
                  <span className={styles.btnIcon}>📋</span>
                  Pack List
                </button>
              </div>
            </div>
          </div>

          {/* Block 2: Deadlines (Time-based bars) */}
          <div className={`${styles.dashboardCard} ${styles.deadlineCard}`}>
            <div className={styles.cardHeader}>
              <h3>Upcoming Deadlines</h3>
              <div className={styles.deadlineStats}>
                <button className={styles.showAllBtn}>Show All</button>
              </div>
            </div>
            <div className={styles.deadlineTimeline}>
              <div className={`${styles.deadlineItem} ${styles.urgent}`}>
                <div className={styles.deadlineIcon}>🎓</div>
                <div className={styles.deadlineInfo}>
                  <div className={styles.deadlineTitle}>UCA Application</div>
                  <div className={styles.deadlineDate}>Oct 6, 2025</div>
                </div>
                <div className={styles.deadlineBar}>
                  <div className={styles.deadlineFill} style={{width: '90%', backgroundColor: '#EF4444'}}></div>
                </div>
                <div className={styles.deadlineTime}>45 min<br />23 sec left</div>
              </div>
              <div className={`${styles.deadlineItem} ${styles.warning}`}>
                <div className={styles.deadlineIcon}>💰</div>
                <div className={styles.deadlineInfo}>
                  <div className={styles.deadlineTitle}>AUCA Scholarship</div>
                  <div className={styles.deadlineDate}>Oct 6, 2025</div>
                </div>
                <div className={styles.deadlineBar}>
                  <div className={styles.deadlineFill} style={{width: '75%', backgroundColor: '#F59E0B'}}></div>
                </div>
                <div className={styles.deadlineTime}>2 hours<br />15 min left</div>
              </div>
              <div className={`${styles.deadlineItem} ${styles.normal}`}>
                <div className={styles.deadlineIcon}>📝</div>
                <div className={styles.deadlineInfo}>
                  <div className={styles.deadlineTitle}>MIT Application</div>
                  <div className={styles.deadlineDate}>Oct 8, 2025</div>
                </div>
                <div className={styles.deadlineBar}>
                  <div className={styles.deadlineFill} style={{width: '50%', backgroundColor: '#10B981'}}></div>
                </div>
                <div className={styles.deadlineTime}>2 days<br />3 hours left</div>
              </div>
            </div>
          </div>

          {/* Block 3: University & Scholarship Views */}
          <div className={`${styles.dashboardCard} ${styles.universityViewsCard}`}>
            <div className={styles.cardHeader}>
              <h3>University & Scholarship Views</h3>
              <div className={styles.universityViewsStats}>
                <span className={styles.universityViewsTotal}>Total: 23</span>
              </div>
            </div>
            <div className={styles.universityViewsDescription}>
              <p>Track how many universities and scholarships you've viewed</p>
            </div>
            <div className={styles.universityViewsChart}>
              <canvas ref={universityViewsChartRef}></canvas>
            </div>
          </div>

          {/* Block 4: Application Status (Semantic Colors Design) */}
          <div className={`${styles.dashboardCard} ${styles.statusCard}`}>
            <div className={styles.cardHeader}>
              <h3>Application Status</h3>
              <div className={styles.statusSummary}>
                <span className={styles.statusTotal}>15 Total</span>
              </div>
            </div>
            <div className={styles.statusContainer}>
              <div className={styles.statusChartLarge}>
                <canvas ref={statusChartRef}></canvas>
              </div>
              <div className={styles.statusLegendCompact}>
                <div className={styles.statusItemCompact}>
                  <div className={styles.colorIndicator} style={{backgroundColor: '#3B82F6'}}></div>
                  <span className={styles.statusCount}>5</span>
                  <span className={styles.statusLabel}>Plan to Apply</span>
                </div>
                <div className={styles.statusItemCompact}>
                  <div className={styles.colorIndicator} style={{backgroundColor: '#F59E0B'}}></div>
                  <span className={styles.statusCount}>4</span>
                  <span className={styles.statusLabel}>Applied</span>
                </div>
                <div className={styles.statusItemCompact}>
                  <div className={styles.colorIndicator} style={{backgroundColor: '#10B981'}}></div>
                  <span className={styles.statusCount}>3</span>
                  <span className={styles.statusLabel}>Accepted</span>
                </div>
                <div className={styles.statusItemCompact}>
                  <div className={styles.colorIndicator} style={{backgroundColor: '#8B5CF6'}}></div>
                  <span className={styles.statusCount}>2</span>
                  <span className={styles.statusLabel}>Waitlist</span>
                </div>
                <div className={styles.statusItemCompact}>
                  <div className={styles.colorIndicator} style={{backgroundColor: '#EF4444'}}></div>
                  <span className={styles.statusCount}>1</span>
                  <span className={styles.statusLabel}>Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separate Achievements Section */}
        <section className={styles.achievementsSectionWrapper}>
          <div className={styles.achievementsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🏆 Your Achievements</h2>
              <div className={styles.sectionActions}>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>View All</button>
              </div>
            </div>
            <div className={styles.achievementsContainer}>
              <div className={styles.achievementsHeader}>
                <h3>Recent Achievements</h3>
              </div>
              <div className={styles.achievementsGrid}>
                <div className={`${styles.achievementCard} ${styles.earned}`}>
                  <div className={styles.achievementIcon}>🎓</div>
                  <div className={styles.achievementContent}>
                    <h4>First Application</h4>
                    <p>Jan 2024</p>
                  </div>
                  <div className={styles.achievementGlow}></div>
                </div>
                <div className={`${styles.achievementCard} ${styles.earned}`}>
                  <div className={styles.achievementIcon}>💰</div>
                  <div className={styles.achievementContent}>
                    <h4>Scholarship Hunter</h4>
                    <p>Feb 2024</p>
                  </div>
                  <div className={styles.achievementGlow}></div>
                </div>
                <div className={`${styles.achievementCard} ${styles.earned}`}>
                  <div className={styles.achievementIcon}>🎯</div>
                  <div className={styles.achievementContent}>
                    <h4>Perfect Match</h4>
                    <p>Mar 2024</p>
                  </div>
                  <div className={styles.achievementGlow}></div>
                </div>
                <div className={`${styles.achievementCard} ${styles.locked}`}>
                  <div className={styles.achievementIcon}>🏆</div>
                  <div className={styles.achievementContent}>
                    <h4>University Master</h4>
                    <p>Locked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Universities Section */}
        <section className={styles.recommendedUniversitiesWrapper}>
          <div className={styles.recommendedUniversitiesSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🔒 Recommended Universities</h2>
              <div className={styles.sectionActions}>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>View All</button>
              </div>
            </div>
            <div className={styles.universitiesGrid}>
              <div className={styles.universityCard}>
                <div className={styles.universityHeader}>
                  <div className={styles.universityLogo}>MIT</div>
                  <div className={styles.universityInfo}>
                    <h3>Massachusetts Institute of Technology</h3>
                    <p>Cambridge, MA, USA</p>
                  </div>
                </div>
                <div className={styles.universityStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>#1 Ranking</span>
                    <span className={styles.statValue}>95% Match</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>$53k Tuition</span>
                  </div>
                </div>
                <div className={styles.universityActions}>
                  <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Save</button>
                  <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Compare</button>
                  <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>Apply</button>
                </div>
              </div>

              <div className={styles.universityCard}>
                <div className={styles.universityHeader}>
                  <div className={styles.universityLogo}>ST</div>
                  <div className={styles.universityInfo}>
                    <h3>Stanford University</h3>
                    <p>Stanford, CA, USA</p>
                  </div>
                </div>
                <div className={styles.universityStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>#2 Ranking</span>
                    <span className={styles.statValue}>92% Match</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>$56k Tuition</span>
                  </div>
                </div>
                <div className={styles.universityActions}>
                  <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Save</button>
                  <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Compare</button>
                  <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>Apply</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Timeline Section */}
        <section className={styles.applicationTimelineWrapper}>
          <div className={styles.applicationTimelineSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>📅 Application Timeline</h2>
              <div className={styles.sectionActions}>
                <button className={`${styles.btn} ${styles.btnOutline}`}>Learn More</button>
              </div>
            </div>
            <div className={styles.timelineContainer}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>📝</div>
                <div className={styles.timelineContent}>
                  <h4>MIT Application</h4>
                  <div className={styles.timelineProgress}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{width: '75%'}}></div>
                    </div>
                    <span className={styles.timelineProgressText}>75%</span>
                  </div>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>📝</div>
                <div className={styles.timelineContent}>
                  <h4>Stanford Application</h4>
                  <div className={styles.timelineProgress}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{width: '60%'}}></div>
                    </div>
                    <span className={styles.timelineProgressText}>60%</span>
                  </div>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>📝</div>
                <div className={styles.timelineContent}>
                  <h4>Harvard Application</h4>
                  <div className={styles.timelineProgress}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{width: '45%'}}></div>
                    </div>
                    <span className={styles.timelineProgressText}>45%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Matching Section */}
        <section className={styles.smartMatchingWrapper}>
          <div className={styles.smartMatchingSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🎯 Smart Matching</h2>
            </div>
            <div className={styles.smartMatchingContent}>
              <p>Our AI-powered algorithm matches you with universities that align with your academic goals, budget, and preferences.</p>
              <div className={styles.matchingFeatures}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>💰</div>
                  <div className={styles.featureContent}>
                    <h4>Scholarship Finder</h4>
                    <p>Discover thousands of scholarship opportunities tailored to your profile and academic achievements.</p>
                  </div>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>📊</div>
                  <div className={styles.featureContent}>
                    <h4>Compare & Analyze</h4>
                    <p>Compare universities side by side with detailed statistics, rankings, and student reviews.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Universities Section */}
        <section className={styles.searchUniversitiesWrapper}>
          <div className={styles.searchUniversitiesSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🔍 Search Universities</h2>
            </div>
            <div className={styles.searchForm}>
              <div className={styles.searchRow}>
                <div className={styles.searchField}>
                  <label>Location</label>
                  <select className={styles.searchSelect}>
                    <option>Any Country</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
                <div className={styles.searchField}>
                  <label>Major</label>
                  <select className={styles.searchSelect}>
                    <option>Any Major</option>
                    <option>Computer Science</option>
                    <option>Engineering</option>
                    <option>Business</option>
                  </select>
                </div>
                <div className={styles.searchField}>
                  <label>Tuition Range</label>
                  <select className={styles.searchSelect}>
                    <option>Any Range</option>
                    <option>$0 - $20k</option>
                    <option>$20k - $40k</option>
                    <option>$40k - $60k</option>
                  </select>
                </div>
              </div>
              <button className={`${styles.btn} ${styles.btnPrimary}`}>Advanced Search</button>
            </div>
            <div className={styles.searchResults}>
              <div className={styles.universityCard}>
                <div className={styles.universityHeader}>
                  <div className={styles.universityLogo}>H</div>
                  <div className={styles.universityInfo}>
                    <h3>Harvard University</h3>
                    <p>Cambridge, MA, USA</p>
                  </div>
                </div>
                <div className={styles.universityStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>#3 Ranking</span>
                    <span className={styles.statValue}>98% Match</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>$54k Tuition</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

              {/* Search Scholarships Section */}
              <section className={styles.searchScholarshipsWrapper}>
                <div className={styles.searchScholarshipsSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>💰 Search Scholarships</h2>
                  </div>
                  <div className={styles.scholarshipForm}>
                    <div className={styles.searchRow}>
                      <div className={styles.searchField}>
                        <label>Amount Range</label>
                        <select className={styles.searchSelect}>
                          <option>Any Amount</option>
                          <option>$1k - $5k</option>
                          <option>$5k - $10k</option>
                          <option>$10k+</option>
                        </select>
                      </div>
                      <div className={styles.searchField}>
                        <label>Deadline</label>
                        <select className={styles.searchSelect}>
                          <option>Any Time</option>
                          <option>Next Month</option>
                          <option>Next 3 Months</option>
                          <option>Next 6 Months</option>
                        </select>
                      </div>
                      <div className={styles.searchField}>
                        <label>Type</label>
                        <select className={styles.searchSelect}>
                          <option>Any Type</option>
                          <option>Merit-based</option>
                          <option>Need-based</option>
                          <option>Minority</option>
                        </select>
                      </div>
                    </div>
                    <button className={`${styles.btn} ${styles.btnPrimary}`}>Find Scholarships</button>
                  </div>
                  <div className={styles.scholarshipResults}>
                    <div className={styles.scholarshipCard}>
                      <div className={styles.scholarshipHeader}>
                        <h4>Gates Millennium Scholarship</h4>
                        <span className={styles.scholarshipAmount}>$25,000</span>
                      </div>
                      <p>Full scholarship for outstanding minority students pursuing undergraduate degrees.</p>
                      <div className={styles.scholarshipFooter}>
                        <span className={styles.scholarshipDeadline}>Deadline: March 15</span>
                        <span className={styles.scholarshipMatch}>95% Match</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Study Together Section */}
              <section className={styles.studyTogetherWrapper}>
                <div className={styles.studyTogetherSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>📚 Study Together</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Create Study Session</button>
                    </div>
                  </div>
                  <div className={styles.studySessions}>
                    <div className={styles.studySessionCard}>
                      <div className={styles.sessionHeader}>
                        <div className={styles.sessionAvatar}>A</div>
                        <div className={styles.sessionInfo}>
                          <h4>Alex Chen</h4>
                          <p>MIT '28 | Computer Science</p>
                          <span className={styles.sessionStatus}>Active</span>
                        </div>
                      </div>
                      <div className={styles.sessionDetails}>
                        <h5>📖 Calculus II - Chapter 8</h5>
                        <div className={styles.sessionMeta}>
                          <span>⏰ Today, 7:00 PM</span>
                          <span>📍 Library Study Room 3</span>
                          <span>👥 3/5 participants</span>
                        </div>
                        <div className={styles.sessionActions}>
                          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>Join Session</button>
                          <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>View Details</button>
                        </div>
                      </div>
                    </div>

                    <div className={styles.studySessionCard}>
                      <div className={styles.sessionHeader}>
                        <div className={styles.sessionAvatar}>S</div>
                        <div className={styles.sessionInfo}>
                          <h4>Sarah Johnson</h4>
                          <p>Stanford '28 | Engineering</p>
                          <span className={styles.sessionStatus}>Starting Soon</span>
                        </div>
                      </div>
                      <div className={styles.sessionDetails}>
                        <h5>🔬 Physics Lab Prep</h5>
                        <div className={styles.sessionMeta}>
                          <span>⏰ Tomorrow, 2:00 PM</span>
                          <span>📍 Physics Building Room 201</span>
                          <span>👥 2/4 participants</span>
                        </div>
                        <div className={styles.sessionActions}>
                          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>Join Session</button>
                          <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>View Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* University Reels Section */}
              <section className={styles.universityReelsWrapper}>
                <div className={styles.universityReelsSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>🎬 University Reels</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Upload Reel</button>
                    </div>
                  </div>
                  <div className={styles.reelsContainer}>
                    <div className={styles.reelCard}>
                      <div className={styles.reelVideo}>
                        <div className={styles.videoThumbnail}>
                          <span className={styles.playIcon}>▶️</span>
                          <span className={styles.videoDuration}>0:45</span>
                        </div>
                        <h4>MIT Campus Tour</h4>
                      </div>
                      <div className={styles.reelInfo}>
                        <div className={styles.reelAuthor}>
                          <div className={styles.authorAvatar}>M</div>
                          <div className={styles.authorDetails}>
                            <h5>MIT Official</h5>
                            <p>@mit_official</p>
                          </div>
                          <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Follow</button>
                        </div>
                        <p>Explore the iconic MIT campus and discover what makes it one of the world's leading universities! 🎓✨</p>
                        <div className={styles.reelStats}>
                          <span>👁️ 2.3k</span>
                          <span>❤️ 156</span>
                          <span>💬 23</span>
                          <span>📤 8</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.reelCard}>
                      <div className={styles.reelVideo}>
                        <div className={styles.videoThumbnail}>
                          <span className={styles.playIcon}>▶️</span>
                          <span className={styles.videoDuration}>1:20</span>
                        </div>
                        <h4>Stanford Dorm Life</h4>
                      </div>
                      <div className={styles.reelInfo}>
                        <div className={styles.reelAuthor}>
                          <div className={styles.authorAvatar}>S</div>
                          <div className={styles.authorDetails}>
                            <h5>Stanford Student</h5>
                            <p>@stanford_life</p>
                          </div>
                          <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Follow</button>
                        </div>
                        <p>A day in the life of a Stanford student - from morning classes to late-night study sessions! 📚</p>
                        <div className={styles.reelStats}>
                          <span>👁️ 1.8k</span>
                          <span>❤️ 98</span>
                          <span>💬 15</span>
                          <span>📤 5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Detailed Application Timeline Section */}
              <section className={styles.detailedTimelineWrapper}>
                <div className={styles.detailedTimelineSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>📅 Application Timeline</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>View All</button>
                    </div>
                  </div>
                  <div className={styles.timelineSteps}>
                    <div className={styles.timelineStep}>
                      <div className={styles.stepIcon}>📝</div>
                      <div className={styles.stepContent}>
                        <h4>Application Started</h4>
                        <p>MIT Application</p>
                        <span className={styles.stepDate}>Jan 15, 2024</span>
                      </div>
                    </div>
                    <div className={styles.timelineStep}>
                      <div className={styles.stepIcon}>📄</div>
                      <div className={styles.stepContent}>
                        <h4>Documents Submitted</h4>
                        <p>Transcripts and Recommendations</p>
                        <span className={styles.stepDate}>Feb 1, 2024</span>
                      </div>
                    </div>
                    <div className={styles.timelineStep}>
                      <div className={styles.stepIcon}>✍️</div>
                      <div className={styles.stepContent}>
                        <h4>Essay Review</h4>
                        <p>Personal Statement</p>
                        <span className={styles.stepStatus}>In Progress</span>
                      </div>
                    </div>
                    <div className={styles.timelineStep}>
                      <div className={styles.stepIcon}>✅</div>
                      <div className={styles.stepContent}>
                        <h4>Final Submission</h4>
                        <p>Complete Application</p>
                        <span className={styles.stepDate}>Mar 15, 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* My Documents Section */}
              <section className={styles.documentsWrapper}>
                <div className={styles.documentsSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>📄 My Documents</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Upload New</button>
                    </div>
                  </div>
                  <div className={styles.documentsList}>
                    <div className={styles.documentCard}>
                      <div className={styles.documentIcon}>📄</div>
                      <div className={styles.documentInfo}>
                        <h4>High School Transcript</h4>
                        <p>Uploaded 2 days ago</p>
                        <span className={styles.documentStatus}>Verified</span>
                      </div>
                    </div>
                    <div className={styles.documentCard}>
                      <div className={styles.documentIcon}>📝</div>
                      <div className={styles.documentInfo}>
                        <h4>Personal Statement</h4>
                        <p>Draft version</p>
                        <span className={styles.documentStatus}>Pending Review</span>
                      </div>
                    </div>
                    <div className={styles.documentCard}>
                      <div className={styles.documentIcon}>📋</div>
                      <div className={styles.documentInfo}>
                        <h4>Letters of Recommendation</h4>
                        <p>2 of 3 received</p>
                        <span className={styles.documentStatus}>Partial</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Match Universities AI Section */}
              <section className={styles.matchUniversitiesWrapper}>
                <div className={styles.matchUniversitiesSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>🎯 Match Universities</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Run AI Match</button>
                    </div>
                  </div>
                  <div className={styles.matchContent}>
                    <div className={styles.profileSection}>
                      <h3>Your Profile</h3>
                      <div className={styles.profileStats}>
                        <div className={styles.profileStat}>
                          <span className={styles.statLabel}>GPA</span>
                          <span className={styles.statValue}>3.8</span>
                        </div>
                        <div className={styles.profileStat}>
                          <span className={styles.statLabel}>SAT Score</span>
                          <span className={styles.statValue}>1450</span>
                        </div>
                        <div className={styles.profileStat}>
                          <span className={styles.statLabel}>Major Interest</span>
                          <span className={styles.statValue}>Computer Science</span>
                        </div>
                        <div className={styles.profileStat}>
                          <span className={styles.statLabel}>Budget Range</span>
                          <span className={styles.statValue}>$40k - $60k</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.matchedUniversities}>
                      <h3>AI Matched Universities</h3>
                      <div className={styles.matchCard}>
                        <div className={styles.matchPercentage}>98%</div>
                        <div className={styles.matchInfo}>
                          <h4>Carnegie Mellon University</h4>
                          <p>Perfect match for CS program</p>
                        </div>
                      </div>
                      <div className={styles.matchCard}>
                        <div className={styles.matchPercentage}>92%</div>
                        <div className={styles.matchInfo}>
                          <h4>Georgia Tech</h4>
                          <p>Strong engineering program</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Match Scholarships Section */}
              <section className={styles.matchScholarshipsWrapper}>
                <div className={styles.matchScholarshipsSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>🎯 Match Scholarships</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Find Matches</button>
                    </div>
                  </div>
                  <div className={styles.scholarshipStats}>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>47</div>
                      <div className={styles.statLabel}>Available Scholarships</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>$2.3M</div>
                      <div className={styles.statLabel}>Total Value</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>15</div>
                      <div className={styles.statLabel}>High Match</div>
                    </div>
                  </div>
                  <div className={styles.scholarshipMatches}>
                    <div className={styles.scholarshipMatchCard}>
                      <div className={styles.matchPercentage}>95% Match</div>
                      <h4>National Merit Scholarship</h4>
                      <p>$2,500/year</p>
                      <span className={styles.matchDescription}>For high-achieving students</span>
                    </div>
                    <div className={styles.scholarshipMatchCard}>
                      <div className={styles.matchPercentage}>88% Match</div>
                      <h4>STEM Excellence Award</h4>
                      <p>$5,000/year</p>
                      <span className={styles.matchDescription}>Computer Science students</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Similar Students Section */}
              <section className={styles.similarStudentsWrapper}>
                <div className={styles.similarStudentsSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>👥 Similar Students</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>View All</button>
                    </div>
                  </div>
                  <div className={styles.studentsList}>
                    <div className={styles.studentCard}>
                      <div className={styles.studentAvatar}>A</div>
                      <div className={styles.studentInfo}>
                        <h4>Alex Chen</h4>
                        <p>MIT '28 | Computer Science</p>
                        <div className={styles.studentStats}>
                          <span>GPA: 3.9</span>
                          <span>SAT: 1520</span>
                        </div>
                        <div className={styles.similarityScore}>94% Similar</div>
                      </div>
                    </div>
                    <div className={styles.studentCard}>
                      <div className={styles.studentAvatar}>S</div>
                      <div className={styles.studentInfo}>
                        <h4>Sarah Johnson</h4>
                        <p>Stanford '28 | Engineering</p>
                        <div className={styles.studentStats}>
                          <span>GPA: 3.8</span>
                          <span>SAT: 1480</span>
                        </div>
                        <div className={styles.similarityScore}>89% Similar</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Connect Friends Section */}
              <section className={styles.connectFriendsWrapper}>
                <div className={styles.connectFriendsSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>👫 Connect Friends</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Invite Friends</button>
                    </div>
                  </div>
                  <div className={styles.friendsStats}>
                    <div className={styles.friendsStat}>
                      <span className={styles.statNumber}>12</span>
                      <span className={styles.statLabel}>Connected</span>
                    </div>
                    <div className={styles.friendsStat}>
                      <span className={styles.statNumber}>5</span>
                      <span className={styles.statLabel}>Pending</span>
                    </div>
                  </div>
                  <div className={styles.friendsList}>
                    <div className={styles.friendCard}>
                      <div className={styles.friendAvatar}>M</div>
                      <div className={styles.friendInfo}>
                        <h4>Mike Rodriguez</h4>
                        <p>Applying to same universities</p>
                        <span className={styles.friendStatus}>Online</span>
                      </div>
                    </div>
                    <div className={styles.friendCard}>
                      <div className={styles.friendAvatar}>E</div>
                      <div className={styles.friendInfo}>
                        <h4>Emma Wilson</h4>
                        <p>Shared 3 scholarships</p>
                        <span className={styles.friendStatus}>Offline</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Alumni Mentors Section */}
              <section className={styles.alumniMentorsWrapper}>
                <div className={styles.alumniMentorsSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>🎓 Alumni Mentors</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Find Mentor</button>
                    </div>
                  </div>
                  <div className={styles.mentorsList}>
                    <div className={styles.mentorCard}>
                      <div className={styles.mentorAvatar}>J</div>
                      <div className={styles.mentorInfo}>
                        <h4>Dr. Jennifer Liu</h4>
                        <p>MIT '15 | Software Engineer at Google</p>
                        <div className={styles.mentorDetails}>
                          <span className={styles.mentorField}>Computer Science</span>
                          <span className={styles.mentorSpecialty}>Career Guidance</span>
                        </div>
                        <div className={styles.mentorRating}>⭐ 4.9</div>
                      </div>
                    </div>
                    <div className={styles.mentorCard}>
                      <div className={styles.mentorAvatar}>R</div>
                      <div className={styles.mentorInfo}>
                        <h4>Robert Kim</h4>
                        <p>Stanford '12 | Investment Banker</p>
                        <div className={styles.mentorDetails}>
                          <span className={styles.mentorField}>Business</span>
                          <span className={styles.mentorSpecialty}>Finance</span>
                        </div>
                        <div className={styles.mentorRating}>⭐ 4.8</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Get Verified Section */}
              <section className={styles.verificationWrapper}>
                <div className={styles.verificationSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>✅ Get Verified</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Start Verification</button>
                    </div>
                  </div>
                  <div className={styles.verificationSteps}>
                    <div className={styles.verificationStep}>
                      <div className={styles.stepIcon}>✓</div>
                      <div className={styles.stepContent}>
                        <h4>Email Verification</h4>
                        <p>Email address confirmed</p>
                      </div>
                    </div>
                    <div className={styles.verificationStep}>
                      <div className={styles.stepIcon}>📄</div>
                      <div className={styles.stepContent}>
                        <h4>Document Upload</h4>
                        <p>Upload your transcripts</p>
                      </div>
                    </div>
                    <div className={styles.verificationStep}>
                      <div className={styles.stepIcon}>🎓</div>
                      <div className={styles.stepContent}>
                        <h4>Academic Verification</h4>
                        <p>Verify your academic records</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.verificationBenefits}>
                    <h4>Verification Benefits</h4>
                    <ul>
                      <li>✓ Access to premium scholarships</li>
                      <li>✓ Priority university matching</li>
                      <li>✓ Verified student badge</li>
                      <li>✓ Enhanced profile visibility</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Internships Matching Section */}
              <section className={styles.internshipsWrapper}>
                <div className={styles.internshipsSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>💼 Internships Matching</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Find Internships</button>
                    </div>
                  </div>
                  <div className={styles.internshipFilters}>
                    <div className={styles.filterRow}>
                      <div className={styles.filterField}>
                        <label>Industry</label>
                        <select className={styles.filterSelect}>
                          <option>Technology</option>
                          <option>Finance</option>
                          <option>Healthcare</option>
                        </select>
                      </div>
                      <div className={styles.filterField}>
                        <label>Duration</label>
                        <select className={styles.filterSelect}>
                          <option>Summer (3 months)</option>
                          <option>Fall (4 months)</option>
                          <option>Spring (4 months)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className={styles.internshipResults}>
                    <div className={styles.internshipCard}>
                      <div className={styles.internshipHeader}>
                        <h4>Google Software Engineering Intern</h4>
                        <span className={styles.internshipLocation}>Mountain View, CA</span>
                      </div>
                      <div className={styles.internshipDetails}>
                        <span>12 weeks</span>
                        <span>$7,500/month</span>
                        <span className={styles.matchPercentage}>96% Match</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Masters Matching Section */}
              <section className={styles.mastersWrapper}>
                <div className={styles.mastersSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>💼 Masters Matching</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Find Programs</button>
                    </div>
                  </div>
                  <div className={styles.mastersPrograms}>
                    <div className={styles.programCard}>
                      <h4>Computer Science</h4>
                      <p>23 programs matched</p>
                      <div className={styles.programUniversities}>
                        <span>MIT</span>
                        <span>Stanford</span>
                        <span>CMU</span>
                      </div>
                    </div>
                    <div className={styles.programCard}>
                      <h4>Business Administration</h4>
                      <p>18 programs matched</p>
                      <div className={styles.programUniversities}>
                        <span>Harvard</span>
                        <span>Wharton</span>
                        <span>Sloan</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Career Path Analysis Section */}
              <section className={styles.careerAnalysisWrapper}>
                <div className={styles.careerAnalysisSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>📊 Career Path Analysis</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Generate Report</button>
                    </div>
                  </div>
                  <div className={styles.careerContent}>
                    <div className={styles.careerPaths}>
                      <h4>Top Career Paths</h4>
                      <div className={styles.careerPathItem}>
                        <span className={styles.careerTitle}>Software Engineer</span>
                        <span className={styles.careerPercentage}>85%</span>
                      </div>
                      <div className={styles.careerPathItem}>
                        <span className={styles.careerTitle}>Data Scientist</span>
                        <span className={styles.careerPercentage}>78%</span>
                      </div>
                      <div className={styles.careerPathItem}>
                        <span className={styles.careerTitle}>Product Manager</span>
                        <span className={styles.careerPercentage}>72%</span>
                      </div>
                    </div>
                    <div className={styles.salaryProjections}>
                      <h4>Salary Projections</h4>
                      <div className={styles.salaryLevel}>
                        <span className={styles.salaryTitle}>Entry Level</span>
                        <span className={styles.salaryRange}>$80k - $120k</span>
                      </div>
                      <div className={styles.salaryLevel}>
                        <span className={styles.salaryTitle}>Mid Level</span>
                        <span className={styles.salaryRange}>$120k - $180k</span>
                      </div>
                      <div className={styles.salaryLevel}>
                        <span className={styles.salaryTitle}>Senior Level</span>
                        <span className={styles.salaryRange}>$180k - $300k</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Essay Reviews Section */}
              <section className={styles.essayReviewsWrapper}>
                <div className={styles.essayReviewsSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>📝 Essay Reviews</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Submit Essay</button>
                    </div>
                  </div>
                  <div className={styles.reviewOptions}>
                    <div className={styles.reviewCard}>
                      <h4>Basic Review</h4>
                      <div className={styles.reviewPrice}>$49</div>
                      <ul>
                        <li>Grammar & Style Check</li>
                        <li>Basic Feedback</li>
                        <li>24-hour turnaround</li>
                      </ul>
                    </div>
                    <div className={styles.reviewCard}>
                      <h4>Premium Review</h4>
                      <div className={styles.reviewPrice}>$99</div>
                      <ul>
                        <li>Comprehensive Analysis</li>
                        <li>Personalized Feedback</li>
                        <li>12-hour turnaround</li>
                        <li>Revision suggestions</li>
                      </ul>
                    </div>
                  </div>
                  <div className={styles.recentReviews}>
                    <h4>Recent Reviews</h4>
                    <div className={styles.reviewItem}>
                      <div className={styles.reviewRating}>9.2/10</div>
                      <div className={styles.reviewInfo}>
                        <h5>Personal Statement - MIT</h5>
                        <p>Excellent structure and compelling narrative</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Mock Interviews Section */}
              <section className={styles.mockInterviewsWrapper}>
                <div className={styles.mockInterviewsSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>🎤 Mock Interviews</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Schedule Interview</button>
                    </div>
                  </div>
                  <div className={styles.interviewTypes}>
                    <div className={styles.interviewCard}>
                      <div className={styles.interviewIcon}>🎓</div>
                      <div className={styles.interviewInfo}>
                        <h4>University Admissions</h4>
                        <p>Practice for college interviews</p>
                        <div className={styles.interviewPrice}>$75</div>
                      </div>
                    </div>
                    <div className={styles.interviewCard}>
                      <div className={styles.interviewIcon}>💼</div>
                      <div className={styles.interviewInfo}>
                        <h4>Job Interviews</h4>
                        <p>Prepare for internship interviews</p>
                        <div className={styles.interviewPrice}>$100</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.interviewStats}>
                    <div className={styles.interviewStat}>
                      <span className={styles.statNumber}>15</span>
                      <span className={styles.statLabel}>Completed</span>
                    </div>
                    <div className={styles.interviewStat}>
                      <span className={styles.statNumber}>8.7</span>
                      <span className={styles.statLabel}>Avg Rating</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Concierge Support Section */}
              <section className={styles.conciergeWrapper}>
                <div className={styles.conciergeSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>🎩 Concierge Support</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Get Support</button>
                    </div>
                  </div>
                  <div className={styles.supportServices}>
                    <div className={styles.serviceCard}>
                      <div className={styles.serviceIcon}>📞</div>
                      <div className={styles.serviceInfo}>
                        <h4>24/7 Support</h4>
                        <p>Round-the-clock assistance</p>
                      </div>
                    </div>
                    <div className={styles.serviceCard}>
                      <div className={styles.serviceIcon}>🎯</div>
                      <div className={styles.serviceInfo}>
                        <h4>Personal Advisor</h4>
                        <p>Dedicated application specialist</p>
                      </div>
                    </div>
                    <div className={styles.serviceCard}>
                      <div className={styles.serviceIcon}>📋</div>
                      <div className={styles.serviceInfo}>
                        <h4>Application Review</h4>
                        <p>Complete application check</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.liveSupport}>
                    <h4>Live Support</h4>
                    <div className={styles.supportMessage}>
                      <p><strong>I need help with my MIT application</strong></p>
                      <p>I'll connect you with our MIT specialist right away!</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Get Courses Section */}
              <section className={styles.coursesWrapper}>
                <div className={styles.coursesSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>📝 Get Courses</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Browse Courses</button>
                    </div>
                  </div>
                  <div className={styles.courseCategories}>
                    <div className={styles.categoryCard}>
                      <h4>All Courses</h4>
                      <div className={styles.categoryOptions}>
                        <span>Test Prep</span>
                        <span>Academic</span>
                        <span>Skills</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.featuredCourses}>
                    <div className={styles.courseCard}>
                      <div className={styles.courseIcon}>📚</div>
                      <div className={styles.courseInfo}>
                        <h4>SAT Prep Masterclass</h4>
                        <p>Comprehensive SAT preparation</p>
                        <div className={styles.courseMeta}>
                          <span>12 weeks</span>
                          <span>⭐ 4.8</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.courseCard}>
                      <div className={styles.courseIcon}>✍️</div>
                      <div className={styles.courseInfo}>
                        <h4>College Essay Writing</h4>
                        <p>Master the art of essay writing</p>
                        <div className={styles.courseMeta}>
                          <span>8 weeks</span>
                          <span>⭐ 4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Math Section */}
              <section className={styles.mathWrapper}>
                <div className={styles.mathSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>🔢 Math</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Start Learning</button>
                    </div>
                  </div>
                  <div className={styles.mathProgress}>
                    <div className={styles.progressItem}>
                      <h4>Algebra I</h4>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{width: '75%'}}></div>
                      </div>
                      <span>75% Complete</span>
                    </div>
                    <div className={styles.progressItem}>
                      <h4>Calculus</h4>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{width: '45%'}}></div>
                      </div>
                      <span>45% Complete</span>
                    </div>
                  </div>
                  <div className={styles.practiceProblems}>
                    <h4>Practice Problems</h4>
                    <div className={styles.problemCard}>
                      <p>Solve for x: 2x + 5 = 13</p>
                      <div className={styles.problemActions}>
                        <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Show Hint</button>
                        <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>Submit Answer</button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* English Section */}
              <section className={styles.englishWrapper}>
                <div className={styles.englishSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>📚 English</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Start Learning</button>
                    </div>
                  </div>
                  <div className={styles.englishModules}>
                    <div className={styles.moduleCard}>
                      <h4>Grammar Fundamentals</h4>
                      <div className={styles.moduleProgress}>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{width: '80%'}}></div>
                        </div>
                        <span>80%</span>
                      </div>
                      <p>Master essential grammar rules</p>
                    </div>
                    <div className={styles.moduleCard}>
                      <h4>Reading Comprehension</h4>
                      <div className={styles.moduleProgress}>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{width: '60%'}}></div>
                        </div>
                        <span>60%</span>
                      </div>
                      <p>Improve reading skills</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Essay Writing Section */}
              <section className={styles.essayWritingWrapper}>
                <div className={styles.essayWritingSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>✍️ Essay Writing</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Start Writing</button>
                    </div>
                  </div>
                  <div className={styles.essayTools}>
                    <div className={styles.toolCard}>
                      <h4>Essay Templates</h4>
                      <p>Pre-built structures for different essay types</p>
                    </div>
                    <div className={styles.toolCard}>
                      <h4>Writing Prompts</h4>
                      <p>Practice with real college prompts</p>
                    </div>
                  </div>
                  <div className={styles.yourEssays}>
                    <h4>Your Essays</h4>
                    <div className={styles.essayItem}>
                      <h5>Personal Statement Draft</h5>
                      <span className={styles.essayStatus}>In Progress</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* AI Literacy Section */}
              <section className={styles.aiLiteracyWrapper}>
                <div className={styles.aiLiteracySection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>🤖 AI Literacy</h2>
                    <div className={styles.sectionActions}>
                      <button className={`${styles.btn} ${styles.btnPrimary}`}>Start Course</button>
                    </div>
                  </div>
                  <div className={styles.aiModules}>
                    <div className={styles.aiModuleCard}>
                      <div className={styles.moduleIcon}>✓</div>
                      <div className={styles.moduleInfo}>
                        <h4>Introduction to AI</h4>
                        <p>Understanding artificial intelligence basics</p>
                      </div>
                    </div>
                    <div className={styles.aiModuleCard}>
                      <div className={styles.moduleIcon}>🎯</div>
                      <div className={styles.moduleInfo}>
                        <h4>Machine Learning Fundamentals</h4>
                        <p>Core concepts and applications</p>
                      </div>
                    </div>
                    <div className={styles.aiModuleCard}>
                      <div className={styles.moduleIcon}>🔮</div>
                      <div className={styles.moduleInfo}>
                        <h4>Future of AI</h4>
                        <p>Ethics and implications</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* My Privacy Dashboard Section */}
              <section className={styles.privacyDashboardWrapper}>
                <div className={styles.privacyDashboardSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>🔒 My Privacy Dashboard</h2>
                  </div>
                  <div className={styles.privacySettings}>
                    <div className={styles.settingGroup}>
                      <h4>Privacy Settings</h4>
                      <div className={styles.settingItem}>
                        <label>Data Sharing</label>
                        <div className={styles.settingOptions}>
                          <label>
                            <input type="checkbox" defaultChecked />
                            Share profile with universities
                          </label>
                          <label>
                            <input type="checkbox" defaultChecked />
                            Allow scholarship matching
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className={styles.settingGroup}>
                      <h4>Communication</h4>
                      <div className={styles.settingItem}>
                        <label>Notifications</label>
                        <div className={styles.settingOptions}>
                          <label>
                            <input type="checkbox" defaultChecked />
                            Email notifications
                          </label>
                          <label>
                            <input type="checkbox" />
                            SMS updates
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className={styles.settingGroup}>
                      <h4>Your Data</h4>
                      <div className={styles.dataStats}>
                        <div className={styles.dataStat}>
                          <span className={styles.statNumber}>247</span>
                          <span className={styles.statLabel}>Profile Views</span>
                        </div>
                        <div className={styles.dataStat}>
                          <span className={styles.statNumber}>12</span>
                          <span className={styles.statLabel}>Applications</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className={`${styles.rightSidebar} ${rightSidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.rightSidebarHeader}>
          <h3 className={styles.rightSidebarTitle}>Quick Tools</h3>
          <p className={styles.rightSidebarSubtitle}>Access your most used features</p>
        </div>
        <div className={styles.rightSidebarContent}>
          {/* Action Buttons */}
          <div className={styles.widget}>
            <div className={styles.actionButtons}>
              <button 
                onClick={() => handleNavClick('/dashboard/send-info')} 
                className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`} 
                style={{width: '100%'}}
              >
                📤 Send Info & ⭐ Get Premium
              </button>
            </div>
          </div>

          {/* Student Registration Progress */}
          <div className={styles.widget}>
            <div className={styles.registrationHeader}>
              <div className={styles.registrationTitleRow}>
                <span className={styles.progressEmoji}>😊</span>
                <h4 className={styles.widgetTitle}>Registration Progress</h4>
              </div>
              <span className={styles.stepsCounter}>8/12 steps</span>
            </div>
            <div className={styles.registrationProgressContainer}>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{width: '67%'}}></div>
                </div>
                <span className={styles.progressPercentage}>67%</span>
              </div>
              <button 
                onClick={() => handleNavClick('/dashboard/contact-premium')}
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm} ${styles.registrationBtn}`}
              >
                Finish Registration
              </button>
            </div>
          </div>

          {/* Quick Reminders */}
          <div className={styles.widget}>
            <h4 className={styles.widgetTitle}>Important Reminders</h4>
            <div className={styles.remindersList}>
              <div className={`${styles.reminderCard} ${styles.urgent}`}>
                <div className={styles.reminderIcon}>🚨</div>
                <div className={styles.reminderContent}>
                  <h5>Deadline Alert</h5>
                  <p>MIT application due in 3 days</p>
                </div>
              </div>
              <div className={`${styles.reminderCard} ${styles.important}`}>
                <div className={styles.reminderIcon}>📝</div>
                <div className={styles.reminderContent}>
                  <h5>Document Upload</h5>
                  <p>Upload transcripts for 5 universities</p>
                </div>
              </div>
              <div className={`${styles.reminderCard} ${styles.info}`}>
                <div className={styles.reminderIcon}>💡</div>
                <div className={styles.reminderContent}>
                  <h5>Scholarship Match</h5>
                  <p>3 new scholarships match your profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  )
}

export default DashboardPage