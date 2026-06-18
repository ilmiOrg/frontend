import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "../../../../hooks/useLanguage";
import {
  getApplicationTasks,
  addApplicationTask,
  updateApplicationTask,
  deleteApplicationTask,
} from "../../../../api/applications";
import m from "./style.module.css";

/** Per-application checklist: toggle/add/remove tasks with a progress bar. */
const ChecklistSection = ({ applicationId }) => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getApplicationTasks(applicationId);
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (task) => {
    setError(null);
    setTasks((rows) => rows.map((r) => (r.taskId === task.taskId ? { ...r, done: !r.done } : r)));
    try {
      await updateApplicationTask(applicationId, task.taskId, { done: !task.done });
    } catch (e) {
      setError(e.message);
      load(); // revert to server truth
    }
  };

  const add = async () => {
    const title = newTitle.trim();
    if (!title) return;
    setBusy(true);
    setError(null);
    try {
      const created = await addApplicationTask(applicationId, title);
      setTasks((rows) => [...rows, created]);
      setNewTitle("");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (taskId) => {
    try {
      await deleteApplicationTask(applicationId, taskId);
      setTasks((rows) => rows.filter((r) => r.taskId !== taskId));
    } catch (e) {
      setError(e.message);
    }
  };

  const done = tasks.filter((task) => task.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  if (loading) return <p className={m.checklistLoading}>{t("checklistLoading")}</p>;

  return (
    <div className={m.checklist}>
      <div className={m.checklistHead}>
        <span className={m.checklistProgressLabel}>
          {t("checklistDone").replace("{done}", done).replace("{total}", tasks.length)}
        </span>
        <div className={m.checklistBar}>
          <div className={m.checklistFill} style={{ "--fill": `${pct}%` }} />
        </div>
      </div>
      {error ? <p className={m.error}>{error}</p> : null}
      <ul className={m.taskList}>
        {tasks.map((task) => (
          <li key={task.taskId} className={m.taskItem}>
            <label className={m.taskLabel} htmlFor={`task-${task.taskId}`}>
              <input id={`task-${task.taskId}`} type="checkbox" checked={task.done} onChange={() => toggle(task)} />
              <span className={task.done ? m.taskDone : ""}>{task.title}</span>
            </label>
            <button
              type="button"
              className={m.taskRemove}
              aria-label={t("checklistRemoveTask").replace("{title}", task.title)}
              onClick={() => remove(task.taskId)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className={m.taskAddRow}>
        <input
          className={m.taskAddInput}
          placeholder={t("checklistAddPlaceholder")}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button type="button" className={m.taskAddBtn} disabled={busy || !newTitle.trim()} onClick={add}>
          {t("checklistAdd")}
        </button>
      </div>
    </div>
  );
};

export default ChecklistSection;
