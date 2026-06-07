function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "3px solid var(--border)",
        borderTop: "3px solid var(--accent)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default Spinner;