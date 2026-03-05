import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { saveUserProfile } from "../services/userService";
import { sendWelcomeEmail } from "../services/emailService";

const ADMIN_EMAIL = "kmkrphd@gmail.com";

function ToessLoader({ status }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 px-10 py-12 flex flex-col items-center max-w-sm w-full mx-4">
        {/* Animated rings */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
          <div
            className="absolute inset-3 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"
            style={{ animationDuration: "0.8s", animationDirection: "reverse" }}
          />
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-bold tracking-tight">
              T
            </span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-1">TOESS</h2>
        <p className="text-xs text-slate-400 mb-6 text-center">
          Transactions on Evolutionary Smart Systems
        </p>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-slate-500 text-sm font-medium">{status}</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const handled = useRef(false);
  const [status, setStatus] = useState("Verifying your account...");

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const user = data?.session?.user;
        if (!user) {
          navigate("/login?error=no_session", { replace: true });
          return;
        }

        setStatus("Setting up your profile...");

        const isGoogleUser = user.app_metadata?.provider === "google";

        if (isGoogleUser) {
          // ✅ Check if new user using created_at timestamp
          // New user = account created within last 30 seconds
          const createdAt = new Date(user.created_at).getTime();
          const isNewUser = Date.now() - createdAt < 30000;
          console.log(
            "🔍 Google user — isNewUser:",
            isNewUser,
            "| created_at:",
            user.created_at,
          );

          // ✅ Save/update profile
          try {
            await saveUserProfile(user, {
              givenName:
                user.user_metadata?.given_name ||
                user.user_metadata?.full_name?.split(" ")[0] ||
                "",
              familyName:
                user.user_metadata?.family_name ||
                user.user_metadata?.full_name?.split(" ").slice(1).join(" ") ||
                "",
              role: user.email === ADMIN_EMAIL ? "admin" : "author",
            });
          } catch (profileError) {
            console.warn(
              "⚠️ Profile save failed (non-blocking):",
              profileError.message,
            );
          }

          // ✅ Send welcome email only for new users
          if (isNewUser) {
            setStatus("Sending welcome email...");
            console.log("📧 Sending welcome email to:", user.email);
            try {
              const result = await sendWelcomeEmail({
                email: user.email,
                name:
                  user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  user.email,
              });
              console.log("✅ Welcome email result:", result);
            } catch (emailError) {
              console.warn("⚠️ Welcome email failed:", emailError.message);
            }
          } else {
            console.log("ℹ️ Returning user — skipping welcome email");
          }
        }

        setStatus("Redirecting...");

        if (user.email === ADMIN_EMAIL) {
          navigate("/dashboard/admin", { replace: true });
          return;
        }

        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        const role = profile?.role || "author";

        if (role === "reviewer") {
          navigate("/dashboard/reviewer", { replace: true });
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

  return <ToessLoader status={status} />;
}
