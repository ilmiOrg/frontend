import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import Chart from "chart.js/auto";
import { ILMI_LOGO_URL } from "../../../../lib/ilmiLogoUrl";
import { SkyToggle } from "../../../../components/ui/SkyToggle";
import { ScrollContainer } from "../../../../components/ui/ScrollContainer";
import {
  HomeIcon,
  StarIcon,
  SearchIcon,
  HeartIcon,
  BookOpenIcon,
  GraduationCapIcon,
  AwardIcon,
  TargetIcon,
  UsersIcon,
  MessageCircleIcon,
  PenToolIcon,
  MicIcon,
  CrownIcon,
  CalculatorIcon,
  LanguagesIcon,
  FileEditIcon,
  CpuIcon,
  LogOutIcon,
  ChevronDownIcon,
  BellIcon,
  UserIcon,
  SendIcon,
  FlameIcon,
  DollarIcon,
  MenuIcon,
  XIcon,
  TelegramIcon,
  ExternalLinkIcon,
} from "../../shared/Icons";
import styles from "./style.clean.module.css";

const TELEGRAM_LINK = "https://t.me/ilmiOfficialGroup";

const CHART_COLORS = {
  textMuted: "#94A3B8",
  gridLine: "rgba(255, 255, 255, 0.06)",
  purple: "#7c3aed",
  green: "#10b981",
  blue: "#3B82F6",
  amber: "#F59E0B",
  red: "#EF4444",
  violet: "#8B5CF6",
  bg: "#0F172A",
};

const STATUS_DATA = [
  { label: "Plan to Apply", count: 5, color: CHART_COLORS.blue },
  { label: "Applied", count: 4, color: CHART_COLORS.amber },
  { label: "Accepted", count: 3, color: CHART_COLORS.green },
  { label: "Waitlist", count: 2, color: CHART_COLORS.violet },
  { label: "Rejected", count: 1, color: CHART_COLORS.red },
];

