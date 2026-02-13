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
  });

  return role;
};

/**
 * Get user role
 */
export const getUserRole = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().role : null;
};
