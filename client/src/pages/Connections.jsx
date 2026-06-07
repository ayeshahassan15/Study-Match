import { useEffect, useReducer } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import usePageTitle from "../hooks/usePageTitle";
import Spinner from "../components/Spinner";

const initialState = { connections: [], requests: [], notifications: [], loading: true };

function reducer(state, action) {
  switch (action.type) {
    case "LOADED": return { ...state, loading: false, ...action.payload };
    case "ACCEPT": return {
      ...state,
      requests: state.requests.filter(r => r._id !== action.id),
      connections: [...state.connections, action.user]
    };
    case "REJECT": return { ...state, requests: state.requests.filter(r => r._id !== action.id) };
    default: return state;
  }
}

function Connections() {
  usePageTitle("Connections");
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    axios.get("/api/connections", { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(res => dispatch({ type: "LOADED", payload: res.data.data }))
      .catch(() => dispatch({ type: "LOADED", payload: { connections: [], requests: [], notifications: [] } }));
  }, []);

  const handleAccept = async (fromUser) => {
    try {
      await axios.patch("/api/connections/accept", { fromUserId: fromUser._id }, { headers: { Authorization: `Bearer ${getToken()}` } });
      dispatch({ type: "ACCEPT", id: fromUser._id, user: fromUser });
      showToast(`Connected with ${fromUser.name}!`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to accept.", "error");
    }
  };

  const handleReject = async (fromUser) => {
    try {
      await axios.patch("/api/connections/reject", { fromUserId: fromUser._id }, { headers: { Authorization: `Bearer ${getToken()}` } });
      dispatch({ type: "REJECT", id: fromUser._id });
      showToast("Request rejected.");
    } catch (err) {
      showToast("Failed to reject.", "error");
    }
  };

  if (state.loading) return <Spinner />;

  return (
    <div>
      <h1>Connections</h1>
      <p style={{ marginBottom: "1.5rem" }}>Manage your study buddy connections</p>

      {/* Notifications */}
      <h2 style={{ marginBottom: "1rem" }}>Notifications ({state.notifications.filter(n => !n.read).length})</h2>
      {state.notifications.length === 0 && <p className="empty" style={{ marginBottom: "1.5rem" }}>No notifications yet.</p>}
      {state.notifications.slice().reverse().map((n, i) => (
        <div key={i} className="card" style={{ marginBottom: "0.5rem", padding: "1rem", background: n.read ? "var(--surface)" : "rgba(124,109,255,0.08)", borderColor: n.read ? "var(--border)" : "rgba(124,109,255,0.3)" }}>
          <p style={{ color: "var(--text)", fontSize: "0.9rem" }}>{n.message}</p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>{new Date(n.createdAt).toLocaleDateString()}</p>
        </div>
      ))}

      {/* Connection Requests */}
      <h2 style={{ margin: "1.5rem 0 1rem" }}>Pending Requests ({state.requests.length})</h2>
      {state.requests.length === 0 && <p className="empty" style={{ marginBottom: "1.5rem" }}>No pending requests.</p>}
      {state.requests.map(r => (
        <div key={r._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <div>
            <h3>{r.name}</h3>
            <p style={{ fontSize: "0.85rem" }}>{r.email}</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => handleAccept(r)} style={{ fontSize: "0.8rem", padding: "0.3rem 0.8rem" }}>Accept</button>
            <button onClick={() => handleReject(r)} className="delete-btn" style={{ fontSize: "0.8rem", padding: "0.3rem 0.8rem" }}>Reject</button>
          </div>
        </div>
      ))}

      {/* My Connections */}
      <h2 style={{ margin: "1.5rem 0 1rem" }}>My Connections ({state.connections.length})</h2>
      {state.connections.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <p style={{ fontSize: "3rem" }}>🤝</p>
          <p className="empty">No connections yet. Send requests from student profiles!</p>
        </div>
      )}
      {state.connections.map(c => (
        <div key={c._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <div>
            <h3>{c.name}</h3>
            <p style={{ fontSize: "0.85rem" }}>{c.email}</p>
          </div>
          <span className="tag">Connected ✓</span>
        </div>
      ))}
    </div>
  );
}

export default Connections;