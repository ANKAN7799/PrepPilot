// Import the functions you need from the SDKs you need
import { initializeApp , getApp, getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDk5hbjyJH8k_NzdmPYJhD0nbsk9G-tDMs",
    authDomain: "preppilot-b6396.firebaseapp.com",
    projectId: "preppilot-b6396",
    storageBucket: "preppilot-b6396.firebasestorage.app",
    messagingSenderId: "913696962111",
    appId: "1:913696962111:web:90f5721066893861e72a8a",
    measurementId: "G-WCSQRDJ0RM"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app)