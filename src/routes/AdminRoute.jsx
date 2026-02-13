import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { getUserRole } from "../services/userService";

export default function AdminRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        setAllowed(false);
        return;
      }

      const role = await getUserRole(user.uid);
      setAllowed(role === "admin");
    };

    checkRole();
  }, []);

  if (allowed === null) {
    return <div className="p-10">Checking permissions...</div>;
  }

  if (!allowed) {
    return <Navigate to="/dashboard/author" replace />;
  }

  return children;
}
