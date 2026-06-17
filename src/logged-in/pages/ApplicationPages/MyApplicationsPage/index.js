import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTemplate from "../../../shared/PageTemplate";
import { useTranslation } from "../../../../hooks/useLanguage";
import { GraduationCapIcon } from "../../../shared/Icons";
import { SelectField } from "../../../../ui-components";
import {
  getApplications,
  updateApplication,
  deleteApplication,
  APPLICATION_STATUSES,
} from "../../../../api/applications";
import ChecklistSection from "./ChecklistSection";
import s from "../../../shared/ContentPage/style.module.css";
import m from "./style.module.css";

const prettyEnum = (v) =>
  String(v || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const STATUS_OPTIONS = APPLICATION_STATUSES.map((v) => ({ value: v, label: prettyEnum(v) }));

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(`${dateStr}T00:00:00`);
  return Math.round((d - today) / 86400000);
};

const deadlineLabel = (dateStr, t) => {
  const days = daysUntil(dateStr);
  const daysLeft = (n) => t("appsDaysLeft").replace("{days}", n);
  if (days === null) return { text: t("appsNoDeadlineSet"), tone: "none" };
  if (days < 0)
    return { text: t("appsPastDue").replace("{days}", Math.abs(days)), tone: "urgent" };
  if (days === 0) return { text: t("appsDueToday"), tone: "urgent" };
  if (days <= 14) return { text: daysLeft(days), tone: "urgent" };
  if (days <= 45) return { text: daysLeft(days), tone: "warning" };
  return { text: daysLeft(days), tone: "normal" };
};

const MyApplicationsPage = () => {
  const { t } = useTranslation();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getApplications();
      setApps(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (id, status) => {
    if (busyId === id) return; // ignore overlapping updates while one is in flight
    setBusyId(id);
    setError(null);
    try {
      const updated = await updateApplication(id, { status });
      setApps((rows) => rows.map((a) => (a.applicationId === id ? updated : a)));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const changeDeadline = async (id, deadline) => {
    setBusyId(id);
    try {
      const updated = await updateApplication(id, { deadline });
      setApps((rows) => rows.map((a) => (a.applicationId === id ? updated : a)));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    setBusyId(id);
    try {
      await deleteApplication(id);
      setApps((rows) => rows.filter((a) => a.applicationId !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <PageTemplate
      icon={<GraduationCapIcon size={22} />}
      title={t("appsTitle")}
      description={t("appsDescription")}
    >
      <div className={s.layout}>
        {loading ? (
          <p className={s.emptyState}>{t("appsLoading")}</p>
        ) : error ? (
          <p className={s.emptyState}>{error}</p>
        ) : apps.length === 0 ? (
          <div className={s.introPanel}>
            <h3 className={s.sectionLabel}>{t("appsEmptyTitle")}</h3>
            <p className={s.introText}>
              {t("appsEmptyHintBefore")} <strong>{t("appsTrackApplicationQuoted")}</strong>{" "}
              {t("appsEmptyHintAfter")}
            </p>
            <Link to="/dashboard/ai/match-universities" className={m.cta}>
              {t("appsFindMatches")}
            </Link>
          </div>
        ) : (
          <>
            <h3 className={s.sectionLabel}>
              {(apps.length === 1 ? t("appsCountOne") : t("appsCountMany")).replace(
                "{count}",
                apps.length
              )}
            </h3>
            <div className={m.list}>
              {apps.map((a) => {
                const u = a.university || {};
                const dl = deadlineLabel(a.deadline, t);
                return (
                  <div className={s.contentCard} key={a.applicationId}>
                    <div className={s.cardHeader}>
                      <div>
                        <h4 className={s.cardTitle}>
                          {prettyEnum(a.fieldType)} · {prettyEnum(a.degree)}
                        </h4>
                        <p className={s.cardDesc}>
                          {u.name}
                          {u.city ? `, ${u.city}` : ""}
                          {u.country ? `, ${u.country}` : ""}
                        </p>
                      </div>
                      <span className={`${m.deadlinePill} ${m[`dl_${dl.tone}`] || ""}`}>
                        {dl.text}
                      </span>
                    </div>

                    <div className={m.controls}>
                      <SelectField
                        label={t("appsStatus")}
                        value={a.status}
                        onChange={(v) => changeStatus(a.applicationId, v)}
                        options={STATUS_OPTIONS}
                      />
                      <label className={m.dateField}>
                        <span className={m.dateLabel}>{t("appsDeadline")}</span>
                        <input
                          type="date"
                          className={m.dateInput}
                          value={a.deadline || ""}
                          disabled={busyId === a.applicationId}
                          onChange={(e) => changeDeadline(a.applicationId, e.target.value)}
                        />
                      </label>
                      <button
                        type="button"
                        className={m.removeBtn}
                        disabled={busyId === a.applicationId}
                        onClick={() => remove(a.applicationId)}
                      >
                        {t("appsRemove")}
                      </button>
                    </div>

                    {a.notes ? <p className={m.notes}>{a.notes}</p> : null}
                    {a.submittedDate ? (
                      <p className={m.submitted}>
                        {t("appsSubmitted").replace("{date}", a.submittedDate)}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      className={m.checklistToggle}
                      aria-expanded={expandedId === a.applicationId}
                      onClick={() =>
                        setExpandedId(expandedId === a.applicationId ? null : a.applicationId)
                      }
                    >
                      {expandedId === a.applicationId ? t("appsHideChecklist") : t("appsShowChecklist")}
                    </button>
                    {expandedId === a.applicationId ? (
                      <ChecklistSection applicationId={a.applicationId} />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </PageTemplate>
  );
};

export default MyApplicationsPage;
