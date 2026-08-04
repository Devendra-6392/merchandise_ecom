"use client";

import { createContext, useContext, useState, useEffect } from "react";

const API_BASE_URL = "https://turf.localhostt.live/api/v1";

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  clearError: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verify session via HttpOnly Cookie on mount
    verifySession();
  }, []);

  const verifySession = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      }
    } catch (err) {
      console.warn("Session verification check offline/unauthorized:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password.");
      }

      setUser(data.user);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (err) {
      console.warn("Login API notice:", err.message);

      // Fallback in-memory session for offline development
      if (err.name === "TypeError" || err.message.includes("Failed to fetch")) {
        const mockUser = {
          _id: "usr_" + Date.now(),
          name: email.split("@")[0].toUpperCase(),
          email: email,
          role: "customer",
          phone: "+1 (555) 019-2834",
          address: "123 Atelier Way, Fashion District",
        };

        setUser(mockUser);
        setLoading(false);
        return { success: true, user: mockUser };
      }

      setError(err.message || "An unexpected login error occurred.");
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const signup = async (name, email, password) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password, role: "customer" }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed. Email may already be in use.");
      }

      setUser(data.user);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (err) {
      console.warn("Signup API notice:", err.message);

      // Fallback in-memory session for offline development
      if (err.name === "TypeError" || err.message.includes("Failed to fetch")) {
        const mockUser = {
          _id: "usr_" + Date.now(),
          name: name,
          email: email,
          role: "customer",
          phone: "",
          address: "",
        };

        setUser(mockUser);
        setLoading(false);
        return { success: true, user: mockUser };
      }

      setError(err.message || "An unexpected registration error occurred.");
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Logout request notice:", err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        clearError,
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
