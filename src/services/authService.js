import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Register new user with email/password
 * → sends verification email
 */
export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await sendEmailVerification(user);
  return user;
};

/**
 * Login user with email/password
 * → allows login ONLY if email is verified
 */
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  if (!user.emailVerified) {
    await signOut(auth);
    throw new Error("Please verify your email before logging in.");
  }
  return user;
};

/**
 * Google Sign-In (login + register both use this)
 * Google accounts are pre-verified — no email verification needed
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
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