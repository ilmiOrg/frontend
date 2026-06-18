import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTemplate from "../../../shared/PageTemplate";
import { AwardIcon } from "../../../shared/Icons";
import { useAuth } from "../../../../contexts/AuthContext";
import { getScholarshipMatches } from "../../../../api/scholarships";
import { useTranslation } from "../../../../hooks/useLanguage";
import s from "../../../shared/ContentPage/style.module.css";
import m from "./style.module.css";

const prettyEnum = (v) =>
  String(v || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const awardLabel = (sch, t) => {
  const cur = sch.currency ? `${sch.currency} ` : "";
  switch (sch.awardType) {
    case "FULL_TUITION":
      return t("matchScholAwardFullTuition");
    case "FULL_COST_OF_ATTENDANCE":
      return t("matchScholAwardFullCost");
    case "PERCENTAGE_OFF_TUITION":
      return sch.awardValue != null ? t("matchScholAwardPercentOff").replace("{value}", Number(sch.awardValue)) : t("matchScholAwardTuitionDiscount");
    case "FIXED_AMOUNT":
      return sch.awardValue != null ? `${cur}${Number(sch.awardValue).toLocaleString()}` : t("matchScholAwardFixed");
    default:
      return t("matchScholAwardVariable");
  }
};

const MatchScholarshipsPage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const isGuest = user?.isGuest === true;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eligibleOnly, setEligibleOnly] = useState(false);

  // Fetch in the effect with an `active` guard so a slow response from a previous filter can't
  // overwrite the latest one (rapid eligibleOnly toggles).
  useEffect(() => {
    if (!isAuthenticated || isGuest) return undefined;
    let active = true;
    setLoading(true);
    setError(null);
    getScholarshipMatches({ eligibleOnly })
      .then((data) => {
        if (active) setRows(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (active) setError(e?.message || t("matchScholErrorDefault"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isGuest, eligibleOnly]);

  if (isGuest) {
    return (
      <PageTemplate
        icon={<AwardIcon size={22} />}
        title={t("matchScholTitle")}
        description={t("matchScholGuestDesc")}
      >
        <div className={s.layout}>
          <div className={s.ctaPanel}>
            <div className={s.ctaBody}>
              <h3 className={s.ctaTitle}>{t("matchScholGuestCtaTitle")}</h3>
              <p className={s.ctaDesc}>
                {t("matchScholGuestCtaDesc")}
              </p>
            </div>
            <Link to="/register" className={s.ctaBtn}>{t("matchScholGuestCtaBtn")}</Link>
          </div>
        </div>
      </PageTemplate>
    );
  }

  const eligibleCount = rows.filter((r) => r.eligible).length;

  return (
    <PageTemplate
      icon={<AwardIcon size={22} />}
      title={t("matchScholTitle")}
      description={t("matchScholDesc")}
    >
      <div className={s.layout}>
        <div className={m.toolbar}>
          <label className={m.filterToggle}>
            <input
              type="checkbox"
              checked={eligibleOnly}
              onChange={(e) => setEligibleOnly(e.target.checked)}
            />
            {t("matchScholEligibleOnly")}
          </label>
        </div>

        {loading ? (
          <p className={s.emptyState}>{t("matchScholLoading")}</p>
        ) : error ? (
          <p className={s.emptyState}>{error}</p>
        ) : rows.length === 0 ? (
          <p className={s.emptyState}>
            {t("matchScholEmptyPrefix")}
            <Link to="/dashboard/profile">{t("matchScholEmptyLink")}</Link>.
          </p>
        ) : (
          <>
            <h3 className={s.sectionLabel}>
              {t("matchScholCount").replace("{eligible}", eligibleCount).replace("{total}", rows.length)}
            </h3>
            <div className={m.list}>
              {rows.map((r) => (
                <div className={s.contentCard} key={r.scholarshipId}>
                  <div className={s.cardHeader}>
                    <div className={m.titleWrap}>
                      <h4 className={s.cardTitle}>{r.name}</h4>
                      <p className={s.cardDesc}>
                        {r.universityName}
                        {r.countryName ? `, ${r.countryName}` : ""}
                      </p>
                    </div>
                    <span className={`${m.eligPill} ${r.eligible ? m.eligYes : m.eligNo}`}>
                      {r.eligible ? t("matchScholEligible") : t("matchScholNotEligible")}
                    </span>
                  </div>

                  <div className={s.cardMeta}>
                    <span className={`${s.metaBadge} ${s.highlight}`}>{awardLabel(r, t)}</span>
                    {r.degreeLevel && <span className={s.metaBadge}>{prettyEnum(r.degreeLevel)}</span>}
                    {r.fieldType && <span className={s.metaBadge}>{prettyEnum(r.fieldType)}</span>}
                    {r.matchesInterests && (
                      <span className={`${s.metaBadge} ${s.success}`}>{t("matchScholYourInterest")}</span>
                    )}
                    {r.deadline && <span className={s.metaBadge}>{t("matchScholDue").replace("{date}", r.deadline)}</span>}
                  </div>

                  {Array.isArray(r.reasons) && r.reasons.length > 0 && (
                    <ul className={m.reasons}>
                      {r.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageTemplate>
  );
};

export default MatchScholarshipsPage;
