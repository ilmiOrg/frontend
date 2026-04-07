import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../hooks/useLanguage";
import styles from "./UniversityResultCard.module.css";

function formatTuition(n) {
  if (n === 0) return "No tuition (public)";
  return `≈ €${n.toLocaleString()} / year`;
}

function badgeLetters(name) {
  const skip = new Set([
    "of",
    "the",
    "and",
    "university",
    "college",
    "international",
  ]);
  const parts = name.split(/\s+/).filter((w) => !skip.has(w.toLowerCase()));
  if (parts.length >= 2 && parts[0][0] && parts[1][0]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  const compact = name.replace(/[^A-Za-z]/g, "");
  return compact.slice(0, 3).toUpperCase() || "UNI";
}

const SLIDE_MS = 2000;

export default function UniversityResultCard({
  university: u,
  isFavorite,
  onToggleFavorite,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const detailPath = `/dashboard/search/universities/${u.slug}`;

  const slides = useMemo(() => {
    if (u.galleryUrls?.length) return u.galleryUrls;
    return [u.imageUrl];
  }, [u.galleryUrls, u.imageUrl]);

  const [slide, setSlide] = useState(0);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    setLogoFailed(false);
  }, [u.universityId, u.logoUrl]);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const mark = u.abbr ?? badgeLetters(u.name);
  const showLogo = u.logoUrl && !logoFailed;

  return (
    <li className={styles.card}>
      <div className={styles.hero}>
        <div className={styles.slideshow}>
          {slides.map((url, i) => (
            <img
              key={url}
              src={url}
              alt=""
              className={`${styles.slideImg} ${
                i === slide ? styles.slideImgVisible : ""
              }`}
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
      </div>

      <div className={styles.aside}>
        <div className={styles.brandStack}>
          <div
            className={`${styles.logoMark} ${
              showLogo ? styles.logoMarkImage : ""
            }`}
          >
            {showLogo ? (
              <img
                className={styles.logoImg}
                src={u.logoUrl}
                alt=""
                loading="lazy"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className={styles.logoFallback} aria-hidden>
                {mark}
              </span>
            )}
          </div>
        </div>

        <div className={styles.info}>
          <h3 className={styles.title}>{u.name}</h3>
          <p className={styles.meta}>
            {u.type === "university" ? "University" : "College"} · {u.city},{" "}
            {u.country}
          </p>
          <p className={styles.description}>{u.shortDescription}</p>
          <p className={styles.tags}>{u.specializations.join(" · ")}</p>
          <p className={styles.tuition}>{formatTuition(u.tuitionAnnual)}</p>
          <p className={styles.langs}>{u.languages.join(", ")}</p>

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
              onClick={() => onToggleFavorite(u.universityId)}
              aria-pressed={isFavorite}
            >
              {isFavorite ? `★ ${t("favoriteSaved")}` : `☆ ${t("favoriteSave")}`}
            </button>
            <Link className={`${styles.btn} ${styles.btnOutline}`} to={detailPath}>
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}
