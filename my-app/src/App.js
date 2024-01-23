// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAR6OLzGGwZ3TuvzdL23rWYfK8eUlQPs7U",
  authDomain: "info442-4theyouth.firebaseapp.com",
  projectId: "info442-4theyouth",
  storageBucket: "info442-4theyouth.appspot.com",
  messagingSenderId: "564734397166",
  appId: "1:564734397166:web:da4714ff16b65fa536c1ff",
  measurementId: "G-HRWFKF5F80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);