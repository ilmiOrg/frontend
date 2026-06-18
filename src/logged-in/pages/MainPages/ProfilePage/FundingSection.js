import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import { getFunding, addFundingSource, deleteFundingSource } from "../../../../api/funding";
import styles from "./fundingStyle.module.css";

/**
 * Itemized budget: funding sources whose sum becomes the student's max budget
 * (used by affordability matching). Replaces guessing a single number.
 */
const FundingSection = ({ disabled, onTotalChange }) => {
  const { t } = useTranslation();
  const [sources, setSources] = useState([]);
  const [total, setTotal] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const apply = useCallback(
    (data) => {
      setSources(data.sources || []);
      setTotal(data.totalBudget || 0);
      setCurrency(data.currency || "USD");
      if (onTotalChange) onTotalChange(data.totalBudget || 0);
    },
    [onTotalChange]
  );

  const load = useCallback(async () => {
    try {
      apply(await getFunding());
    } catch (e) {
      setError(e.message);
    }
  }, [apply]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    const amt = Number(amount);
    if (!label.trim() || !(amt >= 0)) return;
    setBusy(true);
    setError(null);
    try {
      apply(await addFundingSource({ label: label.trim(), amount: amt, currency: "USD" }));
      setLabel("");
      setAmount("");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    setBusy(true);
    try {
      apply(await deleteFundingSource(id));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.head}>
        <h3 className={styles.title}>{t("fundingTitle")}</h3>
        <span className={styles.total}>
          {t("fundingTotalLabel")}: {Number(total).toLocaleString()} {currency}{t("fundingPerYear")}
        </span>
      </div>
      <p className={styles.hint}>
        {t("fundingHint")}
      </p>
      {error ? <p className={styles.error}>{error}</p> : null}

      {sources.length > 0 ? (
        <ul className={styles.list}>
          {sources.map((srcItem) => (
            <li key={srcItem.id} className={styles.item}>
              <span className={styles.itemLabel}>{srcItem.label}</span>
              <span className={styles.itemAmount}>
                {Number(srcItem.amount).toLocaleString()} {srcItem.currency}
              </span>
              <button
                type="button"
                className={styles.remove}
                aria-label={t("fundingRemoveAria").replace("{label}", srcItem.label)}
                disabled={disabled || busy}
                onClick={() => remove(srcItem.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className={styles.addRow}>
        <input
          className={styles.input}
          placeholder={t("fundingSourcePlaceholder")}
          aria-label={t("fundingSourceAria")}
          value={label}
          disabled={disabled || busy}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          className={styles.amount}
          type="number"
          min="0"
          placeholder={t("fundingAmountPlaceholder")}
          aria-label={t("fundingAmountAria")}
          value={amount}
          disabled={disabled || busy}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button
          type="button"
          className={styles.addBtn}
          disabled={disabled || busy || !label.trim() || amount === ""}
          onClick={add}
        >
          {t("fundingAdd")}
        </button>
      </div>
    </div>
  );
};

export default FundingSection;
