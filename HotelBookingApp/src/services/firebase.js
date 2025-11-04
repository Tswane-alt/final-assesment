
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCy0aI2z9itPBuqM2lfKeWWLsNDgQJcV8Y",
  authDomain: "hotelbookingapp-cdcfa.firebaseapp.com",
  projectId: "hotelbookingapp-cdcfa",
  storageBucket: "hotelbookingapp-cdcfa.firebasestorage.app",
  messagingSenderId: "661267600146",
  appId: "1:661267600146:web:1d8e2a2cd535bc4a0c59cb",
  measurementId: "G-LFRNBKZSTQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log('Firebase initialized');

export default app;

/* Initialize Firebase


let db;
let storage;

try {
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { app, auth, db, storage };*/
