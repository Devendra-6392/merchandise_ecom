import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("merch_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("merch_token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user details from backend if token exists
  useEffect(() => {
    async function verifyAuth() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://turf.localhostt.live/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem("merch_user", JSON.stringify(data.user));
        } else {
          // Token invalid or expired
          logout();
        }
      } catch (err) {
        console.error("Auth verification error:", err);
      } finally {
        setLoading(false);
      }
    }

    verifyAuth();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await fetch(`https://turf.localhostt.live/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials");
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("merch_token", data.token);
      localStorage.setItem("merch_user", JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Register / Signup handler
  const signup = async (userData) => {
    setError(null);
    try {
      const res = await fetch(`https://turf.localhostt.live/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("merch_token", data.token);
      localStorage.setItem("merch_user", JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem("merch_token");
    localStorage.removeItem("merch_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        setError,
        login,
        signup,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
