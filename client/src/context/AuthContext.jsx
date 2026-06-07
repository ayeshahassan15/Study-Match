import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const badges = JSON.parse(localStorage.getItem("badges") || "[]");
    return token ? { token, name, badges } : null;
  });

  const login = (token, name, badges = []) => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("badges", JSON.stringify(badges));
    setUser({ token, name, badges });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("badges");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
