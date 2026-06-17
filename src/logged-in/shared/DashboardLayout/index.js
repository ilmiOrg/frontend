import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useTranslation } from "../../../hooks/useLanguage";
import { getApplications } from "../../../api/applications";
import { ILMI_LOGO_URL } from "../../../lib/ilmiLogoUrl";
import { SkyToggle } from "../../../components/ui/SkyToggle";
import { ScrollContainer } from "../../../components/ui/ScrollContainer";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import {
  HomeIcon,
  SearchIcon,
  HeartIcon,
  BookOpenIcon,
  GraduationCapIcon,
  TargetIcon,
  AwardIcon,
  PenToolIcon,
  TrendingUpIcon,
  BellIcon,
  SendIcon,
  TelegramIcon,
  ExternalLinkIcon,
} from "../Icons";
import styles from "./style.module.css";

const TELEGRAM_LINK = "https://t.me/ilmiOfficialGroup";

const NAV_GROUPS = [
  {
    id: "main",
    labelKey: "dashMain",
    items: [
      { icon: HomeIcon, labelKey: "dashDashboard", path: "/dashboard" },
      { icon: SearchIcon, labelKey: "dashSearchUniversities", path: "/dashboard/search/universities" },
      { icon: HeartIcon, labelKey: "dashFavoriteUniversities", path: "/dashboard/search/universities/favorites" },
      { icon: BookOpenIcon, labelKey: "dashSearchFields", path: "/dashboard/search/fields" },
      { icon: GraduationCapIcon, labelKey: "dashSearchPrograms", path: "/dashboard/search/programs" },
      { icon: HeartIcon, labelKey: "dashFavoritePrograms", path: "/dashboard/search/programs/favorites" },
      { icon: SearchIcon, labelKey: "dashSearchScholarships", path: "/dashboard/search/scholarships" },
    ],
  },
  {
    id: "opportunities",
    labelKey: "dashNavOpportunities",
    items: [
      { icon: TrendingUpIcon, labelKey: "dashJobs", path: "/dashboard/opportunities/jobs" },
      { icon: BookOpenIcon, labelKey: "dashCourses", path: "/dashboard/opportunities/courses" },
    ],
  },
  {
    id: "aiTools",
    labelKey: "dashNavAiTools",
    items: [
      { icon: TargetIcon, labelKey: "dashMatchUniversities", path: "/dashboard/ai/match-universities" },
      { icon: AwardIcon, labelKey: "dashMatchScholarships", path: "/dashboard/ai/match-scholarships" },
      { icon: PenToolIcon, labelKey: "dashEssayReview", path: "/dashboard/learning/essay-review" },
    ],
  },
  {
    id: "apply",
    labelKey: "dashNavApply",
    items: [
      { icon: BookOpenIcon, labelKey: "dashMyAcademics", path: "/dashboard/academics" },
      { icon: GraduationCapIcon, labelKey: "dashMyApplications", path: "/dashboard/applications" },
    ],
  },
];

const ADMIN_GROUP = {
  id: "admin",
  labelKey: "dashNavAdmin",
  items: [{ icon: TargetIcon, labelKey: "dashAdminReview", path: "/dashboard/admin" }],
};

