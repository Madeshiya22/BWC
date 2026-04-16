import { useState, useCallback } from "react";

let toastId = 0;

const toasts = [];
const listeners = new Set();

function notify() { listeners.forEach((fn) => fn([...toasts])); }

export function addToast(message, type = "info") {
  const id = ++toastId;
  toasts.push({ id, message, type });
  notify();
  setTimeout(() => {
    const i = toasts.findIndex((t) => t.id === id);
    if (i !== -1) { toasts.splice(i, 1); notify(); }
  }, 3500);
}

export function ToastContainer() {
  const [list, setList] = useState([]);

  // subscribe
  useState(() => {
    const fn = (arr) => setList(arr);
    listeners.add(fn);
    return () => listeners.delete(fn);
  });

  return (
    <div className="toast-container">
      {list.map((t) => (
        <div key={t.id} className={`toast ${t.type === "error" ? "error" : ""}`}>
          <span style={{ color: t.type === "error" ? "var(--error)" : "var(--primary)" }}>
            {t.type === "error" ? "✕" : "✓"}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
