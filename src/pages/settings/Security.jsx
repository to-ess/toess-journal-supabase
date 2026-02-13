import { auth } from "../../services/firebase";
import { Shield, Key, AlertTriangle } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";

export default function Security() {
  const user = auth.currentUser;

  const handleResetPassword = async () => {
    await sendPasswordResetEmail(auth, user.email);
    alert("Password reset email sent.");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white border rounded-xl p-6">

        <h1 className="text-2xl font-bold mb-2">Security</h1>
        <p className="text-sm text-gray-600 mb-6">
          Manage your account security and authentication
        </p>

        {/* Account Info */}
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold">Account Status</span>
          </div>
          <p className="text-sm text-gray-700">
            Email verified:{" "}
            <span className="font-semibold">
              {user?.emailVerified ? "Yes" : "No"}
            </span>
          </p>
          <p className="text-sm text-gray-700 mt-1">
            Provider: <span className="font-semibold">Password</span>
          </p>
        </div>

        {/* Password */}
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold">Password</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            For security reasons, password changes require email verification.
          </p>
          <button
            onClick={handleResetPassword}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
          >
            Send Password Reset Email
          </button>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-700">
            If you notice suspicious activity, reset your password immediately
            and contact the editorial team.
          </p>
        </div>

      </div>
    </div>
  );
}
