import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useTranslation } from "../../../hooks/useLanguage";
import { ILMI_LOGO_URL } from "../../../lib/ilmiLogoUrl";
import { SkyToggle } from "../../../components/ui/SkyToggle";
import { ScrollContainer } from "../../../components/ui/ScrollContainer";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import {
  HomeIcon,
  StarIcon,
  SearchIcon,
  HeartIcon,
  BookOpenIcon,
  GraduationCapIcon,
  TargetIcon,
  UsersIcon,
  MessageCircleIcon,
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
      { icon: StarIcon, labelKey: "dashDreamUniversity", path: "/dashboard/dream-university" },
      { icon: SearchIcon, labelKey: "dashSearchUniversities", path: "/dashboard/search/universities" },
      { icon: HeartIcon, labelKey: "dashFavoriteUniversities", path: "/dashboard/search/universities/favorites" },
      { icon: BookOpenIcon, labelKey: "dashSearchFields", path: "/dashboard/search/fields" },
      { icon: GraduationCapIcon, labelKey: "dashSearchPrograms", path: "/dashboard/search/programs" },
      { icon: HeartIcon, labelKey: "dashFavoritePrograms", path: "/dashboard/search/programs/favorites" },
      { icon: SearchIcon, labelKey: "dashSearchScholarships", path: "/dashboard/search/scholarships" },
    ],
  },
  {
    id: "aiTools",
    labelKey: "dashNavAiTools",
    items: [
      { icon: TargetIcon, labelKey: "dashMatchUniversities", path: "/dashboard/ai/match-universities" },
      { icon: TargetIcon, labelKey: "dashMatchScholarships", path: "/dashboard/ai/match-scholarships" },
      { icon: UsersIcon, labelKey: "dashSimilarStudents", path: "/dashboard/ai/similar-students" },
    ],
  },
  {
    id: "friends",
    labelKey: "dashNavFriendsAndMentors",
    items: [
      { icon: MessageCircleIcon, labelKey: "dashConnectFriends", path: "/dashboard/community/friends" },
    ],
  },
  {
    id: "contactPremium",
    labelKey: "dashNavSectionContactPremium",
    items: [
      { icon: BellIcon, labelKey: "dashContactPremium", path: "/dashboard/contact-premium" },
    ],
  },
];

const isItemActive = (itemPath, pathname) => {
  if (itemPath === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/";
  }
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();

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
      <aside className={styles.sidebar}>
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
            {NAV_GROUPS.map((group) => (
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
            <h1 className={styles.welcomeBarTitle}>
              {t("dashWelcomeBackPrefix")} {displayFullName}
            </h1>
          </div>
          <div className={styles.topBarRight}>
            <LanguageSwitcher className={styles.langSwitcher} />
            <SkyToggle checked={isDark} onChange={toggleTheme} />
            <button className={styles.actionBtn} title={t("dashNotifications")}>
              <BellIcon size={18} />
              <span className={styles.notifBadge}>3</span>
            </button>
            <button
              className={styles.topProfileButton}
              title={t("dashProfile")}
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
