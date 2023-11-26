import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// DEV
// const firebaseConfig = {
//   apiKey: "AIzaSyBkNQRCYF3EwkhSPNJqzFJS36KREvhrPro",
//   authDomain: "mercury-fe382.firebaseapp.com",
//   projectId: "mercury-fe382",
//   storageBucket: "mercury-fe382.appspot.com",
//   messagingSenderId: "225249121302",
//   appId: "1:225249121302:web:505d51ecd7599147881137"
// };

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