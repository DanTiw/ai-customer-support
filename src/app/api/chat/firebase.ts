// Import the functions you need from the SDKs you need
"use client"
import firebase from 'firebase/app';
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics"; // Corrected import
import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXuIKG51Iwmm3JcJvr54Un0TA_mBS3rgE",
  authDomain: "chat-assitant.firebaseapp.com",
  projectId: "chat-assitant",
  storageBucket: "chat-assitant.appspot.com",
  messagingSenderId: "101758648692",
  appId: "1:101758648692:web:bbf225efb3f0d0464d6c21",
  measurementId: "G-P0YEY296MY"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);
// Initialize Firebase Auth
const auth = getAuth(app);

export const initFirebase = () => {
  if (typeof window !== 'undefined' && !getApps().length) {
    const app = initializeApp(firebaseConfig);
    return getFirestore(app);
  }
};

export const getFirebaseApp = () => {
  if (typeof window !== 'undefined') {
    return getApps()[0];
  }
  return null;
};
export { db, auth };