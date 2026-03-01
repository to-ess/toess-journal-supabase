import { Navigate } from "react-router-dom";
import { auth } from "../services/firebase";

const ADMIN_EMAIL = "kmkrphd@gmail.com";

export default function AdminRoute({ children }) {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Check email directly — same logic as Firestore rules
  // No Firestore lookup needed, so wiping the DB won't break admin access
  if (user.email !== ADMIN_EMAIL) {
    return <Navigate to="/dashboard/author" replace />;
  }

  return children;
}