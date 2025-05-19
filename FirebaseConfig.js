// firebaseConfig.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ─── Your Firebase config ────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:           "AIzaSyAhLoz36GqfZghvNAFOrMrDJUiBi3MRlG4",
  authDomain:       "lingualens-21c01.firebaseapp.com",
  projectId:        "lingualens-21c01",
  storageBucket:    "lingualens-21c01.appspot.com",
  messagingSenderId: "414667820478",
  appId:             "1:414667820478:web:c89cbe9f0c5ac53c97fdef",
};
// ──────────────────────────────────────────────────────────────────────────

// Ensure the Firebase *App* is only ever initialized once
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Now guard *Auth* initialization.
// If an Auth instance already exists, `getAuth(app)` will return it.
// Otherwise call `initializeAuth`.
let auth;
try {
  // This will throw if Auth hasn’t been initialized
  auth = getAuth(app);
} catch {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Export Firestore & Storage (these are idempotent)
export const db      = getFirestore(app);
export const storage = getStorage(app);

// Optional: a users collection reference
export const usersRef = collection(db, "users");

export { auth };
