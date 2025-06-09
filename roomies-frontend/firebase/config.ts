// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWW5RTBkvBIjAAWgJ1wF0_qhDLuLN1r6M",
  authDomain: "roomies-app-32362.firebaseapp.com",
  projectId: "roomies-app-32362",
  storageBucket: "roomies-app-32362.firebasestorage.app",
  messagingSenderId: "434083306699",
  appId: "1:434083306699:web:98701bd7dbe383832b4f4e",
  measurementId: "G-ZV9RXJ8GBX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
