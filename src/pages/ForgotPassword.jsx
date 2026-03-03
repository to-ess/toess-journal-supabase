import { useState } from "react";

import { supabase } from "../services/supabase";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateEmail()) return;

    setLoading(true);

    try {
      await supabase.auth.resetPasswordForEmail(email);
      setMessage(
        "Password reset email sent. Please check your inbox."
      );
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again later");
      } else {
        setError("Failed to send reset email. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Forgot password
        </h2>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your registered email and we’ll send you a reset link.
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">
            {error}
          </p>
        )}

        {message && (
          <p className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg text-center">
            {message}
          </p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>

        <div className="text-sm text-center mt-6 text-gray-600">
          Remembered your password?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
