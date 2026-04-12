import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCo74D-6jnOJ-6EqNluTBtulnjiMO2-GU",
  authDomain: "solarsis-agency.firebaseapp.com",
  projectId: "solarsis-agency",
  storageBucket: "solarsis-agency.firebasestorage.app",
  messagingSenderId: "430709619435",
  appId: "1:430709619435:web:f5926d978a23ba6375dcae",
  measurementId: "G-M1V04KJ7E2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