const NAV_SECTIONS = [
  {
    id: "main",
    label: "Main",
    items: [
      { icon: HomeIcon, label: "Dashboard", path: null, active: true },
      { icon: StarIcon, label: "Dream University", path: "/dashboard/dream-university" },
      { icon: SearchIcon, label: "Search Universities", path: "/dashboard/search/universities" },
      { icon: HeartIcon, label: "Favorite Universities", path: "/dashboard/search/universities/favorites" },
      { icon: BookOpenIcon, label: "Search Fields", path: "/dashboard/search/fields" },
      { icon: GraduationCapIcon, label: "Search Programs", path: "/dashboard/search/programs" },
      { icon: HeartIcon, label: "Favorite Programs", path: "/dashboard/search/programs/favorites" },
      { icon: DollarIcon, label: "Search Scholarships", path: "/dashboard/search/scholarships" },
    ],
  },
  {
    id: "aiMatching",
    label: "AI & Smart Matching",
    items: [
      { icon: TargetIcon, label: "Match Universities", path: "/dashboard/ai/match-universities" },
      { icon: TargetIcon, label: "Match Scholarships", path: "/dashboard/ai/match-scholarships" },
      { icon: UsersIcon, label: "Similar Students", path: "/dashboard/ai/similar-students" },
    ],
  },
  {
    id: "community",
    label: "Community",
    items: [
      { icon: MessageCircleIcon, label: "Connect Friends", path: "/dashboard/community/friends" },
      { icon: GraduationCapIcon, label: "Alumni Mentors", path: "/dashboard/community/mentors" },
    ],
  },
  {
    id: "premium",
    label: "Premium Services",
    items: [
      { icon: PenToolIcon, label: "Essay Reviews", path: "/dashboard/premium/essay-reviews" },
      { icon: MicIcon, label: "Mock Interviews", path: "/dashboard/premium/mock-interviews" },
      { icon: CrownIcon, label: "Concierge Support", path: "/dashboard/premium/concierge" },
    ],
  },
  {
    id: "learning",
    label: "Learning & Courses",
    items: [
      { icon: BookOpenIcon, label: "Get Courses", path: "/dashboard/courses" },
      { icon: CalculatorIcon, label: "Math", path: "/dashboard/courses/math" },
      { icon: LanguagesIcon, label: "English", path: "/dashboard/courses/english" },
      { icon: FileEditIcon, label: "Essay Writing", path: "/dashboard/courses/essay-writing" },
      { icon: CpuIcon, label: "AI Literacy", path: "/dashboard/courses/ai-literacy" },
    ],
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const viewsChartRef = useRef(null);
  const statusChartRef = useRef(null);

  const [expandedSections, setExpandedSections] = useState({ main: true });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("theme");
    return saved !== "light";
  });

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.id = "dashboard-no-scroll";
    styleEl.textContent =
      "html, body, #root { overflow: hidden !important; height: 100vh !important; width: 100vw !important; }";
    document.head.appendChild(styleEl);
    return () => document.getElementById("dashboard-no-scroll")?.remove();
  }, []);

  useEffect(() => {
    const handler = () =>
      setIsDark(document.body.getAttribute("theme") === "dark");
    window.addEventListener("themeChanged", handler);
    return () => window.removeEventListener("themeChanged", handler);
  }, []);

  useEffect(() => {
    let script = document.querySelector(
      'script[src="https://cdn.voiceflow.com/widget-next/bundle.mjs"]'
    );
    if (!script) {
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
      script.onload = () => {
        window.voiceflow?.chat.load({
          verify: { projectID: "68e16d089e709b6501735885" },
          url: "https://general-runtime.voiceflow.com",
          versionID: "production",
          voice: { url: "https://runtime-api.voiceflow.com" },
        });
      };
      document.head.appendChild(script);
    }

    const chatStyle = document.createElement("style");
    chatStyle.id = "voiceflow-viewport-position";
    chatStyle.textContent =
      '[id*="voiceflow"],[class*="vf-widget"],[class*="vf-chat"],iframe[src*="voiceflow"],div[id*="voiceflow"],div[class*="vf-widget"]{position:fixed!important;z-index:99999!important;}';
    document.head.appendChild(chatStyle);

    const moveWidget = () => {
      document
        .querySelectorAll('[id*="voiceflow"],[class*="vf-widget"]')
        .forEach((w) => {
          if (w.parentElement && w.parentElement.tagName !== "BODY") {
            document.body.appendChild(w);
          }
        });
    };

    const interval = setInterval(moveWidget, 500);
    const observer = new MutationObserver(moveWidget);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearInterval(interval);
      observer.disconnect();
      document.getElementById("voiceflow-viewport-position")?.remove();
    };
  }, []);

  useEffect(() => {
    let viewsChart = null;
    let statusChart = null;

    const timer = setTimeout(() => {
      if (viewsChartRef.current) {
        const ctx = viewsChartRef.current.getContext("2d");
        viewsChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Universities",
                data: [3, 5, 8, 10, 12, 15],
                borderColor: CHART_COLORS.purple,
                backgroundColor: "rgba(124, 58, 237, 0.1)",
                tension: 0.4,
                fill: false,
                pointBackgroundColor: CHART_COLORS.purple,
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
              },
              {
                label: "Scholarships",
                data: [2, 3, 5, 6, 7, 8],
                borderColor: CHART_COLORS.green,
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                tension: 0.4,
                fill: false,
                pointBackgroundColor: CHART_COLORS.green,
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: { color: CHART_COLORS.textMuted, usePointStyle: true, padding: 16 },
              },
            },
            scales: {
              x: { grid: { color: CHART_COLORS.gridLine }, ticks: { color: CHART_COLORS.textMuted } },
              y: { grid: { color: CHART_COLORS.gridLine }, ticks: { color: CHART_COLORS.textMuted } },
            },
          },
        });
      }

      if (statusChartRef.current) {
        const ctx = statusChartRef.current.getContext("2d");
        statusChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: STATUS_DATA.map((s) => s.label),
            datasets: [
              {
                data: STATUS_DATA.map((s) => s.count),
                backgroundColor: STATUS_DATA.map((s) => s.color),
                borderWidth: 3,
                borderColor: CHART_COLORS.bg,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: "55%",
          },
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      viewsChart?.destroy();
      statusChart?.destroy();
    };
  }, []);

  const toggleSection = (id) =>
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.body.setAttribute("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(
      new CustomEvent("themeChanged", { detail: { theme: next ? "dark" : "light", isDark: next } })
    );
  };

  const userInitial =
    user?.email?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "U";
  const userName = user?.name || "Student";
  const userEmail = user?.email || "student@ilmi.demo";

  return (
    <div className={`${styles.dashboard} ${sidebarCollapsed ? styles.leftCollapsed : ""}`}>
      <button
        className={styles.sidebarToggle}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        title={sidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
      >
        {sidebarCollapsed ? <MenuIcon size={16} /> : <XIcon size={16} />}
      </button>

      <div className={styles.liquidShape} />
      <div className={styles.liquidShape} />
      <div className={styles.liquidShape} />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <img src={ILMI_LOGO_URL} alt="ilmi" className={styles.logoImage} />
            <span>ilmi</span>
          </div>
          <div className={styles.tagline}>Your university journey starts here</div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/send-info")}
            className={styles.sendInfoBtn}
          >
            <SendIcon size={14} />
            Send Info & Get Premium
          </button>
        </div>

        <ScrollContainer className={styles.sidebarScroll} disableHorizontalScroll paddingAbsolute>
          <nav className={styles.nav}>
            {NAV_SECTIONS.map((section) => (
              <div key={section.id} className={styles.navSection}>
                <button
                  className={styles.navSectionHeader}
                  onClick={() => toggleSection(section.id)}
                >
                  <span>{section.label}</span>
                  <ChevronDownIcon
                    size={14}
                    className={`${styles.chevronIcon} ${
                      expandedSections[section.id] ? styles.chevronOpen : styles.chevronClosed
                    }`}
                  />
                </button>
                {expandedSections[section.id] &&
                  section.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => item.path && navigate(item.path)}
                      className={`${styles.navItem} ${item.active ? styles.active : ""}`}
                    >
                      <span className={styles.navIcon}>
                        <item.icon size={18} />
                      </span>
                      <span className={styles.navLabel}>{item.label}</span>
                    </button>
                  ))}
              </div>
            ))}

            {/* Telegram */}
            <div className={styles.navSection}>
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.telegramLink}
              >
                <span className={styles.telegramIcon}>
                  <TelegramIcon size={18} />
                </span>
                <span className={styles.navLabel}>Join Our Community</span>
                <ExternalLinkIcon size={14} />
              </a>
            </div>

            {/* Logout */}
            <div className={styles.navSection}>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className={styles.logoutItem}
              >
                <span className={styles.navIcon}>
                  <LogOutIcon size={18} />
                </span>
                <span className={styles.navLabel}>Logout</span>
              </button>
            </div>
          </nav>
        </ScrollContainer>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <ScrollContainer className={styles.mainScroll} disableHorizontalScroll>
          <div className={styles.mainInner}>
            {/* Top Bar */}
            <div className={styles.topBar}>
              <div className={styles.topBarLeft}>
                <div className={styles.profileSection}>
                  <div className={styles.avatar}>{userInitial}</div>
                  <div className={styles.profileInfo}>
                    <span className={styles.profileName}>{userName}</span>
                    <span className={styles.profileEmail}>{userEmail}</span>
                  </div>
                  <span className={styles.timezone}>GMT+6</span>
                </div>
              </div>
              <div className={styles.topBarRight}>
                <div className={styles.streakBadge}>
                  <span className={styles.streakIcon}><FlameIcon size={16} /></span>
                  <span>47</span>
                </div>
                <SkyToggle checked={isDark} onChange={toggleTheme} />
                <button
                  className={styles.actionBtn}
                  title="Notifications"
                >
                  <BellIcon size={18} />
                  <span className={styles.notifBadge}>3</span>
                </button>
                <button
                  className={styles.actionBtn}
                  title="Profile"
                  onClick={() => navigate("/dashboard/profile")}
                >
                  <UserIcon size={18} />
                </button>
              </div>
            </div>

            {/* Dashboard Grid - Top Cards */}
            <div className={styles.dashGrid}>
              {/* Dream University */}
              <div className={styles.dreamCard}>
                <div className={styles.dreamHeader}>
                  <h3 className={styles.dreamTitle}>Dream University</h3>
                  <div className={styles.dreamProgress}>
                    <div className={styles.progressRing}>
                      <svg className={styles.progressRingSvg} width="44" height="44">
                        <defs>
                          <linearGradient id="dreamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2563EB" />
                            <stop offset="100%" stopColor="#10B981" />
                          </linearGradient>
                        </defs>
                        <circle className={styles.ringBg} cx="22" cy="22" r="18" />
                        <circle className={styles.ringFill} cx="22" cy="22" r="18" />
                      </svg>
                      <span className={styles.progressPercent}>92%</span>
                    </div>
                    <div className={styles.progressLabel}>
                      <span className={styles.progressMatch}>Perfect Match</span>
                      <span className={styles.progressUni}>UCA Peak</span>
                    </div>
                  </div>
                </div>
                <div className={styles.dreamBody}>
                  <div className={styles.dreamLogo}>
                    <GraduationCapIcon size={22} stroke="white" />
                  </div>
                  <div className={styles.dreamInfo}>
                    <div className={styles.dreamName}>University of Central Asia</div>
                    <div className={styles.dreamLocation}>Naryn, Kyrgyzstan</div>
                  </div>
                </div>
                <div className={styles.dreamActions}>
                  <button className={`${styles.dreamBtn} ${styles.dreamBtnPrimary}`}>
                    Start Climb
                  </button>
                  <button className={`${styles.dreamBtn} ${styles.dreamBtnSecondary}`}>
                    Pack List
                  </button>
                </div>
              </div>

              {/* Deadlines */}
              <div className={styles.deadlinesCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Upcoming Deadlines</h3>
                  <button className={styles.cardAction}>Show All</button>
                </div>
                <div className={styles.deadlineList}>
                  <div className={styles.deadlineRow}>
                    <div className={`${styles.deadlineIcon} ${styles.deadlineUrgent}`}>
                      <GraduationCapIcon size={14} />
                    </div>
                    <div className={styles.deadlineInfo}>
                      <div className={styles.deadlineTitle}>UCA Application</div>
                      <div className={styles.deadlineDate}>Oct 6, 2025</div>
                    </div>
                    <div className={styles.deadlineBar}>
                      <div className={styles.deadlineFill} style={{ width: "90%", background: CHART_COLORS.red }} />
                    </div>
                    <div className={styles.deadlineTime}>45 min left</div>
                  </div>
                  <div className={styles.deadlineRow}>
                    <div className={`${styles.deadlineIcon} ${styles.deadlineWarning}`}>
                      <DollarIcon size={14} />
                    </div>
                    <div className={styles.deadlineInfo}>
                      <div className={styles.deadlineTitle}>AUCA Scholarship</div>
                      <div className={styles.deadlineDate}>Oct 6, 2025</div>
                    </div>
                    <div className={styles.deadlineBar}>
                      <div className={styles.deadlineFill} style={{ width: "75%", background: CHART_COLORS.amber }} />
                    </div>
                    <div className={styles.deadlineTime}>2h 15m left</div>
                  </div>
                  <div className={styles.deadlineRow}>
                    <div className={`${styles.deadlineIcon} ${styles.deadlineNormal}`}>
                      <PenToolIcon size={14} />
                    </div>
                    <div className={styles.deadlineInfo}>
                      <div className={styles.deadlineTitle}>MIT Application</div>
                      <div className={styles.deadlineDate}>Oct 8, 2025</div>
                    </div>
                    <div className={styles.deadlineBar}>
                      <div className={styles.deadlineFill} style={{ width: "50%", background: CHART_COLORS.green }} />
                    </div>
                    <div className={styles.deadlineTime}>2d 3h left</div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className={styles.chartCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>University & Scholarship Views</h3>
                  <span className={styles.chartStats}>Total: 23</span>
                </div>
                <p className={styles.cardDescription}>
                  Track how many universities and scholarships you have viewed
                </p>
                <div className={styles.chartWrap}>
                  <canvas ref={viewsChartRef} />
                </div>
              </div>

              {/* Status */}
              <div className={styles.statusCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Application Status</h3>
                  <span className={styles.statusTotal}>15 Total</span>
                </div>
                <div className={styles.statusContainer}>
                  <div className={styles.statusChart}>
                    <canvas ref={statusChartRef} />
                  </div>
                  <div className={styles.statusLegend}>
                    {STATUS_DATA.map((s) => (
                      <div key={s.label} className={styles.statusRow}>
                        <div className={styles.statusDot} style={{ background: s.color }} />
                        <span className={styles.statusCount}>{s.count}</span>
                        <span className={styles.statusLabel}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Universities */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recommended Universities</h2>
                <button className={styles.sectionActionPrimary}>View All</button>
              </div>
              <div className={styles.uniGrid}>
                {[
                  { abbr: "MIT", name: "Massachusetts Institute of Technology", loc: "Cambridge, MA, USA", rank: "#1 Ranking", match: "95% Match", tuition: "$53k Tuition" },
                  { abbr: "ST", name: "Stanford University", loc: "Stanford, CA, USA", rank: "#2 Ranking", match: "92% Match", tuition: "$56k Tuition" },
                ].map((u) => (
                  <div key={u.abbr} className={styles.uniCard}>
                    <div className={styles.uniCardHeader}>
                      <div className={styles.uniLogo}>{u.abbr}</div>
                      <div>
                        <h3 className={styles.uniName}>{u.name}</h3>
                        <p className={styles.uniLocation}>{u.loc}</p>
                      </div>
                    </div>
                    <div className={styles.uniStats}>
                      <div className={styles.uniStat}>
                        <span className={styles.uniStatLabel}>{u.rank}</span>
                        <span className={styles.uniStatValue}>{u.match}</span>
                      </div>
                      <div className={styles.uniStat}>
                        <span className={styles.uniStatLabel}>{u.tuition}</span>
                      </div>
                    </div>
                    <div className={styles.uniActions}>
                      <button className={styles.uniBtnOutline}>Save</button>
                      <button className={styles.uniBtnOutline}>Compare</button>
                      <button className={styles.uniBtnPrimary}>Apply</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Matching */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Smart Matching</h2>
              </div>
              <p className={styles.matchContent}>
                Our AI-powered algorithm matches you with universities that align with your academic goals, budget, and preferences.
              </p>
              <div className={styles.matchFeatures}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}><DollarIcon size={18} /></div>
                  <div>
                    <h4 className={styles.featureTitle}>Scholarship Finder</h4>
                    <p className={styles.featureDesc}>Discover thousands of scholarship opportunities tailored to your profile and academic achievements.</p>
                  </div>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}><TargetIcon size={18} /></div>
                  <div>
                    <h4 className={styles.featureTitle}>Compare & Analyze</h4>
                    <p className={styles.featureDesc}>Compare universities side by side with detailed statistics, rankings, and student reviews.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Universities */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Search Universities</h2>
              </div>
              <div className={styles.searchForm}>
                <div className={styles.searchRow}>
                  <div className={styles.searchField}>
                    <label className={styles.searchFieldLabel}>Location</label>
                    <select className={styles.searchSelect}>
                      <option>Any Country</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                  <div className={styles.searchField}>
                    <label className={styles.searchFieldLabel}>Major</label>
                    <select className={styles.searchSelect}>
                      <option>Any Major</option>
                      <option>Computer Science</option>
                      <option>Engineering</option>
                      <option>Business</option>
                    </select>
                  </div>
                  <div className={styles.searchField}>
                    <label className={styles.searchFieldLabel}>Tuition Range</label>
                    <select className={styles.searchSelect}>
                      <option>Any Range</option>
                      <option>$0 - $20k</option>
                      <option>$20k - $40k</option>
                      <option>$40k - $60k</option>
                    </select>
                  </div>
                </div>
                <button className={styles.sectionActionPrimary}>Advanced Search</button>
              </div>
              <div className={styles.uniGrid} style={{ marginTop: 12 }}>
                <div className={styles.uniCard}>
                  <div className={styles.uniCardHeader}>
                    <div className={styles.uniLogo}>H</div>
                    <div>
                      <h3 className={styles.uniName}>Harvard University</h3>
                      <p className={styles.uniLocation}>Cambridge, MA, USA</p>
                    </div>
                  </div>
                  <div className={styles.uniStats}>
                    <div className={styles.uniStat}>
                      <span className={styles.uniStatLabel}>#3 Ranking</span>
                      <span className={styles.uniStatValue}>98% Match</span>
                    </div>
                    <div className={styles.uniStat}>
                      <span className={styles.uniStatLabel}>$54k Tuition</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Scholarships */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Search Scholarships</h2>
              </div>
              <div className={styles.searchForm}>
                <div className={styles.searchRow}>
                  <div className={styles.searchField}>
                    <label className={styles.searchFieldLabel}>Amount Range</label>
                    <select className={styles.searchSelect}>
                      <option>Any Amount</option>
                      <option>$1k - $5k</option>
                      <option>$5k - $10k</option>
                      <option>$10k+</option>
                    </select>
                  </div>
                  <div className={styles.searchField}>
                    <label className={styles.searchFieldLabel}>Deadline</label>
                    <select className={styles.searchSelect}>
                      <option>Any Time</option>
                      <option>Next Month</option>
                      <option>Next 3 Months</option>
                      <option>Next 6 Months</option>
                    </select>
                  </div>
                  <div className={styles.searchField}>
                    <label className={styles.searchFieldLabel}>Type</label>
                    <select className={styles.searchSelect}>
                      <option>Any Type</option>
                      <option>Merit-based</option>
                      <option>Need-based</option>
                      <option>Minority</option>
                    </select>
                  </div>
                </div>
                <button className={styles.sectionActionPrimary}>Find Scholarships</button>
              </div>
              <div className={styles.scholarshipCard}>
                <div className={styles.scholarshipHeader}>
                  <h4 className={styles.scholarshipName}>Gates Millennium Scholarship</h4>
                  <span className={styles.scholarshipAmount}>$25,000</span>
                </div>
                <p className={styles.scholarshipDesc}>
                  Full scholarship for outstanding minority students pursuing undergraduate degrees.
                </p>
                <div className={styles.scholarshipFooter}>
                  <span className={styles.scholarshipDeadline}>Deadline: March 15</span>
                  <span className={styles.scholarshipMatch}>95% Match</span>
                </div>
              </div>
            </div>

            {/* Match Universities */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Match Universities</h2>
                <button className={styles.sectionActionPrimary}>Run AI Match</button>
              </div>
              <div className={styles.communityGrid}>
                <div>
                  <h4 className={styles.featureTitle}>Your Profile</h4>
                  <div className={styles.statsRow} style={{ marginTop: 8 }}>
                    {[
                      { label: "GPA", value: "3.8" },
                      { label: "SAT Score", value: "1450" },
                      { label: "Budget", value: "$40-60k" },
                    ].map((s) => (
                      <div key={s.label} className={styles.statCard}>
                        <div className={styles.statNumber}>{s.value}</div>
                        <div className={styles.statLabel}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className={styles.featureTitle}>AI Matched</h4>
                  <div className={styles.matchGrid} style={{ marginTop: 8 }}>
                    {[
                      { pct: "98%", name: "Carnegie Mellon University", desc: "Perfect match for CS program" },
                      { pct: "92%", name: "Georgia Tech", desc: "Strong engineering program" },
                    ].map((m) => (
                      <div key={m.name} className={styles.matchCard}>
                        <div className={styles.matchPercent}>{m.pct}</div>
                        <div>
                          <h4 className={styles.matchName}>{m.name}</h4>
                          <p className={styles.matchDesc}>{m.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Match Scholarships */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Match Scholarships</h2>
                <button className={styles.sectionActionPrimary}>Find Matches</button>
              </div>
              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>47</div>
                  <div className={styles.statLabel}>Available</div>
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
              <div className={styles.matchGrid}>
                {[
                  { pct: "95%", name: "National Merit Scholarship", amt: "$2,500/year", desc: "For high-achieving students" },
                  { pct: "88%", name: "STEM Excellence Award", amt: "$5,000/year", desc: "Computer Science students" },
                ].map((m) => (
                  <div key={m.name} className={styles.matchCard}>
                    <div className={styles.matchPercent}>{m.pct}</div>
                    <div>
                      <h4 className={styles.matchName}>{m.name}</h4>
                      <p className={styles.matchDesc}>{m.amt} — {m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Students */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Similar Students</h2>
                <button className={styles.sectionActionPrimary}>View All</button>
              </div>
              <div className={styles.communityGrid}>
                {[
                  { init: "A", name: "Alex Chen", desc: "MIT '28 | Computer Science", stats: ["GPA: 3.9", "SAT: 1520"], score: "94% Similar" },
                  { init: "S", name: "Sarah Johnson", desc: "Stanford '28 | Engineering", stats: ["GPA: 3.8", "SAT: 1480"], score: "89% Similar" },
                ].map((s) => (
                  <div key={s.name} className={styles.personCard}>
                    <div className={styles.personAvatar}>{s.init}</div>
                    <div>
                      <h4 className={styles.personName}>{s.name}</h4>
                      <p className={styles.personDesc}>{s.desc}</p>
                      <div className={styles.personStats}>
                        {s.stats.map((st) => <span key={st}>{st}</span>)}
                      </div>
                      <div className={styles.personScore}>{s.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect Friends */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Connect Friends</h2>
                <button className={styles.sectionActionPrimary}>Invite Friends</button>
              </div>
              <div className={styles.statsRow} style={{ marginBottom: 12 }}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>12</div>
                  <div className={styles.statLabel}>Connected</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>5</div>
                  <div className={styles.statLabel}>Pending</div>
                </div>
                <div className={styles.statCard} />
              </div>
              <div className={styles.communityGrid}>
                {[
                  { init: "M", name: "Mike Rodriguez", desc: "Applying to same universities", online: true },
                  { init: "E", name: "Emma Wilson", desc: "Shared 3 scholarships", online: false },
                ].map((f) => (
                  <div key={f.name} className={styles.personCard}>
                    <div className={styles.personAvatar}>{f.init}</div>
                    <div>
                      <h4 className={styles.personName}>{f.name}</h4>
                      <p className={styles.personDesc}>{f.desc}</p>
                      <span className={`${styles.personStatus} ${f.online ? styles.personOnline : styles.personOffline}`}>
                        {f.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alumni Mentors */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Alumni Mentors</h2>
                <button className={styles.sectionActionPrimary}>Find Mentor</button>
              </div>
              <div className={styles.communityGrid}>
                {[
                  { init: "J", name: "Dr. Jennifer Liu", desc: "MIT '15 | Software Engineer at Google", tags: ["Computer Science", "Career Guidance"], rating: "4.9" },
                  { init: "R", name: "Robert Kim", desc: "Stanford '12 | Investment Banker", tags: ["Business", "Finance"], rating: "4.8" },
                ].map((m) => (
                  <div key={m.name} className={styles.personCard}>
                    <div className={styles.personAvatar}>{m.init}</div>
                    <div>
                      <h4 className={styles.personName}>{m.name}</h4>
                      <p className={styles.personDesc}>{m.desc}</p>
                      <div className={styles.mentorMeta}>
                        {m.tags.map((t) => <span key={t} className={styles.mentorTag}>{t}</span>)}
                      </div>
                      <div className={styles.mentorRating}>★ {m.rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Essay Reviews */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Essay Reviews</h2>
                <button className={styles.sectionActionPrimary}>Submit Essay</button>
              </div>
              <div className={styles.premiumGrid}>
                <div className={styles.premiumCard}>
                  <h4 className={styles.premiumTitle}>Basic Review</h4>
                  <div className={styles.premiumPrice}>$49</div>
                  <ul className={styles.premiumFeatures}>
                    <li>Grammar & Style Check</li>
                    <li>Basic Feedback</li>
                    <li>24-hour turnaround</li>
                  </ul>
                </div>
                <div className={styles.premiumCard}>
                  <h4 className={styles.premiumTitle}>Premium Review</h4>
                  <div className={styles.premiumPrice}>$99</div>
                  <ul className={styles.premiumFeatures}>
                    <li>Comprehensive Analysis</li>
                    <li>Personalized Feedback</li>
                    <li>12-hour turnaround</li>
                    <li>Revision suggestions</li>
                  </ul>
                </div>
              </div>
              <div className={styles.reviewItem}>
                <div className={styles.reviewRating}>9.2/10</div>
                <div>
                  <h5 className={styles.reviewTitle}>Personal Statement - MIT</h5>
                  <p className={styles.reviewDesc}>Excellent structure and compelling narrative</p>
                </div>
              </div>
            </div>

            {/* Mock Interviews */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Mock Interviews</h2>
                <button className={styles.sectionActionPrimary}>Schedule Interview</button>
              </div>
              <div className={styles.interviewGrid}>
                <div className={styles.interviewCard}>
                  <div className={styles.interviewIcon}><GraduationCapIcon size={18} /></div>
                  <div>
                    <h4 className={styles.interviewTitle}>University Admissions</h4>
                    <p className={styles.interviewDesc}>Practice for college interviews</p>
                    <div className={styles.interviewPrice}>$75</div>
                  </div>
                </div>
                <div className={styles.interviewCard}>
                  <div className={styles.interviewIcon}><CrownIcon size={18} /></div>
                  <div>
                    <h4 className={styles.interviewTitle}>Job Interviews</h4>
                    <p className={styles.interviewDesc}>Prepare for internship interviews</p>
                    <div className={styles.interviewPrice}>$100</div>
                  </div>
                </div>
              </div>
              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>15</div>
                  <div className={styles.statLabel}>Completed</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>8.7</div>
                  <div className={styles.statLabel}>Avg Rating</div>
                </div>
                <div className={styles.statCard} />
              </div>
            </div>

            {/* Concierge Support */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Concierge Support</h2>
                <button className={styles.sectionActionPrimary}>Get Support</button>
              </div>
              <div className={styles.serviceGrid}>
                {[
                  { icon: <BellIcon size={16} />, title: "24/7 Support", desc: "Round-the-clock assistance" },
                  { icon: <TargetIcon size={16} />, title: "Personal Advisor", desc: "Dedicated application specialist" },
                  { icon: <BookOpenIcon size={16} />, title: "Application Review", desc: "Complete application check" },
                ].map((s) => (
                  <div key={s.title} className={styles.serviceItem}>
                    <div className={styles.serviceIcon}>{s.icon}</div>
                    <div>
                      <h4 className={styles.serviceTitle}>{s.title}</h4>
                      <p className={styles.serviceDesc}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.liveSupportBox}>
                <h4 className={styles.liveSupportTitle}>Live Support</h4>
                <p className={styles.liveSupportMsg}>
                  <span className={styles.liveSupportBold}>I need help with my MIT application</span>
                  <br />I will connect you with our MIT specialist right away!
                </p>
              </div>
            </div>

            {/* Get Courses */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Courses</h2>
                <button className={styles.sectionActionPrimary}>Browse Courses</button>
              </div>
              <div className={styles.courseGrid}>
                {[
                  { icon: <BookOpenIcon size={18} />, name: "SAT Prep Masterclass", desc: "Comprehensive SAT preparation", meta: ["12 weeks", "★ 4.8"] },
                  { icon: <FileEditIcon size={18} />, name: "College Essay Writing", desc: "Master the art of essay writing", meta: ["8 weeks", "★ 4.9"] },
                ].map((c) => (
                  <div key={c.name} className={styles.courseCard}>
                    <div className={styles.courseIcon}>{c.icon}</div>
                    <div>
                      <h4 className={styles.courseName}>{c.name}</h4>
                      <p className={styles.courseDesc}>{c.desc}</p>
                      <div className={styles.courseMeta}>
                        {c.meta.map((m) => <span key={m}>{m}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Math */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Math</h2>
                <button className={styles.sectionActionPrimary}>Start Learning</button>
              </div>
              {[
                { name: "Algebra I", pct: 75 },
                { name: "Calculus", pct: 45 },
              ].map((p) => (
                <div key={p.name} className={styles.progressItem}>
                  <div className={styles.progressLabel}>
                    <span className={styles.progressName}>{p.name}</span>
                    <span className={styles.progressValue}>{p.pct}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
              <div className={styles.problemCard}>
                <p className={styles.problemText}>Solve for x: 2x + 5 = 13</p>
                <div className={styles.problemActions}>
                  <button className={styles.sectionActionOutline}>Show Hint</button>
                  <button className={styles.sectionActionPrimary}>Submit Answer</button>
                </div>
              </div>
            </div>

            {/* English */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>English</h2>
                <button className={styles.sectionActionPrimary}>Start Learning</button>
              </div>
              {[
                { name: "Grammar Fundamentals", pct: 80, desc: "Master essential grammar rules" },
                { name: "Reading Comprehension", pct: 60, desc: "Improve reading skills" },
              ].map((m) => (
                <div key={m.name} style={{ marginBottom: 14 }}>
                  <div className={styles.progressLabel}>
                    <span className={styles.progressName}>{m.name}</span>
                    <span className={styles.progressValue}>{m.pct}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${m.pct}%` }} />
                  </div>
                  <p className={styles.cardDescription} style={{ marginTop: 4 }}>{m.desc}</p>
                </div>
              ))}
            </div>

            {/* Essay Writing */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Essay Writing</h2>
                <button className={styles.sectionActionPrimary}>Start Writing</button>
              </div>
              <div className={styles.toolGrid}>
                <div className={styles.toolCard}>
                  <h4 className={styles.toolTitle}>Essay Templates</h4>
                  <p className={styles.toolDesc}>Pre-built structures for different essay types</p>
                </div>
                <div className={styles.toolCard}>
                  <h4 className={styles.toolTitle}>Writing Prompts</h4>
                  <p className={styles.toolDesc}>Practice with real college prompts</p>
                </div>
              </div>
              <div className={styles.essayItem}>
                <h5 className={styles.essayTitle}>Personal Statement Draft</h5>
                <span className={styles.essayStatus}>In Progress</span>
              </div>
            </div>

            {/* AI Literacy */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>AI Literacy</h2>
                <button className={styles.sectionActionPrimary}>Start Course</button>
              </div>
              <div className={styles.moduleGrid}>
                {[
                  { name: "Introduction to AI", desc: "Understanding artificial intelligence basics", done: true },
                  { name: "Machine Learning Fundamentals", desc: "Core concepts and applications", done: false },
                  { name: "Future of AI", desc: "Ethics and implications", done: false },
                ].map((m) => (
                  <div key={m.name} className={styles.moduleCard}>
                    <div className={`${styles.moduleStatus} ${m.done ? styles.moduleComplete : styles.modulePending}`}>
                      {m.done ? "✓" : "→"}
                    </div>
                    <div>
                      <h4 className={styles.moduleName}>{m.name}</h4>
                      <p className={styles.moduleDesc}>{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollContainer>
      </main>
    </div>
  );
};

export default DashboardPage;
