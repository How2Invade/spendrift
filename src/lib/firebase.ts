// =========================================================================
//  ACTION REQUIRED: CONFIGURE FIREBASE
// =========================================================================
// This file contains placeholder Firebase configuration. To make your app
// work, you need to replace these placeholders with your actual Firebase
// project's credentials. The error "auth/api-key-not-valid" is happening
// because these values are currently placeholders.
//
// How to get your credentials:
// 1. Go to the Firebase Console: https://console.firebase.google.com/
// 2. If you don't have a project, create a new one.
// 3. In your project, go to Project Settings (click the gear icon ⚙️).
// 4. In the "General" tab, scroll down to "Your apps".
// 5. If you haven't set up a web app, click the "</>" icon to add one.
// 6. Find the `firebaseConfig` object and copy its values here.
// =========================================================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration - REPLACE THESE VALUES!
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
