import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7b9COfOrS7hi1lLZpzjH8KAu0iF0ZbsI",
  authDomain: "mercury-prod-cff3e.firebaseapp.com",
  projectId: "mercury-prod-cff3e",
  storageBucket: "mercury-prod-cff3e.appspot.com",
  messagingSenderId: "166501381472",
  appId: "1:166501381472:web:06942376c4fda1119c5a05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db, app };