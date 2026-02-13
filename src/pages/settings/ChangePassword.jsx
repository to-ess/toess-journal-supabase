import { useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import { AlertCircle, CheckCircle, Lock, Eye, EyeOff, Shield, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (password.length < 10) return { strength: 2, label: "Fair", color: "bg-yellow-500" };
    if (password.length < 14) return { strength: 3, label: "Good", color: "bg-blue-500" };
    return { strength: 4, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in to change your password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setSuccess("Password updated successfully! Redirecting...");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/dashboard/author");
      }, 2000);
    } catch (err) {
      console.error(err);

      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Current password is incorrect.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Try again later.");
      } else if (err.code === "auth/requires-recent-login") {
        setError("Please log in again and retry.");
      } else {
        setError("Failed to update password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Change Password</h1>
              <p className="text-blue-100 mt-1">Update your account security credentials</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Security Recommendations</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use at least 10 characters for stronger security</li>
                <li>• Include uppercase, lowercase, numbers, and symbols</li>
                <li>• Avoid common words or personal information</li>
                <li>• Don't reuse passwords from other accounts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Password Settings</h2>
                <p className="text-sm text-slate-600">Enter your current and new password</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Alerts */}
            {error && (
              <div className="mb-6 flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleChangePassword} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Current Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  New Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600">Password strength:</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength.strength === 1 ? 'text-red-600' :
                        passwordStrength.strength === 2 ? 'text-yellow-600' :
                        passwordStrength.strength === 3 ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-2">Minimum 6 characters required</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Confirm New Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || (confirmPassword && newPassword !== confirmPassword)}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}