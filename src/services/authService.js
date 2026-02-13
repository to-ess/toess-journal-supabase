import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Register new user
 * → sends verification email
 */
export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // Send verification email (ONLY once during registration)
  await sendEmailVerification(user);

  return user;
};

/**
 * Login user
 * → allows login ONLY if email is verified
 */
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  if (!user.emailVerified) {
    await signOut(auth);
    throw new Error("Please verify your email before logging in.");
  }

  return user;
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Listen to auth state changes
 */
export const observeAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};
