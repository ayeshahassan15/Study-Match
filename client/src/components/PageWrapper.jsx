function PageWrapper({ children }) {
  return (
    <div style={{ animation: "fadeUp 0.35s ease both" }}>
      {children}
    </div>
  );
}

export default PageWrapper;