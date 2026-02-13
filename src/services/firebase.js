import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

/* ===============================
   FIREBASE CONFIG
================================ */

const firebaseConfig = {
  apiKey: "AIzaSyAVyhACFAaZZ8Hemedcgq_EmLzq9ydM-Nc",
  authDomain: "toess-5b213.firebaseapp.com",
  projectId: "toess-5b213",
  storageBucket: "toess-5b213.firebasestorage.app",
  messagingSenderId: "1058323657280",
  appId: "1:1058323657280:web:50604d4a089ee1205225a5"
};

/* ===============================
   INITIALIZE APP
================================ */

const app = initializeApp(firebaseConfig);

/* ===============================
   EXPORT SERVICES
================================ */

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

/* ⭐ REQUIRED FOR CLOUD FUNCTIONS ⭐ */
export const functions = getFunctions(app);
