import React, { useCallback, useEffect, useState } from "react";
import {
  getApplicationTasks,
  addApplicationTask,
  updateApplicationTask,
  deleteApplicationTask,
} from "../../../../api/applications";
import m from "./style.module.css";

/** Per-application checklist: toggle/add/remove tasks with a progress bar. */
const ChecklistSection = ({ applicationId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
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

  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  if (loading) return <p className={m.checklistLoading}>Loading checklist…</p>;

  return (
    <div className={m.checklist}>
      <div className={m.checklistHead}>
        <span className={m.checklistProgressLabel}>
          {done}/{tasks.length} done
        </span>
        <div className={m.checklistBar}>
          <div className={m.checklistFill} style={{ width: `${pct}%` }} />
        </div>
      </div>
      {error ? <p className={m.error}>{error}</p> : null}
      <ul className={m.taskList}>
        {tasks.map((t) => (
          <li key={t.taskId} className={m.taskItem}>
            <label className={m.taskLabel}>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t)} />
              <span className={t.done ? m.taskDone : ""}>{t.title}</span>
            </label>
            <button
              type="button"
              className={m.taskRemove}
              aria-label={`Remove task: ${t.title}`}
              onClick={() => remove(t.taskId)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className={m.taskAddRow}>
        <input
          className={m.taskAddInput}
          placeholder="Add a task…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button type="button" className={m.taskAddBtn} disabled={busy || !newTitle.trim()} onClick={add}>
          Add
        </button>
      </div>
    </div>
  );
};

export default ChecklistSection;
