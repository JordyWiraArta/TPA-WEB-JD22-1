// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCj1MXoQHb94IEMW-suAwTXKdB-z0zsKwU",
  authDomain: "tpa-web-378ab.firebaseapp.com",
  projectId: "tpa-web-378ab",
  storageBucket: "tpa-web-378ab.appspot.com",
  messagingSenderId: "588888504129",
  appId: "1:588888504129:web:8f6eaa1a48e24a520653c0",
  measurementId: "G-T401H8HYQ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);