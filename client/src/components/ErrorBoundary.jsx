import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <p style={{ fontSize: "3rem" }}>💥</p>
          <h1 style={{ marginBottom: "1rem" }}>Something went wrong</h1>
          <p style={{ marginBottom: "2rem" }}>An unexpected error occurred.</p>
          <button onClick={() => window.location.href = "/"}>Go Home</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;