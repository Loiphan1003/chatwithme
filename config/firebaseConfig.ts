import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMUL5NjQzH3Ww5jd8NqiZBNXLQ9D_APRY",
  authDomain: "chatwithme-54c92.firebaseapp.com",
  projectId: "chatwithme-54c92",
  storageBucket: "chatwithme-54c92.appspot.com",
  messagingSenderId: "277732657312",
  appId: "1:277732657312:web:2c7b540c1bcbbef9fca1c5",
  measurementId: "G-DB2YW5MGVJ",
};

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth , db}

