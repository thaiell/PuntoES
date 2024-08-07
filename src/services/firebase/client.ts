import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";


const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_APIKEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)


export { auth };