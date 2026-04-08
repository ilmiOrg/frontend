import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { getUniversities } from "../../../../api/universities";
import { searchPrograms } from "../../../../api/programs";
import { mapUniversityFromApi } from "./searchUniversitiesData";
import { getFavorites, addFavorite, removeFavorite } from "../../../../api/favorites";
import styles from "./UniversityDetailPage.module.css";

function formatTuition(n) {
  if (n === 0) return "No tuition (public)";
  return `≈ €${n.toLocaleString()} / year`;
}

function formatProgramTuition(n, currency) {
  if (n === 0) return "Free / public";
  const sym = currency === "USD" ? "$" : "€";
  return `≈ ${sym}${n.toLocaleString()} / year`;
}

export default function UniversityDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const isGuest = user?.isGuest === true;
  const [u, setUniversity] = useState(null);
  const [loadingUniversity, setLoadingUniversity] = useState(true);
  useEffect(() => {
    if (!slug) {
      setUniversity(null);
      setLoadingUniversity(false);
      return;
    }
    getUniversities()
      .then((items) => {
        const mapped = items.map(mapUniversityFromApi);
        const found = mapped.find((item) => item.slug === slug) || null;
        setUniversity(found);
      })
      .catch(() => {
        setUniversity(null);
      })
      .finally(() => {
        setLoadingUniversity(false);
      });
  }, [slug]);


  const [favorite, setFavorite] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const favoriteRef = useRef(false);

  useEffect(() => {
    favoriteRef.current = favorite;
  }, [favorite]);

  // Load favorite state from backend on mount
  useEffect(() => {
    if (isGuest || !u?.universityId) return;
    getFavorites()
      .then((list) => {
        const isSaved = list.some((f) => f.universityId === u.universityId);
        setFavorite(isSaved);
      })
      .catch(() => {
        // non-critical; favorite button state defaults to false
      });
  }, [isGuest, u?.universityId]);

  const toggleFavorite = () => {
    if (isGuest || !u?.universityId) {
      setFavorite((f) => !f);
      return;
    }

    const wasFavorite = favoriteRef.current;
    setFavorite(!wasFavorite);

    const apiFn = wasFavorite ? removeFavorite : addFavorite;
    apiFn(u.universityId).catch(() => {
      // Revert on error
      setFavorite(wasFavorite);
    });
  };

  useEffect(() => {
    setLogoFailed(false);
  }, [slug, u?.logoUrl]);

  useEffect(() => {
    if (!u?.universityId) return;
    setLoadingPrograms(true);
    searchPrograms({ universityId: u.universityId })
      .then(setPrograms)
      .catch(() => setPrograms([]))
      .finally(() => setLoadingPrograms(false));
  }, [u?.universityId]);

  if (loadingUniversity) {
    return (
      <PageTemplate onBack={() => navigate(-1)} icon="🔍" title="Loading...">
        <div className={styles.notFound}>
          <p>Loading university details...</p>
        </div>
      </PageTemplate>
    );
  }

  if (!u) {
    return (
      <PageTemplate
        onBack={() => navigate(-1)}
        icon="🔍"
        title="Institution not found"
        actions={
          <Link className={styles.backLink} to="/dashboard/search/universities">
            Back to search
          </Link>
        }
      >
        <div className={styles.notFound}>
          <p>No university matches “{slug}”.</p>
          <Link className={styles.backLinkLarge} to="/dashboard/search/universities">
            Return to search
          </Link>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      onBack={() => navigate(-1)}
      icon="🎓"
      title={u.name}
    >
      <div className={styles.detail}>
        <div className={styles.hero}>
          <img
            className={styles.heroImg}
            src={u.imageUrl}
            alt=""
            width={960}
            height={420}
          />
        </div>
        <div className={styles.content}>
          <div
            className={`${styles.detailLogo} ${
              u.logoUrl && !logoFailed ? styles.detailLogoImage : ""
            }`}
          >
            {u.logoUrl && !logoFailed ? (
              <img
                className={styles.detailLogoImg}
                src={u.logoUrl}
                alt=""
                loading="lazy"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className={styles.detailLogoFallback}>
                {u.abbr ?? u.name.slice(0, 3).toUpperCase()}
              </span>
            )}
          </div>
          <p className={styles.locationLine}>
            {u.city}, {u.country} ·{" "}
            {u.type === "university" ? "University" : "College"}
          </p>
          <p className={styles.tuition}>{formatTuition(u.tuitionAnnual)}</p>
          <p className={styles.langs}>Languages: {u.languages.join(", ")}</p>

          {(u.fields || []).length > 0 && (
            <div className={styles.fieldChips}>
              {u.fields.map((f) => (
                <Link
                  key={f.fieldId}
                  className={styles.fieldChip}
                  to={`/dashboard/search/fields/${f.fieldSlug}`}
                >
                  {f.fieldName}
                </Link>
              ))}
            </div>
          )}

          <p className={styles.longText}>{u.detailDescription}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => navigate("/dashboard/applications/timeline")}
            >
              Apply
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={toggleFavorite}
              aria-pressed={favorite}
            >
              {favorite ? `★ ${t("favoriteSaved")}` : `☆ ${t("favoriteSave")}`}
            </button>
          </div>

          {!loadingPrograms && programs.length > 0 && (
            <section className={styles.programsSection}>
              <h2 className={styles.sectionTitle}>
                {t("uniDetailPrograms")} ({programs.length})
              </h2>
              <div className={styles.programsGrid}>
                {programs.map((p) => (
                  <Link
                    key={p.programId}
                    className={styles.programCard}
                    to={`/dashboard/search/programs/${p.programId}`}
                  >
                    <span className={styles.programCategory}>
                      {p.categoryName}
                    </span>
                    <h3 className={styles.programName}>{p.programName}</h3>
                    <p className={styles.programMeta}>
                      {p.degreeLevel} · {p.language}
                      {p.durationYears ? ` · ${p.durationYears} yr` : ""}
                    </p>
                    <p className={styles.programTuition}>
                      {formatProgramTuition(p.tuitionPerYear, p.currency)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {loadingPrograms && (
            <p className={styles.loadingNote}>{t("searchFieldsLoading")}</p>
          )}
        </div>
      </div>
    </PageTemplate>
  );
}
