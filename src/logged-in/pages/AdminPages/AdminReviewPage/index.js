import React, { useCallback, useEffect, useState } from "react";
import PageTemplate from "../../../shared/PageTemplate";
import { TargetIcon, CheckIcon } from "../../../shared/Icons";
import { SelectField } from "../../../../ui-components";
import { getStagedRecords, approveStaged, rejectStaged, ingestCsv } from "../../../../api/admin";
import s from "../../../shared/ContentPage/style.module.css";

const TYPE_OPTIONS = ["UNIVERSITY", "PROGRAM", "SCHOLARSHIP", "JOB", "COURSE"].map((v) => ({
  value: v,
  label: title(v),
}));
const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"].map((v) => ({ value: v, label: title(v) }));

function title(v) {
  return String(v || "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function summarize(payload) {
  if (!payload) return "—";
  return payload.name || payload.title || payload.universityName || payload.externalRef || "(record)";
}

const AdminReviewPage = () => {
  const [type, setType] = useState("UNIVERSITY");
  const [status, setStatus] = useState("PENDING");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStagedRecords({ type, status });
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [type, status]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (id, fn) => {
    setBusyId(id);
    try {
      await fn(id);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow re-uploading the same file
    if (!file) return;
    setUploading(true);
    setUploadMsg(null);
    setError(null);
    try {
      const r = await ingestCsv(type, file);
      setUploadMsg(
        `Uploaded ${title(type)}: ${r.inserted} new, ${r.updated} updated, ${r.skipped} skipped. Review below.`
      );
      setStatus("PENDING");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageTemplate
      icon={<TargetIcon size={22} />}
      title="Admin · Scraping review"
      description="Review and approve scraped records before they go live."
    >
      <div className={s.layout}>
        <div className={s.introPanel}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <SelectField label="Type" value={type} onChange={setType} options={TYPE_OPTIONS} />
            <SelectField label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
            <label className={s.primaryBtn} style={{ cursor: "pointer" }}>
              {uploading ? "Uploading…" : `Bulk-upload ${title(type)} CSV`}
              <input
                type="file"
                accept=".csv,text/csv"
                hidden
                disabled={uploading}
                onChange={handleUpload}
              />
            </label>
          </div>
          <p className={s.introText} style={{ marginTop: 8 }}>
            CSV header row = field names (e.g. <code>externalRef,universityName,name,awardType,awardValue,degreeLevel,fieldType,studentTypeEligibility,minGpa,currency,description</code>).
            Rows land as PENDING for review below.
          </p>
          {uploadMsg ? <p className={s.metaBadge + " " + s.success}>{uploadMsg}</p> : null}
        </div>

        {loading ? (
          <p className={s.emptyState}>Loading…</p>
        ) : error ? (
          <p className={s.emptyState}>{error}</p>
        ) : rows.length === 0 ? (
          <p className={s.emptyState}>No {title(type)} records with status {title(status)}.</p>
        ) : (
          <>
            <h3 className={s.sectionLabel}>{rows.length} {title(type)} · {title(status)}</h3>
            <div className={s.matchList || s.cardGrid}>
              {rows.map((r) => (
                <div className={s.contentCard} key={r.id}>
                  <div className={s.cardHeader}>
                    <div className={s.cardTitleWrap || ""}>
                      <h4 className={s.cardTitle}>{summarize(r.payload)}</h4>
                      <p className={s.cardDesc}>
                        {r.source} · {r.externalRef}
                      </p>
                    </div>
                  </div>
                  <div className={s.cardMeta}>
                    <span className={`${s.metaBadge} ${s.highlight}`}>{title(r.type)}</span>
                    <span className={s.metaBadge}>{title(r.status)}</span>
                  </div>
                  {r.status === "PENDING" ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        className={s.primaryBtn}
                        disabled={busyId === r.id}
                        onClick={() => act(r.id, approveStaged)}
                      >
                        <CheckIcon size={14} /> Approve
                      </button>
                      <button
                        type="button"
                        className={s.metaBadge}
                        style={{ cursor: "pointer", borderColor: "var(--error)", color: "var(--error)" }}
                        disabled={busyId === r.id}
                        onClick={() => act(r.id, rejectStaged)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageTemplate>
  );
};

export default AdminReviewPage;