const isItemActive = (itemPath, pathname) => {
  if (itemPath === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/";
  }
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();

  const navGroups = isAdmin ? [...NAV_GROUPS, ADMIN_GROUP] : NAV_GROUPS;

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => {
    setMobileNavOpen(false); // close the drawer whenever the route changes
  }, [location.pathname]);

  // In-app deadline reminder: real count of tracked applications due within 14 days
  // (not yet submitted/decided). Surfaces on the notification bell.
  const [dueSoonCount, setDueSoonCount] = useState(0);
  const isGuest = user?.isGuest === true;
  useEffect(() => {
    if (isGuest) return undefined;
    let cancelled = false;
    const DONE = new Set(["SUBMITTED", "WAITLISTED", "ADMITTED", "REJECTED", "ENROLLED", "WITHDRAWN"]);
    (async () => {
      try {
        const apps = await getApplications();
        if (cancelled) return;
        const today = new Date().setHours(0, 0, 0, 0);
        const count = (apps || []).filter((a) => {
          if (!a.deadline || DONE.has(a.status)) return false;
          const days = Math.round((new Date(`${a.deadline}T00:00:00`) - today) / 86400000);
          return days >= 0 && days <= 14;
        }).length;
        setDueSoonCount(count);
      } catch (_) {
        // non-fatal
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isGuest, location.pathname]);

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
    const handler = () => setIsDark(document.body.getAttribute("theme") === "dark");
    window.addEventListener("themeChanged", handler);
    return () => window.removeEventListener("themeChanged", handler);
  }, []);

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

  const nameFromUser = user?.name?.trim() || "";
  const nameTokens = nameFromUser.split(/\s+/).filter(Boolean);
  const displayFullName =
    nameTokens.length >= 2 ? nameFromUser : t("dashDefaultDisplayName");
  const initialsSource = displayFullName.trim().split(/\s+/).filter(Boolean);
  const userInitial =
    initialsSource.length > 1
      ? `${initialsSource[0][0]}${initialsSource[1][0]}`.toUpperCase()
      : (initialsSource[0]?.[0] || "N").toUpperCase();
  const userAvatar = user?.photoUrl || user?.avatarUrl || null;

  return (
    <div className={styles.shell}>
      {mobileNavOpen ? (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      ) : null}
      <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className={styles.logo}
            aria-label="ilmi home"
          >
            <img src={ILMI_LOGO_URL} alt="ilmi" className={styles.logoImage} />
            <span>ilmi</span>
          </button>
          <div className={styles.tagline}>{t("dashTagline")}</div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/send-info")}
            className={styles.sendInfoBtn}
          >
            <SendIcon size={14} />
            {t("dashSendInfo")}
          </button>
        </div>

        <ScrollContainer className={styles.sidebarScroll} disableHorizontalScroll paddingAbsolute>
          <nav className={styles.nav}>
            {navGroups.map((group) => (
              <div key={group.id} className={styles.navSection}>
                <p className={styles.navSectionLabel}>{t(group.labelKey)}</p>
                {group.items.map((item) => {
                  const active = isItemActive(item.path, location.pathname);
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => navigate(item.path)}
                      className={`${styles.navItem} ${active ? styles.active : ""}`}
                    >
                      <span className={styles.navIcon}>
                        <item.icon size={18} />
                      </span>
                      <span className={styles.navLabel}>{t(item.labelKey)}</span>
                    </button>
                  );
                })}
              </div>
            ))}

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
                <span className={styles.navLabel}>{t("dashJoinCommunity")}</span>
                <ExternalLinkIcon size={14} />
              </a>
            </div>
          </nav>
        </ScrollContainer>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              type="button"
              className={styles.hamburger}
              onClick={() => setMobileNavOpen((o) => !o)}
              aria-label={t("dashToggleMenu")}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className={styles.welcomeBarTitle}>
              {t("dashWelcomeBackPrefix")} {displayFullName}
            </h1>
          </div>
          <div className={styles.topBarRight}>
            <span className={styles.langSwitcher}>
              <LanguageSwitcher />
            </span>
            <SkyToggle checked={isDark} onChange={toggleTheme} />
            <button
              className={styles.actionBtn}
              title={
                dueSoonCount > 0
                  ? t("dashDeadlinesDueSoon").replace("{count}", dueSoonCount)
                  : t("dashNotifications")
              }
              aria-label={
                dueSoonCount > 0
                  ? t("dashDeadlinesDueSoon").replace("{count}", dueSoonCount)
                  : t("dashNotifications")
              }
              onClick={() => navigate("/dashboard/applications")}
            >
              <BellIcon size={18} />
              {dueSoonCount > 0 ? (
                <span className={styles.notifBadge}>{dueSoonCount}</span>
              ) : null}
            </button>
            <button
              className={styles.topProfileButton}
              title={t("dashProfile")}
              aria-label={t("dashProfile")}
              onClick={() => navigate("/dashboard/profile")}
            >
              <span className={styles.topProfileAvatar}>
                {userAvatar ? (
                  <img src={userAvatar} alt={t("dashProfile")} className={styles.topProfileImage} />
                ) : (
                  userInitial
                )}
              </span>
              <span className={styles.topProfileText}>
                <span className={styles.topProfileName}>{displayFullName}</span>
              </span>
            </button>
          </div>
        </div>

        <ScrollContainer className={styles.mainScroll} disableHorizontalScroll>
          <div className={styles.outletWrap}>
            <Outlet />
          </div>
        </ScrollContainer>
      </main>
    </div>
  );
};

export default DashboardLayout;
