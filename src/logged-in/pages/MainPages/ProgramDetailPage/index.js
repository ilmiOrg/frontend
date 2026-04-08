import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import { GraduationCapIcon, StarIcon } from "../../../shared/Icons";
import styles from "./style.module.css";
import { getProgramById, getFavoritePrograms, addFavoriteProgram, removeFavoriteProgram } from "../../../../api/programs";

function formatTuition(amount, currency) {
  if (Number(amount) === 0) return "Free / public";
  return `${currency} ${Number(amount).toLocaleString()} / year`;
}

const ProgramDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const isGuest = user?.isGuest === true;

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const isFavoriteRef = useRef(false);

  useEffect(() => {
    isFavoriteRef.current = isFavorite;
  }, [isFavorite]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProgramById(id)
      .then(setProgram)
      .catch(() => setError("notFound"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isGuest) return;
    getFavoritePrograms()
      .then((list) => {
        if (list.some((p) => p.programId === id)) {
          setIsFavorite(true);
        }
      })
      .catch(() => {});
  }, [id, isGuest]);

  const toggleFavorite = useCallback(() => {
    if (isGuest) {
      setIsFavorite((f) => !f);
      return;
    }
    const wasFav = isFavoriteRef.current;
    setIsFavorite(!wasFav);
    const apiFn = wasFav ? removeFavoriteProgram : addFavoriteProgram;
    apiFn(id).catch(() => setIsFavorite(wasFav));
  }, [id, isGuest]);

  if (loading) {
    return (
      <PageTemplate icon={<GraduationCapIcon size={22} />} title={t("programDetailTitle")}>
        <p className={styles.loading}>{t("searchFieldsLoading")}</p>
      </PageTemplate>
    );
  }

  if (error || !program) {
    return (
      <PageTemplate icon={<GraduationCapIcon size={22} />} title={t("programDetailTitle")}>
        <p className={styles.error}>{t("programDetailNotFound")}</p>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate icon={<GraduationCapIcon size={22} />} title={program.programName} onBack={() => navigate(-1)}>
      <div className={styles.layout}>
        <button type="button" className={styles.backLink} onClick={() => navigate(-1)}>
          ← {t("programDetailBack")}
        </button>

        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.programName}>{program.programName}</h1>
            <span className={styles.categoryBadge}>
              {program.categoryName}
            </span>
          </div>

          <div className={styles.metaGrid}>
            {program.universityName && (
              <div className={styles.metaItem}>
                <p className={styles.metaLabel}>{t("programDetailUniversity")}</p>
                <p className={styles.metaValue}>{program.universityName}</p>
              </div>
            )}
            <div className={styles.metaItem}>
              <p className={styles.metaLabel}>{t("programDetailLocation")}</p>
              <p className={styles.metaValue}>
                {program.city}, {program.countryName}
              </p>
            </div>
            <div className={styles.metaItem}>
              <p className={styles.metaLabel}>{t("programDetailDegree")}</p>
              <p className={styles.metaValue}>{program.degreeLevel}</p>
            </div>
            <div className={styles.metaItem}>
              <p className={styles.metaLabel}>{t("programDetailLanguage")}</p>
              <p className={styles.metaValue}>{program.language}</p>
            </div>
            {program.durationYears && (
              <div className={styles.metaItem}>
                <p className={styles.metaLabel}>{t("programDetailDuration")}</p>
                <p className={styles.metaValue}>
                  {program.durationYears} {program.durationYears === 1 ? "year" : "years"}
                </p>
              </div>
            )}
            <div className={styles.metaItem}>
              <p className={styles.metaLabel}>{t("programDetailTuition")}</p>
              <p className={styles.tuitionValue}>
                {formatTuition(program.tuitionPerYear, program.currency)}
              </p>
            </div>
          </div>

          {program.description && (
            <div className={styles.descSection}>
              <h2 className={styles.descTitle}>{t("programDetailDescription")}</h2>
              <p className={styles.descBody}>{program.description}</p>
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={toggleFavorite}
              aria-pressed={isFavorite}
            >
              {isFavorite
                ? <><StarIcon size={14} /> {t("favoriteSaved")}</>
                : <><StarIcon size={14} /> {t("favoriteSave")}</>}
            </button>
            {program.website && (
              <a
                className={`${styles.btn} ${styles.btnOutline}`}
                href={program.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("programDetailWebsite")}
              </a>
            )}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ProgramDetailPage;
