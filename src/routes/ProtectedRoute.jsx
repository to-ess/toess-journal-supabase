import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
  }, []);

  // Still checking auth — show nothing (or a spinner)
  if (user === undefined) return null;

  // Not logged in — redirect to login
  if (!user) return <Navigate to="/login" replace />;

  return children;
}