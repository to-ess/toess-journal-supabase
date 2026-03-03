import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, signInWithGoogle } from "../services/authService";
import { saveUserProfile } from "../services/userService";
import { supabase } from "../services/supabase";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, UserPlus } from "lucide-react";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isDisabled = loading || googleLoading;

  const validate = () => {
    if (!givenName || !familyName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields"); return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address"); return false;
    }
    if (password.length < 12) {
      setError("Password must be at least 12 characters"); return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match"); return false;
    }
    if (!agreeTerms) {
      setError("You must agree to the terms of use"); return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const user = await registerUser(email, password);
      await saveUserProfile(user, { givenName, familyName, role: "author" });
      setMessage("Account created! Please check your email to verify your account before logging in.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      if (err.message?.includes("already registered")) setError("An account with this email already exists");
      else if (err.message?.includes("weak")) setError("Password is too weak");
      else setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Google sign-up: just trigger the redirect — AuthCallback handles the rest
  const handleGoogleRegister = async () => {
    if (!agreeTerms) {
      setError("You must agree to the terms of use before continuing");
      return;
    }
    setGoogleLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      // Browser redirects to Google — execution stops here
    } catch (err) {
      setError("Google sign-up failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex justify-center mb-4">
            <UserPlus className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Account</h1>
          <p className="text-lg text-blue-100">Join ToESS to submit and manage your research papers</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Form header */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-8 py-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Register as Author</h2>
            <p className="text-sm text-slate-600 mt-1">Fill in your details or sign up with Google</p>
          </div>

          {/* Alerts */}
          <div className="px-8 pt-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            {message && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{message}</span>
              </div>
            )}
          </div>

          <div className="px-8 pb-8 space-y-6">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isDisabled}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : <GoogleIcon />}
              {googleLoading ? "Redirecting to Google..." : "Sign up with Google"}
            </button>

            <p className="text-xs text-slate-500 text-center -mt-3">
              By signing up with Google you agree to our{" "}
              <Link to="/terms-of-service" className="text-indigo-600 hover:underline">terms</Link> &{" "}
              <Link to="/privacy-policy" className="text-indigo-600 hover:underline">privacy policy</Link>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR REGISTER WITH EMAIL</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Email form */}
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Given Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" required placeholder="John"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                      disabled={isDisabled} value={givenName} onChange={e => setGivenName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Family Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" required placeholder="Doe"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                      disabled={isDisabled} value={familyName} onChange={e => setFamilyName(e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="email" required placeholder="john.doe@example.com"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                    disabled={isDisabled} value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <p className="mt-1.5 text-xs text-slate-500">Use your institutional or professional email</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type={showPassword ? "text" : "password"} required placeholder="Minimum 12 characters"
                    className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                    disabled={isDisabled} value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">Must be at least 12 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type={showConfirmPassword ? "text" : "password"} required placeholder="Re-enter your password"
                    className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                    disabled={isDisabled} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded" required />
                <p className="text-sm text-slate-700">
                  I agree to the{" "}
                  <Link to="/terms-of-service" className="text-indigo-600 hover:underline font-semibold">terms of use</Link>
                  {" "}and{" "}
                  <Link to="/privacy-policy" className="text-indigo-600 hover:underline font-semibold">privacy policy</Link>
                </p>
              </div>

              <button type="submit" disabled={isDisabled}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : "Create Account"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline font-semibold">Login here</Link>
          </p>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">After Registration</h3>
              <p className="text-sm text-slate-700">
                If registering with email, verify your email before logging in. Google sign-up is instant — no verification needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}