import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../../../shared/PageTemplate";
import { StarIcon } from "../../../shared/Icons";
import UniversityResultCard from "./UniversityResultCard";
import styles from "./style.module.css";
import { getFavorites, removeFavorite } from "../../../../api/favorites";
import { mapUniversityFromApi } from "./searchUniversitiesData";
import { useTranslation } from "../../../../hooks/useLanguage";

const FavoriteUniversitiesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFavorites()
      .then((items) => {
        setFavorites(items.map(mapUniversityFromApi));
      })
      .catch((err) => {
        setError(err.message || t("errFailedLoadFavorites"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [t]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((u) => u.universityId)),
    [favorites]
  );

  const handleToggleFavorite = async (universityId) => {
    try {
      await removeFavorite(universityId);
      setFavorites((prev) => prev.filter((u) => u.universityId !== universityId));
    } catch (err) {
      setError(err.message || t("errFailedRemoveFavorite"));
    }
  };

  return (
    <PageTemplate
      icon={<StarIcon size={22} />}
      title={t("favoriteUniversitiesTitle")}
      actions={
        <button
          type="button"
          className={styles.smartButton}
          onClick={() => navigate("/dashboard/search/universities")}
        >
          {t("search")}
        </button>
      }
    >
      <div className={styles.layout}>
        <section className={styles.resultsSection} aria-live="polite">
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>{t("favoriteUniversitiesTitle")}</h2>
            <span className={styles.resultsCount}>
              {favorites.length} {favorites.length === 1 ? "result" : "results"}
            </span>
          </div>
          {loading && <p className={styles.emptyState}>{t("loading")}</p>}
          {!loading && error && <p className={styles.emptyState}>{error}</p>}
          {!loading && !error && favorites.length === 0 && (
            <p className={styles.emptyState}>{t("favoriteUniversitiesEmpty")}</p>
          )}
          {!loading && !error && favorites.length > 0 && (
            <ul className={styles.resultList}>
              {favorites.map((u) => (
                <UniversityResultCard
                  key={u.universityId}
                  university={u}
                  isFavorite={favoriteIds.has(u.universityId)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageTemplate>
  );
};

export default FavoriteUniversitiesPage;
