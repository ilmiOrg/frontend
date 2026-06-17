import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import { SelectField, AccentButton } from "../../../../ui-components";
import {
  getInterestedDegrees,
  addInterestedDegree,
  removeInterestedDegree,
  getInterestedFields,
  addInterestedField,
  removeInterestedField,
} from "../../../../api/interests";
import s from "../../../shared/ContentPage/style.module.css";
import styles from "./InterestsSection.module.css";

const DEGREE_OPTIONS = [
  { value: "HIGH_SCHOOL_DIPLOMA", label: "High school diploma" },
  { value: "ASSOCIATE", label: "Associate" },
  { value: "BACHELOR", label: "Bachelor" },
  { value: "MASTER", label: "Master" },
  { value: "DOCTORATE", label: "Doctorate" },
];

const FIELD_OPTIONS = [
  "COMPUTER_SCIENCE", "ENGINEERING", "MEDICINE", "LAW", "BUSINESS", "ECONOMICS",
  "MATHEMATICS", "PHYSICS", "BIOLOGY", "CHEMISTRY", "HUMANITIES", "SOCIAL_SCIENCES",
  "ARTS", "EDUCATION", "ARCHITECTURE",
].map((v) => ({ value: v, label: pretty(v) }));

function pretty(v) {
  return String(v).toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Lets a student declare interested degrees + fields (feeds matching). */
const InterestsSection = ({ disabled }) => {
  const { t } = useTranslation();
  const [degrees, setDegrees] = useState([]);
  const [fields, setFields] = useState([]);
  const [degreePick, setDegreePick] = useState("BACHELOR");
  const [fieldPick, setFieldPick] = useState("COMPUTER_SCIENCE");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [d, f] = await Promise.all([getInterestedDegrees(), getInterestedFields()]);
      setDegrees(Array.isArray(d) ? d : []);
      setFields(Array.isArray(f) ? f : []);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    if (!disabled) refresh();
  }, [disabled, refresh]);

  const run = async (fn) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const hasDegree = degrees.some((x) => x.degree === degreePick);
  const hasField = fields.some((x) => x.field === fieldPick);

  return (
    <div className={s.introPanel}>
      <h3 className={s.sectionLabel}>{t("interestsTitle")}</h3>
      <p className={s.introText}>
        {t("interestsIntro")}
      </p>

      <div className={styles.pickerRow}>
        <SelectField label={t("interestsDegreeLabel")} value={degreePick} onChange={setDegreePick} options={DEGREE_OPTIONS} />
        <AccentButton onClick={disabled || busy || hasDegree ? undefined : () => run(() => addInterestedDegree(degreePick))}>
          {hasDegree ? t("interestsAdded") : t("interestsAddDegree")}
        </AccentButton>
      </div>
      <div className={`${s.cardMeta} ${styles.badgeList}`}>
        {degrees.length === 0 ? <span className={s.metaBadge}>{t("interestsNoDegrees")}</span> : degrees.map((d) => (
          <span key={d.id} className={`${s.metaBadge} ${s.highlight}`}>
            {pretty(d.degree)}{" "}
            <button type="button" aria-label={t("interestsRemoveAria")} onClick={() => run(() => removeInterestedDegree(d.id))}
              className={styles.removeButton}>×</button>
          </span>
        ))}
      </div>

      <div className={`${styles.pickerRow} ${styles.pickerRowSpaced}`}>
        <SelectField label={t("interestsFieldLabel")} value={fieldPick} onChange={setFieldPick} options={FIELD_OPTIONS} />
        <AccentButton onClick={disabled || busy || hasField ? undefined : () => run(() => addInterestedField(fieldPick))}>
          {hasField ? t("interestsAdded") : t("interestsAddField")}
        </AccentButton>
      </div>
      <div className={`${s.cardMeta} ${styles.badgeList}`}>
        {fields.length === 0 ? <span className={s.metaBadge}>{t("interestsNoFields")}</span> : fields.map((f) => (
          <span key={f.id} className={`${s.metaBadge} ${s.highlight}`}>
            {pretty(f.field)}{" "}
            <button type="button" aria-label={t("interestsRemoveAria")} onClick={() => run(() => removeInterestedField(f.id))}
              className={styles.removeButton}>×</button>
          </span>
        ))}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default InterestsSection;
