import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const tokenKey = "token";
  const userKey = "user";

  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem(tokenKey);
      const userData = localStorage.getItem(userKey);
      const parsedUser = token && userData ? JSON.parse(userData) : null;
      return parsedUser
        ? {
            ...parsedUser,
            isAdmin: parsedUser.role === "admin",
          }
        : null;
    } catch (err) {
      console.error("Failed to parse user data from localStorage", err);
      return null;
    }
  });

  // Automatically set Authorization header for future axios requests
  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      if (!data.token || !data.user) {
        throw new Error(
          "Registration failed: token or user missing from response"
        );
      }

      const userData = {
        ...data.user,
        isAdmin: data.user.role === "admin",
      };

      localStorage.setItem(tokenKey, data.token);
      localStorage.setItem(userKey, JSON.stringify(userData));

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(userData);
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });

      if (!data.token || !data.user) {
        throw new Error("Login failed: token or user missing from response");
      }

      const userData = {
        ...data.user,
        isAdmin: data.user.role === "admin",
      };

      localStorage.setItem(tokenKey, data.token);
      localStorage.setItem(userKey, JSON.stringify(userData));

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(userData);
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
