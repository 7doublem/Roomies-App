// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDfyVT_cG9tShfX3SIOrfcmTt63HzbQ61Y',
  authDomain: 'roomies-b0ee5.firebaseapp.com',
  projectId: 'roomies-b0ee5',
  storageBucket: 'roomies-b0ee5.firebasestorage.app',
  messagingSenderId: '710125408350',
  appId: '1:710125408350:web:e65effaadb4cb903b5a4cf',
  measurementId: 'G-DQKLEF85EQ',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
