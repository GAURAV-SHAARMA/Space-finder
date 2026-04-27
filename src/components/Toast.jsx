import { useApp } from "../context/AppContext";
import "./Toast.css";

export default function Toast() {
  const { state, dispatch } = useApp();

  return (
    <div className="toast-container">
      {state.toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type} animate-fadeInUp`}>
          <span className="toast-icon">
            {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : toast.type === "warning" ? "⚠️" : "ℹ️"}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => dispatch({ type: "REMOVE_TOAST", payload: toast.id })}>×</button>
        </div>
      ))}
    </div>
  );
}
