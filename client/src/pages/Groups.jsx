import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import usePageTitle from "../hooks/usePageTitle";
import Spinner from "../components/Spinner";

const initialState = { groups: [], loading: true, error: null };

function reducer(state, action) {
  switch (action.type) {
    case "LOADED": return { loading: false, groups: action.payload, error: null };
    case "ADD": return { ...state, groups: [action.payload, ...state.groups] };
    case "UPDATE": return { ...state, groups: state.groups.map(g => g._id === action.payload._id ? action.payload : g) };
    case "DELETE": return { ...state, groups: state.groups.filter(g => g._id !== action.id) };
    case "ERROR": return { ...state, loading: false, error: action.payload };
    default: return state;
  }
}

function Groups() {
  usePageTitle("Study Groups");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [form, setForm] = useState({ name: "", subject: "" });
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState(null);

  const getToken = () => localStorage.getItem("token");
  const getMyId = () => {
    try { return JSON.parse(atob(getToken().split(".")[1])).id; } catch { return null; }
  };

  useEffect(() => {
    axios.get("/api/groups", { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(res => dispatch({ type: "LOADED", payload: res.data.data || [] }))
      .catch(() => dispatch({ type: "LOADED", payload: [] }));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim()) { setMsg({ type: "error", text: "Name and subject are required." }); return; }
    setCreating(true);
    try {
      const res = await axios.post("/api/groups", form, { headers: { Authorization: `Bearer ${getToken()}` } });
      dispatch({ type: "ADD", payload: res.data.data });
      setForm({ name: "", subject: "" });
      setShowForm(false);
      setMsg({ type: "success", text: "Study group created!" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to create group." });
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (id) => {
    try {
      const res = await axios.patch(`/api/groups?id=${id}`, {}, { headers: { Authorization: `Bearer ${getToken()}` } });
      dispatch({ type: "UPDATE", payload: res.data.data });
      setMsg({ type: "success", text: "Joined group!" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to join." });
    }
  };

  const handleLeaveOrDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/groups?id=${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      dispatch({ type: "DELETE", id });
      setMsg({ type: "success", text: "Done!" });
    } catch (err) {
      setMsg({ type: "error", text: "Failed." });
    }
  };

  const myId = getMyId();

  return (
    <div>
      <h1>Study Groups</h1>
      <p style={{ marginBottom: "1.5rem" }}>Join or create study groups based on subjects.</p>

      {msg && <p className={msg.type} style={{ marginBottom: "1rem" }}>{msg.text}</p>}

      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: "1.5rem" }}>
        {showForm ? "Cancel" : "+ Create Group"}
      </button>

      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Group Name</label>
              <input type="text" placeholder="e.g. DSA Study Squad" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input type="text" placeholder="e.g. Mathematics" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            </div>
            <button type="submit" disabled={creating}>{creating ? "Creating..." : "Create Group"}</button>
          </form>
        </div>
      )}

      {state.loading && <Spinner />}

      {!state.loading && state.groups.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <p className="empty">No study groups yet. Create the first one!</p>
        </div>
      )}

      {state.groups.map(group => {
        const isMember = group.members && group.members.includes(myId);
        const isCreator = group.createdBy && (group.createdBy === myId || group.createdBy.toString() === myId);
        return (
          <div key={group._id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: "0.3rem" }}>{group.name}</h3>
                <span className="tag" style={{ marginBottom: "0.5rem", display: "inline-block" }}>{group.subject}</span>
                <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  {group.members ? group.members.length : 0} member{group.members?.length !== 1 ? "s" : ""}: {group.memberNames ? group.memberNames.join(", ") : ""}
                </p>
                {isCreator && <span className="tag time" style={{ marginTop: "0.3rem", display: "inline-block" }}>Creator</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginLeft: "1rem" }}>
                {!isMember && <button onClick={() => handleJoin(group._id)} style={{ fontSize: "0.78rem", padding: "0.3rem 0.7rem" }}>Join</button>}
                {isMember && (
                  <button onClick={() => handleLeaveOrDelete(group._id)} className="delete-btn" style={{ fontSize: "0.78rem", padding: "0.3rem 0.7rem" }}>
                    {isCreator ? "Delete" : "Leave"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Groups;
