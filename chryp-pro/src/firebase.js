// src/firebase.js

import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2GfePojT71ta3qhtYV6Yu3BiUbiw594I",
  authDomain: "chyrp-sunian.firebaseapp.com",
  projectId: "chyrp-sunian",
  storageBucket: "chyrp-sunian.firebasestorage.app",
  messagingSenderId: "507101055340",
  appId: "1:507101055340:web:94ce73d548463a18b5cb49",
  measurementId: "G-NPG63F3HB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the app object so you can use it in other components
export default app;