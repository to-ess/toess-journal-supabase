import { useState } from "react";
import { loginUser, signInWithGoogle } from "../services/authService";
import { getUserRole } from "../services/userService";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ROUTES = {
  ADMIN_DASHBOARD: "/dashboard/admin",
  AUTHOR_DASHBOARD: "/dashboard/author",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password"
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const ERROR_MESSAGES = {
  no_session: "Sign-in failed. Please try again.",
  oauth_failed: "Google sign-in failed. Please try again.",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Show error from OAuth callback redirect if present
  const callbackError = searchParams.get("error");
  const displayError = error || (callbackError ? ERROR_MESSAGES[callbackError] ?? "Sign-in failed. Please try again." : "");

  const handleEmailChange = (e) => { setEmail(e.target.value); if (error) setError(""); };
  const handlePasswordChange = (e) => { setPassword(e.target.value); if (error) setError(""); };

  const redirectByRole = async (user) => {
    const role = await getUserRole(user.id);
    navigate(role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.AUTHOR_DASHBOARD, { replace: true });
  };

  const validateInputs = () => {
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields"); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address"); return false; }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    setLoading(true);
    setError("");
    try {
      const user = await loginUser(email, password);
      await redirectByRole(user);
    } catch (err) {
      if (err.message?.includes("Invalid login credentials")) setError("Invalid email or password");
      else if (err.message?.includes("Email not confirmed")) setError("Please verify your email before logging in");
      else if (err.message?.includes("Too many requests")) setError("Too many attempts. Please try again later");
      else setError(err.message || "Login failed. Please try again");
    } finally {
      setLoading(false);
    }
  };

  // Google login just triggers the redirect — no async result to handle here
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      // Browser will redirect to Google — execution stops here
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const isDisabled = loading || googleLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to ToESS</h2>

        {displayError && (
          <p id="error-message" role="alert"
            className="mb-4 text-sm text-center text-red-600 bg-red-50 p-3 rounded-lg">
            {displayError}
          </p>
        )}

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isDisabled}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {googleLoading ? (
            <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : <GoogleIcon />}
          {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <fieldset disabled={isDisabled} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email" type="email" required placeholder="Email address"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                value={email} onChange={handleEmailChange}
                aria-describedby={displayError ? "error-message" : undefined}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  id="password" type={showPassword ? "text" : "password"} required placeholder="Password"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                  value={password} onChange={handlePasswordChange}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm font-medium"
                  tabIndex={-1}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={isDisabled}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in...
                </span>
              ) : "Login"}
            </button>
          </fieldset>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          New user?{" "}
          <Link to={ROUTES.REGISTER} className="text-indigo-600 hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}