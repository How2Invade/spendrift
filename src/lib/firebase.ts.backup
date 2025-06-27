import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLXu60Ep22ElAX5VFpFwoLkApfJGPCtQk",
  authDomain: "spendrift.firebaseapp.com",
  projectId: "spendrift",
  storageBucket: "spendrift.firebasestorage.app",
  messagingSenderId: "218606426646",
  appId: "1:218606426646:web:944bd2223e9ecd25b03337"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
