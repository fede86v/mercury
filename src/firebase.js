import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBkNQRCYF3EwkhSPNJqzFJS36KREvhrPro",
  authDomain: "mercury-fe382.firebaseapp.com",
  projectId: "mercury-fe382",
  storageBucket: "mercury-fe382.appspot.com",
  messagingSenderId: "225249121302",
  appId: "1:225249121302:web:505d51ecd7599147881137",
  measurementId: "G-EZ8RX9NGW0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db, app, analytics};