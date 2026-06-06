import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnR-3fcC5B2CoZNR9GECjbdGmeLhCXn-c",
  authDomain: "realcrickettracker.firebaseapp.com",
  projectId: "realcrickettracker",
  storageBucket: "realcrickettracker.firebasestorage.app",
  messagingSenderId: "291544787588",
  appId: "1:291544787588:web:ab62f2e61687b33cfeb0d1"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db, collection, addDoc };
