import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../../../hooks/useLanguage";
import PageTemplate from "../../../shared/PageTemplate";
import styles from "./style.module.css";
import { getFavoritePrograms, removeFavoriteProgram } from "../../../../api/programs";

function formatTuition(amount, currency) {
  if (Number(amount) === 0) return "Free / public";
  return `${currency} ${Number(amount).toLocaleString()} / year`;
}

const FavoriteProgramsPage = () => {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFavoritePrograms()
      .then(setPrograms)
      .catch(() => setPrograms([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = useCallback((programId) => {
    setPrograms((prev) => prev.filter((p) => p.programId !== programId));
    removeFavoriteProgram(programId).catch(() => {
      getFavoritePrograms()
        .then(setPrograms)
        .catch(() => {});
    });
  }, []);

  return (
    <PageTemplate icon="★" title={t("favoriteProgramsTitle")}>
      <div className={styles.layout}>
        {loading ? (
          <p className={styles.emptyState}>{t("searchFieldsLoading")}</p>
        ) : programs.length === 0 ? (
          <p className={styles.emptyState}>{t("favoriteProgramsEmpty")}</p>
        ) : (
          <ul className={styles.resultList}>
            {programs.map((p) => (
              <li key={p.programId} className={styles.programCard}>
                <div className={styles.programHeader}>
                  <h3 className={styles.programName}>{p.programName}</h3>
                  <span className={styles.programCategory}>
                    {p.categoryName}
                  </span>
                </div>
                <p className={styles.programMeta}>
                  {p.universityName} · {p.city}, {p.countryName} ·{" "}
                  {p.degreeLevel} · {p.language}
                </p>
                <div className={styles.programFooter}>
                  <p className={styles.programTuition}>
                    {formatTuition(p.tuitionPerYear, p.currency)}
                  </p>
                  <div className={styles.programActions}>
                    <Link
                      className={`${styles.btn} ${styles.btnOutline}`}
                      to={`/dashboard/search/programs/${p.programId}`}
                    >
                      {t("searchFieldsViewDetails")}
                    </Link>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnDanger}`}
                      onClick={() => handleRemove(p.programId)}
                    >
                      {t("favoriteProgramsRemove")}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageTemplate>
  );
};

export default FavoriteProgramsPage;
