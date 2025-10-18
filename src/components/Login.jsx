import React, { useState } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";

const Login = ({ openSignUp, onClose, loginType = 'user' }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      if (onClose) onClose();
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {loginType === 'admin' ? 'Admin Login' : 'User Login'}
      </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember Me
            </label>
            <a href="#" className="text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={openSignUp}
                className="text-blue-500 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
    </div>
  );
};

export default Login;
