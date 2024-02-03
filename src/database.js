import firebaseConfig from "./firebase-config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig),
    auth = getAuth(app),
    db = getFirestore(app);

export { auth, db };
