import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const ADMIN_EMAIL = "kmkrphd@gmail.com";

export default function AdminRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
  }, []);

  // Still checking auth — show nothing
  if (user === undefined) return null;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but not admin
  if (user.email !== ADMIN_EMAIL) return <Navigate to="/dashboard/author" replace />;

  return children;
}