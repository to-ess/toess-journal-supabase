import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const ADMIN_EMAIL = "kmkrphd@gmail.com";

/**
 * Save user profile with role
 */
export const saveUserProfile = async (user) => {
  const role = user.email === ADMIN_EMAIL ? "admin" : "author";

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role,
    createdAt: new Date(),
  }, { merge: true }); // ✅ merge so it doesn't overwrite reviewer role

  return role;
};

/**
 * Get user role — falls back to email check if Firestore doc missing
 */
export const getUserRole = async (uid) => {
  try {
    const snap = await getDoc(doc(db, "users", uid));

    if (snap.exists()) {
      return snap.data().role;
    }

    // ✅ Doc missing (e.g. DB was wiped) — recreate it based on email
    const { auth } = await import("./firebase");
    const user = auth.currentUser;
    if (user) {
      const role = user.email === ADMIN_EMAIL ? "admin" : "author";
      await setDoc(doc(db, "users", uid), {
        email: user.email,
        role,
        createdAt: new Date(),
      });
      return role;
    }

    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    // ✅ Last resort — check email directly
    const { auth } = await import("./firebase");
    const user = auth.currentUser;
    if (user?.email === ADMIN_EMAIL) return "admin";
    return "author";
  }
};