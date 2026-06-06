import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: "0.8rem 1.2rem",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "white",
            background: t.type === "success" ? "#4ade80" : t.type === "error" ? "#ff6b6b" : "#7c6dff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            animation: "fadeUp 0.3s ease",
            minWidth: "220px",
            maxWidth: "320px"
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}