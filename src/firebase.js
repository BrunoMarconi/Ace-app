// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvZlOltgJOu9RGNyugAqlTf8wRQvGUIkQ",
  authDomain: "aceapp-c6797.firebaseapp.com",
  projectId: "aceapp-c6797",
  storageBucket: "aceapp-c6797.firebasestorage.app",
  messagingSenderId: "934213848301",
  appId: "1:934213848301:web:b3677a15a64fb6ce5350e4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();