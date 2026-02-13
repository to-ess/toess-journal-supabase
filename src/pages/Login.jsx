import { useState } from "react";
import { loginUser } from "../services/authService";
import { getUserRole } from "../services/userService";
import { Link, useNavigate } from "react-router-dom";

// Constants
const ROUTES = {
  ADMIN_DASHBOARD: "/dashboard/admin",
  AUTHOR_DASHBOARD: "/dashboard/author",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password"
};

const ROLES = {
  ADMIN: "admin",
  AUTHOR: "author"
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(""); // Clear error when user starts typing
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const validateInputs = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1️⃣ Login (email must be verified)
      const user = await loginUser(email, password);

      // 2️⃣ Get role from Firestore
      const role = await getUserRole(user.uid);

      // 3️⃣ Redirect based on role
      if (role === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        navigate(ROUTES.AUTHOR_DASHBOARD);
      }
    } catch (err) {
      // Provide user-friendly error messages
      if (err.code === 'auth/user-not-found') {
        setError("No account found with this email");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later");
      } else if (err.code === 'auth/user-disabled') {
        setError("This account has been disabled");
      } else if (err.code === 'auth/invalid-email') {
        setError("Invalid email address");
      } else if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password");
      } else {
        setError(err.message || "Login failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to ToESS
        </h2>

        {error && (
          <p 
            id="error-message" 
            role="alert" 
            className="mb-4 text-sm text-center text-red-600 bg-red-50 p-3 rounded-lg"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <fieldset disabled={loading} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Email address"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                value={email}
                onChange={handleEmailChange}
                aria-describedby={error ? "error-message" : undefined}
                aria-invalid={error ? "true" : "false"}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                  value={password}
                  onChange={handlePasswordChange}
                  aria-describedby={error ? "error-message" : undefined}
                  aria-invalid={error ? "true" : "false"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm font-medium"
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link 
                to={ROUTES.FORGOT_PASSWORD} 
                className="text-sm text-indigo-600 hover:underline"
                tabIndex={loading ? -1 : 0}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg 
                    className="animate-spin h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </fieldset>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          New user?{" "}
          <Link 
            to={ROUTES.REGISTER} 
            className="text-indigo-600 hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}