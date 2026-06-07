import usePageTitle from "../hooks/usePageTitle";
import PageWrapper from "../components/PageWrapper";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

function NotFound() {
  usePageTitle("404 Not Found");
  return (
    <PageWrapper>
      <div style={{ textAlign: "center", padding: "5rem 0" }}>
      <p style={{ fontSize: "5rem" }}>404</p>
      <h1 style={{ marginBottom: "1rem" }}>Page Not Found</h1>
      <p style={{ marginBottom: "2rem" }}>The page you are looking for does not exist.</p>
      <Link to="/"><button>Go Home</button></Link>
    </div>
    </PageWrapper>
  );
}
export default NotFound;



