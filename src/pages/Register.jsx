// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { saveUserProfile } from "../services/userService";
import { auth } from "../services/firebase";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  UserPlus 
} from "lucide-react";

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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!givenName || !familyName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < 12) {
      setError("Password must be at least 12 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!agreeTerms) {
      setError("You must agree to the terms of use");
      return false;
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
      // 1️⃣ Create user + send verification email
      await registerUser(email, password);

      // 2️⃣ Save profile in Firestore
      await saveUserProfile(auth.currentUser, {
        givenName,
        familyName,
        role: "author"
      });

      setMessage(
        "Account created successfully! Please check your email to verify your account before logging in."
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak");
      } else {
        setError(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              <UserPlus className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Account</h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Join ToESS to submit and manage your research papers
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-8 py-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Register as Author</h2>
            <p className="text-sm text-slate-600 mt-1">
              Fill in your details to create an account
            </p>
          </div>

          {/* Messages */}
          <div className="px-8 pt-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{message}</span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="px-8 pb-8 space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Given Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="John"
                    value={givenName}
                    onChange={(e) => setGivenName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Family Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Doe"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Use your institutional or professional email address
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Minimum 12 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Must be at least 12 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded"
                required
              />
              <p className="text-sm text-slate-700">
                I agree to the{" "}
                <Link to="/terms" className="text-indigo-600 hover:underline font-semibold">
                  ToESS terms of use
                </Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-indigo-600 hover:underline font-semibold">
                  privacy policy
                </Link>
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">After Registration</h3>
              <p className="text-sm text-slate-700">
                You will receive a verification email. Please verify your email address before logging in. 
                Check your spam folder if you don't see it in your inbox.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}