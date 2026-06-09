import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTemplate from "../../../shared/PageTemplate";
import { AwardIcon } from "../../../shared/Icons";
import { useAuth } from "../../../../contexts/AuthContext";
import { getScholarshipMatches } from "../../../../api/scholarships";
import s from "../../../shared/ContentPage/style.module.css";
import m from "./style.module.css";

const prettyEnum = (v) =>
  String(v || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const awardLabel = (sch) => {
  const cur = sch.currency ? `${sch.currency} ` : "";
  switch (sch.awardType) {
    case "FULL_TUITION":
      return "Full tuition";
    case "FULL_COST_OF_ATTENDANCE":
      return "Full cost of attendance";
    case "PERCENTAGE_OFF_TUITION":
      return sch.awardValue != null ? `${Number(sch.awardValue)}% off tuition` : "Tuition discount";
    case "FIXED_AMOUNT":
      return sch.awardValue != null ? `${cur}${Number(sch.awardValue).toLocaleString()}` : "Fixed award";
    default:
      return "Variable award";
  }
};

const MatchScholarshipsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const isGuest = user?.isGuest === true;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eligibleOnly, setEligibleOnly] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getScholarshipMatches({ eligibleOnly });
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Could not load scholarship matches");
    } finally {
      setLoading(false);
    }
  }, [eligibleOnly]);

  useEffect(() => {
    if (isAuthenticated && !isGuest) load();
  }, [isAuthenticated, isGuest, load]);

  if (isGuest) {
    return (
      <PageTemplate
        icon={<AwardIcon size={22} />}
        title="Scholarship Matches"
        description="See which scholarships you likely qualify for, ranked by fit."
      >
        <div className={s.layout}>
          <div className={s.ctaPanel}>
            <div className={s.ctaBody}>
              <h3 className={s.ctaTitle}>Create a free account to get matched</h3>
              <p className={s.ctaDesc}>
                Matching uses your country, grades, and interests — guests can browse, but
                scholarship matches need a saved profile.
              </p>
            </div>
            <Link to="/register" className={s.ctaBtn}>Sign up</Link>
          </div>
        </div>
      </PageTemplate>
    );
  }

  const eligibleCount = rows.filter((r) => r.eligible).length;

  return (
    <PageTemplate
      icon={<AwardIcon size={22} />}
      title="Scholarship Matches"
      description="Active scholarships ranked against your profile — citizenship, GPA, and interests."
    >
      <div className={s.layout}>
        <div className={m.toolbar}>
          <label className={m.filterToggle}>
            <input
              type="checkbox"
              checked={eligibleOnly}
              onChange={(e) => setEligibleOnly(e.target.checked)}
            />
            Eligible only
          </label>
        </div>

        {loading ? (
          <p className={s.emptyState}>Finding scholarships for you…</p>
        ) : error ? (
          <p className={s.emptyState}>{error}</p>
        ) : rows.length === 0 ? (
          <p className={s.emptyState}>
            No scholarships available yet. Check back as the catalog grows, or set your{" "}
            <Link to="/dashboard/profile">interests and budget</Link>.
          </p>
        ) : (
          <>
            <h3 className={s.sectionLabel}>
              {eligibleCount} you likely qualify for of {rows.length}
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
                      {r.eligible ? "Eligible" : "Not eligible"}
                    </span>
                  </div>

                  <div className={s.cardMeta}>
                    <span className={`${s.metaBadge} ${s.highlight}`}>{awardLabel(r)}</span>
                    {r.degreeLevel && <span className={s.metaBadge}>{prettyEnum(r.degreeLevel)}</span>}
                    {r.fieldType && <span className={s.metaBadge}>{prettyEnum(r.fieldType)}</span>}
                    {r.matchesInterests && (
                      <span className={`${s.metaBadge} ${s.success}`}>★ Your interest</span>
                    )}
                    {r.deadline && <span className={s.metaBadge}>Due {r.deadline}</span>}
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
