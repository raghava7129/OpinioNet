// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSCga4fkexU6bOrC0uDEfhV6n1FnXqkEM",
  authDomain: "opinionet-79150.firebaseapp.com",
  projectId: "opinionet-79150",
  storageBucket: "opinionet-79150.appspot.com",
  messagingSenderId: "694815798452",
  appId: "1:694815798452:web:55b7f9fc662a974aecd3e1",
  measurementId: "G-1F7GKEY5W1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
export default auth;