import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const ADMIN_EMAIL = "kmkrphd@gmail.com";

/**
 * Industry standard Supabase OAuth callback handler.
 *
 * After Google redirects back to /auth/callback, Supabase has already
 * written the session tokens to localStorage via the URL hash/code.
 * We just need to read the session and redirect the user.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const handleCallback = async () => {
      try {
        // getSession() triggers Supabase to parse the URL and exchange
        // the auth code for a session automatically
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        const user = data?.session?.user;

        if (!user) {
          // No session — something went wrong
          navigate("/login?error=no_session", { replace: true });
          return;
        }

        // Redirect based on role
        if (user.email === ADMIN_EMAIL) {
          navigate("/dashboard/admin", { replace: true });
        } else {
          navigate("/dashboard/author", { replace: true });
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        navigate("/login?error=oauth_failed", { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <svg
        className="animate-spin h-10 w-10 text-indigo-600 mb-4"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="text-gray-700 font-medium text-lg">Completing sign-in...</p>
      <p className="text-gray-400 text-sm mt-1">You'll be redirected shortly.</p>
    </div>
  );
}