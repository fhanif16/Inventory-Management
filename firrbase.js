// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXu6jx-Lj3Y1r1b5cOSm3jJtwc3-bPprI",
  authDomain: "inventory-management-463bc.firebaseapp.com",
  projectId: "inventory-management-463bc",
  storageBucket: "inventory-management-463bc.appspot.com",
  messagingSenderId: "20232294421",
  appId: "1:20232294421:web:d52d8daa63fb7456457e1c",
  measurementId: "G-59TT6HNWG7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export{firestore}