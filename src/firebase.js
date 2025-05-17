import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Timestamp } from "firebase/firestore";
const firebaseConfig ={
    apiKey: "AIzaSyB6qB4J85fz7xgHJCqSezoVYqFvBd5qF_I",
  authDomain: "farmfresh-1cdaf.firebaseapp.com",
  projectId: "farmfresh-1cdaf",
  storageBucket: "farmfresh-1cdaf.firebasestorage.app",
  messagingSenderId: "564195494440",
  appId: "1:564195494440:web:989920ed67024cb348831d",
  measurementId: "G-NTKWBY1KH0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export {db, collection, addDoc, query, where, getDocs, storage, getDoc, doc};
export {Timestamp};