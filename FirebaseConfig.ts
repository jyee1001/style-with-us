import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from  'firebase/firestore';




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9y9xSRGp-s_o2RwILOefcQDrcvREbjM8",
  authDomain: "style-with-us.firebaseapp.com",
  projectId: "style-with-us",
  storageBucket: "style-with-us.appspot.com",
  messagingSenderId: "664885606765",
  appId: "1:664885606765:web:ed82dfca92ffdce3928264"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIERSTORE_DB = getFirestore(FIREBASE_APP);