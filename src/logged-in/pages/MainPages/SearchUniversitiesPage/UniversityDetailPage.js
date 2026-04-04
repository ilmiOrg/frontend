import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PageTemplate from "../../../shared/PageTemplate";
import { getUniversityBySlug } from "./searchUniversitiesData";
import styles from "./UniversityDetailPage.module.css";

function formatTuition(n) {
  if (n === 0) return "No tuition (public)";
  return `≈ €${n.toLocaleString()} / year`;
}

export default function UniversityDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const u = slug ? getUniversityBySlug(slug) : null;

  const [favorite, setFavorite] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    setLogoFailed(false);
  }, [slug, u?.logoUrl]);

  if (!u) {
    return (
      <PageTemplate
        backTo="/dashboard/search/universities"
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
      backTo="/dashboard/search/universities"
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
          <p className={styles.fields}>
            Fields: {u.specializations.join(" · ")}
          </p>
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
              onClick={() => setFavorite((f) => !f)}
              aria-pressed={favorite}
            >
              {favorite ? "★ Saved" : "☆ Add to favorites"}
            </button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
