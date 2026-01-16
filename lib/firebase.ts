import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCSt-YeC7coH123gXzsw9Y1ZDB4QU8qxNE",
  authDomain: "imosuite-es-9fa22.firebaseapp.com",
  projectId: "imosuite-es-9fa22",
  storageBucket: "imosuite-es-9fa22.firebasestorage.app",
  messagingSenderId: "912741473554",
  appId: "1:912741473554:web:092e0c43e8907bda1da7cb",
  measurementId: "G-LMFKH92GTR"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;