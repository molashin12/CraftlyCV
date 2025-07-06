// Firebase configuration and initialization for CraftlyCV
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVWN1i5YD6dBb2ZM3Gs63k2bDCAIdvF4Q",
  authDomain: "craftlycv.firebaseapp.com",
  projectId: "craftlycv",
  storageBucket: "craftlycv.firebasestorage.app",
  messagingSenderId: "1094867505373",
  appId: "1:1094867505373:web:3b7310435f263540e80b34",
  measurementId: "G-QJ3HRSQ717"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Export the app instance
export default app;

// Collection names (following project rules)
export const COLLECTIONS = {
  users: 'users',
  applications: 'applications',
  templates: 'templates',
  analytics: 'analytics'
} as const;

// Firebase configuration object for client-side usage
export { firebaseConfig };