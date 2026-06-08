import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Students from "./pages/Students";
import Match from "./pages/Match";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EditStudent from "./pages/EditStudent";
import StudentDetail from "./pages/StudentDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Connections from "./pages/Connections";
import EditAccount from './pages/EditAccount';
import Groups from "./pages/Groups";
import "./App.css";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditStudent /></ProtectedRoute>} />
          <Route path="/student/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
          <Route path="/edit-account" element={<ProtectedRoute><EditAccount /></ProtectedRoute>} />
          <Route path="/match" element={<ProtectedRoute><Match /></ProtectedRoute>} />
          <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


